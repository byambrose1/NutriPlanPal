import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { ShoppingList } from "@/components/shopping-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ShoppingCart, MapPin, DollarSign, Clock, Route, TrendingDown, Store, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface StoreInfo {
  name: string;
  distance: string;
  priceRating: string;
  estimatedTime: string;
}

export default function Shopping() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [priceComparisonQuery, setPriceComparisonQuery] = useState("");
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const { user } = useAuth();

  // Fetch household
  const { data: household, isLoading: householdLoading } = useQuery<any>({
    queryKey: ["/api/households/me"],
  });

  // Fetch active shopping list for household
  const { data: activeShoppingList, isLoading: shoppingListLoading } = useQuery({
    queryKey: ['/api/households', household?.id, 'shopping-lists', 'active'],
    enabled: !!household?.id
  });

  // Price comparison mutation
  const priceComparisonMutation = useMutation({
    mutationFn: async (items: string[]) => {
      const response = await fetch('/api/grocery-prices/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      if (!response.ok) throw new Error('Failed to compare prices');
      return response.json();
    }
  });

  // Best prices mutation
  const bestPricesMutation = useMutation({
    mutationFn: async (items: string[]) => {
      const response = await fetch('/api/grocery-prices/best-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      if (!response.ok) throw new Error('Failed to get best prices');
      return response.json();
    }
  });

  // Route optimization mutation
  const routeOptimizationMutation = useMutation({
    mutationFn: async (stores: string[]) => {
      const response = await fetch('/api/shopping/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stores })
      });
      if (!response.ok) throw new Error('Failed to optimize route');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Route Optimized!",
        description: `Total distance: ${data.totalDistance} miles, Est. time: ${data.estimatedTime} minutes`,
      });
      setIsRouteDialogOpen(false);
    }
  });

  const handleCompareSelected = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to compare prices.",
        variant: "destructive",
      });
      return;
    }
    priceComparisonMutation.mutate(selectedItems);
  };

  const handleAddItem = () => {
    if (!priceComparisonQuery.trim()) return;
    
    bestPricesMutation.mutate([priceComparisonQuery.trim()]);
    setPriceComparisonQuery("");
  };

  const handleOptimizeRoute = () => {
    const stores = ["Tesco", "Sainsbury's", "Asda", "Morrisons"];
    routeOptimizationMutation.mutate(stores);
  };

  // Calculate shopping stats from actual data
  const shoppingStats = {
    totalItems: (activeShoppingList as any)?.items?.length || 0,
    completedItems: (activeShoppingList as any)?.items?.filter((item: any) => item.isPurchased).length || 0,
    estimatedTotal: (activeShoppingList as any)?.totalEstimatedCost || "0",
    potentialSavings: "23.50" // This would be calculated from price comparison in a real implementation
  };

  // Use household's preferred stores or fallback to defaults
  const preferredStores = household?.preferredStores || [];
  const defaultStores = household?.currency === "GBP" 
    ? [
        { name: "Aldi", distance: "1.9 km", priceRating: "budget", estimatedTime: "15 min" },
        { name: "Tesco", distance: "2.5 km", priceRating: "budget", estimatedTime: "20 min" },
        { name: "Asda", distance: "2.9 km", priceRating: "budget", estimatedTime: "22 min" },
        { name: "Sainsbury's", distance: "3.2 km", priceRating: "moderate", estimatedTime: "25 min" },
        { name: "Morrisons", distance: "4.0 km", priceRating: "moderate", estimatedTime: "30 min" },
        { name: "Waitrose", distance: "5.1 km", priceRating: "premium", estimatedTime: "35 min" }
      ]
    : [
        { name: "Walmart", distance: "1.2 mi", priceRating: "budget", estimatedTime: "15 min" },
        { name: "Target", distance: "1.8 mi", priceRating: "moderate", estimatedTime: "20 min" },
        { name: "Kroger", distance: "2.1 mi", priceRating: "moderate", estimatedTime: "22 min" },
        { name: "Whole Foods", distance: "3.2 mi", priceRating: "premium", estimatedTime: "30 min" },
        { name: "Aldi", distance: "1.5 mi", priceRating: "budget", estimatedTime: "18 min" }
      ];
  
  const stores: StoreInfo[] = preferredStores.length > 0 
    ? preferredStores.map((name: string, index: number) => ({
        name,
        distance: `${(1.5 + index * 0.5).toFixed(1)} ${household?.currency === "GBP" ? "km" : "mi"}`,
        priceRating: "budget",
        estimatedTime: `${15 + index * 5} min`
      }))
    : defaultStores;

  return (
    <div className="min-h-screen bg-background mb-16 md:mb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="shopping-title">
              Smart Shopping
            </h1>
            <p className="text-muted-foreground">
              Compare prices and optimize your grocery shopping experience
            </p>
          </div>
          
          <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0" data-testid="button-optimize-route">
                <Route className="mr-2 h-4 w-4" />
                Optimize Route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Optimize Shopping Route</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We'll find the most efficient route to visit your selected stores.
                </p>
                <div className="space-y-2">
                  {stores.slice(0, 4).map((store) => (
                    <div key={store.name} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{store.name}</span>
                      <Badge variant={store.priceRating === "budget" ? "secondary" : store.priceRating === "premium" ? "destructive" : "default"}>
                        {store.priceRating}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleOptimizeRoute}
                  disabled={routeOptimizationMutation.isPending}
                  className="w-full"
                  data-testid="button-confirm-optimize"
                >
                  {routeOptimizationMutation.isPending ? "Optimizing..." : "Optimize Route"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Shopping Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1" data-testid="stat-total-items">
                {shoppingStats.totalItems}
              </div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1" data-testid="stat-completed-items">
                {shoppingStats.completedItems}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1" data-testid="stat-estimated-total">
                {household?.currency === "GBP" ? "£" : "$"}{shoppingStats.estimatedTotal}
              </div>
              <div className="text-sm text-muted-foreground">Estimated Total</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1" data-testid="stat-potential-savings">
                {household?.currency === "GBP" ? "£" : "$"}{shoppingStats.potentialSavings}
              </div>
              <div className="text-sm text-muted-foreground">Potential Savings</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="shopping-list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shopping-list" data-testid="tab-shopping-list">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Shopping List
            </TabsTrigger>
            <TabsTrigger value="price-comparison" data-testid="tab-price-comparison">
              <DollarSign className="mr-2 h-4 w-4" />
              Price Comparison
            </TabsTrigger>
            <TabsTrigger value="store-locator" data-testid="tab-store-locator">
              <MapPin className="mr-2 h-4 w-4" />
              Store Locator
            </TabsTrigger>
          </TabsList>

          {/* Shopping List Tab */}
          <TabsContent value="shopping-list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Shopping List</CardTitle>
              </CardHeader>
              <CardContent>
                {shoppingListLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-3">
                        <div className="w-4 h-4 bg-muted rounded"></div>
                        <div className="flex-1 h-4 bg-muted rounded"></div>
                        <div className="w-16 h-4 bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : activeShoppingList ? (
                  <ShoppingList 
                    shoppingList={activeShoppingList as any}
                    onItemsSelected={setSelectedItems}
                  />
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No shopping list found</h3>
                    <p className="text-muted-foreground mb-4">
                      Generate a meal plan first to create your shopping list automatically.
                    </p>
                    <Button data-testid="button-create-meal-plan">
                      Create Meal Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {activeShoppingList ? (
              <div className="flex gap-4">
                <Button
                  onClick={handleCompareSelected}
                  disabled={selectedItems.length === 0 || priceComparisonMutation.isPending}
                  data-testid="button-compare-selected"
                >
                  <TrendingDown className="mr-2 h-4 w-4" />
                  Compare Selected ({selectedItems.length})
                </Button>
                <Button variant="outline" data-testid="button-export-list">
                  Export List
                </Button>
              </div>
            ) : null}
          </TabsContent>

          {/* Price Comparison Tab */}
          <TabsContent value="price-comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Comparison Tool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter item name to compare prices..."
                    value={priceComparisonQuery}
                    onChange={(e) => setPriceComparisonQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                    data-testid="input-price-comparison"
                  />
                  <Button 
                    onClick={handleAddItem}
                    disabled={!priceComparisonQuery.trim() || bestPricesMutation.isPending}
                    data-testid="button-add-item"
                  >
                    Compare
                  </Button>
                </div>

                {bestPricesMutation.data && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Price Comparison Results</h4>
                    {bestPricesMutation.data.map((item: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 capitalize">{item.itemName}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="bg-green-50 border border-green-200 rounded p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-green-800">{item.bestPrice.storeName}</span>
                              <Badge className="bg-green-100 text-green-800">Best Price</Badge>
                            </div>
                            <div className="text-lg font-bold text-green-900">${item.bestPrice.price}</div>
                            <div className="text-sm text-green-700">per {item.bestPrice.unit}</div>
                          </div>
                          
                          {item.alternatives.map((alt: any, altIndex: number) => (
                            <div key={altIndex} className="border rounded p-3">
                              <div className="font-medium">{alt.storeName}</div>
                              <div className="text-lg font-bold">${alt.price}</div>
                              <div className="text-sm text-muted-foreground">per {alt.unit}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {priceComparisonMutation.data && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Selected Items Comparison</h4>
                    {Object.entries(priceComparisonMutation.data).map(([itemName, prices]: [string, any]) => (
                      <div key={itemName} className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 capitalize">{itemName}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {prices.map((price: any, index: number) => (
                            <div 
                              key={index} 
                              className={`border rounded p-3 ${index === 0 ? 'bg-green-50 border-green-200' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{price.storeName}</span>
                                {index === 0 && <Badge variant="secondary">Lowest</Badge>}
                              </div>
                              <div className="text-lg font-bold">${price.price}</div>
                              <div className="text-sm text-muted-foreground">per {price.unit}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store Locator Tab */}
          <TabsContent value="store-locator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nearby Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stores.map((store) => (
                    <div key={store.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center">
                          <Store className="mr-2 h-4 w-4 text-primary" />
                          {store.name}
                        </h4>
                        <Badge 
                          variant={
                            store.priceRating === "budget" ? "secondary" : 
                            store.priceRating === "premium" ? "destructive" : "default"
                          }
                        >
                          {store.priceRating}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-3 w-3" />
                          {store.distance} away
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-3 w-3" />
                          {store.estimatedTime} drive time
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" data-testid={`button-directions-${store.name.toLowerCase()}`}>
                          <MapPin className="mr-1 h-3 w-3" />
                          Directions
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-store-info-${store.name.toLowerCase()}`}>
                          Store Info
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap className="mr-2 h-4 w-4 text-accent" />
                    <span className="font-medium">Smart Shopping Tip</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Visit budget stores first for bulk items and staples, then premium stores for specialty ingredients. 
                    This can save you up to 30% on your total grocery bill!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Route Optimization Results */}
        {routeOptimizationMutation.data && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Optimized Shopping Route</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {routeOptimizationMutation.data.totalDistance} mi
                    </div>
                    <div className="text-sm text-muted-foreground">Total Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">
                      {routeOptimizationMutation.data.estimatedTime} min
                    </div>
                    <div className="text-sm text-muted-foreground">Estimated Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">
                      {routeOptimizationMutation.data.optimizedRoute.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Stores</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Suggested Order:</h4>
                  {routeOptimizationMutation.data.optimizedRoute.map((store: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{store.name}</div>
                        <div className="text-sm text-muted-foreground">{store.address}</div>
                      </div>
                      <Badge variant="outline">{store.distance} mi</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
