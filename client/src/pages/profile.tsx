import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Settings, Bell, Target, Users, Utensils, Heart, Shield, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SubscriptionCard } from "@/components/subscription-card";
import { useAuth } from "@/hooks/useAuth";

const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  familySize: z.number().min(1).max(20),
  weeklyBudget: z.number().min(10).max(1000),
  dietaryRestrictions: z.array(z.string()),
  allergies: z.array(z.string()),
  medicalConditions: z.array(z.string()),
  cookingSkillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  kitchenEquipment: z.array(z.string()),
  childrenAges: z.array(z.number()),
  goals: z.array(z.string()),
  preferredCuisines: z.array(z.string()),
  dislikedIngredients: z.array(z.string()),
  mealPrepPreference: z.enum(["none", "some", "lots"])
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

const DIETARY_RESTRICTIONS = [
  "vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", 
  "low-carb", "keto", "paleo", "mediterranean", "low-sodium"
];

const COMMON_ALLERGIES = [
  "nuts", "shellfish", "eggs", "dairy", "soy", "wheat", "fish", "sesame"
];

const MEDICAL_CONDITIONS = [
  "diabetes", "hypertension", "heart-disease", "high-cholesterol", 
  "celiac-disease", "ibs", "kidney-disease", "pregnancy"
];

const KITCHEN_EQUIPMENT = [
  "stove", "oven", "microwave", "slow-cooker", "instant-pot", 
  "air-fryer", "blender", "food-processor", "grill", "stand-mixer"
];

const HEALTH_GOALS = [
  "weight-loss", "weight-gain", "muscle-gain", "heart-health", 
  "energy-boost", "immune-support", "digestive-health", "general-wellness"
];

const CUISINES = [
  "american", "italian", "mexican", "asian", "indian", "mediterranean", 
  "french", "thai", "japanese", "greek", "moroccan", "middle-eastern"
];

const COMMON_DISLIKES = [
  "mushrooms", "onions", "garlic", "cilantro", "seafood", "organ-meat", 
  "spicy-food", "bitter-greens", "coconut", "olives"
];

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  
  const [notifications, setNotifications] = useState({
    mealPlanReminders: true,
    shoppingReminders: true,
    priceAlerts: true,
    weeklyReport: true
  });

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/users', user?.id, 'profile'],
    enabled: !!user?.id
  });

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ['/api/users', user?.id],
    enabled: !!user?.id
  });

  const isLoading = authLoading || profileLoading;

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    values: {
      name: userData?.name || user?.name || "",
      email: userData?.email || user?.email || "",
      familySize: userProfile?.familySize || 4,
      weeklyBudget: parseFloat(userProfile?.weeklyBudget || "150"),
      dietaryRestrictions: userProfile?.dietaryRestrictions || [],
      allergies: userProfile?.allergies || [],
      medicalConditions: userProfile?.medicalConditions || [],
      cookingSkillLevel: userProfile?.cookingSkillLevel || "intermediate",
      kitchenEquipment: userProfile?.kitchenEquipment || ["stove", "oven", "microwave"],
      childrenAges: userProfile?.childrenAges || [],
      goals: userProfile?.goals || [],
      preferredCuisines: userProfile?.preferredCuisines || [],
      dislikedIngredients: userProfile?.dislikedIngredients || [],
      mealPrepPreference: userProfile?.mealPrepPreference || "some"
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<ProfileUpdateData>) => {
      const response = await fetch(`/api/users/${user?.id}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          weeklyBudget: profileData.weeklyBudget?.toString()
        })
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ProfileUpdateData) => {
    updateProfileMutation.mutate(data);
  };

  const toggleArrayItem = (array: string[], item: string, onChange: (value: string[]) => void) => {
    if (array.includes(item)) {
      onChange(array.filter(i => i !== item));
    } else {
      onChange([...array, item]);
    }
  };

  const watchedValues = watch();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background mb-16 md:mb-0">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mb-16 md:mb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="profile-title">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account and customize your meal planning experience
            </p>
          </div>
          {user?.isAdmin && (
            <Button
              onClick={() => {
                const currentUrl = window.location.origin;
                const adminUrl = currentUrl.replace(':5000', ':8000').replace('5000', '8000');
                window.open(adminUrl, '_blank');
              }}
              variant="outline"
              className="flex items-center gap-2"
              data-testid="admin-panel-link"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="text-primary-foreground text-xl" />
            </div>
            <div>
              <div className="font-semibold" data-testid="user-name">
                {userData?.name || "Sarah Johnson"}
              </div>
              <div className="text-sm text-muted-foreground" data-testid="user-email">
                {userData?.email || "sarah@example.com"}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" data-testid="tab-personal">
              <User className="mr-2 h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="dietary" data-testid="tab-dietary">
              <Heart className="mr-2 h-4 w-4" />
              Health & Diet
            </TabsTrigger>
            <TabsTrigger value="preferences" data-testid="tab-preferences">
              <Utensils className="mr-2 h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            placeholder="Enter your full name"
                            data-testid="input-name"
                          />
                        )}
                      />
                      {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            type="email"
                            placeholder="Enter your email"
                            data-testid="input-email"
                          />
                        )}
                      />
                      {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label>Cooking Skill Level</Label>
                    <Controller
                      name="cookingSkillLevel"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger data-testid="select-cooking-skill">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner - I'm just starting out</SelectItem>
                            <SelectItem value="intermediate">Intermediate - I can follow recipes well</SelectItem>
                            <SelectItem value="advanced">Advanced - I love experimenting in the kitchen</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Family & Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Family Size: {watchedValues.familySize} people</Label>
                    <Controller
                      name="familySize"
                      control={control}
                      render={({ field }) => (
                        <Slider
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          max={12}
                          min={1}
                          step={1}
                          className="mt-2"
                          data-testid="slider-family-size"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label>Weekly Budget: ${watchedValues.weeklyBudget}</Label>
                    <Controller
                      name="weeklyBudget"
                      control={control}
                      render={({ field }) => (
                        <Slider
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          max={500}
                          min={50}
                          step={10}
                          className="mt-2"
                          data-testid="slider-weekly-budget"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label>Children's Ages</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Add age"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const age = parseInt((e.target as HTMLInputElement).value);
                            if (age > 0 && age < 18) {
                              setValue('childrenAges', [...watchedValues.childrenAges, age]);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        data-testid="input-child-age"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {watchedValues.childrenAges.map((age, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => {
                            setValue('childrenAges', watchedValues.childrenAges.filter((_, i) => i !== index));
                          }}
                          data-testid={`badge-child-age-${age}`}
                        >
                          {age} years old ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Health & Dietary Tab */}
            <TabsContent value="dietary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-primary" />
                    Health & Dietary Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Dietary Restrictions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {DIETARY_RESTRICTIONS.map((restriction) => (
                        <div key={restriction} className="flex items-center space-x-2">
                          <Checkbox
                            checked={watchedValues.dietaryRestrictions.includes(restriction)}
                            onCheckedChange={() => 
                              toggleArrayItem(
                                watchedValues.dietaryRestrictions, 
                                restriction, 
                                (value) => setValue('dietaryRestrictions', value)
                              )
                            }
                            data-testid={`checkbox-diet-${restriction}`}
                          />
                          <Label className="text-sm capitalize">{restriction.replace('-', ' ')}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Allergies</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {COMMON_ALLERGIES.map((allergy) => (
                        <div key={allergy} className="flex items-center space-x-2">
                          <Checkbox
                            checked={watchedValues.allergies.includes(allergy)}
                            onCheckedChange={() => 
                              toggleArrayItem(
                                watchedValues.allergies, 
                                allergy, 
                                (value) => setValue('allergies', value)
                              )
                            }
                            data-testid={`checkbox-allergy-${allergy}`}
                          />
                          <Label className="text-sm capitalize">{allergy}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Medical Conditions (that affect diet)</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {MEDICAL_CONDITIONS.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            checked={watchedValues.medicalConditions.includes(condition)}
                            onCheckedChange={() => 
                              toggleArrayItem(
                                watchedValues.medicalConditions, 
                                condition, 
                                (value) => setValue('medicalConditions', value)
                              )
                            }
                            data-testid={`checkbox-medical-${condition}`}
                          />
                          <Label className="text-sm capitalize">{condition.replace('-', ' ')}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Health Goals</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {HEALTH_GOALS.map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            checked={watchedValues.goals.includes(goal)}
                            onCheckedChange={() => 
                              toggleArrayItem(
                                watchedValues.goals, 
                                goal, 
                                (value) => setValue('goals', value)
                              )
                            }
                            data-testid={`checkbox-goal-${goal}`}
                          />
                          <Label className="text-sm capitalize">{goal.replace('-', ' ')}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="mr-2 h-5 w-5 text-primary" />
                    Cooking Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Kitchen Equipment</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {KITCHEN_EQUIPMENT.map((equipment) => (
                        <div key={equipment} className="flex items-center space-x-2">
                          <Checkbox
                            checked={watchedValues.kitchenEquipment.includes(equipment)}
                            onCheckedChange={() => 
                              toggleArrayItem(
                                watchedValues.kitchenEquipment, 
                                equipment, 
                                (value) => setValue('kitchenEquipment', value)
                              )
                            }
                            data-testid={`checkbox-equipment-${equipment}`}
                          />
                          <Label className="text-sm capitalize">{equipment.replace('-', ' ')}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Preferred Cuisines</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {CUISINES.map((cuisine) => (
                        <div key={cuisine} className="flex items-center space-x-2">
                          <Checkbox
                            checked={watchedValues.preferredCuisines.includes(cuisine)}
                            onCheckedChange={() => 
                              toggleArrayItem(
                                watchedValues.preferredCuisines, 
                                cuisine, 
                                (value) => setValue('preferredCuisines', value)
                              )
                            }
                            data-testid={`checkbox-cuisine-${cuisine}`}
                          />
                          <Label className="text-sm capitalize">{cuisine}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Foods You Dislike</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {COMMON_DISLIKES.map((dislike) => (
                        <div key={dislike} className="flex items-center space-x-2">
                          <Checkbox
                            checked={watchedValues.dislikedIngredients.includes(dislike)}
                            onCheckedChange={() => 
                              toggleArrayItem(
                                watchedValues.dislikedIngredients, 
                                dislike, 
                                (value) => setValue('dislikedIngredients', value)
                              )
                            }
                            data-testid={`checkbox-dislike-${dislike}`}
                          />
                          <Label className="text-sm capitalize">{dislike.replace('-', ' ')}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Meal Prep Preference</Label>
                    <Controller
                      name="mealPrepPreference"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="mt-2" data-testid="select-meal-prep">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None - I prefer to cook fresh each time</SelectItem>
                            <SelectItem value="some">Some - I like batch cooking occasionally</SelectItem>
                            <SelectItem value="lots">Lots - I want to meal prep as much as possible</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Meal Plan Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get notified when it's time to plan next week's meals</p>
                    </div>
                    <Switch
                      checked={notifications.mealPlanReminders}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, mealPlanReminders: checked }))
                      }
                      data-testid="switch-meal-plan-reminders"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Shopping Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminders to check your shopping list before grocery trips</p>
                    </div>
                    <Switch
                      checked={notifications.shoppingReminders}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, shoppingReminders: checked }))
                      }
                      data-testid="switch-shopping-reminders"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about significant price changes on your grocery items</p>
                    </div>
                    <Switch
                      checked={notifications.priceAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, priceAlerts: checked }))
                      }
                      data-testid="switch-price-alerts"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Report</Label>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of your nutrition and spending</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, weeklyReport: checked }))
                      }
                      data-testid="switch-weekly-report"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-primary" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" data-testid="button-export-data">
                      Export My Data
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Download all your recipes, meal plans, and preferences
                    </p>
                  </div>

                  <Separator />

                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" data-testid="button-reset-preferences">
                      Reset Preferences
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Reset all your preferences to default values
                    </p>
                  </div>

                  <Separator />

                  <div className="flex flex-col space-y-2">
                    <Button variant="destructive" data-testid="button-delete-account">
                      Delete Account
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Management */}
              <SubscriptionCard />
            </TabsContent>

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" data-testid="button-cancel">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Tabs>
      </main>
    </div>
  );
}
