import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Check, Crown, Sparkles, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PRICING_PLANS = {
  basic: {
    name: "Basic",
    price: "£9.99",
    priceId: process.env.VITE_STRIPE_BASIC_PRICE_ID || "price_basic",
    features: [
      "Weekly meal plans for 1-2 people",
      "Up to 100 recipes",
      "Basic shopping lists",
      "Email support"
    ]
  },
  premium: {
    name: "Premium",
    price: "£19.99",
    priceId: process.env.VITE_STRIPE_PREMIUM_PRICE_ID || "price_premium",
    features: [
      "Unlimited family members",
      "500+ diverse recipes",
      "AI-powered meal generation",
      "Smart pantry management",
      "Price comparison & optimization",
      "Nutrition tracking & reports",
      "Priority support"
    ]
  }
};

export function SubscriptionCard() {
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Get current user
  const { data: user } = useQuery<any>({
    queryKey: ["/api/auth/user"],
  });

  const isSubscribed = user?.subscriptionStatus === "active" || user?.subscriptionStatus === "trialing";
  const currentTier = user?.subscriptionTier || "free";

  // Create checkout session
  const createCheckoutSession = useMutation({
    mutationFn: async ({ priceId, tier }: { priceId: string; tier: string }) => {
      const response = await apiRequest("POST", "/api/stripe/create-checkout-session", {
        priceId,
        tier
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
      setLoadingPlan(null);
    },
  });

  // Create portal session
  const createPortalSession = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/stripe/create-portal-session", {});
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to open billing portal",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (tier: "basic" | "premium") => {
    const plan = PRICING_PLANS[tier];
    setLoadingPlan(tier);
    createCheckoutSession.mutate({ priceId: plan.priceId, tier });
  };

  const handleManageSubscription = () => {
    createPortalSession.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-orange-500" />
              Subscription Plan
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </div>
          {isSubscribed && (
            <Badge variant="default" className="bg-orange-500" data-testid="subscription-badge">
              {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Plan
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSubscribed ? (
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                You're currently on the {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} plan
              </p>
              {user?.subscriptionPeriodEnd && (
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Renews on {new Date(user.subscriptionPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button
              onClick={handleManageSubscription}
              disabled={createPortalSession.isPending}
              className="w-full"
              data-testid="button-manage-subscription"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {createPortalSession.isPending ? "Opening..." : "Manage Subscription"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Update payment method, view invoices, or cancel your subscription
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Basic Plan */}
            <div className="border rounded-lg p-6 space-y-4 hover:border-orange-500 transition-colors">
              <div>
                <h3 className="font-semibold text-lg">Basic</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{PRICING_PLANS.basic.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-2">
                {PRICING_PLANS.basic.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscribe("basic")}
                disabled={loadingPlan !== null}
                variant="outline"
                className="w-full"
                data-testid="button-subscribe-basic"
              >
                {loadingPlan === "basic" ? "Processing..." : "Subscribe to Basic"}
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-orange-500 rounded-lg p-6 space-y-4 relative bg-orange-50/50 dark:bg-orange-950/20">
              <Badge className="absolute -top-2 right-4 bg-orange-500" data-testid="badge-popular">
                <Sparkles className="w-3 h-3 mr-1" />
                Popular
              </Badge>
              <div>
                <h3 className="font-semibold text-lg">Premium</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{PRICING_PLANS.premium.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-2">
                {PRICING_PLANS.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscribe("premium")}
                disabled={loadingPlan !== null}
                className="w-full bg-orange-500 hover:bg-orange-600"
                data-testid="button-subscribe-premium"
              >
                {loadingPlan === "premium" ? "Processing..." : "Subscribe to Premium"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
