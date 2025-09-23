import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  familySize: integer("family_size").notNull(),
  weeklyBudget: decimal("weekly_budget", { precision: 10, scale: 2 }).notNull(),
  dietaryRestrictions: text("dietary_restrictions").array(),
  allergies: text("allergies").array(),
  medicalConditions: text("medical_conditions").array(),
  cookingSkillLevel: text("cooking_skill_level").notNull(), // beginner, intermediate, advanced
  kitchenEquipment: text("kitchen_equipment").array(),
  childrenAges: integer("children_ages").array(),
  goals: text("goals").array(), // weight_loss, muscle_gain, healthy_eating, etc.
  preferredCuisines: text("preferred_cuisines").array(),
  dislikedIngredients: text("disliked_ingredients").array(),
  mealPrepPreference: text("meal_prep_preference").notNull(), // none, some, lots
});

export const recipes = pgTable("recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").array().notNull(),
  ingredients: jsonb("ingredients").notNull(), // [{ name, amount, unit }]
  prepTime: integer("prep_time").notNull(), // minutes
  cookTime: integer("cook_time").notNull(), // minutes
  servings: integer("servings").notNull(),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  cuisineType: text("cuisine_type"),
  dietaryTags: text("dietary_tags").array(), // vegetarian, vegan, gluten-free, etc.
  nutrition: jsonb("nutrition").notNull(), // { calories, protein, carbs, fat, fiber, sugar, sodium }
  estimatedCost: decimal("estimated_cost", { precision: 8, scale: 2 }),
  isBatchCookable: boolean("is_batch_cookable").default(false),
  isFreezerFriendly: boolean("is_freezer_friendly").default(false),
  isKidFriendly: boolean("is_kid_friendly").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default(sql`0`),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  weekStartDate: timestamp("week_start_date").notNull(),
  meals: jsonb("meals").notNull(), // { [day]: { breakfast?, lunch?, dinner?, snacks? } }
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  totalCalories: integer("total_calories"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shoppingLists = pgTable("shopping_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mealPlanId: varchar("meal_plan_id").references(() => mealPlans.id),
  items: jsonb("items").notNull(), // [{ name, amount, unit, category, estimated_price, best_store }]
  totalEstimatedCost: decimal("total_estimated_cost", { precision: 10, scale: 2 }),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groceryPrices = pgTable("grocery_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemName: text("item_name").notNull(),
  storeName: text("store_name").notNull(),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // lb, oz, each, etc.
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const recipeFeedback = pgTable("recipe_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  recipeId: varchar("recipe_id").notNull().references(() => recipes.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"), // optional comment
  isLiked: boolean("is_liked"), // optional like/dislike, can be null
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mealPlanFeedback = pgTable("meal_plan_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mealPlanId: varchar("meal_plan_id").notNull().references(() => mealPlans.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"), // optional comment
  isLiked: boolean("is_liked"), // optional like/dislike, can be null
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  name: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  rating: true,
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true,
  isActive: true,
});

export const insertShoppingListSchema = createInsertSchema(shoppingLists).omit({
  id: true,
  createdAt: true,
  isCompleted: true,
});

export const insertGroceryPriceSchema = createInsertSchema(groceryPrices).omit({
  id: true,
  lastUpdated: true,
});

export const insertRecipeFeedbackSchema = createInsertSchema(recipeFeedback).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMealPlanFeedbackSchema = createInsertSchema(mealPlanFeedback).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type ShoppingList = typeof shoppingLists.$inferSelect;
export type InsertShoppingList = z.infer<typeof insertShoppingListSchema>;
export type GroceryPrice = typeof groceryPrices.$inferSelect;
export type InsertGroceryPrice = z.infer<typeof insertGroceryPriceSchema>;
export type RecipeFeedback = typeof recipeFeedback.$inferSelect;
export type InsertRecipeFeedback = z.infer<typeof insertRecipeFeedbackSchema>;
export type MealPlanFeedback = typeof mealPlanFeedback.$inferSelect;
export type InsertMealPlanFeedback = z.infer<typeof insertMealPlanFeedbackSchema>;
