import { 
  type User, 
  type InsertUser,
  type UpsertUser,
  type Household,
  type InsertHousehold,
  type HouseholdMember,
  type InsertHouseholdMember,
  type HouseholdPreferences,
  type InsertHouseholdPreferences,
  type NotificationPreferences,
  type InsertNotificationPreferences,
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
  // Users - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Households
  getHousehold(id: string): Promise<Household | undefined>;
  getUserHousehold(userId: string): Promise<Household | undefined>;
  createHousehold(household: InsertHousehold): Promise<Household>;
  updateHousehold(id: string, updates: Partial<InsertHousehold>): Promise<Household | undefined>;
  
  // Household Members
  getHouseholdMember(id: string): Promise<HouseholdMember | undefined>;
  getHouseholdMembers(householdId: string): Promise<HouseholdMember[]>;
  createHouseholdMember(member: InsertHouseholdMember): Promise<HouseholdMember>;
  updateHouseholdMember(id: string, updates: Partial<InsertHouseholdMember>): Promise<HouseholdMember | undefined>;
  
  // Household Preferences
  getHouseholdPreferences(householdId: string): Promise<HouseholdPreferences | undefined>;
  createHouseholdPreferences(preferences: InsertHouseholdPreferences): Promise<HouseholdPreferences>;
  updateHouseholdPreferences(householdId: string, updates: Partial<InsertHouseholdPreferences>): Promise<HouseholdPreferences | undefined>;
  
  // Notification Preferences
  getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined>;
  createNotificationPreferences(preferences: InsertNotificationPreferences): Promise<NotificationPreferences>;
  updateNotificationPreferences(userId: string, updates: Partial<InsertNotificationPreferences>): Promise<NotificationPreferences | undefined>;
  
  // Recipes
  getRecipe(id: string): Promise<Recipe | undefined>;
  getRecipes(limit?: number, offset?: number): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  searchRecipes(query: string): Promise<Recipe[]>;
  
  // Meal Plans
  getMealPlan(id: string): Promise<MealPlan | undefined>;
  getActiveMealPlan(householdMemberId: string): Promise<MealPlan | undefined>;
  getMemberMealPlans(householdMemberId: string): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  
  // Shopping Lists
  getShoppingList(id: string): Promise<ShoppingList | undefined>;
  getHouseholdShoppingLists(householdId: string): Promise<ShoppingList[]>;
  getActiveShoppingList(householdId: string): Promise<ShoppingList | undefined>;
  createShoppingList(shoppingList: InsertShoppingList): Promise<ShoppingList>;
  
  // Grocery Prices
  getGroceryPrices(itemName: string): Promise<GroceryPrice[]>;
  createGroceryPrice(price: InsertGroceryPrice): Promise<GroceryPrice>;
  
  // Recipe Feedback
  createRecipeFeedback(feedback: InsertRecipeFeedback): Promise<RecipeFeedback>;
  
  // Meal Plan Feedback
  createMealPlanFeedback(feedback: InsertMealPlanFeedback): Promise<MealPlanFeedback>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private households: Map<string, Household> = new Map();
  private householdMembers: Map<string, HouseholdMember> = new Map();
  private householdPreferences: Map<string, HouseholdPreferences> = new Map();
  private notificationPreferences: Map<string, NotificationPreferences> = new Map();
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
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5"
      }
    ];

    sampleRecipes.forEach(recipe => {
      this.recipes.set(recipe.id, {
        ...recipe,
        rating: "4.5",
        cuisineType: recipe.cuisineType || null,
        dietaryTags: recipe.dietaryTags || null,
        imageUrl: recipe.imageUrl || null,
        imageMetadata: null,
        estimatedCost: recipe.estimatedCost || null,
        isBatchCookable: recipe.isBatchCookable || null,
        isFreezerFriendly: recipe.isFreezerFriendly || null,
        isKidFriendly: recipe.isKidFriendly || null,
        createdAt: new Date()
      });
    });
  }

  // User methods - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async upsertUser(upsertData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(upsertData.id!);
    
    if (existingUser) {
      const updated: User = {
        ...existingUser,
        ...upsertData,
        updatedAt: new Date()
      };
      this.users.set(upsertData.id!, updated);
      return updated;
    } else {
      const newUser: User = {
        id: upsertData.id!,
        email: upsertData.email || null,
        firstName: upsertData.firstName || null,
        lastName: upsertData.lastName || null,
        profileImageUrl: upsertData.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(newUser.id, newUser);
      return newUser;
    }
  }

  // Household methods
  async getHousehold(id: string): Promise<Household | undefined> {
    return this.households.get(id);
  }

  async getUserHousehold(userId: string): Promise<Household | undefined> {
    return Array.from(this.households.values()).find(h => h.ownerId === userId);
  }

  async createHousehold(insertHousehold: InsertHousehold): Promise<Household> {
    const id = randomUUID();
    const household: Household = {
      ...insertHousehold,
      id,
      name: insertHousehold.name || null,
      currency: insertHousehold.currency || 'USD',
      shoppingFrequency: insertHousehold.shoppingFrequency || null,
      preferredStores: insertHousehold.preferredStores || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.households.set(id, household);
    return household;
  }

  async updateHousehold(id: string, updates: Partial<InsertHousehold>): Promise<Household | undefined> {
    const existing = this.households.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...updates,
      updatedAt: new Date()
    };
    this.households.set(id, updated);
    return updated;
  }

  // Household Member methods
  async getHouseholdMember(id: string): Promise<HouseholdMember | undefined> {
    return this.householdMembers.get(id);
  }

  async getHouseholdMembers(householdId: string): Promise<HouseholdMember[]> {
    return Array.from(this.householdMembers.values()).filter(m => m.householdId === householdId);
  }

  async createHouseholdMember(insertMember: InsertHouseholdMember): Promise<HouseholdMember> {
    const id = randomUUID();
    const member: HouseholdMember = {
      ...insertMember,
      id,
      userId: insertMember.userId || null,
      nickname: insertMember.nickname || null,
      age: insertMember.age || null,
      gender: insertMember.gender || null,
      isChild: insertMember.isChild || null,
      dietaryRestrictions: insertMember.dietaryRestrictions || null,
      allergies: insertMember.allergies || null,
      medicalConditions: insertMember.medicalConditions || null,
      dislikedFoods: insertMember.dislikedFoods || null,
      preferredCuisines: insertMember.preferredCuisines || null,
      primaryGoal: insertMember.primaryGoal || null,
      currentWeight: insertMember.currentWeight || null,
      weightUnit: insertMember.weightUnit || null,
      targetWeight: insertMember.targetWeight || null,
      height: insertMember.height || null,
      heightUnit: insertMember.heightUnit || null,
      activityLevel: insertMember.activityLevel || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.householdMembers.set(id, member);
    return member;
  }

  async updateHouseholdMember(id: string, updates: Partial<InsertHouseholdMember>): Promise<HouseholdMember | undefined> {
    const existing = this.householdMembers.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...updates,
      updatedAt: new Date()
    };
    this.householdMembers.set(id, updated);
    return updated;
  }

  // Household Preferences methods
  async getHouseholdPreferences(householdId: string): Promise<HouseholdPreferences | undefined> {
    return Array.from(this.householdPreferences.values()).find(p => p.householdId === householdId);
  }

  async createHouseholdPreferences(insertPreferences: InsertHouseholdPreferences): Promise<HouseholdPreferences> {
    const id = randomUUID();
    const preferences: HouseholdPreferences = {
      ...insertPreferences,
      id,
      kitchenEquipment: insertPreferences.kitchenEquipment || null,
      cookingTimeAvailable: insertPreferences.cookingTimeAvailable || null,
      cookingStyle: insertPreferences.cookingStyle || null,
      mealPrepPreference: insertPreferences.mealPrepPreference || null,
      workSchedule: insertPreferences.workSchedule || null,
      eatingOutFrequency: insertPreferences.eatingOutFrequency || null,
      leftoverPreference: insertPreferences.leftoverPreference || null,
      mealsPerDay: insertPreferences.mealsPerDay || null,
      snacksPerDay: insertPreferences.snacksPerDay || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.householdPreferences.set(id, preferences);
    return preferences;
  }

  async updateHouseholdPreferences(householdId: string, updates: Partial<InsertHouseholdPreferences>): Promise<HouseholdPreferences | undefined> {
    const existing = await this.getHouseholdPreferences(householdId);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...updates,
      updatedAt: new Date()
    };
    this.householdPreferences.set(existing.id, updated);
    return updated;
  }

  // Notification Preferences methods
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    return Array.from(this.notificationPreferences.values()).find(p => p.userId === userId);
  }

  async createNotificationPreferences(insertPreferences: InsertNotificationPreferences): Promise<NotificationPreferences> {
    const id = randomUUID();
    const preferences: NotificationPreferences = {
      ...insertPreferences,
      id,
      emailNotifications: insertPreferences.emailNotifications ?? null,
      smsNotifications: insertPreferences.smsNotifications ?? null,
      phoneNumber: insertPreferences.phoneNumber || null,
      mealPlanReminders: insertPreferences.mealPlanReminders ?? null,
      shoppingListReminders: insertPreferences.shoppingListReminders ?? null,
      mealPrepReminders: insertPreferences.mealPrepReminders ?? null,
      reminderTime: insertPreferences.reminderTime || null,
      reminderDays: insertPreferences.reminderDays || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notificationPreferences.set(id, preferences);
    return preferences;
  }

  async updateNotificationPreferences(userId: string, updates: Partial<InsertNotificationPreferences>): Promise<NotificationPreferences | undefined> {
    const existing = await this.getNotificationPreferences(userId);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      ...updates,
      updatedAt: new Date()
    };
    this.notificationPreferences.set(existing.id, updated);
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

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = randomUUID();
    const recipe: Recipe = {
      ...insertRecipe,
      id,
      rating: "0",
      cuisineType: insertRecipe.cuisineType || null,
      dietaryTags: insertRecipe.dietaryTags || null,
      imageUrl: insertRecipe.imageUrl || null,
      imageMetadata: insertRecipe.imageMetadata || null,
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

  async getActiveMealPlan(householdMemberId: string): Promise<MealPlan | undefined> {
    return Array.from(this.mealPlans.values()).find(plan => 
      plan.householdMemberId === householdMemberId && plan.isActive
    );
  }

  async getMemberMealPlans(householdMemberId: string): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values()).filter(plan => plan.householdMemberId === householdMemberId);
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

  // Shopping List methods
  async getShoppingList(id: string): Promise<ShoppingList | undefined> {
    return this.shoppingLists.get(id);
  }

  async getHouseholdShoppingLists(householdId: string): Promise<ShoppingList[]> {
    return Array.from(this.shoppingLists.values()).filter(list => list.householdId === householdId);
  }

  async getActiveShoppingList(householdId: string): Promise<ShoppingList | undefined> {
    return Array.from(this.shoppingLists.values()).find(list => 
      list.householdId === householdId && !list.isCompleted
    );
  }

  async createShoppingList(insertShoppingList: InsertShoppingList): Promise<ShoppingList> {
    const id = randomUUID();
    const shoppingList: ShoppingList = {
      ...insertShoppingList,
      id,
      totalEstimatedCost: insertShoppingList.totalEstimatedCost || null,
      isCompleted: false,
      createdAt: new Date()
    };
    this.shoppingLists.set(id, shoppingList);
    return shoppingList;
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

  // Recipe Feedback methods
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
    return feedback;
  }

  // Meal Plan Feedback methods
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
}

export const storage = new MemStorage();
