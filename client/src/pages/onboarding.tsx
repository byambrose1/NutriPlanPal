import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, User, Users, DollarSign, UtensilsCrossed, Heart, Target, Check, HelpCircle, Activity } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  familySize: z.number().min(1, "Family size must be at least 1").max(20, "Family size cannot exceed 20"),
  currency: z.enum(["USD", "GBP"], { required_error: "Please select a currency" }),
  weeklyBudget: z.number().min(10, "Weekly budget must be at least 10").max(10000, "Please enter a realistic budget"),
  numberOfChildren: z.number().min(0).max(20),
  childrenAges: z.array(z.number()),
  dietaryRestrictions: z.array(z.string()),
  allergies: z.array(z.string()),
  customAllergies: z.string().optional(),
  medicalConditions: z.array(z.string()),
  customMedicalConditions: z.string().optional(),
  cookingSkillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  kitchenEquipment: z.array(z.string()),
  goals: z.array(z.string()),
  preferredCuisines: z.array(z.string()),
  customCuisines: z.string().optional(),
  dislikedIngredients: z.array(z.string()),
  customDislikes: z.string().optional(),
  primaryGoal: z.enum(["lose_weight", "gain_weight", "maintain_weight", "improve_health", "other"], { required_error: "Please select your primary goal" }).optional(),
  currentWeight: z.number().min(1, "Please enter a valid weight").optional(),
  weightUnit: z.enum(["kg", "lbs"]).optional(),
  height: z.number().min(1, "Please enter a valid height").optional(),
  heightUnit: z.enum(["cm", "inches"]).optional(),
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active"]).optional(),
  age: z.number().min(1, "Please enter a valid age").max(120, "Please enter a valid age").optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  mealPrepPreference: z.enum(["none", "some", "lots"])
});

type ProfileFormData = z.infer<typeof profileSchema>;

const DIETARY_RESTRICTIONS = [
  "vegetarian", "vegan", "pescatarian", "carnivore", "halal", "kosher",
  "gluten-free", "dairy-free", "nut-free", "low-carb", "keto", "paleo", 
  "mediterranean", "low-sodium"
];

const COMMON_ALLERGIES = [
  "nuts", "shellfish", "eggs", "dairy", "soy", "wheat", "fish", "sesame"
];

const MEDICAL_CONDITIONS = [
  "diabetes", "hypertension", "heart-disease", "high-cholesterol", 
  "celiac-disease", "pcos", "ibs", "kidney-disease", "pregnancy"
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
  "african", "caribbean", "south-american", "indian", "japanese", "chinese",
  "mediterranean", "middle-eastern", "italian", "french", "american", "mexican", 
  "thai", "greek", "moroccan"
];

const COMMON_DISLIKES = [
  "mushrooms", "onions", "garlic", "cilantro", "seafood", "organ-meat", 
  "spicy-food", "bitter-greens", "coconut", "olives"
];

const ONBOARDING_STEPS = [
  { id: 1, title: "Basic Info", icon: User, description: "Tell us about yourself" },
  { id: 2, title: "Family & Budget", icon: Users, description: "Family size and weekly budget" },
  { id: 3, title: "Health & Diet", icon: Heart, description: "Dietary restrictions and health info" },
  { id: 4, title: "Kitchen Setup", icon: UtensilsCrossed, description: "Available kitchen equipment" },
  { id: 5, title: "Goals & Tastes", icon: Target, description: "Preferences and health goals" },
  { id: 6, title: "Fitness Goals", icon: Activity, description: "Your fitness and health metrics" },
  { id: 7, title: "Meal Prep", icon: DollarSign, description: "Meal preparation preferences" }
];

// Enhanced Step Progress Indicator Component
const StepProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-muted-foreground mb-4">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
      </div>
      
      {/* Desktop Step Indicator */}
      <div className="hidden md:flex items-center justify-between mb-4">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                  ${isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' : ''}
                  ${isUpcoming ? 'bg-muted text-muted-foreground' : ''}
                `}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground max-w-20 leading-tight">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < ONBOARDING_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                  step.id < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" data-testid="onboarding-progress" />
        <div className="mt-2 text-center">
          <div className="text-sm font-medium text-foreground">
            {ONBOARDING_STEPS[currentStep - 1].title}
          </div>
          <div className="text-xs text-muted-foreground">
            {ONBOARDING_STEPS[currentStep - 1].description}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tooltip Helper Component
const InfoTooltip = ({ content, side = "top" }: { content: string; side?: "top" | "bottom" | "left" | "right" }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help ml-1" />
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const [detectedCurrency, setDetectedCurrency] = useState<"USD" | "GBP">("USD");

  // Detect user location for currency
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code === 'GB') {
          setDetectedCurrency('GBP');
          setValue('currency', 'GBP');
        } else {
          setDetectedCurrency('USD');
          setValue('currency', 'USD');
        }
      } catch (error) {
        console.error('Failed to detect location:', error);
        setDetectedCurrency('USD');
        setValue('currency', 'USD');
      }
    };
    detectLocation();
  }, []);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      familySize: 4,
      currency: "USD",
      weeklyBudget: 150,
      numberOfChildren: 0,
      childrenAges: [],
      dietaryRestrictions: [],
      allergies: [],
      customAllergies: "",
      medicalConditions: [],
      customMedicalConditions: "",
      cookingSkillLevel: "intermediate",
      kitchenEquipment: ["stove", "oven", "microwave"],
      goals: [],
      preferredCuisines: [],
      customCuisines: "",
      dislikedIngredients: [],
      customDislikes: "",
      weightUnit: "kg",
      heightUnit: "cm",
      mealPrepPreference: "some"
    }
  });

  const createHouseholdMutation = useMutation({
    mutationFn: async (householdData: any) => {
      return await apiRequest('POST', '/api/households', householdData);
    }
  });

  const createMemberMutation = useMutation({
    mutationFn: async ({ householdId, memberData }: { householdId: string; memberData: any }) => {
      return await apiRequest('POST', `/api/households/${householdId}/members`, memberData);
    }
  });

  const createPreferencesMutation = useMutation({
    mutationFn: async ({ householdId, preferencesData }: { householdId: string; preferencesData: any }) => {
      return await apiRequest('POST', `/api/households/${householdId}/preferences`, preferencesData);
    }
  });

  const createNotificationsMutation = useMutation({
    mutationFn: async (notificationData: any) => {
      return await apiRequest('POST', '/api/notification-preferences', notificationData);
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    console.log('Form submitted with data:', data);
    try {
      // Combine custom inputs with checked options
      const allAllergies = [...data.allergies];
      if (data.customAllergies) {
        allAllergies.push(...data.customAllergies.split(',').map(a => a.trim()).filter(a => a));
      }

      const allMedicalConditions = [...data.medicalConditions];
      if (data.customMedicalConditions) {
        allMedicalConditions.push(...data.customMedicalConditions.split(',').map(c => c.trim()).filter(c => c));
      }

      const allCuisines = [...data.preferredCuisines];
      if (data.customCuisines) {
        allCuisines.push(...data.customCuisines.split(',').map(c => c.trim()).filter(c => c));
      }

      const allDislikes = [...data.dislikedIngredients];
      if (data.customDislikes) {
        allDislikes.push(...data.customDislikes.split(',').map(d => d.trim()).filter(d => d));
      }

      // Step 1: Create household
      console.log('Creating household...');
      const householdResponse = await createHouseholdMutation.mutateAsync({
        weeklyBudget: data.weeklyBudget.toString(),
        currency: data.currency,
      });
      const household = await householdResponse.json();

      // Step 2: Create household member
      console.log('Creating household member...');
      await createMemberMutation.mutateAsync({
        householdId: household.id,
        memberData: {
          name: data.name,
          age: data.age,
          gender: data.gender,
          dietaryRestrictions: data.dietaryRestrictions,
          allergies: allAllergies,
          medicalConditions: allMedicalConditions,
          dislikedFoods: allDislikes,
          preferredCuisines: allCuisines,
          primaryGoal: data.primaryGoal,
          currentWeight: data.currentWeight?.toString(),
          weightUnit: data.weightUnit,
          height: data.height?.toString(),
          heightUnit: data.heightUnit,
          activityLevel: data.activityLevel,
        }
      });

      // Step 3: Create household preferences
      console.log('Creating household preferences...');
      await createPreferencesMutation.mutateAsync({
        householdId: household.id,
        preferencesData: {
          cookingSkillLevel: data.cookingSkillLevel,
          kitchenEquipment: data.kitchenEquipment,
          mealPrepPreference: data.mealPrepPreference,
        }
      });

      // Step 4: Create notification preferences
      console.log('Creating notification preferences...');
      await createNotificationsMutation.mutateAsync({
        emailNotifications: true,
        mealPlanReminders: true,
        shoppingListReminders: true,
      });

      console.log('Profile created successfully!');
      toast({
        title: "Welcome to NutriPlan!",
        description: "Your profile has been created successfully.",
      });

      setLocation("/dashboard");
    } catch (error) {
      console.error('Onboarding submission error:', error);
      toast({
        title: "Error",
        description: "Failed to create your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleArrayItem = (array: string[], item: string, onChange: (value: string[]) => void) => {
    if (array.includes(item)) {
      onChange(array.filter(i => i !== item));
    } else {
      onChange([...array, item]);
    }
  };

  const watchedValues = watch();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <div className="container mx-auto max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="text-primary-foreground text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="onboarding-title">
            Welcome to NutriPlan
          </h1>
          <p className="text-muted-foreground">
            Let's create your personalized meal planning experience
          </p>
        </div>

        {/* Enhanced Progress Indicator */}
        <StepProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  Tell us about yourself
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center">
                    Name *
                    <InfoTooltip content="We use your name to personalize your meal plans and create a welcoming experience." />
                  </Label>
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
                  <Label htmlFor="email" className="flex items-center">
                    Email Address *
                    <InfoTooltip content="Your email helps us save your preferences and send you meal plan updates and grocery reminders." />
                  </Label>
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

                <div>
                  <Label className="flex items-center">
                    Cooking Skill Level
                    <InfoTooltip content="This helps us suggest recipes that match your comfort level - from simple 15-minute meals to complex culinary adventures." />
                  </Label>
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
          )}

          {/* Step 2: Family & Budget */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Family & Budget Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="flex items-center">
                    Family Size: {watchedValues.familySize} people
                    <InfoTooltip content="We adjust portion sizes and grocery quantities to minimize waste and ensure everyone gets fed properly." />
                  </Label>
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
                  <Label className="flex items-center">
                    Currency
                    <InfoTooltip content="Select your preferred currency for budget tracking and grocery pricing." />
                  </Label>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-2" data-testid="select-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                          <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currency && <p className="text-destructive text-sm mt-1">{errors.currency.message}</p>}
                </div>

                <div>
                  <Label className="flex items-center">
                    Weekly Budget ({watchedValues.currency === 'GBP' ? '£' : '$'})
                    <InfoTooltip content="This helps us find cost-effective recipes and suggest budget-friendly ingredient substitutions and store deals." />
                  </Label>
                  <Controller
                    name="weeklyBudget"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center mt-2">
                        <span className="mr-2 text-muted-foreground">{watchedValues.currency === 'GBP' ? '£' : '$'}</span>
                        <Input
                          type="number"
                          min="10"
                          max="10000"
                          step="10"
                          value={field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="Enter weekly budget"
                          data-testid="input-weekly-budget"
                        />
                      </div>
                    )}
                  />
                  {errors.weeklyBudget && <p className="text-destructive text-sm mt-1">{errors.weeklyBudget.message}</p>}
                </div>

                <div>
                  <Label className="flex items-center">
                    How many children live in the household?
                    <InfoTooltip content="We provide age-appropriate cooking activities and ensure meals are kid-friendly with proper nutrition for growing bodies." />
                  </Label>
                  <Controller
                    name="numberOfChildren"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={field.value}
                        onChange={(e) => {
                          const count = parseInt(e.target.value) || 0;
                          field.onChange(count);
                          // Reset children ages if count is reduced
                          if (count < watchedValues.childrenAges.length) {
                            setValue('childrenAges', watchedValues.childrenAges.slice(0, count));
                          }
                        }}
                        placeholder="Number of children"
                        className="mt-2"
                        data-testid="input-number-of-children"
                      />
                    )}
                  />
                </div>

                {watchedValues.numberOfChildren > 0 && (
                  <div>
                    <Label className="mb-2 block">Enter each child's age:</Label>
                    <div className="space-y-2">
                      {Array.from({ length: watchedValues.numberOfChildren }).map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Label className="min-w-20">Child {index + 1}:</Label>
                          <Input
                            type="number"
                            min="0"
                            max="17"
                            value={watchedValues.childrenAges[index] || ''}
                            onChange={(e) => {
                              const newAges = [...watchedValues.childrenAges];
                              newAges[index] = parseInt(e.target.value) || 0;
                              setValue('childrenAges', newAges);
                            }}
                            placeholder="Age"
                            data-testid={`input-child-age-${index}`}
                          />
                          <span className="text-sm text-muted-foreground">years old</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Dietary Restrictions & Allergies */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-primary" />
                  Health & Dietary Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="flex items-center">
                    Dietary Restrictions
                    <InfoTooltip content="This ensures all suggested recipes align with your lifestyle choices and dietary needs, automatically filtering out incompatible options." />
                  </Label>
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

                <div>
                  <Label className="flex items-center">
                    Allergies
                    <InfoTooltip content="Critical for your safety - we'll never suggest recipes containing these ingredients and will flag potential cross-contamination risks." />
                  </Label>
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
                  <div className="mt-3">
                    <Label className="text-sm">Other allergies (please specify):</Label>
                    <Controller
                      name="customAllergies"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Enter any other allergies separated by commas (e.g., pineapple, kiwi)"
                          className="mt-1"
                          data-testid="textarea-custom-allergies"
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center">
                    Medical Conditions (that affect diet)
                    <InfoTooltip content="Helps us recommend meals that support your health goals - like low-sodium recipes for hypertension or diabetic-friendly options." />
                  </Label>
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
                  <div className="mt-3">
                    <Label className="text-sm">Other medical conditions (please specify):</Label>
                    <Controller
                      name="customMedicalConditions"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Enter any other medical conditions separated by commas"
                          className="mt-1"
                          data-testid="textarea-custom-medical"
                        />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Kitchen Equipment */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UtensilsCrossed className="mr-2 h-5 w-5 text-primary" />
                  Kitchen Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center mb-4">
                  <p className="text-muted-foreground">
                    Select the equipment you have available in your kitchen:
                  </p>
                  <InfoTooltip content="We only suggest recipes you can actually make with your available equipment, preventing frustrating ingredient lists you can't use." side="bottom" />
                </div>
                <div className="grid grid-cols-2 gap-2">
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
              </CardContent>
            </Card>
          )}

          {/* Step 5: Goals & Preferences */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Goals & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="flex items-center">
                    Health Goals
                    <InfoTooltip content="We'll prioritize recipes that support your specific health objectives, from weight management to heart health and energy optimization." />
                  </Label>
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

                <div>
                  <Label className="flex items-center">
                    Preferred Cuisines
                    <InfoTooltip content="Helps us suggest meals from cultures and cooking styles you enjoy, ensuring variety while staying within your comfort zone." />
                  </Label>
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
                        <Label className="text-sm capitalize">{cuisine.replace('-', ' ')}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Label className="text-sm">Other cuisines you enjoy (please specify):</Label>
                    <Controller
                      name="customCuisines"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Enter any other cuisines separated by commas (e.g., Korean, Vietnamese)"
                          className="mt-1"
                          data-testid="textarea-custom-cuisines"
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center">
                    Foods You Dislike
                    <InfoTooltip content="We'll avoid these ingredients in your meal plans, or suggest alternatives to make recipes more appealing to your taste preferences." />
                  </Label>
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
                  <div className="mt-3">
                    <Label className="text-sm">Other foods you dislike (please specify):</Label>
                    <Controller
                      name="customDislikes"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Enter any other foods you dislike separated by commas"
                          className="mt-1"
                          data-testid="textarea-custom-dislikes"
                        />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Fitness Goals */}
          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Fitness Goals & Health Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="flex items-center">
                    Primary Goal (Optional)
                    <InfoTooltip content="Understanding your primary health goal helps us tailor meal plans to support your specific objectives, whether it's weight management or general wellness." />
                  </Label>
                  <Controller
                    name="primaryGoal"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="mt-2" data-testid="select-primary-goal">
                          <SelectValue placeholder="Select your primary goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose_weight">Lose weight</SelectItem>
                          <SelectItem value="gain_weight">Gain weight</SelectItem>
                          <SelectItem value="maintain_weight">Maintain weight</SelectItem>
                          <SelectItem value="improve_health">Improve health</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.primaryGoal && <p className="text-destructive text-sm mt-1">{errors.primaryGoal.message}</p>}
                </div>

                {watchedValues.primaryGoal && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="flex items-center">
                          Current Weight (Optional)
                          <InfoTooltip content="Your weight helps us calculate appropriate calorie targets and portion sizes for your goals." />
                        </Label>
                        <div className="flex gap-2 mt-2">
                          <Controller
                            name="currentWeight"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="1"
                                step="0.1"
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                placeholder="Enter weight"
                                data-testid="input-current-weight"
                              />
                            )}
                          />
                          <Controller
                            name="weightUnit"
                            control={control}
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-24" data-testid="select-weight-unit">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="kg">kg</SelectItem>
                                  <SelectItem value="lbs">lbs</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        {errors.currentWeight && <p className="text-destructive text-sm mt-1">{errors.currentWeight.message}</p>}
                      </div>

                      <div>
                        <Label className="flex items-center">
                          Height (Optional)
                          <InfoTooltip content="Height is used along with weight and activity level to calculate your daily caloric needs accurately." />
                        </Label>
                        <div className="flex gap-2 mt-2">
                          <Controller
                            name="height"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="1"
                                step="0.1"
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                placeholder="Enter height"
                                data-testid="input-height"
                              />
                            )}
                          />
                          <Controller
                            name="heightUnit"
                            control={control}
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-28" data-testid="select-height-unit">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cm">cm</SelectItem>
                                  <SelectItem value="inches">inches</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        {errors.height && <p className="text-destructive text-sm mt-1">{errors.height.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="flex items-center">
                          Age (Optional)
                          <InfoTooltip content="Age factors into calculating your basal metabolic rate and nutritional requirements." />
                        </Label>
                        <Controller
                          name="age"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              min="1"
                              max="120"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              placeholder="Enter your age"
                              className="mt-2"
                              data-testid="input-age"
                            />
                          )}
                        />
                        {errors.age && <p className="text-destructive text-sm mt-1">{errors.age.message}</p>}
                      </div>

                      <div>
                        <Label className="flex items-center">
                          Gender (Optional)
                          <InfoTooltip content="Gender helps us calculate more accurate caloric and nutritional recommendations based on metabolic differences." />
                        </Label>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="mt-2" data-testid="select-gender">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.gender && <p className="text-destructive text-sm mt-1">{errors.gender.message}</p>}
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center">
                        Activity Level (Optional)
                        <InfoTooltip content="Your activity level helps us determine your total daily energy expenditure and adjust portion sizes accordingly." />
                      </Label>
                      <Controller
                        name="activityLevel"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-2" data-testid="select-activity-level">
                              <SelectValue placeholder="Select your activity level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary - Little or no exercise</SelectItem>
                              <SelectItem value="lightly_active">Lightly active - Exercise 1-3 days/week</SelectItem>
                              <SelectItem value="moderately_active">Moderately active - Exercise 3-5 days/week</SelectItem>
                              <SelectItem value="very_active">Very active - Exercise 6-7 days/week</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.activityLevel && <p className="text-destructive text-sm mt-1">{errors.activityLevel.message}</p>}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 7: Meal Prep Preferences */}
          {currentStep === 7 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-primary" />
                  Meal Prep Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="flex items-center">
                    How much meal prep do you want to do?
                    <InfoTooltip content="Determines whether we suggest quick daily cooking, batch cooking sessions, or full meal prep strategies to match your lifestyle." />
                  </Label>
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

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Review Your Preferences</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{watchedValues.name || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Family size:</span>
                      <span className="font-medium">{watchedValues.familySize} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weekly budget:</span>
                      <span className="font-medium">{watchedValues.currency === 'GBP' ? '£' : '$'}{watchedValues.weeklyBudget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cooking level:</span>
                      <span className="font-medium capitalize">{watchedValues.cookingSkillLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dietary restrictions:</span>
                      <span className="font-medium">{watchedValues.dietaryRestrictions.length} selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allergies:</span>
                      <span className="font-medium">{watchedValues.allergies.length} selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Health goals:</span>
                      <span className="font-medium">{watchedValues.goals.length} selected</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <Check className="inline w-4 h-4 mr-1" />
                    Ready to go! Click <strong>Finish & Continue</strong> below to save your preferences and start planning meals.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              data-testid="button-prev-step"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button
                type="submit"
                disabled={createHouseholdMutation.isPending || createMemberMutation.isPending}
                data-testid="button-complete-onboarding"
                className="bg-green-600 hover:bg-green-700"
              >
                {(createHouseholdMutation.isPending || createMemberMutation.isPending) ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Profile...
                  </div>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Finish & Continue
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                data-testid="button-next-step"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        </div>
      </div>
    </TooltipProvider>
  );
}
