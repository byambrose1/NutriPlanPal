import Stripe from "stripe";
import { Router, type Request } from "express";
import { storage } from "./storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeRouter = Router();

// Create Checkout Session for Subscription
stripeRouter.post("/create-checkout-session", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = req.user;
    const { priceId, tier } = req.body; // tier: 'basic' or 'premium'

    if (!user.email) {
      return res.status(400).json({ message: "User email is required" });
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
      await storage.updateUserSubscription(user.id, {
        stripeCustomerId: customerId,
      });
    }

    // Get domain from environment or request
    const domain = process.env.REPL_SLUG 
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
      : req.headers.origin || `${req.protocol}://${req.get('host')}`;

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${domain}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/profile?canceled=true`,
      metadata: {
        userId: user.id,
        tier: tier,
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Error creating checkout session: " + error.message });
  }
});

// Create Customer Portal Session
stripeRouter.post("/create-portal-session", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = req.user;

    if (!user.stripeCustomerId) {
      return res.status(400).json({ message: "No subscription found" });
    }

    // Get domain from environment or request
    const domain = process.env.REPL_SLUG 
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
      : req.headers.origin || `${req.protocol}://${req.get('host')}`;

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${domain}/profile`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating portal session:", error);
    res.status(500).json({ message: "Error creating portal session: " + error.message });
  }
});

// Stripe Webhook Handler
stripeRouter.post("/webhook", async (req: Request, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('No signature found');
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    if (WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    } else {
      // For testing without webhook secret
      console.warn("Warning: No webhook secret configured, skipping verification");
      event = JSON.parse(req.body.toString());
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier || 'basic';

        if (userId && session.subscription) {
          await storage.updateUserSubscription(userId, {
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: 'active',
            subscriptionTier: tier,
          });
          console.log(`Subscription created for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await storage.getUserByStripeCustomerId(subscription.customer as string);

        if (user) {
          // Determine tier from subscription items
          const tier = subscription.metadata?.tier || 'basic';
          
          await storage.updateUserSubscription(user.id, {
            subscriptionStatus: subscription.status,
            subscriptionTier: tier,
            subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
          });
          console.log(`Subscription updated for user ${user.id}: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await storage.getUserByStripeCustomerId(subscription.customer as string);

        if (user) {
          await storage.updateUserSubscription(user.id, {
            subscriptionStatus: 'canceled',
            subscriptionTier: 'free',
            subscriptionPeriodEnd: null,
          });
          console.log(`Subscription canceled for user ${user.id}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const user = await storage.getUserByStripeCustomerId(invoice.customer as string);

        if (user) {
          await storage.updateUserSubscription(user.id, {
            subscriptionStatus: 'past_due',
          });
          console.log(`Payment failed for user ${user.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error(`Error handling webhook: ${error.message}`);
    res.status(500).json({ message: "Webhook handler error" });
  }
});

export { stripe };
