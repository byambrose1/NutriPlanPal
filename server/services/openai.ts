import OpenAI from "openai";

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is required. Please add your OpenAI API key to use recipe and meal plan generation features.");
  }
  return new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY
  });
}

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
  currency?: string;
  medicalConditions?: string[];
  primaryGoal?: string;
  currentWeight?: number;
  weightUnit?: string;
  height?: number;
  heightUnit?: string;
  activityLevel?: string;
  age?: number;
  gender?: string;
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
  currency?: string;
  medicalConditions?: string[];
  primaryGoal?: string;
  currentWeight?: number;
  weightUnit?: string;
  height?: number;
  heightUnit?: string;
  activityLevel?: string;
  age?: number;
  gender?: string;
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
Budget per meal: ${params.currency === 'GBP' ? '£' : '$'}${(params.weeklyBudget / 21).toFixed(2)}
Preferred cuisines: ${params.preferredCuisines.join(', ') || 'Any'}
Disliked ingredients: ${params.dislikedIngredients.join(', ') || 'None'}
Available equipment: ${params.equipment.join(', ')}
Health goals: ${params.goals.join(', ') || 'General health'}
${params.childrenAges?.length ? `Children ages: ${params.childrenAges.join(', ')}` : 'No children specified'}
${params.prepTimeLimit ? `Maximum prep time: ${params.prepTimeLimit} minutes` : ''}
${params.medicalConditions?.length ? `Medical conditions: ${params.medicalConditions.join(', ')}` : ''}
${params.primaryGoal ? `Primary health goal: ${params.primaryGoal.replace('_', ' ')}` : ''}
${params.age ? `Age: ${params.age} years` : ''}
${params.gender ? `Gender: ${params.gender}` : ''}
${params.currentWeight ? `Current weight: ${params.currentWeight} ${params.weightUnit || 'kg'}` : ''}
${params.height ? `Height: ${params.height} ${params.heightUnit || 'cm'}` : ''}
${params.activityLevel ? `Activity level: ${params.activityLevel.replace('_', ' ')}` : ''}
${params.currency ? `Currency: ${params.currency}` : ''}

Create a recipe that is budget-friendly, nutritionally balanced, and suitable for the family. If there are children, make it kid-friendly. Consider any medical conditions and adjust nutrition accordingly. If fitness goals are specified, tailor macronutrient ratios appropriately. Include accurate nutrition information and realistic cost estimates.

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
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and chef specializing in family meal planning. Provide accurate, practical recipes that are budget-conscious and family-friendly. Consider medical conditions, fitness goals, and activity levels when applicable to create personalized, health-appropriate meals."
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
Weekly budget: ${params.currency === 'GBP' ? '£' : '$'}${params.weeklyBudget}
Dietary restrictions: ${params.dietaryRestrictions.join(', ') || 'None'}
Allergies: ${params.allergies.join(', ') || 'None'}
Cooking skill level: ${params.cookingSkillLevel}
Health goals: ${params.goals.join(', ') || 'General health'}
Preferred cuisines: ${params.preferredCuisines.join(', ') || 'Varied'}
Disliked ingredients: ${params.dislikedIngredients.join(', ') || 'None'}
Available equipment: ${params.equipment.join(', ')}
Meal prep preference: ${params.mealPrepPreference}
${params.childrenAges?.length ? `Children ages: ${params.childrenAges.join(', ')}` : 'No children specified'}
${params.medicalConditions?.length ? `Medical conditions: ${params.medicalConditions.join(', ')}` : ''}
${params.primaryGoal ? `Primary health goal: ${params.primaryGoal.replace('_', ' ')}` : ''}
${params.age ? `Age: ${params.age} years` : ''}
${params.gender ? `Gender: ${params.gender}` : ''}
${params.currentWeight ? `Current weight: ${params.currentWeight} ${params.weightUnit || 'kg'}` : ''}
${params.height ? `Height: ${params.height} ${params.heightUnit || 'cm'}` : ''}
${params.activityLevel ? `Activity level: ${params.activityLevel.replace('_', ' ')}` : ''}
${params.currency ? `Currency: ${params.currency}` : ''}

Create a balanced weekly meal plan that:
- Stays within budget
- MAXIMISE INGREDIENT REUSE: Plan meals to use the same fresh ingredients across 2-3 days (e.g., if you buy a whole aubergine on Monday, use it in meals Monday-Wednesday)
- Use whole vegetables and standard package sizes (e.g., "1 courgette" not "100g courgette", "1 can chickpeas" not "200g chickpeas")
- Incorporates batch cooking opportunities if preferred - cook extra portions for leftovers
- Includes variety across the week while reusing core ingredients
- Is nutritionally balanced
- Considers prep time for busy families
- Makes use of leftovers efficiently and plans them intentionally
- Is kid-friendly if children are present
- Takes into account medical conditions and adjusts nutrition accordingly
- Aligns with user's primary health goal and activity level
- Suggests practical shopping quantities (whole items, standard tins/packages)

For each day, provide breakfast, lunch, and dinner. Include detailed recipes with ingredients, instructions, nutrition info, and cost estimates. Also provide weekly shopping tips and batch cooking suggestions.

CRITICAL: Return as JSON with EXACTLY this structure. Each recipe MUST follow this exact format:

{
  "monday": {
    "breakfast": {
      "title": "Recipe Name Here",
      "description": "Brief description",
      "instructions": ["Step 1 text", "Step 2 text", "Step 3 text"],
      "ingredients": [
        {"name": "ingredient name", "amount": "150", "unit": "g"},
        {"name": "another ingredient", "amount": "2", "unit": "tbsp"}
      ],
      "prepTime": 10,
      "cookTime": 20,
      "servings": 4,
      "difficulty": "easy",
      "cuisineType": "mediterranean",
      "dietaryTags": ["vegetarian"],
      "nutrition": {
        "calories": 450,
        "protein": 20,
        "carbs": 60,
        "fat": 15,
        "fiber": 8,
        "sugar": 5,
        "sodium": 300
      },
      "estimatedCost": 3.50,
      "isBatchCookable": false,
      "isFreezerFriendly": false,
      "isKidFriendly": true,
      "tips": ["Helpful tip 1", "Helpful tip 2"]
    },
    "lunch": { same format as breakfast },
    "dinner": { same format as breakfast }
  },
  "tuesday": { same format as monday },
  "wednesday": { same format as monday },
  "thursday": { same format as monday },
  "friday": { same format as monday },
  "saturday": { same format as monday },
  "sunday": { same format as monday },
  "totalWeeklyCost": total_number_for_all_meals,
  "totalWeeklyCalories": total_number_for_all_meals,
  "batchCookingTips": ["tip1", "tip2"],
  "shoppingTips": ["tip1", "tip2"]
}

IMPORTANT: Ingredients MUST be objects with "name", "amount", and "unit" fields - NOT strings!`;

  try {
    const openai = getOpenAIClient();
    
    // Determine if UK localization is needed
    const isUK = params.currency === 'GBP';
    const systemPrompt = isUK 
      ? "You are an expert British meal planning nutritionist who specializes in creating budget-friendly, family-oriented weekly meal plans using BRITISH ENGLISH ONLY. CRITICAL: Use only British terminology: courgette (NOT zucchini), aubergine (NOT eggplant), coriander (NOT cilantro), rocket (NOT arugula), spring onion (NOT scallion), minced beef (NOT ground beef), prawns (NOT shrimp). Use metric measurements. Focus on nutrition, variety, cost-effectiveness, and practical meal preparation. Maximise ingredient reuse across the week to reduce waste and cost. Plan meals so fresh produce is used within 2-3 days. Consider all health metrics including medical conditions, fitness goals, activity levels, and individual characteristics when creating plans."
      : "You are an expert meal planning nutritionist who specializes in creating budget-friendly, family-oriented weekly meal plans. Focus on nutrition, variety, cost-effectiveness, and practical meal preparation. Maximize ingredient reuse across the week to reduce waste and cost. Plan meals so fresh produce is used within 2-3 days. Consider all health metrics including medical conditions, fitness goals, activity levels, and individual characteristics when creating plans.";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
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
