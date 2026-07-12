"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RestaurantCard } from "./restaurant-card";
import { CategoryManager } from "./category-manager";
import { RestaurantForm } from "./restaurant-form";
import { Category, Restaurant, RestaurantFormData } from "@/types";

interface RestaurantListProps {
  restaurants: Restaurant[];
  categories: Category[];
  onCreate: (data: RestaurantFormData) => Promise<void>;
  onUpdate: (id: string, data: Partial<RestaurantFormData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCategoryCreate: (name: string) => Promise<void>;
  onCategoryUpdate: (id: string, name: string) => Promise<void>;
  onCategoryDelete: (id: string) => Promise<void>;
}

export function RestaurantList({
  restaurants,
  categories,
  onCreate,
  onUpdate,
  onDelete,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
}: RestaurantListProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const matchesSearch =
        !query ||
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.category?.name.toLowerCase().includes(query) ||
        restaurant.regionPath.some((r) => r.toLowerCase().includes(query)) ||
        (restaurant.address && restaurant.address.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === null || restaurant.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [restaurants, search, selectedCategory]);

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingRestaurant(null);
    setFormOpen(true);
  };

  const handleSubmit = async (data: RestaurantFormData) => {
    if (editingRestaurant) {
      await onUpdate(editingRestaurant.id, data);
    } else {
      await onCreate(data);
    }
  };

  return (
    <section id="shiguo" className="scroll-mt-20">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <span className="text-2xl">🍜</span>
              食过
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              记录所有吃过的餐厅
            </p>
          </div>
          <CategoryManager
            categories={categories}
            onCreate={onCategoryCreate}
            onUpdate={onCategoryUpdate}
            onDelete={onCategoryDelete}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索店名、分类、地区..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/60 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "secondary"}
            className="cursor-pointer px-3 py-1.5"
            onClick={() => setSelectedCategory(null)}
          >
            全部
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className="cursor-pointer px-3 py-1.5"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>

        {filteredRestaurants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white/40 py-16 text-center"
          >
            <p className="text-muted-foreground">还没有餐厅记录</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={handleCreateClick}
            >
              添加第一家餐厅
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RestaurantCard
                  restaurant={restaurant}
                  onEdit={handleEdit}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <RestaurantForm
        categories={categories}
        restaurant={editingRestaurant}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        onClick={handleCreateClick}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </section>
  );
}
