import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Search, Package, Trash2, Edit2, LogOut, Home,
  ShoppingCart, ChefHat, User, Calendar
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const CATEGORIES = [
  "All",
  "Produce",
  "Dairy",
  "Meat & Seafood",
  "Grains & Pasta",
  "Pantry Staples",
  "Frozen",
  "Beverages",
  "Snacks",
  "Other"
];

const pantryItemSchema = z.object({
  ingredientName: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  category: z.string().optional(),
  expirationDate: z.string().optional(),
  notes: z.string().optional(),
});

type PantryItemForm = z.infer<typeof pantryItemSchema>;

export default function Pantry() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Fetch household
  const { data: household, isLoading: householdLoading } = useQuery<any>({
    queryKey: ["/api/households/me"],
  });

  // Fetch pantry items
  const { data: pantryItems = [], isLoading: itemsLoading } = useQuery<any[]>({
    queryKey: ["/api/households", household?.id, "pantry"],
    enabled: !!household?.id,
  });

  // Form for adding/editing items
  const form = useForm<PantryItemForm>({
    resolver: zodResolver(pantryItemSchema),
    defaultValues: {
      ingredientName: "",
      quantity: "",
      unit: "",
      category: "",
      expirationDate: "",
      notes: "",
    },
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (data: PantryItemForm) => {
      return await apiRequest(`/api/households/${household?.id}/pantry`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/households", household?.id, "pantry"] });
      toast({
        title: "Item Added!",
        description: "The item has been added to your pantry inventory.",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PantryItemForm> }) => {
      return await apiRequest(`/api/pantry/${id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/households", household?.id, "pantry"] });
      toast({
        title: "Item Updated!",
        description: "The item has been updated successfully.",
      });
      setEditingItem(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/pantry/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/households", household?.id, "pantry"] });
      toast({
        title: "Item Deleted",
        description: "The item has been removed from your pantry.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PantryItemForm) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data });
    } else {
      addItemMutation.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    form.reset({
      ingredientName: item.ingredientName,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category || "",
      expirationDate: item.expirationDate ? format(new Date(item.expirationDate), "yyyy-MM-dd") : "",
      notes: item.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingItem(null);
    form.reset();
  };

  // Filter items
  const filteredItems = pantryItems.filter((item: any) => {
    const matchesSearch = item.ingredientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Redirect to onboarding if no household
  if (!householdLoading && !household) {
    setLocation("/onboarding");
    return null;
  }

  if (householdLoading || itemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading pantry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NutriPlanPal</h1>
              <nav className="hidden md:flex gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/dashboard")}
                  data-testid="nav-dashboard"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/recipes")}
                  data-testid="nav-recipes"
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  Recipes
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/shopping")}
                  data-testid="nav-shopping"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping
                </Button>
                <Button
                  variant="default"
                  onClick={() => setLocation("/pantry")}
                  data-testid="nav-pantry"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Pantry
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setLocation("/profile")}
                data-testid="button-profile"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pantry Inventory</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track what you have on hand to optimize your shopping lists
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48" data-testid="select-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-item">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="ingredientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ingredient Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Tomatoes" {...field} data-testid="input-ingredient-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="5" {...field} data-testid="input-quantity" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <FormControl>
                                <Input placeholder="lbs, oz, cups" {...field} data-testid="input-unit" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-item-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORIES.slice(1).map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expirationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-expiration" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Location, brand, etc." {...field} data-testid="input-notes" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={addItemMutation.isPending || updateItemMutation.isPending}
                        data-testid="button-save-item"
                      >
                        {addItemMutation.isPending || updateItemMutation.isPending ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Pantry Items Grid */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {pantryItems.length === 0 ? "Your pantry is empty" : "No items match your search"}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {pantryItems.length === 0 ? "Start adding ingredients you have on hand" : "Try adjusting your filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item: any) => {
              const isExpiringSoon = item.expirationDate && 
                new Date(item.expirationDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
              const isExpired = item.expirationDate && new Date(item.expirationDate) < new Date();

              return (
                <Card key={item.id} data-testid={`card-item-${item.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg" data-testid={`text-name-${item.id}`}>
                          {item.ingredientName}
                        </CardTitle>
                        <CardDescription>
                          {item.quantity} {item.unit}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          data-testid={`button-edit-${item.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {item.category && (
                      <Badge variant="secondary" className="mb-2">
                        {item.category}
                      </Badge>
                    )}
                    {item.expirationDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span className={isExpired ? "text-red-500 font-semibold" : isExpiringSoon ? "text-orange-500 font-semibold" : "text-gray-600 dark:text-gray-400"}>
                          {isExpired ? "Expired: " : "Expires: "}
                          {format(new Date(item.expirationDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                    )}
                    {item.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {item.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
