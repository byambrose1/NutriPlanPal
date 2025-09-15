export interface GroceryPriceData {
  itemName: string;
  storeName: string;
  price: number;
  unit: string;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  lastUpdated: Date;
}

export interface StoreLocation {
  name: string;
  address: string;
  distance: number; // miles
  priceRating: 'budget' | 'moderate' | 'premium';
}

// Mock price comparison data - in production this would scrape real grocery store websites
const mockPriceData: { [key: string]: GroceryPriceData[] } = {
  "chicken breast": [
    { itemName: "chicken breast", storeName: "Walmart", price: 6.99, unit: "lb", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "chicken breast", storeName: "Target", price: 7.49, unit: "lb", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "chicken breast", storeName: "Whole Foods", price: 8.99, unit: "lb", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "chicken breast", storeName: "Kroger", price: 7.29, unit: "lb", availability: "limited", lastUpdated: new Date() },
    { itemName: "chicken breast", storeName: "Aldi", price: 5.99, unit: "lb", availability: "in-stock", lastUpdated: new Date() }
  ],
  "ground turkey": [
    { itemName: "ground turkey", storeName: "Walmart", price: 6.99, unit: "lb", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "ground turkey", storeName: "Target", price: 7.49, unit: "lb", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "ground turkey", storeName: "Whole Foods", price: 8.99, unit: "lb", availability: "in-stock", lastUpdated: new Date() }
  ],
  "quinoa": [
    { itemName: "quinoa", storeName: "Target", price: 6.49, unit: "2 cups", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "quinoa", storeName: "Whole Foods", price: 7.99, unit: "2 cups", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "quinoa", storeName: "Aldi", price: 5.99, unit: "2 cups", availability: "in-stock", lastUpdated: new Date() }
  ],
  "baby spinach": [
    { itemName: "baby spinach", storeName: "Kroger", price: 3.99, unit: "5 oz", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "baby spinach", storeName: "Walmart", price: 3.49, unit: "5 oz", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "baby spinach", storeName: "Whole Foods", price: 4.99, unit: "5 oz", availability: "in-stock", lastUpdated: new Date() }
  ],
  "bell peppers": [
    { itemName: "bell peppers", storeName: "Walmart", price: 4.97, unit: "3 pack", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "bell peppers", storeName: "Target", price: 5.29, unit: "3 pack", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "bell peppers", storeName: "Aldi", price: 3.99, unit: "3 pack", availability: "in-stock", lastUpdated: new Date() }
  ],
  "rolled oats": [
    { itemName: "rolled oats", storeName: "Aldi", price: 2.49, unit: "18 oz", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "rolled oats", storeName: "Walmart", price: 2.98, unit: "18 oz", availability: "in-stock", lastUpdated: new Date() },
    { itemName: "rolled oats", storeName: "Target", price: 3.29, unit: "18 oz", availability: "in-stock", lastUpdated: new Date() }
  ]
};

const mockStoreLocations: StoreLocation[] = [
  { name: "Aldi", address: "123 Budget Ave", distance: 1.2, priceRating: "budget" },
  { name: "Walmart", address: "456 Value St", distance: 2.1, priceRating: "budget" },
  { name: "Target", address: "789 Target Blvd", distance: 1.8, priceRating: "moderate" },
  { name: "Kroger", address: "321 Fresh Way", distance: 2.5, priceRating: "moderate" },
  { name: "Whole Foods", address: "654 Organic Ln", distance: 3.2, priceRating: "premium" }
];

export async function compareGroceryPrices(items: string[]): Promise<{ [key: string]: GroceryPriceData[] }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const results: { [key: string]: GroceryPriceData[] } = {};
  
  for (const item of items) {
    const normalizedItem = item.toLowerCase().trim();
    const prices = mockPriceData[normalizedItem] || [];
    
    // Sort by price (lowest first)
    results[item] = prices.sort((a, b) => a.price - b.price);
  }
  
  return results;
}

export async function findBestPrices(items: string[]): Promise<Array<{
  itemName: string;
  bestPrice: GroceryPriceData;
  alternatives: GroceryPriceData[];
}>> {
  const priceComparisons = await compareGroceryPrices(items);
  
  return Object.entries(priceComparisons).map(([itemName, prices]) => ({
    itemName,
    bestPrice: prices[0], // First item is cheapest due to sorting
    alternatives: prices.slice(1, 4) // Show top 3 alternatives
  }));
}

export async function optimizeShoppingRoute(selectedStores: string[]): Promise<{
  optimizedRoute: StoreLocation[];
  totalDistance: number;
  estimatedTime: number;
}> {
  // Simulate route optimization
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const storeLocations = mockStoreLocations.filter(store => 
    selectedStores.includes(store.name)
  );
  
  // Simple optimization - sort by distance
  const optimizedRoute = storeLocations.sort((a, b) => a.distance - b.distance);
  const totalDistance = optimizedRoute.reduce((sum, store) => sum + store.distance, 0);
  const estimatedTime = totalDistance * 10 + optimizedRoute.length * 15; // 10 min per mile + 15 min per store
  
  return {
    optimizedRoute,
    totalDistance: Math.round(totalDistance * 10) / 10,
    estimatedTime: Math.round(estimatedTime)
  };
}

export async function getStoreLocations(zipCode?: string): Promise<StoreLocation[]> {
  // In production, this would use the zip code to find actual nearby stores
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockStoreLocations;
}

export function generateShoppingList(recipes: any[], familySize: number): Array<{
  name: string;
  amount: string;
  unit: string;
  category: string;
  estimatedPrice?: number;
  bestStore?: string;
}> {
  const consolidatedIngredients: { [key: string]: { amount: number; unit: string; category: string } } = {};
  
  // Consolidate ingredients from all recipes
  recipes.forEach(recipe => {
    if (recipe.ingredients) {
      recipe.ingredients.forEach((ingredient: any) => {
        const key = ingredient.name.toLowerCase();
        const amount = parseFloat(ingredient.amount) || 1;
        
        if (consolidatedIngredients[key]) {
          consolidatedIngredients[key].amount += amount;
        } else {
          consolidatedIngredients[key] = {
            amount: amount,
            unit: ingredient.unit,
            category: categorizeIngredient(ingredient.name)
          };
        }
      });
    }
  });
  
  // Convert back to array format with price estimates
  return Object.entries(consolidatedIngredients).map(([name, data]) => {
    const priceData = mockPriceData[name];
    const bestPrice = priceData ? priceData.sort((a, b) => a.price - b.price)[0] : null;
    
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount: data.amount.toString(),
      unit: data.unit,
      category: data.category,
      estimatedPrice: bestPrice?.price,
      bestStore: bestPrice?.storeName
    };
  });
}

function categorizeIngredient(ingredient: string): string {
  const lowerIngredient = ingredient.toLowerCase();
  
  if (lowerIngredient.includes('chicken') || lowerIngredient.includes('turkey') || 
      lowerIngredient.includes('beef') || lowerIngredient.includes('fish')) {
    return 'Meat & Seafood';
  }
  if (lowerIngredient.includes('milk') || lowerIngredient.includes('cheese') || 
      lowerIngredient.includes('yogurt') || lowerIngredient.includes('butter')) {
    return 'Dairy';
  }
  if (lowerIngredient.includes('apple') || lowerIngredient.includes('banana') || 
      lowerIngredient.includes('berry') || lowerIngredient.includes('orange')) {
    return 'Fruits';
  }
  if (lowerIngredient.includes('spinach') || lowerIngredient.includes('pepper') || 
      lowerIngredient.includes('carrot') || lowerIngredient.includes('onion')) {
    return 'Vegetables';
  }
  if (lowerIngredient.includes('bread') || lowerIngredient.includes('pasta') || 
      lowerIngredient.includes('rice') || lowerIngredient.includes('oats')) {
    return 'Pantry & Grains';
  }
  
  return 'Other';
}
