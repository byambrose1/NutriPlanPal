import { useState } from "react";
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
import { ChevronLeft, ChevronRight, User, Users, DollarSign, UtensilsCrossed, Heart, Target, Check, HelpCircle } from "lucide-react";
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

type ProfileFormData = z.infer<typeof profileSchema>;

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

const ONBOARDING_STEPS = [
  { id: 1, title: "Basic Info", icon: User, description: "Tell us about yourself" },
  { id: 2, title: "Family & Budget", icon: Users, description: "Family size and weekly budget" },
  { id: 3, title: "Health & Diet", icon: Heart, description: "Dietary restrictions and health info" },
  { id: 4, title: "Kitchen Setup", icon: UtensilsCrossed, description: "Available kitchen equipment" },
  { id: 5, title: "Goals & Tastes", icon: Target, description: "Preferences and health goals" },
  { id: 6, title: "Meal Prep", icon: DollarSign, description: "Meal preparation preferences" }
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
  const totalSteps = 6;

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      familySize: 4,
      weeklyBudget: 150,
      dietaryRestrictions: [],
      allergies: [],
      medicalConditions: [],
      cookingSkillLevel: "intermediate",
      kitchenEquipment: ["stove", "oven", "microwave"],
      childrenAges: [],
      goals: [],
      preferredCuisines: [],
      dislikedIngredients: [],
      mealPrepPreference: "some"
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; username: string }) => {
      return await apiRequest('POST', '/api/users', userData);
    }
  });

  const createProfileMutation = useMutation({
    mutationFn: async ({ userId, profileData }: { userId: string; profileData: any }) => {
      return await apiRequest('POST', `/api/users/${userId}/profile`, profileData);
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Create user first
      const userResponse = await createUserMutation.mutateAsync({
        name: data.name,
        email: data.email,
        username: data.email // Using email as username for simplicity
      });

      const user = await userResponse.json();

      // Create profile
      await createProfileMutation.mutateAsync({
        userId: user.id,
        profileData: {
          familySize: data.familySize,
          weeklyBudget: data.weeklyBudget.toString(),
          dietaryRestrictions: data.dietaryRestrictions,
          allergies: data.allergies,
          medicalConditions: data.medicalConditions,
          cookingSkillLevel: data.cookingSkillLevel,
          kitchenEquipment: data.kitchenEquipment,
          childrenAges: data.childrenAges,
          goals: data.goals,
          preferredCuisines: data.preferredCuisines,
          dislikedIngredients: data.dislikedIngredients,
          mealPrepPreference: data.mealPrepPreference
        }
      });

      toast({
        title: "Welcome to NutriPlan!",
        description: "Your profile has been created successfully.",
      });

      setLocation("/");
    } catch (error) {
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
                    Full Name *
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
                    Weekly Budget: ${watchedValues.weeklyBudget}
                    <InfoTooltip content="This helps us find cost-effective recipes and suggest budget-friendly ingredient substitutions and store deals." />
                  </Label>
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
                  <Label className="flex items-center">
                    Children's Ages (if any)
                    <InfoTooltip content="We provide age-appropriate cooking activities and ensure meals are kid-friendly with proper nutrition for growing bodies." />
                  </Label>
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
                        <Label className="text-sm capitalize">{cuisine}</Label>
                      </div>
                    ))}
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
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Meal Prep Preferences */}
          {currentStep === 6 && (
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
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Family size: {watchedValues.familySize} people</p>
                    <p>Weekly budget: ${watchedValues.weeklyBudget}</p>
                    <p>Cooking level: {watchedValues.cookingSkillLevel}</p>
                    <p>Dietary restrictions: {watchedValues.dietaryRestrictions.length} selected</p>
                    <p>Allergies: {watchedValues.allergies.length} selected</p>
                    <p>Health goals: {watchedValues.goals.length} selected</p>
                  </div>
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
                disabled={createUserMutation.isPending || createProfileMutation.isPending}
                data-testid="button-complete-onboarding"
              >
                {(createUserMutation.isPending || createProfileMutation.isPending) ? "Creating Profile..." : "Complete Setup"}
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
