import { 
  type User, 
  type InsertUser, 
  type UserProfile, 
  type InsertUserProfile,
  type Recipe,
  type InsertRecipe,
  type MealPlan,
  type InsertMealPlan,
  type ShoppingList,
  type InsertShoppingList,
  type GroceryPrice,
  type InsertGroceryPrice,
  type RecipeFeedback,
  type InsertRecipeFeedback,
  type MealPlanFeedback,
  type InsertMealPlanFeedback
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Recipes
  getRecipe(id: string): Promise<Recipe | undefined>;
  getRecipes(limit?: number, offset?: number): Promise<Recipe[]>;
  getRecipesByTags(tags: string[]): Promise<Recipe[]>;
  getRecipesByDietary(dietaryRestrictions: string[]): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  searchRecipes(query: string): Promise<Recipe[]>;
  
  // Meal Plans
  getMealPlan(id: string): Promise<MealPlan | undefined>;
  getActiveMealPlan(userId: string): Promise<MealPlan | undefined>;
  getUserMealPlans(userId: string): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  updateMealPlan(id: string, updates: Partial<InsertMealPlan>): Promise<MealPlan | undefined>;
  
  // Shopping Lists
  getShoppingList(id: string): Promise<ShoppingList | undefined>;
  getUserShoppingLists(userId: string): Promise<ShoppingList[]>;
  getActiveShoppingList(userId: string): Promise<ShoppingList | undefined>;
  createShoppingList(shoppingList: InsertShoppingList): Promise<ShoppingList>;
  updateShoppingList(id: string, updates: Partial<InsertShoppingList>): Promise<ShoppingList | undefined>;
  
  // Grocery Prices
  getGroceryPrices(itemName: string): Promise<GroceryPrice[]>;
  createGroceryPrice(price: InsertGroceryPrice): Promise<GroceryPrice>;
  updateGroceryPrices(itemName: string, prices: InsertGroceryPrice[]): Promise<void>;
  
  // Recipe Feedback
  getRecipeFeedback(recipeId: string): Promise<RecipeFeedback[]>;
  getUserRecipeFeedback(userId: string, recipeId: string): Promise<RecipeFeedback | undefined>;
  createRecipeFeedback(feedback: InsertRecipeFeedback): Promise<RecipeFeedback>;
  updateRecipeFeedback(id: string, updates: Partial<InsertRecipeFeedback>): Promise<RecipeFeedback | undefined>;
  getRecipeAverageRating(recipeId: string): Promise<number>;
  
  // Meal Plan Feedback
  getMealPlanFeedback(mealPlanId: string): Promise<MealPlanFeedback[]>;
  getUserMealPlanFeedback(userId: string, mealPlanId: string): Promise<MealPlanFeedback | undefined>;
  createMealPlanFeedback(feedback: InsertMealPlanFeedback): Promise<MealPlanFeedback>;
  updateMealPlanFeedback(id: string, updates: Partial<InsertMealPlanFeedback>): Promise<MealPlanFeedback | undefined>;
  getMealPlanAverageRating(mealPlanId: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private recipes: Map<string, Recipe> = new Map();
  private mealPlans: Map<string, MealPlan> = new Map();
  private shoppingLists: Map<string, ShoppingList> = new Map();
  private groceryPrices: Map<string, GroceryPrice[]> = new Map();
  private recipeFeedback: Map<string, RecipeFeedback> = new Map();
  private mealPlanFeedback: Map<string, MealPlanFeedback> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample recipes
    const sampleRecipes: (InsertRecipe & { id: string })[] = [
      {
        id: "recipe-1",
        title: "One-Pot Family Pasta",
        description: "Kid-approved pasta with hidden vegetables and lean ground turkey. Perfect for busy weeknights!",
        instructions: [
          "Heat olive oil in a large pot over medium heat",
          "Add diced onions and cook until translucent",
          "Add ground turkey and cook until browned",
          "Add pasta, broth, and diced tomatoes",
          "Bring to a boil, then simmer for 15 minutes",
          "Stir in vegetables and cook for 5 more minutes",
          "Season with herbs and serve"
        ],
        ingredients: [
          { name: "Ground turkey", amount: "1", unit: "lb" },
          { name: "Whole wheat pasta", amount: "12", unit: "oz" },
          { name: "Diced tomatoes", amount: "1", unit: "can" },
          { name: "Chicken broth", amount: "2", unit: "cups" },
          { name: "Mixed vegetables", amount: "2", unit: "cups" },
          { name: "Olive oil", amount: "2", unit: "tbsp" },
          { name: "Onion", amount: "1", unit: "medium" }
        ],
        prepTime: 10,
        cookTime: 25,
        servings: 4,
        difficulty: "easy",
        cuisineType: "Italian",
        dietaryTags: ["kid-friendly", "batch-cookable"],
        nutrition: {
          calories: 420,
          protein: 28,
          carbs: 52,
          fat: 12,
          fiber: 8,
          sugar: 8,
          sodium: 580
        },
        estimatedCost: "12.50",
        isBatchCookable: true,
        isFreezerFriendly: true,
        isKidFriendly: true,
        rating: "4.8",
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5"
      },
      {
        id: "recipe-2",
        title: "Tropical Smoothie Bowl",
        description: "Vibrant and nutritious breakfast that kids love to help make and customize with their favorite toppings.",
        instructions: [
          "Freeze banana slices overnight",
          "Blend frozen banana, mango, and coconut milk until smooth",
          "Pour into a bowl",
          "Top with granola, berries, and coconut flakes",
          "Drizzle with honey if desired"
        ],
        ingredients: [
          { name: "Frozen banana", amount: "2", unit: "medium" },
          { name: "Frozen mango", amount: "1", unit: "cup" },
          { name: "Coconut milk", amount: "1/2", unit: "cup" },
          { name: "Granola", amount: "1/4", unit: "cup" },
          { name: "Mixed berries", amount: "1/2", unit: "cup" },
          { name: "Coconut flakes", amount: "2", unit: "tbsp" }
        ],
        prepTime: 10,
        cookTime: 0,
        servings: 2,
        difficulty: "easy",
        cuisineType: "Healthy",
        dietaryTags: ["vegan", "gluten-free", "kid-friendly"],
        nutrition: {
          calories: 290,
          protein: 12,
          carbs: 58,
          fat: 8,
          fiber: 11,
          sugar: 35,
          sodium: 25
        },
        estimatedCost: "8.75",
        isBatchCookable: false,
        isFreezerFriendly: false,
        isKidFriendly: true,
        rating: "4.6",
        imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38"
      }
    ];

    sampleRecipes.forEach(recipe => {
      this.recipes.set(recipe.id, {
        ...recipe,
        createdAt: new Date()
      });
    });

    // Sample grocery prices
    const samplePrices: { [key: string]: InsertGroceryPrice[] } = {
      "Ground turkey": [
        { itemName: "Ground turkey", storeName: "Whole Foods", price: "8.99", unit: "lb" },
        { itemName: "Ground turkey", storeName: "Target", price: "7.49", unit: "lb" },
        { itemName: "Ground turkey", storeName: "Walmart", price: "6.99", unit: "lb" }
      ],
      "Quinoa": [
        { itemName: "Quinoa", storeName: "Target", price: "6.49", unit: "2 cups" },
        { itemName: "Quinoa", storeName: "Whole Foods", price: "7.99", unit: "2 cups" },
        { itemName: "Quinoa", storeName: "Aldi", price: "5.99", unit: "2 cups" }
      ]
    };

    Object.entries(samplePrices).forEach(([itemName, prices]) => {
      this.groceryPrices.set(itemName, prices.map(price => ({
        ...price,
        id: randomUUID(),
        lastUpdated: new Date()
      })));
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // User Profile methods
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(profile => profile.userId === userId);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = {
      ...insertProfile,
      id,
      dietaryRestrictions: insertProfile.dietaryRestrictions || null,
      allergies: insertProfile.allergies || null,
      medicalConditions: insertProfile.medicalConditions || null,
      kitchenEquipment: insertProfile.kitchenEquipment || null,
      childrenAges: insertProfile.childrenAges || null,
      goals: insertProfile.goals || null,
      preferredCuisines: insertProfile.preferredCuisines || null,
      dislikedIngredients: insertProfile.dislikedIngredients || null
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existing = await this.getUserProfile(userId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.userProfiles.set(existing.id, updated);
    return updated;
  }

  // Recipe methods
  async getRecipe(id: string): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipes(limit = 50, offset = 0): Promise<Recipe[]> {
    const recipes = Array.from(this.recipes.values());
    return recipes.slice(offset, offset + limit);
  }

  async getRecipesByTags(tags: string[]): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(recipe =>
      tags.some(tag => recipe.dietaryTags?.includes(tag))
    );
  }

  async getRecipesByDietary(dietaryRestrictions: string[]): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(recipe =>
      !dietaryRestrictions.some(restriction => recipe.dietaryTags?.includes(restriction))
    );
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = randomUUID();
    const recipe: Recipe = {
      ...insertRecipe,
      id,
      rating: "0",
      cuisineType: insertRecipe.cuisineType || null,
      dietaryTags: insertRecipe.dietaryTags || null,
      imageUrl: insertRecipe.imageUrl || null,
      estimatedCost: insertRecipe.estimatedCost || null,
      isBatchCookable: insertRecipe.isBatchCookable || null,
      isFreezerFriendly: insertRecipe.isFreezerFriendly || null,
      isKidFriendly: insertRecipe.isKidFriendly || null,
      createdAt: new Date()
    };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(recipe =>
      recipe.title.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Meal Plan methods
  async getMealPlan(id: string): Promise<MealPlan | undefined> {
    return this.mealPlans.get(id);
  }

  async getActiveMealPlan(userId: string): Promise<MealPlan | undefined> {
    return Array.from(this.mealPlans.values()).find(plan => 
      plan.userId === userId && plan.isActive
    );
  }

  async getUserMealPlans(userId: string): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values()).filter(plan => plan.userId === userId);
  }

  async createMealPlan(insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const id = randomUUID();
    const mealPlan: MealPlan = {
      ...insertMealPlan,
      id,
      isActive: true,
      totalCost: insertMealPlan.totalCost || null,
      totalCalories: insertMealPlan.totalCalories || null,
      createdAt: new Date()
    };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }

  async updateMealPlan(id: string, updates: Partial<InsertMealPlan>): Promise<MealPlan | undefined> {
    const existing = this.mealPlans.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.mealPlans.set(id, updated);
    return updated;
  }

  // Shopping List methods
  async getShoppingList(id: string): Promise<ShoppingList | undefined> {
    return this.shoppingLists.get(id);
  }

  async getUserShoppingLists(userId: string): Promise<ShoppingList[]> {
    return Array.from(this.shoppingLists.values()).filter(list => list.userId === userId);
  }

  async getActiveShoppingList(userId: string): Promise<ShoppingList | undefined> {
    return Array.from(this.shoppingLists.values()).find(list => 
      list.userId === userId && !list.isCompleted
    );
  }

  async createShoppingList(insertShoppingList: InsertShoppingList): Promise<ShoppingList> {
    const id = randomUUID();
    const shoppingList: ShoppingList = {
      ...insertShoppingList,
      id,
      mealPlanId: insertShoppingList.mealPlanId || null,
      totalEstimatedCost: insertShoppingList.totalEstimatedCost || null,
      isCompleted: false,
      createdAt: new Date()
    };
    this.shoppingLists.set(id, shoppingList);
    return shoppingList;
  }

  async updateShoppingList(id: string, updates: Partial<InsertShoppingList>): Promise<ShoppingList | undefined> {
    const existing = this.shoppingLists.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.shoppingLists.set(id, updated);
    return updated;
  }

  // Grocery Price methods
  async getGroceryPrices(itemName: string): Promise<GroceryPrice[]> {
    return this.groceryPrices.get(itemName) || [];
  }

  async createGroceryPrice(insertPrice: InsertGroceryPrice): Promise<GroceryPrice> {
    const id = randomUUID();
    const price: GroceryPrice = {
      ...insertPrice,
      id,
      lastUpdated: new Date()
    };
    
    const existing = this.groceryPrices.get(insertPrice.itemName) || [];
    existing.push(price);
    this.groceryPrices.set(insertPrice.itemName, existing);
    
    return price;
  }

  async updateGroceryPrices(itemName: string, prices: InsertGroceryPrice[]): Promise<void> {
    const groceryPrices = prices.map(price => ({
      ...price,
      id: randomUUID(),
      lastUpdated: new Date()
    }));
    this.groceryPrices.set(itemName, groceryPrices);
  }

  // Recipe Feedback methods
  async getRecipeFeedback(recipeId: string): Promise<RecipeFeedback[]> {
    return Array.from(this.recipeFeedback.values()).filter(feedback => feedback.recipeId === recipeId);
  }

  async getUserRecipeFeedback(userId: string, recipeId: string): Promise<RecipeFeedback | undefined> {
    return Array.from(this.recipeFeedback.values()).find(
      feedback => feedback.userId === userId && feedback.recipeId === recipeId
    );
  }

  async createRecipeFeedback(insertFeedback: InsertRecipeFeedback): Promise<RecipeFeedback> {
    const id = randomUUID();
    const feedback: RecipeFeedback = {
      ...insertFeedback,
      id,
      isLiked: insertFeedback.isLiked || null,
      comment: insertFeedback.comment || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.recipeFeedback.set(id, feedback);
    
    // Update recipe average rating
    await this.updateRecipeRating(insertFeedback.recipeId);
    
    return feedback;
  }

  async updateRecipeFeedback(id: string, updates: Partial<InsertRecipeFeedback>): Promise<RecipeFeedback | undefined> {
    const existing = this.recipeFeedback.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...updates,
      updatedAt: new Date()
    };
    this.recipeFeedback.set(id, updated);
    
    // Update recipe average rating
    await this.updateRecipeRating(existing.recipeId);
    
    return updated;
  }

  async getRecipeAverageRating(recipeId: string): Promise<number> {
    const feedbacks = await this.getRecipeFeedback(recipeId);
    if (feedbacks.length === 0) return 0;
    
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return Math.round((totalRating / feedbacks.length) * 10) / 10; // Round to 1 decimal
  }

  private async updateRecipeRating(recipeId: string): Promise<void> {
    const recipe = this.recipes.get(recipeId);
    if (recipe) {
      const averageRating = await this.getRecipeAverageRating(recipeId);
      recipe.rating = averageRating.toString();
      this.recipes.set(recipeId, recipe);
    }
  }

  // Meal Plan Feedback methods
  async getMealPlanFeedback(mealPlanId: string): Promise<MealPlanFeedback[]> {
    return Array.from(this.mealPlanFeedback.values()).filter(feedback => feedback.mealPlanId === mealPlanId);
  }

  async getUserMealPlanFeedback(userId: string, mealPlanId: string): Promise<MealPlanFeedback | undefined> {
    return Array.from(this.mealPlanFeedback.values()).find(
      feedback => feedback.userId === userId && feedback.mealPlanId === mealPlanId
    );
  }

  async createMealPlanFeedback(insertFeedback: InsertMealPlanFeedback): Promise<MealPlanFeedback> {
    const id = randomUUID();
    const feedback: MealPlanFeedback = {
      ...insertFeedback,
      id,
      isLiked: insertFeedback.isLiked || null,
      comment: insertFeedback.comment || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mealPlanFeedback.set(id, feedback);
    return feedback;
  }

  async updateMealPlanFeedback(id: string, updates: Partial<InsertMealPlanFeedback>): Promise<MealPlanFeedback | undefined> {
    const existing = this.mealPlanFeedback.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...updates,
      updatedAt: new Date()
    };
    this.mealPlanFeedback.set(id, updated);
    return updated;
  }

  async getMealPlanAverageRating(mealPlanId: string): Promise<number> {
    const feedbacks = await this.getMealPlanFeedback(mealPlanId);
    if (feedbacks.length === 0) return 0;
    
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return Math.round((totalRating / feedbacks.length) * 10) / 10; // Round to 1 decimal
  }
}

export const storage = new MemStorage();
