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
  type PantryItem,
  type InsertPantryItem,
  type GroceryPrice,
  type InsertGroceryPrice,
  type RecipeFeedback,
  type InsertRecipeFeedback,
  type MealPlanFeedback,
  type InsertMealPlanFeedback
} from "@shared/schema";
import { randomUUID } from "crypto";
import { importedRecipes } from "./import-recipes-json";

export interface IStorage {
  // Users - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Subscription Management
  updateUserSubscription(userId: string, subscriptionData: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionTier?: string;
    subscriptionPeriodEnd?: Date;
  }): Promise<User | undefined>;
  getUserByStripeCustomerId(customerId: string): Promise<User | undefined>;
  
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
  
  // Pantry Items
  getPantryItem(id: string): Promise<PantryItem | undefined>;
  getHouseholdPantryItems(householdId: string): Promise<PantryItem[]>;
  createPantryItem(item: InsertPantryItem): Promise<PantryItem>;
  updatePantryItem(id: string, updates: Partial<InsertPantryItem>): Promise<PantryItem | undefined>;
  deletePantryItem(id: string): Promise<boolean>;
  
  // Grocery Prices
  getGroceryPrices(itemName: string): Promise<GroceryPrice[]>;
  createGroceryPrice(price: InsertGroceryPrice): Promise<GroceryPrice>;
  
  // Recipe Feedback
  createRecipeFeedback(feedback: InsertRecipeFeedback): Promise<RecipeFeedback>;
  
  // Meal Plan Feedback
  createMealPlanFeedback(feedback: InsertMealPlanFeedback): Promise<MealPlanFeedback>;
  
  // Nutrition Reports
  getMemberNutritionReport(householdMemberId: string, startDate: Date, endDate: Date): Promise<any>;
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
  private pantryItems: Map<string, PantryItem> = new Map();
  private groceryPrices: Map<string, GroceryPrice[]> = new Map();
  private recipeFeedback: Map<string, RecipeFeedback> = new Map();
  private mealPlanFeedback: Map<string, MealPlanFeedback> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Load 500 recipes from JSON dataset
    console.log(`Initializing ${importedRecipes.length} recipes from dataset...`);
    importedRecipes.forEach((recipe: any) => {
      this.recipes.set(recipe.id, {
        ...recipe,
        rating: "4.5",
        cuisineType: recipe.cuisineType || null,
        dietaryTags: recipe.dietaryTags || null,
        imageUrl: recipe.imageUrl || null,
        imageMetadata: null,
        estimatedCost: recipe.estimatedCost || null,
        isBatchCookable: recipe.isBatchCookable || false,
        isFreezerFriendly: recipe.isFreezerFriendly || false,
        isKidFriendly: recipe.isKidFriendly || false,
        createdAt: new Date()
      });
    });
    console.log(`Successfully loaded ${this.recipes.size} recipes into memory storage`);
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
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStatus: 'free',
        subscriptionTier: 'free',
        subscriptionPeriodEnd: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(newUser.id, newUser);
      return newUser;
    }
  }

  // Subscription methods
  async updateUserSubscription(userId: string, subscriptionData: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionTier?: string;
    subscriptionPeriodEnd?: Date;
  }): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updated: User = {
      ...user,
      ...subscriptionData,
      updatedAt: new Date()
    };
    this.users.set(userId, updated);
    return updated;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.stripeCustomerId === customerId);
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
    return Array.from(this.householdMembers.values()).filter(member => member.householdId === householdId);
  }

  async createHouseholdMember(insertMember: InsertHouseholdMember): Promise<HouseholdMember> {
    const id = randomUUID();
    const member: HouseholdMember = {
      ...insertMember,
      id,
      nickname: insertMember.nickname || null,
      dateOfBirth: insertMember.dateOfBirth || null,
      weightUnit: insertMember.weightUnit || null,
      heightUnit: insertMember.heightUnit || null,
      dietaryRestrictions: insertMember.dietaryRestrictions || null,
      allergies: insertMember.allergies || null,
      medicalConditions: insertMember.medicalConditions || null,
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
    return Array.from(this.householdPreferences.values()).find(prefs => prefs.householdId === householdId);
  }

  async createHouseholdPreferences(insertPrefs: InsertHouseholdPreferences): Promise<HouseholdPreferences> {
    const id = randomUUID();
    const prefs: HouseholdPreferences = {
      ...insertPrefs,
      id,
      cookingSkillLevel: insertPrefs.cookingSkillLevel || null,
      kitchenEquipment: insertPrefs.kitchenEquipment || null,
      maxCookingTime: insertPrefs.maxCookingTime || null,
      preferredCuisines: insertPrefs.preferredCuisines || null,
      dislikedIngredients: insertPrefs.dislikedIngredients || null,
      mealPrepPreference: insertPrefs.mealPrepPreference || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.householdPreferences.set(id, prefs);
    return prefs;
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
    return Array.from(this.notificationPreferences.values()).find(prefs => prefs.userId === userId);
  }

  async createNotificationPreferences(insertPrefs: InsertNotificationPreferences): Promise<NotificationPreferences> {
    const id = randomUUID();
    const prefs: NotificationPreferences = {
      ...insertPrefs,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notificationPreferences.set(id, prefs);
    return prefs;
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

  async getRecipes(limit: number = 50, offset: number = 0): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).slice(offset, offset + limit);
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
      imageMetadata: null,
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
    const lowerQuery = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(recipe =>
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.cuisineType?.toLowerCase().includes(lowerQuery) ||
      recipe.dietaryTags?.some(tag => tag.toLowerCase().includes(lowerQuery))
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
      createdAt: new Date(),
      updatedAt: new Date()
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
      list.householdId === householdId && list.isActive
    );
  }

  async createShoppingList(insertList: InsertShoppingList): Promise<ShoppingList> {
    const id = randomUUID();
    const shoppingList: ShoppingList = {
      ...insertList,
      id,
      items: insertList.items as any,
      totalEstimatedCost: insertList.totalEstimatedCost || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.shoppingLists.set(id, shoppingList);
    return shoppingList;
  }

  // Pantry Item methods
  async getPantryItem(id: string): Promise<PantryItem | undefined> {
    return this.pantryItems.get(id);
  }

  async getHouseholdPantryItems(householdId: string): Promise<PantryItem[]> {
    return Array.from(this.pantryItems.values()).filter(item => item.householdId === householdId);
  }

  async createPantryItem(insertItem: InsertPantryItem): Promise<PantryItem> {
    const id = randomUUID();
    const pantryItem: PantryItem = {
      ...insertItem,
      id,
      expirationDate: insertItem.expirationDate || null,
      notes: insertItem.notes || null,
      purchaseDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.pantryItems.set(id, pantryItem);
    return pantryItem;
  }

  async updatePantryItem(id: string, updates: Partial<InsertPantryItem>): Promise<PantryItem | undefined> {
    const existing = await this.getPantryItem(id);
    if (!existing) return undefined;
    
    const updated: PantryItem = { 
      ...existing, 
      ...updates,
      updatedAt: new Date()
    };
    this.pantryItems.set(id, updated);
    return updated;
  }

  async deletePantryItem(id: string): Promise<boolean> {
    return this.pantryItems.delete(id);
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

  // Nutrition Report methods
  async getMemberNutritionReport(householdMemberId: string, startDate: Date, endDate: Date): Promise<any> {
    // Get all meal plans for the member within the date range
    const memberMealPlans = Array.from(this.mealPlans.values()).filter(plan => 
      plan.householdMemberId === householdMemberId &&
      new Date(plan.weekStartDate) >= startDate &&
      new Date(plan.weekStartDate) <= endDate
    );

    // Aggregate nutrition data
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };

    const dailyBreakdown: any[] = [];
    const weeklyData: any[] = [];

    memberMealPlans.forEach(mealPlan => {
      const meals = mealPlan.meals as any;
      let weekTotal = { ...totals, weekStart: mealPlan.weekStartDate };

      Object.entries(meals || {}).forEach(([day, dayMeals]: [string, any]) => {
        let dayTotal = { day, ...totals };
        
        Object.values(dayMeals || {}).forEach((meal: any) => {
          if (meal && meal.nutrition) {
            const nutrition = meal.nutrition;
            dayTotal.calories += nutrition.calories || 0;
            dayTotal.protein += nutrition.protein || 0;
            dayTotal.carbs += nutrition.carbs || 0;
            dayTotal.fat += nutrition.fat || 0;
            dayTotal.fiber += nutrition.fiber || 0;
            dayTotal.sugar += nutrition.sugar || 0;
            dayTotal.sodium += nutrition.sodium || 0;

            weekTotal.calories += nutrition.calories || 0;
            weekTotal.protein += nutrition.protein || 0;
            weekTotal.carbs += nutrition.carbs || 0;
            weekTotal.fat += nutrition.fat || 0;
            weekTotal.fiber += nutrition.fiber || 0;
            weekTotal.sugar += nutrition.sugar || 0;
            weekTotal.sodium += nutrition.sodium || 0;
          }
        });

        dailyBreakdown.push(dayTotal);
      });

      weeklyData.push(weekTotal);
    });

    // Calculate averages
    const daysCount = dailyBreakdown.length || 1;
    const averages = {
      calories: Math.round(totals.calories / daysCount),
      protein: Math.round(totals.protein / daysCount),
      carbs: Math.round(totals.carbs / daysCount),
      fat: Math.round(totals.fat / daysCount),
      fiber: Math.round(totals.fiber / daysCount),
      sugar: Math.round(totals.sugar / daysCount),
      sodium: Math.round(totals.sodium / daysCount)
    };

    return {
      totals,
      averages,
      dailyBreakdown,
      weeklyData,
      periodStart: startDate,
      periodEnd: endDate,
      daysTracked: daysCount
    };
  }
}

export const storage = new MemStorage();
