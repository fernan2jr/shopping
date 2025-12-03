import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, PlusIcon, MinusIcon, XCircle } from "lucide-react";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ThemeProvider } from "@/components/theme-provider";

interface ShoppingItem {
  id: number;
  name: string;
  price: number;
  isWeightable: boolean;
  weight: number;
  quantity: number;
  total: number;
}

function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  // Load items from localStorage at the start
  useEffect(() => {
    const savedItems = localStorage.getItem("shopping-items");
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Ensure all items have quantity property (for backward compatibility)
        const itemsWithQuantity = parsedItems.map((item: ShoppingItem) => ({
          ...item,
          quantity: item.quantity || 1,
        }));
        setItems(itemsWithQuantity);
      } catch (error) {
        console.error("Error loading items:", error);
      }
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

  const handleSubmit = (): void => {
    if (!name.trim()) {
      alert("Please enter a name for the item");
      return;
    }

    const priceNum = parseFloat(price);
    if (!price || priceNum <= 0) {
      alert("Please enter a valid price for the item");
      return;
    }

    const weightNum = parseFloat(weight);
    const isWeightable = weight.trim() !== "" && weightNum > 0;

    const newItem: ShoppingItem = {
      id: Date.now(),
      name: name.trim(),
      price: priceNum,
      isWeightable,
      weight: isWeightable ? weightNum : 0,
      quantity: 1,
      total: isWeightable ? weightNum * priceNum : priceNum,
    };

    setItems([...items, newItem]);

    // Reset form fields
    setName("");
    setPrice("");
    setWeight("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const deleteItem = (id: number): void => {
    setItems(items.filter((item) => item.id !== id));
  };

  const incrementQuantity = (id: number): void => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + 1;
          const newTotal = item.isWeightable
            ? item.price * item.weight
            : item.price * newQuantity;
          return { ...item, quantity: newQuantity, total: newTotal };
        }
        return item;
      })
    );
  };

  const decrementQuantity = (id: number): void => {
    setItems(
      items.map((item) => {
        if (item.id === id && item.quantity > 1) {
          const newQuantity = item.quantity - 1;
          const newTotal = item.isWeightable
            ? item.price * item.weight
            : item.price * newQuantity;
          return { ...item, quantity: newQuantity, total: newTotal };
        }
        return item;
      })
    );
  };

  const clearAll = (): void => {
    if (confirm("Are you sure you want to clear all items?")) {
      setItems([]);
    }
  };

  const total: number = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <ThemeProvider defaultTheme="system" storageKey="shoptracker-theme">
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <ShoppingCart className="size-8" />
              Shopping List
            </h1>
          </div>

          {/* Form */}
          <Card>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product</Label>
                  <Input
                    id="name"
                    placeholder="Example: Tomates, rice, etc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (RD$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lb)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" onClick={handleSubmit}>
                  <Plus className="size-4" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Items List */}
          <Card className="">
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="size-16 mx-auto mb-4 opacity-30" />
                  <p>No items added</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="relative flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.isWeightable
                            ? `RD$ ${item.price.toFixed(
                                2
                              )}/lb × ${item.weight.toFixed(2)} lb`
                            : `RD$ ${item.price.toFixed(2)}`}
                        </p>
                      </div>

                      {!item.isWeightable && (
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => decrementQuantity(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="size-4" />
                          </Button>
                          <ButtonGroupText>{item.quantity}</ButtonGroupText>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => incrementQuantity(item.id)}
                          >
                            <PlusIcon className="size-4" />
                          </Button>
                        </ButtonGroup>
                      )}

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">
                          RD$ {item.total.toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-4 -right-4 text-destructive hover:text-white hover:bg-destructive"
                          onClick={() => deleteItem(item.id)}
                        >
                          <XCircle className="size-4 bg-background rounded-full" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total */}
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="mb-2">Total estimated</p>
                <p className="text-3xl font-bold">RD$ {total.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          {items.length > 0 && (
            <Button variant="secondary" className="w-full" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
