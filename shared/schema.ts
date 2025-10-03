import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Image metadata interface for responsive images
export interface ImageMetadata {
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
  alt: string;
  aspectRatio: number;
  dominantColor: string;
}

// Zod schema for ImageMetadata validation
export const imageMetadataSchema = z.object({
  thumbnail: z.string().url(),
  medium: z.string().url(),
  large: z.string().url(),
  original: z.string().url(),
  alt: z.string(),
  aspectRatio: z.number().positive(),
  dominantColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/), // hex color format
});

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Updated for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Households - for multi-profile support
export const households = pgTable("households", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  name: text("name"), // Optional household name
  weeklyBudget: decimal("weekly_budget", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default('USD'), // GBP or USD
  shoppingFrequency: text("shopping_frequency"), // daily, weekly, biweekly
  preferredStores: text("preferred_stores").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Household Members (Individual Profiles) - each person in the household
export const householdMembers = pgTable("household_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  householdId: varchar("household_id").notNull().references(() => households.id),
  userId: varchar("user_id").references(() => users.id), // If they have their own account
  name: text("name").notNull(),
  nickname: text("nickname"),
  age: integer("age"),
  gender: text("gender"), // male, female, other, prefer_not_to_say
  isChild: boolean("is_child").default(false),
  
  // Dietary Info
  dietaryRestrictions: text("dietary_restrictions").array(), // vegetarian, vegan, pescatarian, carnivore, halal, kosher, gluten-free, dairy-free
  allergies: text("allergies").array(), // nuts, shellfish, soy, eggs, etc.
  medicalConditions: text("medical_conditions").array(), // diabetes, PCOS, IBS, celiac, hypertension, etc.
  dislikedFoods: text("disliked_foods").array(),
  preferredCuisines: text("preferred_cuisines").array(),
  
  // Fitness & Health Goals (for adults)
  primaryGoal: text("primary_goal"), // lose_weight, gain_weight, maintain_weight, build_muscle, improve_health
  currentWeight: decimal("current_weight", { precision: 6, scale: 2 }),
  weightUnit: text("weight_unit").default('kg'), // kg or lbs
  targetWeight: decimal("target_weight", { precision: 6, scale: 2 }),
  height: decimal("height", { precision: 6, scale: 2 }),
  heightUnit: text("height_unit").default('cm'), // cm or inches
  activityLevel: text("activity_level"), // sedentary, lightly_active, moderately_active, very_active, extremely_active
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Lifestyle & Cooking Preferences - per household
export const householdPreferences = pgTable("household_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  householdId: varchar("household_id").notNull().references(() => households.id).unique(),
  
  // Cooking & Kitchen
  cookingSkillLevel: text("cooking_skill_level").notNull(), // beginner, intermediate, advanced
  kitchenEquipment: text("kitchen_equipment").array(),
  cookingTimeAvailable: text("cooking_time_available"), // 15min, 30min, 1hr, 2hr+
  cookingStyle: text("cooking_style"), // batch_cooking, meal_prep, daily_cooking
  mealPrepPreference: text("meal_prep_preference"), // none, some, lots
  
  // Lifestyle
  workSchedule: text("work_schedule"), // traditional_9to5, shift_work, flexible, work_from_home
  eatingOutFrequency: text("eating_out_frequency"), // never, rarely, sometimes, often
  leftoverPreference: text("leftover_preference"), // love_leftovers, tolerate, avoid
  mealsPerDay: integer("meals_per_day").default(3),
  snacksPerDay: integer("snacks_per_day").default(2),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Notification Preferences - per user
export const notificationPreferences = pgTable("notification_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  phoneNumber: varchar("phone_number"), // For SMS notifications
  
  // Reminder types
  mealPlanReminders: boolean("meal_plan_reminders").default(true),
  shoppingListReminders: boolean("shopping_list_reminders").default(true),
  mealPrepReminders: boolean("meal_prep_reminders").default(true),
  
  // Timing
  reminderTime: text("reminder_time").default('09:00'), // HH:MM format
  reminderDays: text("reminder_days").array().default(sql`ARRAY['sunday']`), // days of week
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Recipes table (unchanged)
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
  imageMetadata: jsonb("image_metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Meal Plans - now linked to household members
export const mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  householdMemberId: varchar("household_member_id").notNull().references(() => householdMembers.id),
  weekStartDate: timestamp("week_start_date").notNull(),
  meals: jsonb("meals").notNull(), // { [day]: { breakfast?, lunch?, dinner?, snacks? } }
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  totalCalories: integer("total_calories"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Shopping Lists - merged for entire household
export const shoppingLists = pgTable("shopping_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  householdId: varchar("household_id").notNull().references(() => households.id),
  weekStartDate: timestamp("week_start_date").notNull(),
  items: jsonb("items").notNull(), // [{ name, amount, unit, category, estimated_price, best_store, forMembers: [memberId] }]
  totalEstimatedCost: decimal("total_estimated_cost", { precision: 10, scale: 2 }),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Pantry Inventory - household-level ingredient tracking
export const pantryItems = pgTable("pantry_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  householdId: varchar("household_id").notNull().references(() => households.id),
  ingredientName: text("ingredient_name").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // lb, oz, cups, each, etc.
  category: text("category"), // produce, dairy, grains, meat, pantry_staples, frozen, etc.
  expirationDate: timestamp("expiration_date"),
  purchaseDate: timestamp("purchase_date").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Grocery Prices (unchanged)
export const groceryPrices = pgTable("grocery_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemName: text("item_name").notNull(),
  storeName: text("store_name").notNull(),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // lb, oz, each, etc.
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Recipe Feedback
export const recipeFeedback = pgTable("recipe_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  recipeId: varchar("recipe_id").notNull().references(() => recipes.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  isLiked: boolean("is_liked"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Meal Plan Feedback
export const mealPlanFeedback = pgTable("meal_plan_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mealPlanId: varchar("meal_plan_id").notNull().references(() => mealPlans.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  isLiked: boolean("is_liked"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertHouseholdSchema = createInsertSchema(households).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHouseholdMemberSchema = createInsertSchema(householdMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHouseholdPreferencesSchema = createInsertSchema(householdPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  rating: true,
}).extend({
  imageMetadata: imageMetadataSchema.optional(),
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

export const insertPantryItemSchema = createInsertSchema(pantryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  purchaseDate: true,
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
export type UpsertUser = typeof users.$inferInsert; // For Replit Auth
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Household = typeof households.$inferSelect;
export type InsertHousehold = z.infer<typeof insertHouseholdSchema>;

export type HouseholdMember = typeof householdMembers.$inferSelect;
export type InsertHouseholdMember = z.infer<typeof insertHouseholdMemberSchema>;

export type HouseholdPreferences = typeof householdPreferences.$inferSelect;
export type InsertHouseholdPreferences = z.infer<typeof insertHouseholdPreferencesSchema>;

export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;

export type ShoppingList = typeof shoppingLists.$inferSelect;
export type InsertShoppingList = z.infer<typeof insertShoppingListSchema>;

export type PantryItem = typeof pantryItems.$inferSelect;
export type InsertPantryItem = z.infer<typeof insertPantryItemSchema>;

export type GroceryPrice = typeof groceryPrices.$inferSelect;
export type InsertGroceryPrice = z.infer<typeof insertGroceryPriceSchema>;

export type RecipeFeedback = typeof recipeFeedback.$inferSelect;
export type InsertRecipeFeedback = z.infer<typeof insertRecipeFeedbackSchema>;

export type MealPlanFeedback = typeof mealPlanFeedback.$inferSelect;
export type InsertMealPlanFeedback = z.infer<typeof insertMealPlanFeedbackSchema>;
