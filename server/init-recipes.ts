import { db } from "./db";
import { recipes } from "@shared/schema";
import { importedRecipes } from "./import-recipes-json";

async function initializeRecipes() {
  try {
    console.log("Checking if recipes need to be initialized...");
    
    const existingRecipes = await db.select().from(recipes).limit(1);
    
    if (existingRecipes.length > 0) {
      console.log("Recipes already initialized in database");
      return;
    }

    console.log(`Inserting ${importedRecipes.length} recipes into database...`);
    
    for (const recipe of importedRecipes) {
      await db.insert(recipes).values({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        instructions: recipe.instructions,
        ingredients: recipe.ingredients,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        cuisineType: recipe.cuisineType,
        dietaryTags: recipe.dietaryTags,
        nutrition: recipe.nutrition,
        estimatedCost: recipe.estimatedCost,
        isBatchCookable: recipe.isBatchCookable,
        isFreezerFriendly: recipe.isFreezerFriendly,
        isKidFriendly: recipe.isKidFriendly,
        rating: "0",
        imageUrl: null,
        imageMetadata: null,
      });
    }

    console.log(`Successfully inserted ${importedRecipes.length} recipes into database`);
  } catch (error) {
    console.error("Error initializing recipes:", error);
    throw error;
  }
}

initializeRecipes()
  .then(() => {
    console.log("Recipe initialization complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to initialize recipes:", error);
    process.exit(1);
  });
