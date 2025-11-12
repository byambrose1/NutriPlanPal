import axios from 'axios';

interface FatSecretToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
}

interface FoodSearchResult {
  food_id: string;
  food_name: string;
  food_type: string;
  brand_name?: string;
  food_description: string;
}

interface FoodDetail {
  food_id: string;
  food_name: string;
  food_type: string;
  brand_name?: string;
  servings: {
    serving: Array<{
      serving_id: string;
      serving_description: string;
      metric_serving_amount?: string;
      metric_serving_unit?: string;
      calories: string;
      carbohydrate: string;
      protein: string;
      fat: string;
      saturated_fat?: string;
      polyunsaturated_fat?: string;
      monounsaturated_fat?: string;
      cholesterol?: string;
      sodium?: string;
      potassium?: string;
      fiber?: string;
      sugar?: string;
      vitamin_a?: string;
      vitamin_c?: string;
      calcium?: string;
      iron?: string;
    }>;
  };
}

class FatSecretAPI {
  private clientId: string;
  private clientSecret: string;
  private tokenCache: FatSecretToken | null = null;
  private readonly tokenUrl = 'https://oauth.fatsecret.com/connect/token';
  private readonly apiUrl = 'https://platform.fatsecret.com/rest/server.api';

  constructor() {
    this.clientId = process.env.FATSECRET_CLIENT_ID || '';
    this.clientSecret = process.env.FATSECRET_CLIENT_SECRET || '';

    if (!this.clientId || !this.clientSecret) {
      console.warn('FatSecret API credentials not configured. Food search will use fallback data.');
    } else {
      console.log('FatSecret API initialized successfully');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.tokenCache && this.tokenCache.expires_at > Date.now()) {
      return this.tokenCache.access_token;
    }

    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'basic'
        }).toString(),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.tokenCache = {
        ...response.data,
        expires_at: Date.now() + (response.data.expires_in * 1000) - 60000
      };

      return this.tokenCache.access_token;
    } catch (error: any) {
      console.error('FatSecret OAuth error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with FatSecret API');
    }
  }

  async searchFoods(query: string, maxResults: number = 20): Promise<FoodSearchResult[]> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('FatSecret API not configured');
    }

    try {
      console.log(`FatSecret: Searching for "${query}"...`);
      const token = await this.getAccessToken();
      console.log('FatSecret: Access token obtained');

      const response = await axios.post(
        this.apiUrl,
        new URLSearchParams({
          method: 'foods.search',
          search_expression: query,
          format: 'json',
          max_results: maxResults.toString()
        }).toString(),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      console.log('FatSecret API response:', JSON.stringify(response.data).substring(0, 200));

      if (response.data.foods && response.data.foods.food) {
        const foods = Array.isArray(response.data.foods.food) 
          ? response.data.foods.food 
          : [response.data.foods.food];
        console.log(`FatSecret: Found ${foods.length} foods`);
        return foods;
      }

      console.log('FatSecret: No foods found');
      return [];
    } catch (error: any) {
      console.error('FatSecret search error:', error.response?.data || error.message);
      console.error('Error details:', error);
      throw new Error('Failed to search foods');
    }
  }

  async getFoodDetails(foodId: string): Promise<FoodDetail | null> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('FatSecret API not configured');
    }

    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        this.apiUrl,
        new URLSearchParams({
          method: 'food.get.v2',
          food_id: foodId,
          format: 'json'
        }).toString(),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data.food;
    } catch (error: any) {
      console.error('FatSecret food details error:', error.response?.data || error.message);
      return null;
    }
  }

  parseFoodDescription(description: string): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } {
    const parts = description.split(' - ');
    const nutritionPart = parts.find(p => p.includes('Calories:')) || '';
    
    const getNumber = (label: string): number => {
      const regex = new RegExp(`${label}:\\s*([\\d.]+)`);
      const match = nutritionPart.match(regex);
      return match ? parseFloat(match[1]) : 0;
    };

    return {
      calories: getNumber('Calories'),
      protein: getNumber('Protein'),
      carbs: getNumber('Carbs'),
      fat: getNumber('Fat')
    };
  }
}

export const fatSecretAPI = new FatSecretAPI();
