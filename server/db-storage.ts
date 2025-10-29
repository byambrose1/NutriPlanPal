import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  households,
  householdMembers,
  householdPreferences,
  notificationPreferences,
  recipes,
  mealPlans,
  shoppingLists,
  pantryItems,
  groceryPrices,
  recipeFeedback,
  mealPlanFeedback,
  type User,
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
  type InsertMealPlanFeedback,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async upsertUser(upsertData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        ...upsertData,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...upsertData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  async updateUserSubscription(
    userId: string,
    subscriptionData: {
      stripeCustomerId?: string;
      stripeSubscriptionId?: string;
      subscriptionStatus?: string;
      subscriptionTier?: string;
      subscriptionPeriodEnd?: Date;
    }
  ): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({
        ...subscriptionData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, customerId))
      .limit(1);
    return result[0];
  }

  // Household methods
  async getHousehold(id: string): Promise<Household | undefined> {
    const result = await db.select().from(households).where(eq(households.id, id)).limit(1);
    return result[0];
  }

  async getUserHousehold(userId: string): Promise<Household | undefined> {
    const result = await db
      .select()
      .from(households)
      .where(eq(households.ownerId, userId))
      .limit(1);
    return result[0];
  }

  async createHousehold(household: InsertHousehold): Promise<Household> {
    const result = await db.insert(households).values(household).returning();
    return result[0];
  }

  async updateHousehold(
    id: string,
    updates: Partial<InsertHousehold>
  ): Promise<Household | undefined> {
    const result = await db
      .update(households)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(households.id, id))
      .returning();
    return result[0];
  }

  // Household Member methods
  async getHouseholdMember(id: string): Promise<HouseholdMember | undefined> {
    const result = await db
      .select()
      .from(householdMembers)
      .where(eq(householdMembers.id, id))
      .limit(1);
    return result[0];
  }

  async getHouseholdMembers(householdId: string): Promise<HouseholdMember[]> {
    return await db
      .select()
      .from(householdMembers)
      .where(eq(householdMembers.householdId, householdId));
  }

  async createHouseholdMember(member: InsertHouseholdMember): Promise<HouseholdMember> {
    const result = await db.insert(householdMembers).values(member).returning();
    return result[0];
  }

  async updateHouseholdMember(
    id: string,
    updates: Partial<InsertHouseholdMember>
  ): Promise<HouseholdMember | undefined> {
    const result = await db
      .update(householdMembers)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(householdMembers.id, id))
      .returning();
    return result[0];
  }

  // Household Preferences methods
  async getHouseholdPreferences(householdId: string): Promise<HouseholdPreferences | undefined> {
    const result = await db
      .select()
      .from(householdPreferences)
      .where(eq(householdPreferences.householdId, householdId))
      .limit(1);
    return result[0];
  }

  async createHouseholdPreferences(
    preferences: InsertHouseholdPreferences
  ): Promise<HouseholdPreferences> {
    const result = await db.insert(householdPreferences).values(preferences).returning();
    return result[0];
  }

  async updateHouseholdPreferences(
    householdId: string,
    updates: Partial<InsertHouseholdPreferences>
  ): Promise<HouseholdPreferences | undefined> {
    const result = await db
      .update(householdPreferences)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(householdPreferences.householdId, householdId))
      .returning();
    return result[0];
  }

  // Notification Preferences methods
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    const result = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);
    return result[0];
  }

  async createNotificationPreferences(
    preferences: InsertNotificationPreferences
  ): Promise<NotificationPreferences> {
    const result = await db.insert(notificationPreferences).values(preferences).returning();
    return result[0];
  }

  async updateNotificationPreferences(
    userId: string,
    updates: Partial<InsertNotificationPreferences>
  ): Promise<NotificationPreferences | undefined> {
    const result = await db
      .update(notificationPreferences)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(notificationPreferences.userId, userId))
      .returning();
    return result[0];
  }

  // Recipe methods
  async getRecipe(id: string): Promise<Recipe | undefined> {
    const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
    return result[0];
  }

  async getRecipes(limit: number = 50, offset: number = 0): Promise<Recipe[]> {
    return await db.select().from(recipes).limit(limit).offset(offset);
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const result = await db.insert(recipes).values(recipe).returning();
    return result[0];
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(recipes)
      .where(
        or(
          ilike(recipes.title, lowerQuery),
          ilike(recipes.description, lowerQuery),
          ilike(recipes.cuisineType, lowerQuery)
        )
      );
  }

  // Meal Plan methods
  async getMealPlan(id: string): Promise<MealPlan | undefined> {
    const result = await db.select().from(mealPlans).where(eq(mealPlans.id, id)).limit(1);
    return result[0];
  }

  async getActiveMealPlan(householdMemberId: string): Promise<MealPlan | undefined> {
    try {
      const result = await db
        .select()
        .from(mealPlans)
        .where(
          and(
            eq(mealPlans.householdMemberId, householdMemberId),
            eq(mealPlans.isActive, true)
          )
        )
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching active meal plan:", error);
      return undefined;
    }
  }

  async getMemberMealPlans(householdMemberId: string): Promise<MealPlan[]> {
    try {
      return await db
        .select()
        .from(mealPlans)
        .where(eq(mealPlans.householdMemberId, householdMemberId))
        .orderBy(desc(mealPlans.createdAt));
    } catch (error) {
      console.error("Error fetching member meal plans:", error);
      return [];
    }
  }

  async createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan> {
    const result = await db.insert(mealPlans).values(mealPlan).returning();
    return result[0];
  }

  // Shopping List methods
  async getShoppingList(id: string): Promise<ShoppingList | undefined> {
    const result = await db.select().from(shoppingLists).where(eq(shoppingLists.id, id)).limit(1);
    return result[0];
  }

  async getHouseholdShoppingLists(householdId: string): Promise<ShoppingList[]> {
    return await db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.householdId, householdId))
      .orderBy(desc(shoppingLists.createdAt));
  }

  async getActiveShoppingList(householdId: string): Promise<ShoppingList | undefined> {
    const result = await db
      .select()
      .from(shoppingLists)
      .where(
        and(
          eq(shoppingLists.householdId, householdId),
          eq(shoppingLists.isCompleted, false)
        )
      )
      .orderBy(desc(shoppingLists.createdAt))
      .limit(1);
    return result[0];
  }

  async createShoppingList(shoppingList: InsertShoppingList): Promise<ShoppingList> {
    const result = await db.insert(shoppingLists).values(shoppingList).returning();
    return result[0];
  }

  // Pantry Item methods
  async getPantryItem(id: string): Promise<PantryItem | undefined> {
    const result = await db.select().from(pantryItems).where(eq(pantryItems.id, id)).limit(1);
    return result[0];
  }

  async getHouseholdPantryItems(householdId: string): Promise<PantryItem[]> {
    return await db
      .select()
      .from(pantryItems)
      .where(eq(pantryItems.householdId, householdId));
  }

  async createPantryItem(item: InsertPantryItem): Promise<PantryItem> {
    const result = await db.insert(pantryItems).values(item).returning();
    return result[0];
  }

  async updatePantryItem(
    id: string,
    updates: Partial<InsertPantryItem>
  ): Promise<PantryItem | undefined> {
    const result = await db
      .update(pantryItems)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(pantryItems.id, id))
      .returning();
    return result[0];
  }

  async deletePantryItem(id: string): Promise<boolean> {
    const result = await db.delete(pantryItems).where(eq(pantryItems.id, id)).returning();
    return result.length > 0;
  }

  // Grocery Price methods
  async getGroceryPrices(itemName: string): Promise<GroceryPrice[]> {
    return await db
      .select()
      .from(groceryPrices)
      .where(eq(groceryPrices.itemName, itemName));
  }

  async createGroceryPrice(price: InsertGroceryPrice): Promise<GroceryPrice> {
    const result = await db.insert(groceryPrices).values(price).returning();
    return result[0];
  }

  // Recipe Feedback methods
  async createRecipeFeedback(feedback: InsertRecipeFeedback): Promise<RecipeFeedback> {
    const result = await db.insert(recipeFeedback).values(feedback).returning();
    return result[0];
  }

  // Meal Plan Feedback methods
  async createMealPlanFeedback(feedback: InsertMealPlanFeedback): Promise<MealPlanFeedback> {
    const result = await db.insert(mealPlanFeedback).values(feedback).returning();
    return result[0];
  }

  // Nutrition Reports
  async getMemberNutritionReport(
    householdMemberId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const plans = await db
        .select()
        .from(mealPlans)
        .where(
          and(
            eq(mealPlans.householdMemberId, householdMemberId),
            sql`${mealPlans.weekStartDate} >= ${startDate}`,
            sql`${mealPlans.weekStartDate} <= ${endDate}`
          )
        );

      return {
        householdMemberId,
        startDate,
        endDate,
        mealPlans: plans || [],
        totalCalories: plans ? plans.reduce((sum, plan) => sum + (plan.totalCalories || 0), 0) : 0,
        totalCost: plans ? plans.reduce((sum, plan) => sum + Number(plan.totalCost || 0), 0) : 0,
      };
    } catch (error) {
      console.error("Error fetching nutrition report:", error);
      return {
        householdMemberId,
        startDate,
        endDate,
        mealPlans: [],
        totalCalories: 0,
        totalCost: 0,
      };
    }
  }

  // Admin methods
  async getAdminStats(): Promise<any> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [householdCount] = await db.select({ count: sql<number>`count(*)` }).from(households);
    const [recipeCount] = await db.select({ count: sql<number>`count(*)` }).from(recipes);
    const [mealPlanCount] = await db.select({ count: sql<number>`count(*)` }).from(mealPlans);

    return {
      totalUsers: Number(userCount.count),
      totalHouseholds: Number(householdCount.count),
      totalRecipes: Number(recipeCount.count),
      totalMealPlans: Number(mealPlanCount.count),
    };
  }

  async getUsers(params: {
    page: number;
    limit: number;
    search?: string;
    subscriptionTier?: string;
  }): Promise<{ users: User[]; total: number }> {
    const { page, limit, search, subscriptionTier } = params;
    const offset = (page - 1) * limit;

    let conditions = [];
    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          ilike(users.email, searchPattern),
          ilike(users.firstName, searchPattern),
          ilike(users.lastName, searchPattern)
        )
      );
    }
    if (subscriptionTier) {
      conditions.push(eq(users.subscriptionTier, subscriptionTier));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const userList = await db
      .select()
      .from(users)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt));

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    return {
      users: userList,
      total: Number(countResult.count),
    };
  }

  async updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ isAdmin, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async getAllHouseholds(params: {
    page: number;
    limit: number;
  }): Promise<{ households: any[]; total: number }> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const householdList = await db
      .select({
        id: households.id,
        name: households.name,
        ownerId: households.ownerId,
        weeklyBudget: households.weeklyBudget,
        currency: households.currency,
        createdAt: households.createdAt,
        ownerEmail: users.email,
        ownerName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
      })
      .from(households)
      .leftJoin(users, eq(households.ownerId, users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(households.createdAt));

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(households);

    return {
      households: householdList,
      total: Number(countResult.count),
    };
  }

  async getAnalytics(period: string): Promise<any> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const [newUsers] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.createdAt} >= ${startDate}`);

    const [newHouseholds] = await db
      .select({ count: sql<number>`count(*)` })
      .from(households)
      .where(sql`${households.createdAt} >= ${startDate}`);

    const [newMealPlans] = await db
      .select({ count: sql<number>`count(*)` })
      .from(mealPlans)
      .where(sql`${mealPlans.createdAt} >= ${startDate}`);

    return {
      period,
      startDate,
      endDate: now,
      newUsers: Number(newUsers.count),
      newHouseholds: Number(newHouseholds.count),
      newMealPlans: Number(newMealPlans.count),
    };
  }
}
