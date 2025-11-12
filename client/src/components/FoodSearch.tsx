import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FoodSearchProps {
  onSelect?: (food: any) => void;
  placeholder?: string;
  selectedFoodId?: string;
}

export function FoodSearch({ onSelect, placeholder = "Search for food...", selectedFoodId }: FoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["/api/foods/search", { q: debouncedQuery }],
    enabled: debouncedQuery.length >= 2,
  });

  const foods = data?.foods || [];
  const source = data?.source || "local";

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
          data-testid="input-food-search"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {debouncedQuery.length >= 2 && (
        <div className="space-y-2">
          {source === "fatsecret" && (
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                Powered by FatSecret
              </Badge>
            </div>
          )}
          
          {source === "local" && (
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                Local Database
              </Badge>
            </div>
          )}

          <ScrollArea className="h-[400px] border rounded-lg">
            {foods.length === 0 && !isLoading && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No foods found for "{debouncedQuery}"
              </div>
            )}

            <div className="p-2 space-y-2">
              {foods.map((food: any) => (
                <Card
                  key={food.food_id || food.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFoodId === (food.food_id || food.id)
                      ? "ring-2 ring-orange-500 dark:ring-orange-400"
                      : ""
                  }`}
                  onClick={() => onSelect?.(food)}
                  data-testid={`food-item-${food.food_id || food.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {food.food_name || food.name}
                          </h3>
                          {selectedFoodId === (food.food_id || food.id) && (
                            <Check className="h-4 w-4 text-orange-500" />
                          )}
                        </div>

                        {food.brand_name && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {food.brand_name}
                          </p>
                        )}

                        {food.category && (
                          <Badge variant="secondary" className="text-xs">
                            {food.category}
                          </Badge>
                        )}

                        {/* FatSecret format */}
                        {food.food_description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {food.food_description}
                          </p>
                        )}

                        {/* Local database format */}
                        {food.serving && food.nutrition && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                            <p className="font-medium">{food.serving.description}</p>
                            <div className="flex gap-4 text-xs">
                              <span>Cal: {food.nutrition.calories}</span>
                              <span>P: {food.nutrition.protein}g</span>
                              <span>C: {food.nutrition.carbs}g</span>
                              <span>F: {food.nutrition.fat}g</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {food.food_type && (
                        <Badge variant={food.food_type === "Brand" ? "default" : "outline"}>
                          {food.food_type}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {searchQuery.length > 0 && searchQuery.length < 2 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
}
