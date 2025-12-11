import { useState, useEffect } from "react";
import {
  Plus,
  PlusIcon,
  MinusIcon,
  X,
  Trash2,
  ScaleIcon,
  ArrowDownToLine,
  ArrowUpToLine,
} from "lucide-react";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  weight: number;
}

interface NewItemState {
  name: string;
  price: string;
  weight: string;
  weightPounds: string;
  weightFraction: string;
}

interface Fraction {
  label: string;
  value: number;
}

function App() {
  /* const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Tomato Paste", price: 140.0, quantity: 1, weight: 0 },
    { id: 2, name: "Baked plantain", price: 29.0, quantity: 3, weight: 0 },
    { id: 3, name: "Chicken breast", price: 185.0, quantity: 0, weight: 2.5 },
    { id: 4, name: "Whole Milk", price: 75.0, quantity: 2, weight: 1 },
    { id: 5, name: "Brown Rice", price: 48.0, quantity: 1, weight: 1 },
    { id: 6, name: "Ground Beef", price: 210.0, quantity: 0, weight: 1.2 },
    { id: 7, name: "Pasta Spaghetti", price: 32.0, quantity: 4, weight: 0 },
    { id: 8, name: "Canned Corn", price: 45.0, quantity: 2, weight: 0 },
    { id: 9, name: "Lettuce", price: 25.0, quantity: 1, weight: 0.3 },
    { id: 10, name: "Olive Oil", price: 180.0, quantity: 1, weight: 0.5 },
    { id: 11, name: "Eggs (Dozen)", price: 105.0, quantity: 1, weight: 0 },
    { id: 12, name: "Cheddar Cheese", price: 160.0, quantity: 0, weight: 0.4 },
    { id: 13, name: "Sugar", price: 42.0, quantity: 2, weight: 1 },
    { id: 14, name: "Flour", price: 38.0, quantity: 1, weight: 1 },
    { id: 15, name: "Bananas", price: 20.0, quantity: 6, weight: 1.1 },
    { id: 16, name: "Avocado", price: 55.0, quantity: 2, weight: 0.6 },
    { id: 17, name: "Yogurt", price: 70.0, quantity: 3, weight: 0.45 },
    { id: 18, name: "Sausages", price: 130.0, quantity: 1, weight: 0.5 },
  ]); */
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<NewItemState>({
    name: "",
    price: "",
    weight: "",
    weightPounds: "",
    weightFraction: "0",
  });
  const [showWeightPicker, setShowWeightPicker] = useState<boolean>(false);

  // Load items from localStorage at the start
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("shopping-items");
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error("Error loading items:", error);
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("shopping-items", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving items:", error);
    }
  }, [items]);

  const fractions: Fraction[] = [
    { label: "⅛", value: 0.125 },
    { label: "¼", value: 0.25 },
    { label: "⅜", value: 0.375 },
    { label: "½", value: 0.5 },
    { label: "⅝", value: 0.625 },
    { label: "¾", value: 0.75 },
    { label: "⅞", value: 0.875 },
  ];

  const calculateWeight = (): number => {
    const pounds = parseFloat(newItem.weightPounds) || 0;
    const fraction = parseFloat(newItem.weightFraction) || 0;
    return pounds + fraction;
  };

  const addItem = () => {
    if (newItem.name && newItem.price) {
      const weight = showWeightPicker
        ? calculateWeight()
        : parseFloat(newItem.weight) || 0;
      setItems([
        {
          id: Date.now(),
          name: newItem.name,
          price: parseFloat(newItem.price),
          quantity: weight > 0 ? 0 : 1,
          weight: weight,
        },
        ...items,
      ]);
      setNewItem({
        name: "",
        price: "",
        weight: "",
        weightPounds: "",
        weightFraction: "0",
      });
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const total = items.reduce((sum, item) => {
    if (item.weight > 0) {
      return sum + item.price * item.weight;
    }
    return sum + item.price * item.quantity;
  }, 0);

  const clearAll = () => {
    setItems([]);
  };

  const handleToTheBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleToTheTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative text-center mb-8">
          <div className="flex items-end gap-1.5">
            <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <img src="/favicon.svg" alt="Shopping List" className="size-8" />
              ShopAid
            </h1>
            <p className="text-xs font-semibold text-white/50 mb-3 md:mb-2.5">
              List Tracker
            </p>
          </div>
          <div className="absolute top-0 right-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToTheBottom}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 hover:text-white"
            >
              <ArrowDownToLine className="size-4" />
            </Button>
          </div>
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
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
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
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
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
              <ButtonGroup className="w-full">
                {showWeightPicker ? (
                  <ButtonGroupText className="text-sm font-semibold w-full bg-gray-700 text-gray-200 text-nowrap">
                    {calculateWeight().toFixed(3)} lb
                  </ButtonGroupText>
                ) : (
                  <Input
                    type="number"
                    inputMode="decimal"
                    autoComplete="off"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    id="weight"
                    value={newItem.weight}
                    onChange={(e) =>
                      setNewItem({ ...newItem, weight: e.target.value })
                    }
                    className="w-full bg-gray-700 text-gray-200 placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                )}
                <Button
                  variant="outline"
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                  onClick={() => setShowWeightPicker(!showWeightPicker)}
                >
                  <ScaleIcon className="size-5" />
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {showWeightPicker && (
            <div className="space-y-3 mb-4">
              <Input
                type="number"
                inputMode="decimal"
                step="1"
                min="0"
                placeholder="Whole pounds"
                value={newItem.weightPounds}
                onChange={(e) =>
                  setNewItem({ ...newItem, weightPounds: e.target.value })
                }
                className="w-full bg-gray-700 text-gray-200 placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div className="grid grid-cols-7 gap-2">
                {fractions.map((frac) => (
                  <Button
                    key={frac.value}
                    variant="outline"
                    onClick={() =>
                      setNewItem({
                        ...newItem,
                        weightFraction: frac.value.toString(),
                      })
                    }
                    className={`text-xl font-semibold py-2 px-3 transition-all duration-200 ${
                      parseFloat(newItem.weightFraction) === frac.value
                        ? "bg-emerald-500 text-white border-2 border-emerald-400"
                        : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                    }`}
                  >
                    {frac.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={addItem}
          >
            <Plus className="size-4" />
            Add Item
          </Button>
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-6">
          {items.map((item) => {
            const isWeightable = item.weight > 0;
            const itemTotal = isWeightable
              ? item.price * item.weight
              : item.price * item.quantity;

            return (
              <div
                key={item.id}
                className="rounded-xl p-3 bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      RD$ {item.price.toFixed(2)} per{" "}
                      {isWeightable ? "lb" : "unit"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="size-4 rounded-full" />
                  </Button>
                </div>
                <div className="flex item-center justify-between">
                  {isWeightable ? (
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
                        onClick={() => updateQuantity(item.id, -1)}
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
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 hover:text-white"
                      >
                        <PlusIcon className="size-4" />
                      </Button>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">
                      RD$ {itemTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 mb-4 shadow-xl">
          <div className="text-center">
            <p className="text-emerald-100 text-sm font-medium mb-2">
              Total estimated
            </p>
            <p className="text-4xl font-bold text-white">
              RD$ {total.toFixed(2)}
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold py-3 px-4 transition-all duration-200 border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2"
              onClick={clearAll}
            >
              <Trash2 className="size-4" />
              Clear all
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToTheTop}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 hover:text-white"
            >
              <ArrowUpToLine className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
