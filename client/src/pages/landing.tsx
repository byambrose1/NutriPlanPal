import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChefHat, 
  Sparkles, 
  TrendingDown, 
  Heart, 
  ShoppingCart, 
  Calculator,
  Users,
  Clock,
  Shield,
  Zap,
  Star,
  CheckCircle,
  Play,
  Globe
} from "lucide-react";

type Language = 'en-GB' | 'en-US';

const Landing = () => {
  const [language, setLanguage] = useState<Language>('en-GB');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Rotating banner options
  const bannerOptions = {
    'en-GB': [
      '🎉 NEW: Personalised Meal Plans for Everyone',
      '🎉 NEW: Smart, Stress-Free Meal Planning',
      '🎉 NEW: Your Personalised Path to Easier Eating',
      '🎉 NEW: Meal Planning Made Simple for Any Lifestyle'
    ],
    'en-US': [
      '🎉 NEW: Personalized Meal Plans for Everyone',
      '🎉 NEW: Smart, Stress-Free Meal Planning', 
      '🎉 NEW: Your Personalized Path to Easier Eating',
      '🎉 NEW: Meal Planning Made Simple for Any Lifestyle'
    ]
  };

  // Slideshow headlines and subtext
  const slideshowContent = {
    'en-GB': [
      {
        headline: "Don't Know What to Eat Tonight?",
        subtext: "Stop the decision fatigue! NutriPlanPal generates personalised meal plans and shopping lists so dinner is sorted in seconds.",
        microBenefit: "Save 2+ hours each week"
      },
      {
        headline: "Tired of Repeating the Same Meals Every Week?",
        subtext: "Break the boredom! NutriPlanPal suggests fresh, exciting recipes tailored to your tastes and goals.",
        microBenefit: "Never repeat boring meals again"
      },
      {
        headline: "Struggling to Eat Right for Your Fitness Goals?",
        subtext: "Hit your macros effortlessly! NutriPlanPal creates meal plans designed to support your protein, calorie, and fitness targets.",
        microBenefit: "Track nutrition automatically"
      },
      {
        headline: "Spending Too Much Time or Money on Groceries?",
        subtext: "Save time and cut costs! NutriPlanPal optimises shopping lists and reduces food waste automatically.",
        microBenefit: "Cut food waste by 40%"
      },
      {
        headline: "Can't Stick to Your Diet, Even When You Try?",
        subtext: "Stay on track without stress! NutriPlanPal provides flexible, personalised meal plans that fit your lifestyle.",
        microBenefit: "Flexible plans that actually work"
      },
      {
        headline: "Wish Meal Planning Could Just Do It For You?",
        subtext: "Take the guesswork out! NutriPlanPal generates complete weekly meal plans in seconds.",
        microBenefit: "Complete plans in seconds"
      },
      {
        headline: "Eating Vegan, Vegetarian, or Special Diets but Bored?",
        subtext: "Never get stuck! NutriPlanPal gives endless variety whilst respecting your dietary preferences.",
        microBenefit: "Endless dietary variety"
      },
      {
        headline: "Confused About Portion Sizes or Nutrients?",
        subtext: "Know exactly what to eat! NutriPlanPal guides you so every meal hits your nutritional needs.",
        microBenefit: "Perfect portions every time"
      },
      {
        headline: "Want Healthy Meals Without the Stress?",
        subtext: "Simplify your life! NutriPlanPal makes eating smarter, easier, and more enjoyable for any lifestyle.",
        microBenefit: "Stress-free healthy eating"
      }
    ],
    'en-US': [
      {
        headline: "Don't Know What to Eat Tonight?",
        subtext: "Stop the decision fatigue! NutriPlanPal generates personalized meal plans and shopping lists so dinner is sorted in seconds.",
        microBenefit: "Save 2+ hours each week"
      },
      {
        headline: "Tired of Repeating the Same Meals Every Week?",
        subtext: "Break the boredom! NutriPlanPal suggests fresh, exciting recipes tailored to your tastes and goals.",
        microBenefit: "Never repeat boring meals again"
      },
      {
        headline: "Struggling to Eat Right for Your Fitness Goals?",
        subtext: "Hit your macros effortlessly! NutriPlanPal creates meal plans designed to support your protein, calorie, and fitness targets.",
        microBenefit: "Track nutrition automatically"
      },
      {
        headline: "Spending Too Much Time or Money on Groceries?",
        subtext: "Save time and cut costs! NutriPlanPal optimizes shopping lists and reduces food waste automatically.",
        microBenefit: "Cut food waste by 40%"
      },
      {
        headline: "Can't Stick to Your Diet, Even When You Try?",
        subtext: "Stay on track without stress! NutriPlanPal provides flexible, personalized meal plans that fit your lifestyle.",
        microBenefit: "Flexible plans that actually work"
      },
      {
        headline: "Wish Meal Planning Could Just Do It For You?",
        subtext: "Take the guesswork out! NutriPlanPal generates complete weekly meal plans in seconds.",
        microBenefit: "Complete plans in seconds"
      },
      {
        headline: "Eating Vegan, Vegetarian, or Special Diets but Bored?",
        subtext: "Never get stuck! NutriPlanPal gives endless variety while respecting your dietary preferences.",
        microBenefit: "Endless dietary variety"
      },
      {
        headline: "Confused About Portion Sizes or Nutrients?",
        subtext: "Know exactly what to eat! NutriPlanPal guides you so every meal hits your nutritional needs.",
        microBenefit: "Perfect portions every time"
      },
      {
        headline: "Want Healthy Meals Without the Stress?",
        subtext: "Simplify your life! NutriPlanPal makes eating smarter, easier, and more enjoyable for any lifestyle.",
        microBenefit: "Stress-free healthy eating"
      }
    ]
  };

  // Slideshow rotation logic
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerOptions[language].length);
    }, 8000); // Change banner every 8 seconds

    const slideInterval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideshowContent[language].length);
    }, 4000); // Change slide every 4 seconds

    return () => {
      clearInterval(bannerInterval);
      clearInterval(slideInterval);
    };
  }, [language, bannerOptions, slideshowContent]);

  const content = {
    'en-GB': {
      hero: {
        ctaPrimary: "Start Free Today",
        ctaSecondary: "Watch Demo",
        trustBadge: "Trusted by 10,000+ users"
      },
      benefits: {
        title: "Why People Love NutriPlanPal",
        subtitle: "From chaos to culinary bliss in just minutes per week",
        items: [
          {
            icon: Clock,
            title: "Save 5+ Hours Weekly",
            description: "No more meal planning stress, endless grocery trips, or last-minute takeaway decisions"
          },
          {
            icon: TrendingDown,
            title: "Cut Food Waste by 40%",
            description: "Smart shopping lists and portion planning mean you buy exactly what you need"
          },
          {
            icon: Heart,
            title: "Healthier, Happier Living",
            description: "Nutritionally balanced meals that even picky eaters will love"
          }
        ]
      },
      features: {
        title: "Everything You Need for Food Success",
        subtitle: "Powered by AI, designed for real people",
        items: [
          {
            icon: Sparkles,
            title: "AI Meal Planning Magic",
            description: "Get personalised weekly meal plans that consider your tastes, dietary needs, and schedule",
            highlight: "Smart AI"
          },
          {
            icon: ShoppingCart,
            title: "Intelligent Shopping Optimisation", 
            description: "Compare prices across supermarkets, get optimised shopping routes, and never forget an ingredient again",
            highlight: "Save Money"
          },
          {
            icon: Calculator,
            title: "Nutrition Tracking Made Simple",
            description: "See exactly what nutrients you're getting, with easy visual dashboards and progress tracking",
            highlight: "Stay Healthy"
          },
          {
            icon: Users,
            title: "Kid-Friendly Cooking",
            description: "Age-appropriate cooking activities and safety guidelines to involve children in meal preparation",
            highlight: "Cooking Fun"
          },
          {
            icon: Zap,
            title: "Batch Cooking Mastery",
            description: "Smart meal prep timelines and freezer-friendly recipes that save time all week long",
            highlight: "Time Saver"
          },
          {
            icon: Shield,
            title: "Allergy & Dietary Management",
            description: "Automatically filters recipes based on allergies, medical conditions, and food preferences",
            highlight: "Safe & Smart"
          }
        ]
      },
      social: {
        title: "Join Thousands of Happy Users",
        testimonials: [
          {
            quote: "NutriPlanPal saved our dinner routine! No more 'What's for tea?' arguments.",
            author: "Sarah M., Home Cook",
            rating: 5
          },
          {
            quote: "Cut our grocery bill by £200/month and actually eat healthier. Brilliant!",
            author: "James D., Busy Professional", 
            rating: 5
          },
          {
            quote: "The age-appropriate cooking suggestions are spot-on for involving everyone in meal prep.",
            author: "Lisa K., Teacher & Cook",
            rating: 5
          }
        ]
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            q: "How does the AI meal planning work?",
            a: "Our AI analyses your preferences, dietary requirements, cooking skills, and schedule to create personalised weekly meal plans. It learns from your feedback to improve suggestions over time."
          },
          {
            q: "Can it handle multiple dietary requirements?",
            a: "Absolutely! Whether you have vegans, gluten-free, nut allergies, or picky eaters, NutriPlanPal creates meal plans that work for your individual needs."
          },
          {
            q: "How much does it cost?",
            a: "Start with our free plan that includes basic meal planning. Premium features like grocery price comparison and advanced nutrition tracking are available from £9.99/month."
          },
          {
            q: "Does it work with UK supermarkets?",
            a: "Yes! We integrate with major UK supermarkets including Tesco, ASDA, Sainsbury's, and Morrisons for price comparison and shopping optimisation."
          }
        ]
      },
      cta: {
        title: "Ready to Transform Your Relationship with Food?",
        subtitle: "Join thousands of people who've already revolutionised their mealtimes",
        button: "Start Your Free Journey",
        guarantee: "✅ 30-day money-back guarantee"
      }
    },
    'en-US': {
      hero: {
        ctaPrimary: "Start Free Today",
        ctaSecondary: "Watch Demo",
        trustBadge: "Trusted by 10,000+ users"
      },
      benefits: {
        title: "Why People Love NutriPlanPal",
        subtitle: "From chaos to culinary bliss in just minutes per week",
        items: [
          {
            icon: Clock,
            title: "Save 5+ Hours Weekly",
            description: "No more meal planning stress, endless grocery trips, or last-minute takeout decisions"
          },
          {
            icon: TrendingDown, 
            title: "Cut Food Waste by 40%",
            description: "Smart shopping lists and portion planning mean you buy exactly what you need"
          },
          {
            icon: Heart,
            title: "Healthier, Happier Living", 
            description: "Nutritionally balanced meals that even picky eaters will love"
          }
        ]
      },
      features: {
        title: "Everything You Need for Food Success",
        subtitle: "Powered by AI, designed for real people",
        items: [
          {
            icon: Sparkles,
            title: "AI Meal Planning Magic",
            description: "Get personalized weekly meal plans that consider your tastes, dietary needs, and schedule",
            highlight: "Smart AI"
          },
          {
            icon: ShoppingCart,
            title: "Intelligent Shopping Optimization",
            description: "Compare prices across grocery stores, get optimized shopping routes, and never forget an ingredient again", 
            highlight: "Save Money"
          },
          {
            icon: Calculator,
            title: "Nutrition Tracking Made Simple",
            description: "See exactly what nutrients you're getting, with easy visual dashboards and progress tracking",
            highlight: "Stay Healthy"
          },
          {
            icon: Users,
            title: "Kid-Friendly Cooking",
            description: "Age-appropriate cooking activities and safety guidelines to involve children in meal preparation",
            highlight: "Cooking Fun"
          },
          {
            icon: Zap,
            title: "Batch Cooking Mastery", 
            description: "Smart meal prep timelines and freezer-friendly recipes that save time all week long",
            highlight: "Time Saver"
          },
          {
            icon: Shield,
            title: "Allergy & Dietary Management",
            description: "Automatically filters recipes based on allergies, medical conditions, and food preferences", 
            highlight: "Safe & Smart"
          }
        ]
      },
      social: {
        title: "Join Thousands of Happy Users",
        testimonials: [
          {
            quote: "NutriPlanPal saved our dinner routine! No more 'What's for dinner?' arguments.",
            author: "Sarah M., Home Cook",
            rating: 5
          },
          {
            quote: "Cut our grocery bill by $300/month and actually eat healthier. Amazing!",
            author: "James D., Busy Professional",
            rating: 5
          },
          {
            quote: "The age-appropriate cooking suggestions are spot-on for involving everyone in meal prep.",
            author: "Lisa K., Teacher & Cook", 
            rating: 5
          }
        ]
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            q: "How does the AI meal planning work?",
            a: "Our AI analyzes your preferences, dietary requirements, cooking skills, and schedule to create personalized weekly meal plans. It learns from your feedback to improve suggestions over time."
          },
          {
            q: "Can it handle multiple dietary requirements?", 
            a: "Absolutely! Whether you have vegans, gluten-free, nut allergies, or picky eaters, NutriPlanPal creates meal plans that work for your individual needs."
          },
          {
            q: "How much does it cost?",
            a: "Start with our free plan that includes basic meal planning. Premium features like grocery price comparison and advanced nutrition tracking are available from $12.99/month."
          },
          {
            q: "Does it work with US grocery stores?",
            a: "Yes! We integrate with major US grocery stores including Walmart, Target, Kroger, and Safeway for price comparison and shopping optimization."
          }
        ]
      },
      cta: {
        title: "Ready to Transform Your Relationship with Food?", 
        subtitle: "Join thousands of people who've already revolutionized their mealtimes",
        button: "Start Your Free Journey",
        guarantee: "✅ 30-day money-back guarantee"
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full p-1 shadow-lg">
          <Button 
            variant={language === 'en-GB' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLanguage('en-GB')}
            className="rounded-full text-xs"
            data-testid="language-gb"
          >
            <Globe className="w-3 h-3 mr-1" />
            UK
          </Button>
          <Button 
            variant={language === 'en-US' ? 'default' : 'ghost'}
            size="sm" 
            onClick={() => setLanguage('en-US')}
            className="rounded-full text-xs"
            data-testid="language-us"
          >
            <Globe className="w-3 h-3 mr-1" />
            US
          </Button>
        </div>
      </div>

      {/* Hero Section with Rotating Slideshow */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Rotating Banner */}
          <Badge 
            variant="secondary" 
            className="mb-6 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900 dark:to-yellow-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700 animate-pulse transition-all duration-500"
            data-testid="hero-badge"
          >
            {bannerOptions[language][currentBannerIndex]}
          </Badge>
          
          {/* Rotating Headlines */}
          <div className="min-h-[200px] flex flex-col justify-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-all duration-500 ease-in-out">
              <span className="bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500 bg-clip-text text-transparent">
                {slideshowContent[language][currentSlideIndex].headline}
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed transition-all duration-500 ease-in-out" data-testid="hero-subtitle">
              {slideshowContent[language][currentSlideIndex].subtext}
            </p>
            
            {/* Micro-benefit */}
            <p className="text-lg text-orange-600 dark:text-orange-400 font-semibold mb-8 transition-all duration-500 ease-in-out">
              ✨ {slideshowContent[language][currentSlideIndex].microBenefit}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                data-testid="cta-primary"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {currentContent.hero.ctaPrimary}
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg rounded-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-400 dark:hover:bg-orange-950"
              data-testid="cta-secondary"
            >
              <Play className="w-5 h-5 mr-2" />
              {currentContent.hero.ctaSecondary}
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2" data-testid="trust-badge">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {currentContent.hero.trustBadge}
          </p>
        </div>

        {/* App Screenshot Placeholder */}
        <div className="max-w-5xl mx-auto mt-16 px-4">
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="ml-4 text-xs text-gray-500 dark:text-gray-400">NutriPlanPal App</div>
              </div>
              <div className="h-96 bg-gradient-to-br from-orange-100 via-yellow-100 to-emerald-100 dark:from-gray-600 dark:via-gray-500 dark:to-gray-400 flex items-center justify-center text-2xl font-semibold text-gray-600 dark:text-white">
                📱 App Demo Coming Soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {currentContent.benefits.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {currentContent.benefits.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {currentContent.benefits.items.map((benefit, index) => (
              <Card key={index} className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {currentContent.features.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {currentContent.features.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.features.items.map((feature, index) => (
              <Card key={index} className="group p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800 overflow-hidden relative">
                <CardContent className="pt-6">
                  <Badge 
                    variant="secondary" 
                    className="absolute top-4 right-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-white border-0"
                  >
                    {feature.highlight}
                  </Badge>
                  
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-100 via-yellow-100 to-emerald-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            {currentContent.social.title}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {currentContent.social.testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    — {testimonial.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            {currentContent.faq.title}
          </h2>
          
          <div className="space-y-6">
            {currentContent.faq.items.map((faq, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {currentContent.cta.title}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {currentContent.cta.subtitle}
          </p>
          
          <Link href="/onboarding">
            <Button 
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-12 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              data-testid="final-cta"
            >
              <ChefHat className="w-6 h-6 mr-3" />
              {currentContent.cta.button}
            </Button>
          </Link>
          
          <p className="text-sm mt-6 text-white/80" data-testid="guarantee">
            {currentContent.cta.guarantee}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;