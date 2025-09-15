import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertUserProfileSchema, 
  insertRecipeSchema,
  insertMealPlanSchema,
  insertShoppingListSchema
} from "@shared/schema";
import { generateRecipe, generateWeeklyMealPlan } from "./services/openai";
import { compareGroceryPrices, findBestPrices, optimizeShoppingRoute, generateShoppingList } from "./services/grocery-scraper";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User registration and authentication
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User profiles
  app.post("/api/users/:userId/profile", async (req, res) => {
    try {
      const profileData = insertUserProfileSchema.parse({
        ...req.body,
        userId: req.params.userId
      });
      
      const existingProfile = await storage.getUserProfile(req.params.userId);
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists for this user" });
      }
      
      const profile = await storage.createUserProfile(profileData);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/profile", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/users/:userId/profile", async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateUserProfile(req.params.userId, updates);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Recipes
  app.get("/api/recipes", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;
      const tags = req.query.tags as string;
      
      let recipes;
      
      if (search) {
        recipes = await storage.searchRecipes(search);
      } else if (tags) {
        const tagArray = tags.split(',');
        recipes = await storage.getRecipesByTags(tagArray);
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

  app.post("/api/recipes", async (req, res) => {
    try {
      const recipeData = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(recipeData);
      res.json(recipe);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // AI Recipe Generation
  app.post("/api/recipes/generate", async (req, res) => {
    try {
      const generateSchema = z.object({
        familySize: z.number().min(1),
        dietaryRestrictions: z.array(z.string()).default([]),
        allergies: z.array(z.string()).default([]),
        cookingSkillLevel: z.string(),
        weeklyBudget: z.number().min(0),
        preferredCuisines: z.array(z.string()).default([]),
        dislikedIngredients: z.array(z.string()).default([]),
        mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
        prepTimeLimit: z.number().optional(),
        equipment: z.array(z.string()).default([]),
        goals: z.array(z.string()).default([]),
        childrenAges: z.array(z.number()).optional()
      });
      
      const params = generateSchema.parse(req.body);
      const generatedRecipe = await generateRecipe(params);
      
      // Save the generated recipe
      const recipe = await storage.createRecipe({
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        instructions: generatedRecipe.instructions,
        ingredients: generatedRecipe.ingredients,
        prepTime: generatedRecipe.prepTime,
        cookTime: generatedRecipe.cookTime,
        servings: generatedRecipe.servings,
        difficulty: generatedRecipe.difficulty,
        cuisineType: generatedRecipe.cuisineType,
        dietaryTags: generatedRecipe.dietaryTags,
        nutrition: generatedRecipe.nutrition,
        estimatedCost: generatedRecipe.estimatedCost.toString(),
        isBatchCookable: generatedRecipe.isBatchCookable,
        isFreezerFriendly: generatedRecipe.isFreezerFriendly,
        isKidFriendly: generatedRecipe.isKidFriendly,
        imageUrl: generatedRecipe.imageUrl || null
      });
      
      res.json(recipe);
    } catch (error: any) {
      console.error('Recipe generation error:', error);
      res.status(500).json({ message: "Failed to generate recipe: " + error.message });
    }
  });

  // Meal Plans
  app.get("/api/users/:userId/meal-plans", async (req, res) => {
    try {
      const mealPlans = await storage.getUserMealPlans(req.params.userId);
      res.json(mealPlans);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/meal-plans/active", async (req, res) => {
    try {
      const mealPlan = await storage.getActiveMealPlan(req.params.userId);
      if (!mealPlan) {
        return res.status(404).json({ message: "No active meal plan found" });
      }
      res.json(mealPlan);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users/:userId/meal-plans/generate", async (req, res) => {
    try {
      const generateSchema = z.object({
        familySize: z.number().min(1),
        weeklyBudget: z.number().min(0),
        dietaryRestrictions: z.array(z.string()).default([]),
        allergies: z.array(z.string()).default([]),
        cookingSkillLevel: z.string(),
        goals: z.array(z.string()).default([]),
        preferredCuisines: z.array(z.string()).default([]),
        dislikedIngredients: z.array(z.string()).default([]),
        equipment: z.array(z.string()).default([]),
        childrenAges: z.array(z.number()).optional(),
        mealPrepPreference: z.string()
      });
      
      const params = generateSchema.parse(req.body);
      const weeklyPlan = await generateWeeklyMealPlan(params);
      
      // Calculate week start date (next Monday)
      const now = new Date();
      const weekStartDate = new Date(now);
      const daysUntilMonday = (8 - now.getDay()) % 7;
      weekStartDate.setDate(now.getDate() + daysUntilMonday);
      weekStartDate.setHours(0, 0, 0, 0);
      
      // Create meal plan
      const mealPlan = await storage.createMealPlan({
        userId: req.params.userId,
        weekStartDate,
        meals: weeklyPlan,
        totalCost: weeklyPlan.totalWeeklyCost.toString(),
        totalCalories: weeklyPlan.totalWeeklyCalories
      });
      
      res.json(mealPlan);
    } catch (error: any) {
      console.error('Meal plan generation error:', error);
      res.status(500).json({ message: "Failed to generate meal plan: " + error.message });
    }
  });

  app.post("/api/meal-plans", async (req, res) => {
    try {
      const mealPlanData = insertMealPlanSchema.parse(req.body);
      const mealPlan = await storage.createMealPlan(mealPlanData);
      res.json(mealPlan);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/meal-plans/:id", async (req, res) => {
    try {
      const updates = req.body;
      const mealPlan = await storage.updateMealPlan(req.params.id, updates);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      res.json(mealPlan);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Shopping Lists
  app.get("/api/users/:userId/shopping-lists", async (req, res) => {
    try {
      const shoppingLists = await storage.getUserShoppingLists(req.params.userId);
      res.json(shoppingLists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/shopping-lists/active", async (req, res) => {
    try {
      const shoppingList = await storage.getActiveShoppingList(req.params.userId);
      if (!shoppingList) {
        return res.status(404).json({ message: "No active shopping list found" });
      }
      res.json(shoppingList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/shopping-lists", async (req, res) => {
    try {
      const shoppingListData = insertShoppingListSchema.parse(req.body);
      const shoppingList = await storage.createShoppingList(shoppingListData);
      res.json(shoppingList);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/meal-plans/:id/shopping-list", async (req, res) => {
    try {
      const mealPlan = await storage.getMealPlan(req.params.id);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      
      // Extract recipes from meal plan
      const recipes: any[] = [];
      const meals = mealPlan.meals as any;
      
      Object.values(meals).forEach((dayMeals: any) => {
        if (dayMeals.breakfast) recipes.push(dayMeals.breakfast);
        if (dayMeals.lunch) recipes.push(dayMeals.lunch);
        if (dayMeals.dinner) recipes.push(dayMeals.dinner);
        if (dayMeals.snacks) recipes.push(...dayMeals.snacks);
      });
      
      const profile = await storage.getUserProfile(mealPlan.userId);
      const familySize = profile?.familySize || 4;
      
      const shoppingItems = generateShoppingList(recipes, familySize);
      const totalCost = shoppingItems.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
      
      const shoppingList = await storage.createShoppingList({
        userId: mealPlan.userId,
        mealPlanId: mealPlan.id,
        items: shoppingItems,
        totalEstimatedCost: totalCost.toString()
      });
      
      res.json(shoppingList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Grocery Price Comparison
  app.post("/api/grocery-prices/compare", async (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Items must be an array" });
      }
      
      const priceComparisons = await compareGroceryPrices(items);
      res.json(priceComparisons);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/grocery-prices/best-prices", async (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Items must be an array" });
      }
      
      const bestPrices = await findBestPrices(items);
      res.json(bestPrices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/shopping/optimize-route", async (req, res) => {
    try {
      const { stores } = req.body;
      if (!Array.isArray(stores)) {
        return res.status(400).json({ message: "Stores must be an array" });
      }
      
      const optimizedRoute = await optimizeShoppingRoute(stores);
      res.json(optimizedRoute);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
