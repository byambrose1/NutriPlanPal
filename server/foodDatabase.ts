// Comprehensive food database with accurate nutrition data
// This serves as fallback while FatSecret IP whitelist activates

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  serving: {
    amount: number;
    unit: string;
    description: string;
  };
  nutrition: {
    calories: number;
    protein: number;      // grams
    carbs: number;        // grams
    fat: number;          // grams
    fiber?: number;       // grams
    sugar?: number;       // grams
    sodium?: number;      // mg
    cholesterol?: number; // mg
  };
  searchTerms: string[];
}

export const foodDatabase: FoodItem[] = [
  // Fruits
  { id: "fruit-001", name: "Apple", category: "Fruits", serving: { amount: 1, unit: "medium", description: "1 medium apple (182g)" }, nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19 }, searchTerms: ["apple", "apples", "fruit"] },
  { id: "fruit-002", name: "Banana", category: "Fruits", serving: { amount: 1, unit: "medium", description: "1 medium banana (118g)" }, nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14 }, searchTerms: ["banana", "bananas", "fruit"] },
  { id: "fruit-003", name: "Orange", category: "Fruits", serving: { amount: 1, unit: "medium", description: "1 medium orange (131g)" }, nutrition: { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12 }, searchTerms: ["orange", "oranges", "citrus", "fruit"] },
  { id: "fruit-004", name: "Strawberries", category: "Fruits", serving: { amount: 1, unit: "cup", description: "1 cup halved (152g)" }, nutrition: { calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sugar: 7 }, searchTerms: ["strawberry", "strawberries", "berries", "fruit"] },
  { id: "fruit-005", name: "Blueberries", category: "Fruits", serving: { amount: 1, unit: "cup", description: "1 cup (148g)" }, nutrition: { calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, sugar: 15 }, searchTerms: ["blueberry", "blueberries", "berries", "fruit"] },
  { id: "fruit-006", name: "Grapes", category: "Fruits", serving: { amount: 1, unit: "cup", description: "1 cup (151g)" }, nutrition: { calories: 104, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4, sugar: 23 }, searchTerms: ["grape", "grapes", "fruit"] },
  { id: "fruit-007", name: "Watermelon", category: "Fruits", serving: { amount: 1, unit: "cup", description: "1 cup diced (152g)" }, nutrition: { calories: 46, protein: 0.9, carbs: 12, fat: 0.2, fiber: 0.6, sugar: 9 }, searchTerms: ["watermelon", "melon", "fruit"] },
  { id: "fruit-008", name: "Mango", category: "Fruits", serving: { amount: 1, unit: "cup", description: "1 cup sliced (165g)" }, nutrition: { calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23 }, searchTerms: ["mango", "mangoes", "fruit", "tropical"] },

  // Vegetables
  { id: "veg-001", name: "Broccoli", category: "Vegetables", serving: { amount: 1, unit: "cup", description: "1 cup chopped (91g)" }, nutrition: { calories: 31, protein: 2.6, carbs: 6, fat: 0.3, fiber: 2.4, sugar: 1.5 }, searchTerms: ["broccoli", "vegetable", "green"] },
  { id: "veg-002", name: "Carrots", category: "Vegetables", serving: { amount: 1, unit: "medium", description: "1 medium carrot (61g)" }, nutrition: { calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7, sugar: 3 }, searchTerms: ["carrot", "carrots", "vegetable", "orange"] },
  { id: "veg-003", name: "Spinach", category: "Vegetables", serving: { amount: 1, unit: "cup", description: "1 cup raw (30g)" }, nutrition: { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1 }, searchTerms: ["spinach", "leafy green", "vegetable", "greens"] },
  { id: "veg-004", name: "Bell Pepper", category: "Vegetables", serving: { amount: 1, unit: "medium", description: "1 medium pepper (119g)" }, nutrition: { calories: 30, protein: 1.2, carbs: 7, fat: 0.3, fiber: 2.5, sugar: 4.2 }, searchTerms: ["pepper", "bell pepper", "capsicum", "vegetable"] },
  { id: "veg-005", name: "Tomato", category: "Vegetables", serving: { amount: 1, unit: "medium", description: "1 medium tomato (123g)" }, nutrition: { calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, sugar: 3.2 }, searchTerms: ["tomato", "tomatoes", "vegetable"] },
  { id: "veg-006", name: "Cucumber", category: "Vegetables", serving: { amount: 1, unit: "cup", description: "1 cup sliced (119g)" }, nutrition: { calories: 16, protein: 0.8, carbs: 3.8, fat: 0.1, fiber: 0.6, sugar: 1.9 }, searchTerms: ["cucumber", "vegetable"] },
  { id: "veg-007", name: "Sweet Potato", category: "Vegetables", serving: { amount: 1, unit: "medium", description: "1 medium baked (114g)" }, nutrition: { calories: 103, protein: 2.3, carbs: 24, fat: 0.2, fiber: 3.8, sugar: 7.4 }, searchTerms: ["sweet potato", "yam", "vegetable", "potato"] },
  { id: "veg-008", name: "Lettuce", category: "Vegetables", serving: { amount: 1, unit: "cup", description: "1 cup shredded (47g)" }, nutrition: { calories: 7, protein: 0.5, carbs: 1.2, fat: 0.1, fiber: 0.6, sugar: 0.5 }, searchTerms: ["lettuce", "salad", "greens", "vegetable"] },

  // Proteins
  { id: "protein-001", name: "Chicken Breast", brand: "Generic", category: "Proteins", serving: { amount: 100, unit: "g", description: "100g cooked, skinless" }, nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6, sodium: 74, cholesterol: 85 }, searchTerms: ["chicken", "chicken breast", "poultry", "meat", "protein"] },
  { id: "protein-002", name: "Salmon", category: "Proteins", serving: { amount: 100, unit: "g", description: "100g cooked" }, nutrition: { calories: 206, protein: 22, carbs: 0, fat: 13, sodium: 59, cholesterol: 63 }, searchTerms: ["salmon", "fish", "seafood", "protein"] },
  { id: "protein-003", name: "Ground Beef (90% lean)", category: "Proteins", serving: { amount: 100, unit: "g", description: "100g cooked" }, nutrition: { calories: 176, protein: 25, carbs: 0, fat: 8, sodium: 72, cholesterol: 77 }, searchTerms: ["beef", "ground beef", "mince", "meat", "protein"] },
  { id: "protein-004", name: "Eggs", category: "Proteins", serving: { amount: 1, unit: "large", description: "1 large egg (50g)" }, nutrition: { calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, sodium: 71, cholesterol: 186 }, searchTerms: ["egg", "eggs", "protein"] },
  { id: "protein-005", name: "Tofu (Firm)", category: "Proteins", serving: { amount: 100, unit: "g", description: "100g firm tofu" }, nutrition: { calories: 144, protein: 17, carbs: 3, fat: 9, sodium: 14 }, searchTerms: ["tofu", "soy", "protein", "vegetarian", "vegan"] },
  { id: "protein-006", name: "Greek Yogurt (Non-fat)", brand: "Generic", category: "Dairy", serving: { amount: 170, unit: "g", description: "1 container (170g)" }, nutrition: { calories: 100, protein: 18, carbs: 7, fat: 0, sugar: 6, sodium: 65 }, searchTerms: ["yogurt", "greek yogurt", "dairy", "protein"] },
  { id: "protein-007", name: "Tuna (Canned in Water)", brand: "Generic", category: "Proteins", serving: { amount: 85, unit: "g", description: "1 can drained (85g)" }, nutrition: { calories: 99, protein: 22, carbs: 0, fat: 1, sodium: 318 }, searchTerms: ["tuna", "fish", "canned tuna", "seafood", "protein"] },
  { id: "protein-008", name: "Lentils (Cooked)", category: "Proteins", serving: { amount: 1, unit: "cup", description: "1 cup cooked (198g)" }, nutrition: { calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 16, sodium: 4 }, searchTerms: ["lentils", "legumes", "beans", "protein", "vegetarian"] },

  // Grains & Carbs
  { id: "grain-001", name: "Brown Rice (Cooked)", category: "Grains", serving: { amount: 1, unit: "cup", description: "1 cup cooked (195g)" }, nutrition: { calories: 218, protein: 4.5, carbs: 46, fat: 1.6, fiber: 3.5 }, searchTerms: ["rice", "brown rice", "grain", "carb"] },
  { id: "grain-002", name: "White Rice (Cooked)", category: "Grains", serving: { amount: 1, unit: "cup", description: "1 cup cooked (158g)" }, nutrition: { calories: 205, protein: 4.2, carbs: 45, fat: 0.4, fiber: 0.6 }, searchTerms: ["rice", "white rice", "grain", "carb"] },
  { id: "grain-003", name: "Quinoa (Cooked)", category: "Grains", serving: { amount: 1, unit: "cup", description: "1 cup cooked (185g)" }, nutrition: { calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5 }, searchTerms: ["quinoa", "grain", "carb", "protein"] },
  { id: "grain-004", name: "Oats (Dry)", category: "Grains", serving: { amount: 0.5, unit: "cup", description: "1/2 cup dry (40g)" }, nutrition: { calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4 }, searchTerms: ["oats", "oatmeal", "porridge", "grain", "breakfast"] },
  { id: "grain-005", name: "Whole Wheat Bread", brand: "Generic", category: "Grains", serving: { amount: 1, unit: "slice", description: "1 slice (28g)" }, nutrition: { calories: 80, protein: 4, carbs: 14, fat: 1, fiber: 2, sodium: 140 }, searchTerms: ["bread", "wheat bread", "whole wheat", "grain"] },
  { id: "grain-006", name: "Pasta (Whole Wheat, Cooked)", category: "Grains", serving: { amount: 1, unit: "cup", description: "1 cup cooked (140g)" }, nutrition: { calories: 174, protein: 7.5, carbs: 37, fat: 0.8, fiber: 6 }, searchTerms: ["pasta", "noodles", "spaghetti", "grain", "carb"] },
  { id: "grain-007", name: "Sweet Corn", category: "Grains", serving: { amount: 1, unit: "cup", description: "1 cup kernels (154g)" }, nutrition: { calories: 125, protein: 4.7, carbs: 27, fat: 1.8, fiber: 3.6, sugar: 9 }, searchTerms: ["corn", "sweet corn", "vegetable", "grain"] },

  // Nuts & Seeds
  { id: "nuts-001", name: "Almonds", category: "Nuts & Seeds", serving: { amount: 28, unit: "g", description: "1 oz (28g), about 23 almonds" }, nutrition: { calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5 }, searchTerms: ["almonds", "nuts", "snack"] },
  { id: "nuts-002", name: "Peanut Butter", brand: "Generic", category: "Nuts & Seeds", serving: { amount: 2, unit: "tbsp", description: "2 tablespoons (32g)" }, nutrition: { calories: 188, protein: 8, carbs: 7, fat: 16, fiber: 2, sugar: 3 }, searchTerms: ["peanut butter", "peanuts", "nut butter", "spread"] },
  { id: "nuts-003", name: "Walnuts", category: "Nuts & Seeds", serving: { amount: 28, unit: "g", description: "1 oz (28g), about 14 halves" }, nutrition: { calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9 }, searchTerms: ["walnuts", "nuts", "snack"] },
  { id: "nuts-004", name: "Chia Seeds", category: "Nuts & Seeds", serving: { amount: 28, unit: "g", description: "2 tablespoons (28g)" }, nutrition: { calories: 138, protein: 4.7, carbs: 12, fat: 8.7, fiber: 9.8 }, searchTerms: ["chia seeds", "seeds", "superfood"] },

  // Dairy
  { id: "dairy-001", name: "Milk (2% Fat)", brand: "Generic", category: "Dairy", serving: { amount: 1, unit: "cup", description: "1 cup (244g)" }, nutrition: { calories: 122, protein: 8, carbs: 12, fat: 4.8, sugar: 12, sodium: 115 }, searchTerms: ["milk", "dairy", "2%"] },
  { id: "dairy-002", name: "Cheddar Cheese", brand: "Generic", category: "Dairy", serving: { amount: 28, unit: "g", description: "1 oz (28g)" }, nutrition: { calories: 114, protein: 7, carbs: 0.4, fat: 9.4, sodium: 176, cholesterol: 30 }, searchTerms: ["cheese", "cheddar", "dairy"] },
  { id: "dairy-003", name: "Cottage Cheese (Low-fat)", brand: "Generic", category: "Dairy", serving: { amount: 1, unit: "cup", description: "1 cup (226g)" }, nutrition: { calories: 163, protein: 28, carbs: 6, fat: 2.3, sodium: 918 }, searchTerms: ["cottage cheese", "cheese", "dairy", "protein"] },
  { id: "dairy-004", name: "Almond Milk (Unsweetened)", brand: "Generic", category: "Dairy Alternatives", serving: { amount: 1, unit: "cup", description: "1 cup (240ml)" }, nutrition: { calories: 30, protein: 1, carbs: 1, fat: 2.5, sodium: 170 }, searchTerms: ["almond milk", "milk alternative", "vegan", "dairy free"] },

  // Oils & Fats
  { id: "oil-001", name: "Olive Oil", category: "Oils & Fats", serving: { amount: 1, unit: "tbsp", description: "1 tablespoon (14g)" }, nutrition: { calories: 119, protein: 0, carbs: 0, fat: 13.5 }, searchTerms: ["olive oil", "oil", "fat", "cooking"] },
  { id: "oil-002", name: "Butter", brand: "Generic", category: "Oils & Fats", serving: { amount: 1, unit: "tbsp", description: "1 tablespoon (14g)" }, nutrition: { calories: 102, protein: 0.1, carbs: 0, fat: 11.5, sodium: 91, cholesterol: 31 }, searchTerms: ["butter", "fat", "dairy"] },
  { id: "oil-003", name: "Avocado", category: "Fruits", serving: { amount: 0.5, unit: "medium", description: "1/2 medium avocado (100g)" }, nutrition: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7 }, searchTerms: ["avocado", "fruit", "healthy fat"] }
];

// Search function with fuzzy matching
export function searchFoods(query: string, maxResults: number = 20): FoodItem[] {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return [];
  }

  // Score each food item based on how well it matches
  const scored = foodDatabase.map(food => {
    let score = 0;
    
    // Exact name match
    if (food.name.toLowerCase() === lowerQuery) {
      score += 100;
    }
    // Name starts with query
    else if (food.name.toLowerCase().startsWith(lowerQuery)) {
      score += 50;
    }
    // Name contains query
    else if (food.name.toLowerCase().includes(lowerQuery)) {
      score += 25;
    }
    
    // Check search terms
    for (const term of food.searchTerms) {
      if (term === lowerQuery) {
        score += 75;
      } else if (term.startsWith(lowerQuery)) {
        score += 35;
      } else if (term.includes(lowerQuery)) {
        score += 15;
      }
    }
    
    // Brand match
    if (food.brand && food.brand.toLowerCase().includes(lowerQuery)) {
      score += 10;
    }
    
    return { food, score };
  });

  // Filter out non-matches and sort by score
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.food);
}

// Get food by ID
export function getFoodById(id: string): FoodItem | undefined {
  return foodDatabase.find(food => food.id === id);
}

// Get foods by category
export function getFoodsByCategory(category: string): FoodItem[] {
  return foodDatabase.filter(food => food.category === category);
}

// Get all categories
export function getAllCategories(): string[] {
  return Array.from(new Set(foodDatabase.map(food => food.category)));
}
