import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface RecipeGenerationParams {
  familySize: number;
  dietaryRestrictions: string[];
  allergies: string[];
  cookingSkillLevel: string;
  weeklyBudget: number;
  preferredCuisines: string[];
  dislikedIngredients: string[];
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTimeLimit?: number;
  equipment: string[];
  goals: string[];
  childrenAges?: number[];
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  instructions: string[];
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
  }>;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisineType: string;
  dietaryTags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  estimatedCost: number;
  isBatchCookable: boolean;
  isFreezerFriendly: boolean;
  isKidFriendly: boolean;
  imageUrl?: string;
  tips?: string[];
}

export interface MealPlanParams {
  familySize: number;
  weeklyBudget: number;
  dietaryRestrictions: string[];
  allergies: string[];
  cookingSkillLevel: string;
  goals: string[];
  preferredCuisines: string[];
  dislikedIngredients: string[];
  equipment: string[];
  childrenAges?: number[];
  mealPrepPreference: string;
}

export interface WeeklyMealPlan {
  monday: DayMeals;
  tuesday: DayMeals;
  wednesday: DayMeals;
  thursday: DayMeals;
  friday: DayMeals;
  saturday: DayMeals;
  sunday: DayMeals;
  totalWeeklyCost: number;
  totalWeeklyCalories: number;
  batchCookingTips: string[];
  shoppingTips: string[];
}

export interface DayMeals {
  breakfast?: GeneratedRecipe;
  lunch?: GeneratedRecipe;
  dinner?: GeneratedRecipe;
  snacks?: GeneratedRecipe[];
}

export async function generateRecipe(params: RecipeGenerationParams): Promise<GeneratedRecipe> {
  const prompt = `Generate a personalized ${params.mealType} recipe based on these requirements:

Family size: ${params.familySize} people
Dietary restrictions: ${params.dietaryRestrictions.join(', ') || 'None'}
Allergies: ${params.allergies.join(', ') || 'None'}
Cooking skill level: ${params.cookingSkillLevel}
Budget per meal: $${(params.weeklyBudget / 21).toFixed(2)}
Preferred cuisines: ${params.preferredCuisines.join(', ') || 'Any'}
Disliked ingredients: ${params.dislikedIngredients.join(', ') || 'None'}
Available equipment: ${params.equipment.join(', ')}
Health goals: ${params.goals.join(', ') || 'General health'}
${params.childrenAges?.length ? `Children ages: ${params.childrenAges.join(', ')}` : 'No children specified'}
${params.prepTimeLimit ? `Maximum prep time: ${params.prepTimeLimit} minutes` : ''}

Create a recipe that is budget-friendly, nutritionally balanced, and suitable for the family. If there are children, make it kid-friendly. Include accurate nutrition information and realistic cost estimates.

Return the recipe as a JSON object with the following structure:
{
  "title": "Recipe name",
  "description": "Brief description",
  "instructions": ["Step 1", "Step 2", ...],
  "ingredients": [{"name": "ingredient", "amount": "quantity", "unit": "measurement"}, ...],
  "prepTime": number_in_minutes,
  "cookTime": number_in_minutes,
  "servings": number,
  "difficulty": "easy|medium|hard",
  "cuisineType": "cuisine_type",
  "dietaryTags": ["tag1", "tag2", ...],
  "nutrition": {
    "calories": number_per_serving,
    "protein": number_grams,
    "carbs": number_grams,
    "fat": number_grams,
    "fiber": number_grams,
    "sugar": number_grams,
    "sodium": number_mg
  },
  "estimatedCost": total_cost_number,
  "isBatchCookable": boolean,
  "isFreezerFriendly": boolean,
  "isKidFriendly": boolean,
  "imageUrl": "optional_image_url",
  "tips": ["tip1", "tip2", ...]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and chef specializing in family meal planning. Provide accurate, practical recipes that are budget-conscious and family-friendly."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const recipeData = JSON.parse(response.choices[0].message.content || '{}');
    return recipeData as GeneratedRecipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe');
  }
}

export async function generateWeeklyMealPlan(params: MealPlanParams): Promise<WeeklyMealPlan> {
  const prompt = `Generate a complete weekly meal plan for a family with these specifications:

Family size: ${params.familySize} people
Weekly budget: $${params.weeklyBudget}
Dietary restrictions: ${params.dietaryRestrictions.join(', ') || 'None'}
Allergies: ${params.allergies.join(', ') || 'None'}
Cooking skill level: ${params.cookingSkillLevel}
Health goals: ${params.goals.join(', ') || 'General health'}
Preferred cuisines: ${params.preferredCuisines.join(', ') || 'Varied'}
Disliked ingredients: ${params.dislikedIngredients.join(', ') || 'None'}
Available equipment: ${params.equipment.join(', ')}
Meal prep preference: ${params.mealPrepPreference}
${params.childrenAges?.length ? `Children ages: ${params.childrenAges.join(', ')}` : 'No children specified'}

Create a balanced weekly meal plan that:
- Stays within budget
- Incorporates batch cooking opportunities if preferred
- Includes variety across the week
- Is nutritionally balanced
- Considers prep time for busy families
- Makes use of leftovers efficiently
- Is kid-friendly if children are present

For each day, provide breakfast, lunch, and dinner. Include detailed recipes with ingredients, instructions, nutrition info, and cost estimates. Also provide weekly shopping tips and batch cooking suggestions.

Return as JSON with this structure:
{
  "monday": { "breakfast": recipe_object, "lunch": recipe_object, "dinner": recipe_object },
  "tuesday": { "breakfast": recipe_object, "lunch": recipe_object, "dinner": recipe_object },
  ... (continue for all days)
  "totalWeeklyCost": number,
  "totalWeeklyCalories": number,
  "batchCookingTips": ["tip1", "tip2", ...],
  "shoppingTips": ["tip1", "tip2", ...]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert meal planning nutritionist who specializes in creating budget-friendly, family-oriented weekly meal plans. Focus on nutrition, variety, cost-effectiveness, and practical meal preparation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6
    });

    const mealPlanData = JSON.parse(response.choices[0].message.content || '{}');
    return mealPlanData as WeeklyMealPlan;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw new Error('Failed to generate meal plan');
  }
}
