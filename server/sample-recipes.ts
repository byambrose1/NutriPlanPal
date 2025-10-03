import { InsertRecipe } from "../shared/schema";

export const sampleRecipes: (InsertRecipe & { id: string })[] = [
  // British Cuisine
  {
    id: "recipe-1",
    title: "Shepherd's Pie",
    description: "Classic British comfort food with minced lamb and fluffy mash topping",
    instructions: [
      "Fry mince until browned",
      "Cook onions, carrots, and peas",
      "Add stock and tomato purée, simmer 20 min",
      "Make mashed potatoes",
      "Layer mince in dish, top with mash",
      "Bake at 200°C/400°F for 20 minutes"
    ],
    ingredients: [
      { name: "Minced lamb", amount: "500", unit: "g" },
      { name: "Potatoes", amount: "800", unit: "g" },
      { name: "Carrots", amount: "2", unit: "large" },
      { name: "Peas", amount: "100", unit: "g" }
    ],
    prepTime: 20,
    cookTime: 50,
    servings: 6,
    difficulty: "medium",
    cuisineType: "British",
    dietaryTags: ["kid-friendly"],
    nutrition: { calories: 380, protein: 22, carbs: 40, fat: 14, fiber: 6, sugar: 5, sodium: 520 },
    estimatedCost: "9.50",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3"
  },
  {
    id: "recipe-2",
    title: "Fish and Chips",
    description: "Crispy battered cod with chunky chips - British classic",
    instructions: [
      "Cut potatoes into chips and parboil",
      "Make batter with flour, beer, and seasoning",
      "Coat fish in batter",
      "Deep fry chips until golden",
      "Fry battered fish until crispy",
      "Serve with mushy peas"
    ],
    ingredients: [
      { name: "Cod fillets", amount: "600", unit: "g" },
      { name: "Potatoes", amount: "1", unit: "kg" },
      { name: "Plain flour", amount: "200", unit: "g" },
      { name: "Beer", amount: "300", unit: "ml" }
    ],
    prepTime: 30,
    cookTime: 25,
    servings: 4,
    difficulty: "medium",
    cuisineType: "British",
    dietaryTags: ["kid-friendly"],
    nutrition: { calories: 650, protein: 35, carbs: 72, fat: 24, fiber: 6, sugar: 2, sodium: 680 },
    estimatedCost: "12.00",
    isBatchCookable: false,
    isFreezerFriendly: false,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1579208575657-c595a05383b7"
  },
  
  // Indian Cuisine
  {
    id: "recipe-3",
    title: "Chickpea Curry",
    description: "Creamy vegetarian curry packed with protein",
    instructions: [
      "Fry onions, garlic, ginger until soft",
      "Add curry powder, cook 1 minute",
      "Add tinned tomatoes and chickpeas",
      "Simmer 15 minutes",
      "Stir in coconut milk",
      "Serve with rice or naan"
    ],
    ingredients: [
      { name: "Chickpeas", amount: "2", unit: "tins" },
      { name: "Tinned tomatoes", amount: "1", unit: "tin" },
      { name: "Coconut milk", amount: "400", unit: "ml" },
      { name: "Curry powder", amount: "2", unit: "tbsp" }
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Indian",
    dietaryTags: ["vegetarian", "vegan"],
    nutrition: { calories: 280, protein: 12, carbs: 38, fat: 10, fiber: 11, sugar: 6, sodium: 420 },
    estimatedCost: "4.20",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641"
  },
  {
    id: "recipe-4",
    title: "Butter Chicken",
    description: "Rich, creamy tomato-based curry with tender chicken",
    instructions: [
      "Marinate chicken in yogurt and spices",
      "Grill chicken pieces",
      "Make sauce with tomatoes, cream, butter",
      "Add chicken to sauce",
      "Simmer 15 minutes",
      "Garnish with coriander"
    ],
    ingredients: [
      { name: "Chicken thighs", amount: "700", unit: "g" },
      { name: "Double cream", amount: "200", unit: "ml" },
      { name: "Tinned tomatoes", amount: "400", unit: "g" },
      { name: "Butter", amount: "50", unit: "g" }
    ],
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: "medium",
    cuisineType: "Indian",
    dietaryTags: [],
    nutrition: { calories: 420, protein: 32, carbs: 12, fat: 28, fiber: 3, sugar: 8, sodium: 560 },
    estimatedCost: "10.50",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398"
  },
  {
    id: "recipe-5",
    title: "Vegetable Biryani",
    description: "Fragrant rice dish with mixed vegetables and aromatic spices",
    instructions: [
      "Fry onions until golden",
      "Add vegetables and spices",
      "Layer with parboiled rice",
      "Cover and cook on low heat",
      "Let steam for 10 minutes",
      "Fluff and serve with raita"
    ],
    ingredients: [
      { name: "Basmati rice", amount: "400", unit: "g" },
      { name: "Mixed vegetables", amount: "400", unit: "g" },
      { name: "Biryani spices", amount: "3", unit: "tbsp" },
      { name: "Onions", amount: "2", unit: "large" }
    ],
    prepTime: 25,
    cookTime: 35,
    servings: 6,
    difficulty: "medium",
    cuisineType: "Indian",
    dietaryTags: ["vegetarian", "vegan"],
    nutrition: { calories: 320, protein: 8, carbs: 58, fat: 7, fiber: 5, sugar: 6, sodium: 380 },
    estimatedCost: "6.80",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8"
  },

  // Chinese Cuisine
  {
    id: "recipe-6",
    title: "Chicken Stir-Fry",
    description: "Quick and healthy meal with colorful vegetables",
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
      { name: "Soy sauce", amount: "3", unit: "tbsp" }
    ],
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Chinese",
    dietaryTags: [],
    nutrition: { calories: 220, protein: 28, carbs: 16, fat: 5, fiber: 4, sugar: 9, sodium: 680 },
    estimatedCost: "7.20",
    isBatchCookable: false,
    isFreezerFriendly: false,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19"
  },
  {
    id: "recipe-7",
    title: "Sweet and Sour Pork",
    description: "Crispy pork in tangy sweet and sour sauce",
    instructions: [
      "Coat pork in batter and fry until crispy",
      "Make sauce with vinegar, sugar, ketchup",
      "Add pineapple and peppers to sauce",
      "Toss crispy pork in sauce",
      "Serve immediately with rice"
    ],
    ingredients: [
      { name: "Pork loin", amount: "500", unit: "g" },
      { name: "Pineapple chunks", amount: "200", unit: "g" },
      { name: "Bell peppers", amount: "2", unit: "whole" },
      { name: "Rice vinegar", amount: "60", unit: "ml" }
    ],
    prepTime: 20,
    cookTime: 20,
    servings: 4,
    difficulty: "medium",
    cuisineType: "Chinese",
    dietaryTags: [],
    nutrition: { calories: 380, protein: 26, carbs: 42, fat: 12, fiber: 3, sugar: 24, sodium: 720 },
    estimatedCost: "8.90",
    isBatchCookable: false,
    isFreezerFriendly: false,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1609501676725-7186f017a4b2"
  },

  // Italian Cuisine
  {
    id: "recipe-8",
    title: "Spaghetti Carbonara",
    description: "Creamy pasta with bacon and parmesan",
    instructions: [
      "Cook spaghetti until al dente",
      "Fry bacon until crispy",
      "Mix eggs with parmesan",
      "Toss hot pasta with bacon",
      "Add egg mixture, stir quickly",
      "Season with black pepper"
    ],
    ingredients: [
      { name: "Spaghetti", amount: "400", unit: "g" },
      { name: "Bacon", amount: "200", unit: "g" },
      { name: "Eggs", amount: "4", unit: "whole" },
      { name: "Parmesan", amount: "100", unit: "g" }
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Italian",
    dietaryTags: [],
    nutrition: { calories: 520, protein: 24, carbs: 58, fat: 22, fiber: 3, sugar: 2, sodium: 820 },
    estimatedCost: "6.50",
    isBatchCookable: false,
    isFreezerFriendly: false,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3"
  },
  {
    id: "recipe-9",
    title: "Margherita Pizza",
    description: "Classic Italian pizza with fresh mozzarella and basil",
    instructions: [
      "Roll out pizza dough",
      "Spread tomato sauce",
      "Add mozzarella slices",
      "Bake at 240°C/475°F for 12 minutes",
      "Top with fresh basil",
      "Drizzle with olive oil"
    ],
    ingredients: [
      { name: "Pizza dough", amount: "400", unit: "g" },
      { name: "Tomato sauce", amount: "200", unit: "ml" },
      { name: "Mozzarella", amount: "250", unit: "g" },
      { name: "Fresh basil", amount: "20", unit: "g" }
    ],
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Italian",
    dietaryTags: ["vegetarian"],
    nutrition: { calories: 420, protein: 18, carbs: 52, fat: 16, fiber: 3, sugar: 4, sodium: 680 },
    estimatedCost: "7.80",
    isBatchCookable: false,
    isFreezerFriendly: true,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
  },
  {
    id: "recipe-10",
    title: "Lentil Bolognese",
    description: "Hearty vegan alternative to traditional bolognese",
    instructions: [
      "Fry onions, carrots, celery until soft",
      "Add garlic, cook 1 minute",
      "Add lentils, tinned tomatoes, stock",
      "Simmer 30 minutes",
      "Season and serve with spaghetti"
    ],
    ingredients: [
      { name: "Red lentils", amount: "200", unit: "g" },
      { name: "Tinned tomatoes", amount: "2", unit: "tins" },
      { name: "Spaghetti", amount: "400", unit: "g" },
      { name: "Carrots", amount: "2", unit: "medium" }
    ],
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Italian",
    dietaryTags: ["vegetarian", "vegan"],
    nutrition: { calories: 340, protein: 16, carbs: 62, fat: 2, fiber: 12, sugar: 10, sodium: 380 },
    estimatedCost: "3.80",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1572441713132-c542fc4fe282"
  },

  // Mexican Cuisine
  {
    id: "recipe-11",
    title: "Chicken Tacos",
    description: "Seasoned chicken with fresh toppings in soft tortillas",
    instructions: [
      "Season chicken with taco spices",
      "Cook chicken until done, then shred",
      "Warm tortillas",
      "Fill tortillas with chicken",
      "Top with salsa, lettuce, cheese",
      "Add sour cream and coriander"
    ],
    ingredients: [
      { name: "Chicken breast", amount: "500", unit: "g" },
      { name: "Tortillas", amount: "8", unit: "whole" },
      { name: "Taco seasoning", amount: "2", unit: "tbsp" },
      { name: "Cheddar cheese", amount: "100", unit: "g" }
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Mexican",
    dietaryTags: [],
    nutrition: { calories: 380, protein: 32, carbs: 38, fat: 12, fiber: 5, sugar: 3, sodium: 720 },
    estimatedCost: "9.20",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47"
  },
  {
    id: "recipe-12",
    title: "Bean Burrito Bowl",
    description: "Healthy rice bowl with black beans and fresh vegetables",
    instructions: [
      "Cook rice with lime juice",
      "Warm black beans with spices",
      "Chop vegetables",
      "Assemble bowl with rice base",
      "Add beans, vegetables, avocado",
      "Top with salsa and coriander"
    ],
    ingredients: [
      { name: "Rice", amount: "300", unit: "g" },
      { name: "Black beans", amount: "2", unit: "tins" },
      { name: "Avocado", amount: "2", unit: "whole" },
      { name: "Cherry tomatoes", amount: "200", unit: "g" }
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Mexican",
    dietaryTags: ["vegetarian", "vegan"],
    nutrition: { calories: 420, protein: 14, carbs: 68, fat: 12, fiber: 15, sugar: 4, sodium: 480 },
    estimatedCost: "6.50",
    isBatchCookable: true,
    isFreezerFriendly: false,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf"
  },
  {
    id: "recipe-13",
    title: "Beef Enchiladas",
    description: "Rolled tortillas stuffed with seasoned beef and cheese",
    instructions: [
      "Brown beef with taco seasoning",
      "Fill tortillas with beef mixture",
      "Roll and place in baking dish",
      "Cover with enchilada sauce",
      "Top with cheese",
      "Bake at 180°C/350°F for 20 minutes"
    ],
    ingredients: [
      { name: "Minced beef", amount: "500", unit: "g" },
      { name: "Tortillas", amount: "10", unit: "whole" },
      { name: "Enchilada sauce", amount: "400", unit: "ml" },
      { name: "Cheddar cheese", amount: "200", unit: "g" }
    ],
    prepTime: 20,
    cookTime: 30,
    servings: 5,
    difficulty: "medium",
    cuisineType: "Mexican",
    dietaryTags: [],
    nutrition: { calories: 480, protein: 28, carbs: 42, fat: 22, fiber: 4, sugar: 5, sodium: 920 },
    estimatedCost: "11.00",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1599974430984-a10e1c5e9fe0"
  },

  // Middle Eastern Cuisine
  {
    id: "recipe-14",
    title: "Falafel Wrap",
    description: "Crispy chickpea fritters in flatbread with tahini sauce",
    instructions: [
      "Make falafel mixture with chickpeas and spices",
      "Form into balls and fry until golden",
      "Warm pitta breads",
      "Fill with falafel, salad, pickles",
      "Drizzle with tahini sauce",
      "Wrap and serve"
    ],
    ingredients: [
      { name: "Chickpeas", amount: "2", unit: "tins" },
      { name: "Pitta bread", amount: "4", unit: "whole" },
      { name: "Tahini", amount: "100", unit: "ml" },
      { name: "Fresh parsley", amount: "30", unit: "g" }
    ],
    prepTime: 25,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    cuisineType: "Middle Eastern",
    dietaryTags: ["vegetarian", "vegan"],
    nutrition: { calories: 380, protein: 16, carbs: 52, fat: 14, fiber: 12, sugar: 4, sodium: 560 },
    estimatedCost: "5.80",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1592861956120-e524fc739696"
  },
  {
    id: "recipe-15",
    title: "Lamb Shawarma",
    description: "Spiced lamb with garlic sauce and pickled vegetables",
    instructions: [
      "Marinate lamb in shawarma spices",
      "Grill or pan-fry lamb",
      "Warm flatbreads",
      "Make garlic yogurt sauce",
      "Assemble with lamb, vegetables, sauce",
      "Serve immediately"
    ],
    ingredients: [
      { name: "Lamb leg", amount: "600", unit: "g" },
      { name: "Flatbreads", amount: "6", unit: "whole" },
      { name: "Greek yogurt", amount: "200", unit: "ml" },
      { name: "Shawarma spice mix", amount: "3", unit: "tbsp" }
    ],
    prepTime: 30,
    cookTime: 20,
    servings: 6,
    difficulty: "medium",
    cuisineType: "Middle Eastern",
    dietaryTags: [],
    nutrition: { calories: 420, protein: 28, carbs: 34, fat: 18, fiber: 3, sugar: 4, sodium: 680 },
    estimatedCost: "13.50",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783"
  },
  {
    id: "recipe-16",
    title: "Hummus Bowl",
    description: "Creamy hummus topped with roasted vegetables",
    instructions: [
      "Make hummus with chickpeas and tahini",
      "Roast vegetables with olive oil",
      "Spread hummus in bowl",
      "Top with roasted vegetables",
      "Drizzle with olive oil",
      "Serve with pitta bread"
    ],
    ingredients: [
      { name: "Chickpeas", amount: "2", unit: "tins" },
      { name: "Tahini", amount: "100", unit: "ml" },
      { name: "Mixed vegetables", amount: "400", unit: "g" },
      { name: "Olive oil", amount: "60", unit: "ml" }
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Middle Eastern",
    dietaryTags: ["vegetarian", "vegan"],
    nutrition: { calories: 320, protein: 12, carbs: 38, fat: 14, fiber: 10, sugar: 6, sodium: 420 },
    estimatedCost: "6.20",
    isBatchCookable: true,
    isFreezerFriendly: false,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1548950981-d8cc2a93d31c"
  },

  // Caribbean Cuisine
  {
    id: "recipe-17",
    title: "Jerk Chicken",
    description: "Spicy marinated chicken with authentic jerk seasoning",
    instructions: [
      "Marinate chicken in jerk paste overnight",
      "Grill chicken until charred and cooked through",
      "Rest for 5 minutes",
      "Serve with rice and peas",
      "Add coleslaw on the side"
    ],
    ingredients: [
      { name: "Chicken pieces", amount: "1", unit: "kg" },
      { name: "Jerk seasoning", amount: "4", unit: "tbsp" },
      { name: "Spring onions", amount: "4", unit: "whole" },
      { name: "Scotch bonnet", amount: "1", unit: "whole" }
    ],
    prepTime: 15,
    cookTime: 40,
    servings: 6,
    difficulty: "medium",
    cuisineType: "Caribbean",
    dietaryTags: [],
    nutrition: { calories: 340, protein: 38, carbs: 8, fat: 16, fiber: 2, sugar: 4, sodium: 720 },
    estimatedCost: "9.80",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec"
  },
  {
    id: "recipe-18",
    title: "Caribbean Rice and Peas",
    description: "Coconut rice with kidney beans - perfect side dish",
    instructions: [
      "Fry onions, garlic, thyme",
      "Add rice and toast",
      "Add coconut milk and kidney beans",
      "Simmer until rice is cooked",
      "Fluff with fork",
      "Garnish with fresh thyme"
    ],
    ingredients: [
      { name: "Rice", amount: "400", unit: "g" },
      { name: "Coconut milk", amount: "400", unit: "ml" },
      { name: "Kidney beans", amount: "1", unit: "tin" },
      { name: "Fresh thyme", amount: "4", unit: "sprigs" }
    ],
    prepTime: 10,
    cookTime: 25,
    servings: 6,
    difficulty: "easy",
    cuisineType: "Caribbean",
    dietaryTags: ["vegetarian", "vegan"],
    nutrition: { calories: 280, protein: 8, carbs: 48, fat: 7, fiber: 6, sugar: 2, sodium: 340 },
    estimatedCost: "4.50",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a"
  },

  // African Cuisine
  {
    id: "recipe-19",
    title: "Jollof Rice",
    description: "West African one-pot rice dish with tomatoes and spices",
    instructions: [
      "Blend tomatoes, peppers, onions",
      "Fry paste until oil rises",
      "Add rice and stir",
      "Add stock and seasonings",
      "Cover and simmer until rice is cooked",
      "Let steam for 10 minutes"
    ],
    ingredients: [
      { name: "Rice", amount: "500", unit: "g" },
      { name: "Tinned tomatoes", amount: "2", unit: "tins" },
      { name: "Red peppers", amount: "3", unit: "whole" },
      { name: "Chicken stock", amount: "750", unit: "ml" }
    ],
    prepTime: 20,
    cookTime: 45,
    servings: 6,
    difficulty: "medium",
    cuisineType: "African",
    dietaryTags: ["vegetarian", "vegan"],
    nutrition: { calories: 320, protein: 7, carbs: 62, fat: 4, fiber: 5, sugar: 8, sodium: 580 },
    estimatedCost: "6.00",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26"
  },
  {
    id: "recipe-20",
    title: "Peanut Stew",
    description: "Rich West African stew with peanut butter and vegetables",
    instructions: [
      "Fry onions until soft",
      "Add sweet potato and spices",
      "Add stock and peanut butter",
      "Simmer until sweet potato is tender",
      "Add spinach and chickpeas",
      "Serve with rice"
    ],
    ingredients: [
      { name: "Peanut butter", amount: "200", unit: "g" },
      { name: "Sweet potato", amount: "600", unit: "g" },
      { name: "Chickpeas", amount: "1", unit: "tin" },
      { name: "Spinach", amount: "200", unit: "g" }
    ],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "easy",
    cuisineType: "African",
    dietaryTags: ["vegetarian", "vegan"],
    nutrition: { calories: 420, protein: 16, carbs: 48, fat: 18, fiber: 12, sugar: 12, sodium: 480 },
    estimatedCost: "7.20",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd"
  },

  // Additional Quick & Easy Recipes
  {
    id: "recipe-21",
    title: "Omelette",
    description: "Fluffy eggs with cheese and vegetables",
    instructions: [
      "Whisk eggs with seasoning",
      "Heat butter in pan",
      "Pour in eggs",
      "Add fillings when half set",
      "Fold and serve"
    ],
    ingredients: [
      { name: "Eggs", amount: "6", unit: "whole" },
      { name: "Cheese", amount: "100", unit: "g" },
      { name: "Mushrooms", amount: "100", unit: "g" },
      { name: "Butter", amount: "20", unit: "g" }
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: "easy",
    cuisineType: "French",
    dietaryTags: ["vegetarian"],
    nutrition: { calories: 320, protein: 22, carbs: 4, fat: 24, fiber: 1, sugar: 2, sodium: 480 },
    estimatedCost: "3.50",
    isBatchCookable: false,
    isFreezerFriendly: false,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1612240498936-65f5fbbf9111"
  },
  {
    id: "recipe-22",
    title: "Greek Salad",
    description: "Fresh Mediterranean salad with feta cheese",
    instructions: [
      "Chop tomatoes, cucumber, onion",
      "Add olives and feta",
      "Dress with olive oil and lemon",
      "Season with oregano",
      "Toss gently",
      "Serve immediately"
    ],
    ingredients: [
      { name: "Tomatoes", amount: "4", unit: "large" },
      { name: "Cucumber", amount: "1", unit: "whole" },
      { name: "Feta cheese", amount: "200", unit: "g" },
      { name: "Kalamata olives", amount: "100", unit: "g" }
    ],
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Greek",
    dietaryTags: ["vegetarian"],
    nutrition: { calories: 220, protein: 8, carbs: 12, fat: 16, fiber: 4, sugar: 8, sodium: 680 },
    estimatedCost: "6.80",
    isBatchCookable: false,
    isFreezerFriendly: false,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
  },
  {
    id: "recipe-23",
    title: "Thai Green Curry",
    description: "Fragrant curry with coconut milk and vegetables",
    instructions: [
      "Fry green curry paste",
      "Add coconut milk",
      "Add chicken or tofu and vegetables",
      "Simmer until cooked",
      "Add Thai basil",
      "Serve with jasmine rice"
    ],
    ingredients: [
      { name: "Green curry paste", amount: "3", unit: "tbsp" },
      { name: "Coconut milk", amount: "400", unit: "ml" },
      { name: "Chicken breast", amount: "400", unit: "g" },
      { name: "Thai basil", amount: "20", unit: "g" }
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    cuisineType: "Thai",
    dietaryTags: [],
    nutrition: { calories: 340, protein: 26, carbs: 12, fat: 22, fiber: 3, sugar: 6, sodium: 720 },
    estimatedCost: "9.50",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd"
  },
  {
    id: "recipe-24",
    title: "Pad Thai",
    description: "Classic Thai noodle dish with peanuts and lime",
    instructions: [
      "Soak rice noodles",
      "Make sauce with tamarind, fish sauce, sugar",
      "Stir-fry prawns or chicken",
      "Add noodles and sauce",
      "Toss with egg and beansprouts",
      "Garnish with peanuts and lime"
    ],
    ingredients: [
      { name: "Rice noodles", amount: "400", unit: "g" },
      { name: "Prawns", amount: "300", unit: "g" },
      { name: "Tamarind paste", amount: "2", unit: "tbsp" },
      { name: "Peanuts", amount: "50", unit: "g" }
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    cuisineType: "Thai",
    dietaryTags: [],
    nutrition: { calories: 420, protein: 24, carbs: 58, fat: 12, fiber: 4, sugar: 8, sodium: 880 },
    estimatedCost: "10.50",
    isBatchCookable: false,
    isFreezerFriendly: false,
    isKidFriendly: false,
    imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e"
  },
  {
    id: "recipe-25",
    title: "Beef Chili",
    description: "Hearty American-style chili with beans",
    instructions: [
      "Brown minced beef",
      "Add onions, peppers, garlic",
      "Add tinned tomatoes and beans",
      "Season with chili powder",
      "Simmer for 45 minutes",
      "Serve with rice or cornbread"
    ],
    ingredients: [
      { name: "Minced beef", amount: "600", unit: "g" },
      { name: "Kidney beans", amount: "2", unit: "tins" },
      { name: "Tinned tomatoes", amount: "2", unit: "tins" },
      { name: "Chili powder", amount: "3", unit: "tbsp" }
    ],
    prepTime: 15,
    cookTime: 50,
    servings: 6,
    difficulty: "easy",
    cuisineType: "American",
    dietaryTags: [],
    nutrition: { calories: 380, protein: 28, carbs: 32, fat: 16, fiber: 12, sugar: 8, sodium: 680 },
    estimatedCost: "9.80",
    isBatchCookable: true,
    isFreezerFriendly: true,
    isKidFriendly: true,
    imageUrl: "https://images.unsplash.com/photo-1583224964661-bbbeeb18fb12"
  }
];
