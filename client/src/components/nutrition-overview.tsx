import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface NutritionData {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  fiber: { current: number; target: number };
  carbs: { current: number; target: number };
  fat: { current: number; target: number };
}

interface NutritionOverviewProps {
  nutritionData: NutritionData;
}

export function NutritionOverview({ nutritionData }: NutritionOverviewProps) {
  const CircularProgress = ({ value, max, label, current, target }: { 
    value: number; 
    max: number; 
    label: string; 
    current: number; 
    target: number; 
  }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 15.9155;
    const strokeDasharray = `${(percentage / 100) * circumference}, 100`;
    
    return (
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-2">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path 
              className="text-muted stroke-current" 
              strokeWidth="3" 
              fill="none" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path 
              className="text-primary stroke-current" 
              strokeWidth="3" 
              strokeLinecap="round" 
              fill="none" 
              strokeDasharray={strokeDasharray}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" data-testid={`nutrition-percentage-${label.toLowerCase()}`}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-semibold" data-testid={`nutrition-values-${label.toLowerCase()}`}>
          {current} / {target}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Nutrition Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <CircularProgress
            value={nutritionData.calories.current}
            max={nutritionData.calories.target}
            label="Calories"
            current={nutritionData.calories.current}
            target={nutritionData.calories.target}
          />
          <CircularProgress
            value={nutritionData.protein.current}
            max={nutritionData.protein.target}
            label="Protein"
            current={nutritionData.protein.current}
            target={nutritionData.protein.target}
          />
          <CircularProgress
            value={nutritionData.fiber.current}
            max={nutritionData.fiber.target}
            label="Fiber"
            current={nutritionData.fiber.current}
            target={nutritionData.fiber.target}
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Carbs</span>
              <span className="text-sm text-muted-foreground" data-testid="carbs-progress">
                {nutritionData.carbs.current}g / {nutritionData.carbs.target}g ({Math.round((nutritionData.carbs.current / nutritionData.carbs.target) * 100)}%)
              </span>
            </div>
            <Progress 
              value={(nutritionData.carbs.current / nutritionData.carbs.target) * 100} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Fat</span>
              <span className="text-sm text-muted-foreground" data-testid="fat-progress">
                {nutritionData.fat.current}g / {nutritionData.fat.target}g ({Math.round((nutritionData.fat.current / nutritionData.fat.target) * 100)}%)
              </span>
            </div>
            <Progress 
              value={(nutritionData.fat.current / nutritionData.fat.target) * 100} 
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
