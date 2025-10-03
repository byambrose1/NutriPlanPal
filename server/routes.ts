import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertHouseholdSchema,
  insertHouseholdMemberSchema,
  insertHouseholdPreferencesSchema,
  insertNotificationPreferencesSchema,
  insertRecipeSchema,
  insertMealPlanSchema,
  insertShoppingListSchema,
  insertPantryItemSchema,
  insertRecipeFeedbackSchema,
  insertMealPlanFeedbackSchema
} from "@shared/schema";
import { generateRecipe, generateWeeklyMealPlan } from "./services/openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Authentication endpoints
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const claims = (req.user as any)?.claims;
      if (!claims) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(claims.sub);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Household endpoints
  app.post("/api/households", isAuthenticated, async (req, res) => {
    try {
      const claims = (req.user as any)?.claims;
      if (!claims) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const householdData = insertHouseholdSchema.parse({
        ...req.body,
        ownerId: claims.sub
      });

      const household = await storage.createHousehold(householdData);
      res.json(household);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/households/me", isAuthenticated, async (req, res) => {
    try {
      const claims = (req.user as any)?.claims;
      if (!claims) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const household = await storage.getUserHousehold(claims.sub);
      if (!household) {
        return res.status(404).json({ message: "Household not found" });
      }

      res.json(household);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Household Members endpoints
  app.post("/api/households/:householdId/members", isAuthenticated, async (req, res) => {
    try {
      const memberData = insertHouseholdMemberSchema.parse({
        ...req.body,
        householdId: req.params.householdId
      });

      const member = await storage.createHouseholdMember(memberData);
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/households/:householdId/members", isAuthenticated, async (req, res) => {
    try {
      const members = await storage.getHouseholdMembers(req.params.householdId);
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/members/:id", isAuthenticated, async (req, res) => {
    try {
      const member = await storage.getHouseholdMember(req.params.id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/members/:id", isAuthenticated, async (req, res) => {
    try {
      const member = await storage.updateHouseholdMember(req.params.id, req.body);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Household Preferences endpoints
  app.post("/api/households/:householdId/preferences", isAuthenticated, async (req, res) => {
    try {
      const preferencesData = insertHouseholdPreferencesSchema.parse({
        ...req.body,
        householdId: req.params.householdId
      });

      const preferences = await storage.createHouseholdPreferences(preferencesData);
      res.json(preferences);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/households/:householdId/preferences", isAuthenticated, async (req, res) => {
    try {
      const preferences = await storage.getHouseholdPreferences(req.params.householdId);
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/households/:householdId/preferences", isAuthenticated, async (req, res) => {
    try {
      const preferences = await storage.updateHouseholdPreferences(req.params.householdId, req.body);
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      res.json(preferences);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Notification Preferences endpoints
  app.post("/api/notification-preferences", isAuthenticated, async (req, res) => {
    try {
      const claims = (req.user as any)?.claims;
      if (!claims) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const preferencesData = insertNotificationPreferencesSchema.parse({
        ...req.body,
        userId: claims.sub
      });

      const preferences = await storage.createNotificationPreferences(preferencesData);
      res.json(preferences);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/notification-preferences", isAuthenticated, async (req, res) => {
    try {
      const claims = (req.user as any)?.claims;
      if (!claims) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const preferences = await storage.getNotificationPreferences(claims.sub);
      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/notification-preferences", isAuthenticated, async (req, res) => {
    try {
      const claims = (req.user as any)?.claims;
      if (!claims) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const preferences = await storage.updateNotificationPreferences(claims.sub, req.body);
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      res.json(preferences);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Recipe endpoints
  app.get("/api/recipes", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;

      let recipes;
      if (search) {
        recipes = await storage.searchRecipes(search);
      } else {
        recipes = await storage.getRecipes(limit, offset);
      }

      res.json(recipes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getRecipe(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/recipes/generate", isAuthenticated, async (req, res) => {
    try {
      const schema = z.object({
        title: z.string(),
        dietaryRestrictions: z.array(z.string()).optional(),
        cuisineType: z.string().optional(),
        servings: z.number()
      });

      const data = schema.parse(req.body);
      const recipe = await generateRecipe(data);

      if (!recipe) {
        return res.status(500).json({ message: "Failed to generate recipe" });
      }

      const savedRecipe = await storage.createRecipe(recipe);
      res.json(savedRecipe);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Meal Plan endpoints
  app.get("/api/members/:memberId/meal-plans", isAuthenticated, async (req, res) => {
    try {
      const mealPlans = await storage.getMemberMealPlans(req.params.memberId);
      res.json(mealPlans);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/members/:memberId/meal-plans/active", isAuthenticated, async (req, res) => {
    try {
      const mealPlan = await storage.getActiveMealPlan(req.params.memberId);
      if (!mealPlan) {
        return res.status(404).json({ message: "No active meal plan found" });
      }
      res.json(mealPlan);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/members/:memberId/meal-plans/generate", isAuthenticated, async (req, res) => {
    try {
      const member = await storage.getHouseholdMember(req.params.memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      const household = await storage.getHousehold(member.householdId);
      if (!household) {
        return res.status(404).json({ message: "Household not found" });
      }

      const preferences = await storage.getHouseholdPreferences(member.householdId);
      
      const mealPlanData = await generateWeeklyMealPlan({
        member,
        household,
        preferences
      });

      if (!mealPlanData) {
        return res.status(500).json({ message: "Failed to generate meal plan" });
      }

      const mealPlan = await storage.createMealPlan({
        householdMemberId: req.params.memberId,
        weekStartDate: new Date(),
        meals: mealPlanData.meals,
        totalCost: mealPlanData.totalCost,
        totalCalories: mealPlanData.totalCalories
      });

      res.json(mealPlan);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Shopping List endpoints
  app.get("/api/households/:householdId/shopping-lists", isAuthenticated, async (req, res) => {
    try {
      const shoppingLists = await storage.getHouseholdShoppingLists(req.params.householdId);
      res.json(shoppingLists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/households/:householdId/shopping-lists/active", isAuthenticated, async (req, res) => {
    try {
      const shoppingList = await storage.getActiveShoppingList(req.params.householdId);
      if (!shoppingList) {
        return res.status(404).json({ message: "No active shopping list found" });
      }
      res.json(shoppingList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/households/:householdId/shopping-lists/generate", isAuthenticated, async (req, res) => {
    try {
      const household = await storage.getHousehold(req.params.householdId);
      if (!household) {
        return res.status(404).json({ message: "Household not found" });
      }

      const members = await storage.getHouseholdMembers(req.params.householdId);
      const mealPlans = await Promise.all(
        members.map(member => storage.getActiveMealPlan(member.id))
      );

      const activeMealPlans = mealPlans.filter(plan => plan !== undefined);
      
      if (activeMealPlans.length === 0) {
        return res.status(400).json({ message: "No active meal plans found for household members" });
      }

      const mergedItems = new Map<string, any>();
      
      activeMealPlans.forEach(mealPlan => {
        const meals = mealPlan!.meals as any;
        Object.values(meals).forEach((day: any) => {
          Object.values(day).forEach((meal: any) => {
            if (meal && meal.ingredients) {
              meal.ingredients.forEach((ingredient: any) => {
                const key = ingredient.name.toLowerCase();
                if (mergedItems.has(key)) {
                  const existing = mergedItems.get(key);
                  if (ingredient.unit === existing.unit) {
                    existing.amount = (parseFloat(existing.amount) + parseFloat(ingredient.amount)).toString();
                  } else {
                    existing.amount += ` + ${ingredient.amount} ${ingredient.unit}`;
                    existing.unit = '';
                  }
                } else {
                  mergedItems.set(key, { ...ingredient });
                }
              });
            }
          });
        });
      });

      const items = Array.from(mergedItems.values());
      
      const shoppingList = await storage.createShoppingList({
        householdId: req.params.householdId,
        weekStartDate: new Date(),
        items: items as any,
        totalEstimatedCost: null
      });

      res.json(shoppingList);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Pantry Inventory endpoints
  app.get("/api/households/:householdId/pantry", isAuthenticated, async (req, res) => {
    try {
      const pantryItems = await storage.getHouseholdPantryItems(req.params.householdId);
      res.json(pantryItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/households/:householdId/pantry", isAuthenticated, async (req, res) => {
    try {
      const itemData = insertPantryItemSchema.parse({
        ...req.body,
        householdId: req.params.householdId
      });

      const pantryItem = await storage.createPantryItem(itemData);
      res.json(pantryItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/pantry/:id", isAuthenticated, async (req, res) => {
    try {
      const itemData = insertPantryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updatePantryItem(req.params.id, itemData);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Pantry item not found" });
      }

      res.json(updatedItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/pantry/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deletePantryItem(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Pantry item not found" });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Feedback endpoints
  app.post("/api/recipes/:recipeId/feedback", isAuthenticated, async (req, res) => {
    try {
      const claims = (req.user as any)?.claims;
      if (!claims) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const feedbackData = insertRecipeFeedbackSchema.parse({
        ...req.body,
        recipeId: req.params.recipeId,
        userId: claims.sub
      });

      const feedback = await storage.createRecipeFeedback(feedbackData);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/meal-plans/:mealPlanId/feedback", isAuthenticated, async (req, res) => {
    try {
      const claims = (req.user as any)?.claims;
      if (!claims) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const feedbackData = insertMealPlanFeedbackSchema.parse({
        ...req.body,
        mealPlanId: req.params.mealPlanId,
        userId: claims.sub
      });

      const feedback = await storage.createMealPlanFeedback(feedbackData);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
