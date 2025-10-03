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
          { name: "Ground turkey", amount: "500", unit: "g" },
          { name: "Whole wheat pasta", amount: "350", unit: "g" },
          { name: "Diced tomatoes", amount: "1", unit: "tin" },
          { name: "Chicken stock", amount: "500", unit: "ml" },
          { name: "Mixed vegetables", amount: "300", unit: "g" },
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
        estimatedCost: "8.50",
        isBatchCookable: true,
        isFreezerFriendly: true,
        isKidFriendly: true,
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5"
      },
      {
        id: "recipe-2",
        title: "Chickpea Curry",
        description: "Creamy and flavourful vegetarian curry that's budget-friendly and packed with protein.",
        instructions: [
          "Fry onions, garlic, and ginger in oil until soft",
          "Add curry powder and cook for 1 minute",
          "Add tinned tomatoes and chickpeas",
          "Simmer for 15 minutes",
          "Stir in coconut milk",
          "Serve with rice or naan"
        ],
        ingredients: [
          { name: "Chickpeas", amount: "2", unit: "tins" },
          { name: "Tinned tomatoes", amount: "1", unit: "tin" },
          { name: "Coconut milk", amount: "400", unit: "ml" },
          { name: "Onion", amount: "1", unit: "large" },
          { name: "Garlic", amount: "3", unit: "cloves" },
          { name: "Ginger", amount: "2", unit: "cm" },
          { name: "Curry powder", amount: "2", unit: "tbsp" }
        ],
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: "easy",
        cuisineType: "Indian",
        dietaryTags: ["vegetarian", "vegan", "batch-cookable"],
        nutrition: {
          calories: 280,
          protein: 12,
          carbs: 38,
          fat: 10,
          fiber: 11,
          sugar: 6,
          sodium: 420
        },
        estimatedCost: "4.20",
        isBatchCookable: true,
        isFreezerFriendly: true,
        isKidFriendly: false,
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641"
      },
      {
        id: "recipe-3",
        title: "Shepherd's Pie",
        description: "Classic British comfort food with lean minced lamb and a fluffy mash topping.",
        instructions: [
          "Fry mince until browned, then set aside",
          "Cook onions, carrots, and peas",
          "Return mince, add stock and tomato purée",
          "Simmer for 20 minutes",
          "Make mashed potatoes",
          "Layer mince in dish, top with mash",
          "Bake at 200°C for 20 minutes"
        ],
        ingredients: [
          { name: "Minced lamb", amount: "500", unit: "g" },
          { name: "Potatoes", amount: "800", unit: "g" },
          { name: "Carrots", amount: "2", unit: "large" },
          { name: "Peas", amount: "100", unit: "g" },
          { name: "Onion", amount: "1", unit: "large" },
          { name: "Beef stock", amount: "300", unit: "ml" },
          { name: "Tomato purée", amount: "2", unit: "tbsp" }
        ],
        prepTime: 20,
        cookTime: 50,
        servings: 6,
        difficulty: "medium",
        cuisineType: "British",
        dietaryTags: ["kid-friendly", "batch-cookable"],
        nutrition: {
          calories: 380,
          protein: 22,
          carbs: 40,
          fat: 14,
          fiber: 6,
          sugar: 5,
          sodium: 520
        },
        estimatedCost: "9.50",
        isBatchCookable: true,
        isFreezerFriendly: true,
        isKidFriendly: true,
        imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3"
      },
      {
        id: "recipe-4",
        title: "Lentil Bolognese",
        description: "Hearty vegan alternative to traditional bolognese. Brilliantly budget-friendly!",
        instructions: [
          "Fry onions, carrots, and celery until soft",
          "Add garlic and cook for 1 minute",
          "Add lentils, tinned tomatoes, and stock",
          "Simmer for 30 minutes",
          "Season and serve with spaghetti"
        ],
        ingredients: [
          { name: "Red lentils", amount: "200", unit: "g" },
          { name: "Tinned tomatoes", amount: "2", unit: "tins" },
          { name: "Onion", amount: "1", unit: "large" },
          { name: "Carrots", amount: "2", unit: "medium" },
          { name: "Celery", amount: "2", unit: "sticks" },
          { name: "Vegetable stock", amount: "400", unit: "ml" },
          { name: "Spaghetti", amount: "400", unit: "g" }
        ],
        prepTime: 10,
        cookTime: 35,
        servings: 4,
        difficulty: "easy",
        cuisineType: "Italian",
        dietaryTags: ["vegetarian", "vegan", "batch-cookable"],
        nutrition: {
          calories: 340,
          protein: 16,
          carbs: 62,
          fat: 2,
          fiber: 12,
          sugar: 10,
          sodium: 380
        },
        estimatedCost: "3.80",
        isBatchCookable: true,
        isFreezerFriendly: true,
        isKidFriendly: true,
        imageUrl: "https://images.unsplash.com/photo-1572441713132-c542fc4fe282"
      },
      {
        id: "recipe-5",
        title: "Chicken Stir-Fry",
        description: "Quick and healthy midweek meal loaded with colourful vegetables.",
        instructions: [
          "Cut chicken into strips",
          "Stir-fry chicken in hot wok",
          "Remove chicken, add vegetables",
          "Return chicken, add sauce",
          "Toss for 2 minutes",
          "Serve with rice or noodles"
        ],
        ingredients: [
          { name: "Chicken breast", amount: "400", unit: "g" },
          { name: "Mixed peppers", amount: "2", unit: "whole" },
          { name: "Broccoli", amount: "200", unit: "g" },
          { name: "Soy sauce", amount: "3", unit: "tbsp" },
          { name: "Honey", amount: "1", unit: "tbsp" },
          { name: "Ginger", amount: "2", unit: "cm" },
          { name: "Garlic", amount: "2", unit: "cloves" }
        ],
        prepTime: 15,
        cookTime: 10,
        servings: 4,
        difficulty: "easy",
        cuisineType: "Chinese",
        dietaryTags: ["kid-friendly"],
        nutrition: {
          calories: 220,
          protein: 28,
          carbs: 16,
          fat: 5,
          fiber: 4,
          sugar: 9,
          sodium: 680
        },
        estimatedCost: "7.20",
        isBatchCookable: false,
        isFreezerFriendly: false,
        isKidFriendly: true,
        imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19"
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
      category: insertItem.category || null,
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
}

export const storage = new MemStorage();
