import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  PlusIcon,
  MinusIcon,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

    setItems([newItem, ...items]);

    // Reset form fields
    setName("");
    setPrice("");
    setWeight("");
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
    <div className="min-h-screen p-4 sm:p-6 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <ShoppingCart className="size-8 text-emerald-400" />
            Shopping List
          </h1>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700 shadow-xl">
          <div className="space-y-2 mb-4">
            <Label
              htmlFor="product-name"
              className="text-sm font-medium text-gray-400"
            >
              Product
            </Label>
            <Input
              type="text"
              id="product-name"
              placeholder="Example: Tomates, rice, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-gray-200 placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-400"
              >
                Price (RD$)
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                autoComplete="off"
                step="0.01"
                min="0"
                placeholder="0.00"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-700 text-gray-200 placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="weight"
                className="text-sm font-medium text-gray-400"
              >
                Weight (lb)
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                autoComplete="off"
                step="0.01"
                min="0"
                placeholder="0.00"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-gray-700 text-gray-200 placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={handleSubmit}
          >
            <Plus className="size-4" />
            Add Item
          </Button>
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl p-3 bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    RD$ {item.price.toFixed(2)} per{" "}
                    {item.isWeightable ? "lb" : "unit"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem(item.id)}
                >
                  <X className="size-4 rounded-full" />
                </Button>
              </div>
              <div className="flex item-center justify-between">
                {item.isWeightable ? (
                  <div className="flex item-center gap-2">
                    <div className="px-3 rounded-md border">
                      <span className="text-xs font-semibold">
                        {item.weight.toFixed(2)} lb
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex item-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decrementQuantity(item.id)}
                      disabled={item.quantity <= 1}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 hover:text-white"
                    >
                      <MinusIcon className="size-4" />
                    </Button>
                    <span className="text-lg font-bold min-w-[2.5ch] text-center pt-0.5">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => incrementQuantity(item.id)}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 hover:text-white"
                    >
                      <PlusIcon className="size-4" />
                    </Button>
                  </div>
                )}
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">
                    RD$ {item.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 mb-4 shadow-xl">
          <div className="text-center">
            <p className="text-emerald-100 text-sm font-medium mb-2">
              Total estimated
            </p>
            <p className="text-3xl font-bold text-white">
              RD$ {total.toFixed(2)}
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <Button
            variant="secondary"
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold py-3 px-4 transition-all duration-200 border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2"
            onClick={clearAll}
          >
            <Trash2 className="size-4" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

export default App;
