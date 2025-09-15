import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Edit3, Trash2, Store, MapPin, DollarSign } from "lucide-react";

interface ShoppingItem {
  name: string;
  amount: string;
  unit: string;
  category: string;
  estimatedPrice?: number;
  bestStore?: string;
  completed?: boolean;
}

interface ShoppingListProps {
  shoppingList: {
    id: string;
    items: ShoppingItem[];
    totalEstimatedCost: string;
  };
  onItemsSelected?: (items: string[]) => void;
}

export function ShoppingList({ shoppingList, onItemsSelected }: ShoppingListProps) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", amount: "", unit: "", category: "Other" });

  const items = Array.isArray(shoppingList.items) ? shoppingList.items : [];

  const toggleItemCompleted = (itemName: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemName)) {
      newCompleted.delete(itemName);
    } else {
      newCompleted.add(itemName);
    }
    setCompletedItems(newCompleted);
  };

  const toggleItemSelected = (itemName: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelectedItems(newSelected);
    onItemsSelected?.(Array.from(newSelected));
  };

  const groupedItems = items.reduce((groups: { [key: string]: ShoppingItem[] }, item) => {
    const category = item.category || "Other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const categoryOrder = ["Meat & Seafood", "Dairy", "Fruits", "Vegetables", "Pantry & Grains", "Other"];
  const sortedCategories = categoryOrder.filter(cat => groups[cat]).concat(
    Object.keys(groups).filter(cat => !categoryOrder.includes(cat))
  );

  const completedItemsCount = items.filter(item => completedItems.has(item.name)).length;
  const totalCost = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  const completedCost = items
    .filter(item => completedItems.has(item.name))
    .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      // In a real app, this would call an API to add the item
      setNewItem({ name: "", amount: "", unit: "", category: "Other" });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Progress Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Shopping Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedItemsCount} of {items.length} items
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: items.length ? `${(completedItemsCount / items.length) * 100}%` : '0%' }}
          ></div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Spent: ${completedCost.toFixed(2)}
          </span>
          <span className="text-muted-foreground">
            Total: ${totalCost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" data-testid="button-add-item">
              <Plus className="mr-2 h-3 w-3" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Shopping Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Item Name</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="e.g., Organic Bananas"
                  data-testid="input-new-item-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Amount</Label>
                  <Input
                    value={newItem.amount}
                    onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                    placeholder="2"
                    data-testid="input-new-item-amount"
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    placeholder="lbs"
                    data-testid="input-new-item-unit"
                  />
                </div>
              </div>
              <Button onClick={handleAddItem} className="w-full" data-testid="button-confirm-add-item">
                Add to List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setSelectedItems(new Set(items.map(item => item.name)))}
          data-testid="button-select-all"
        >
          Select All
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setSelectedItems(new Set())}
          data-testid="button-clear-selection"
        >
          Clear Selection
        </Button>
        
        {selectedItems.size > 0 && (
          <Badge variant="secondary" className="px-3 py-1">
            {selectedItems.size} selected
          </Badge>
        )}
      </div>

      {/* Shopping List by Categories */}
      <div className="space-y-6">
        {sortedCategories.map((category) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg" data-testid={`category-${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                {category}
              </h3>
              <Badge variant="outline" className="text-xs">
                {groups[category].length} items
              </Badge>
            </div>
            
            <div className="space-y-2">
              {groups[category].map((item, index) => {
                const itemKey = `${category}-${index}`;
                const isCompleted = completedItems.has(item.name);
                const isSelected = selectedItems.has(item.name);
                
                return (
                  <div 
                    key={itemKey}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                      isCompleted ? 'bg-muted/50' : 'hover:bg-muted/30'
                    }`}
                    data-testid={`shopping-item-${item.name.toLowerCase().replace(/ /g, '-')}`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleItemCompleted(item.name)}
                        data-testid={`checkbox-completed-${item.name.toLowerCase().replace(/ /g, '-')}`}
                      />
                      
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleItemSelected(item.name)}
                        className="text-primary"
                        data-testid={`checkbox-selected-${item.name.toLowerCase().replace(/ /g, '-')}`}
                      />
                      
                      <div className="flex-1">
                        <div className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {item.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.amount} {item.unit}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {item.estimatedPrice && (
                        <div className="text-right">
                          <div className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            ${item.estimatedPrice.toFixed(2)}
                          </div>
                          {item.bestStore && (
                            <div className="flex items-center text-xs text-secondary">
                              <Store className="mr-1 h-3 w-3" />
                              {item.bestStore}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6" data-testid={`button-edit-${item.name.toLowerCase().replace(/ /g, '-')}`}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" data-testid={`button-delete-${item.name.toLowerCase().replace(/ /g, '-')}`}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {category !== sortedCategories[sortedCategories.length - 1] && <Separator />}
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Shopping Summary</span>
          <div className="flex items-center space-x-2">
            <Badge variant={completedItemsCount === items.length ? "default" : "secondary"}>
              {completedItemsCount === items.length ? "Complete" : "In Progress"}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Items</div>
            <div className="font-medium" data-testid="summary-items">
              {completedItemsCount}/{items.length}
            </div>
          </div>
          
          <div>
            <div className="text-muted-foreground">Spent</div>
            <div className="font-medium" data-testid="summary-spent">
              ${completedCost.toFixed(2)}
            </div>
          </div>
          
          <div>
            <div className="text-muted-foreground">Remaining</div>
            <div className="font-medium" data-testid="summary-remaining">
              ${(totalCost - completedCost).toFixed(2)}
            </div>
          </div>
          
          <div>
            <div className="text-muted-foreground">Total Budget</div>
            <div className="font-medium" data-testid="summary-total">
              ${shoppingList.totalEstimatedCost}
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Your shopping list is empty</h3>
          <p className="text-muted-foreground mb-4">
            Add items manually or generate a meal plan to create your shopping list automatically.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-item">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Item
          </Button>
        </div>
      )}
    </div>
  );
}
