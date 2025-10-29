import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';

interface JSONRecipe {
  recipe_id: number;
  name: string;
  cuisine: string;
  meal_type: string;
  diet_tags: string[];
  allergens: string[];
  dislikes: string;
  servings: number;
  prep_time_mins: number;
  cook_time_mins: number;
  total_time_mins: number;
  ingredients_metric: { ingredient: string; amount: number; unit: string }[];
  ingredients_imperial: { ingredient: string; amount: number; unit: string }[];
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  tags: string[];
}

export function importRecipesFromJSON(filePath: string) {
  console.log('Reading JSON file:', filePath);
  const fileContent = readFileSync(filePath, 'utf-8');
  const rawData: JSONRecipe[] = JSON.parse(fileContent);

  console.log(`Found ${rawData.length} recipes in JSON file`);

  const recipes = rawData.map((recipe) => {
    // Convert ingredients to our format (using metric as default for UK)
    const ingredients = recipe.ingredients_metric.map(ing => ({
      name: ing.ingredient,
      amount: ing.amount.toString(),
      unit: ing.unit
    }));

    // Combine diet_tags and tags for dietary information
    const allTags = [
      ...(recipe.diet_tags || []),
      ...(recipe.tags || [])
    ].map(t => t.toLowerCase().replace(/\s+/g, '-'));

    // Determine difficulty based on cook time and number of steps
    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    if (recipe.cook_time_mins <= 20 && recipe.instructions.length <= 4) {
      difficulty = 'easy';
    } else if (recipe.cook_time_mins >= 45 || recipe.instructions.length >= 8) {
      difficulty = 'hard';
    }

    // Estimate cost based on ingredients (rough estimate)
    const ingredientCount = ingredients.length;
    let estimatedCost = '5.00';
    if (ingredientCount <= 4) {
      estimatedCost = '3.50';
    } else if (ingredientCount >= 8) {
      estimatedCost = '8.00';
    }

    // Determine if batch cookable (more servings or cook time > 30 mins)
    const isBatchCookable = recipe.servings >= 4 || recipe.cook_time_mins >= 30;
    
    // Determine if kid friendly based on tags
    const isKidFriendly = allTags.includes('family-friendly') || recipe.meal_type === 'Snack';

    // Generate better recipe title based on main ingredients and cuisine
    const mainIngredient = ingredients[0]?.name || 'Mixed';
    const secondIngredient = ingredients[1]?.name || '';
    let recipeTitle = '';
    
    // Create meaningful recipe names based on cuisine and ingredients
    if (recipe.meal_type === 'Smoothie') {
      recipeTitle = `${mainIngredient} ${secondIngredient ? '& ' + secondIngredient : ''} Smoothie`;
    } else if (recipe.meal_type === 'Salad') {
      recipeTitle = `${mainIngredient} ${recipe.cuisine} Salad`;
    } else if (recipe.meal_type === 'Soup') {
      recipeTitle = `${recipe.cuisine} ${mainIngredient} Soup`;
    } else if (recipe.meal_type === 'Dessert') {
      recipeTitle = `${recipe.cuisine}-Style ${mainIngredient} Dessert`;
    } else if (recipe.meal_type === 'Breakfast') {
      recipeTitle = `${recipe.cuisine} Breakfast with ${mainIngredient}`;
    } else if (recipe.meal_type === 'Snack') {
      recipeTitle = `${mainIngredient} ${recipe.cuisine} Bites`;
    } else {
      // Main courses
      recipeTitle = `${recipe.cuisine} ${mainIngredient} ${secondIngredient ? 'with ' + secondIngredient : ''}`;
    }

    return {
      id: `recipe-${randomUUID()}`,
      title: recipeTitle.trim(),
      description: `Delicious ${recipe.cuisine.toLowerCase()} ${recipe.meal_type.toLowerCase()} featuring ${ingredients.slice(0, 3).map(i => i.name.toLowerCase()).join(', ')}. ${allTags.includes('quick') ? 'Quick and easy to prepare!' : 'Perfect for family meals.'}`.trim(),
      instructions: recipe.instructions,
      ingredients,
      prepTime: recipe.prep_time_mins,
      cookTime: recipe.cook_time_mins,
      servings: recipe.servings,
      difficulty,
      cuisineType: recipe.cuisine,
      dietaryTags: allTags.length > 0 ? allTags : null,
      nutrition: {
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
        fiber: recipe.fibre,
        sugar: Math.round(recipe.carbs * 0.3), // Estimate sugar as ~30% of carbs
        sodium: Math.round(recipe.calories * 0.8) // Rough estimate
      },
      estimatedCost,
      isBatchCookable,
      isFreezerFriendly: isBatchCookable && recipe.meal_type !== 'Smoothie' && recipe.meal_type !== 'Salad',
      isKidFriendly,
      imageUrl: null,
      // Store imperial ingredients as metadata for US users
      ingredientsImperial: recipe.ingredients_imperial.map(ing => ({
        name: ing.ingredient,
        amount: ing.amount.toString(),
        unit: ing.unit
      }))
    };
  });

  console.log(`Successfully parsed ${recipes.length} recipes`);
  return recipes;
}

// Export for use in storage
export const importedRecipes = importRecipesFromJSON('attached_assets/recipe_dataset_500 json_1759535132961.json');
