"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { RestaurantList } from "@/components/restaurant/restaurant-list";
import { GachaSection } from "@/components/gacha/gacha-section";
import { MobileHome } from "@/components/mobile-home";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Category, Restaurant, RestaurantFormData } from "@/types";

type MobileView = "home" | "shiguo" | "shimei";

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileView, setMobileView] = useState<MobileView>("home");

  const fetchData = async () => {
    try {
      const [restaurantsData, categoriesData] = await Promise.all([
        api.getRestaurants(),
        api.getCategories(),
      ]);
      setRestaurants(restaurantsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRestaurant = async (data: RestaurantFormData) => {
    const restaurant = await api.createRestaurant(data);
    setRestaurants((prev) => [restaurant, ...prev]);
  };

  const handleUpdateRestaurant = async (
    id: string,
    data: Partial<RestaurantFormData>
  ) => {
    const restaurant = await api.updateRestaurant(id, data);
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? restaurant : r))
    );
  };

  const handleDeleteRestaurant = async (id: string) => {
    await api.deleteRestaurant(id);
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreateCategory = async (name: string) => {
    const category = await api.createCategory(name);
    setCategories((prev) => [...prev, category].sort((a, b) => a.sortOrder - b.sortOrder));
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    const category = await api.updateCategory(id, name);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? category : c))
    );
  };

  const handleDeleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setRestaurants((prev) =>
      prev.map((r) => (r.categoryId === id ? { ...r, categoryId: null, category: null } : r))
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            {mobileView !== "home" && (
              <button
                onClick={() => setMobileView("home")}
                className="mr-1 -ml-1 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
                aria-label="返回首页"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setMobileView("home")}
              className="flex items-center gap-2 lg:cursor-default"
            >
              <span className="text-2xl">🍚</span>
              <span className="text-xl font-semibold tracking-tight">饭好</span>
            </button>
          </motion.div>

        </div>
      </header>

      {mobileView === "home" && (
        <div className="flex flex-1 lg:hidden">
          <MobileHome
            restaurantsCount={restaurants.length}
            onSelect={setMobileView}
          />
        </div>
      )}

      <main
        className={cn(
          "flex-1",
          mobileView === "home" ? "hidden lg:block" : "block"
        )}
      >
        <section className="mx-auto hidden max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:block">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              今天，吃点什么好？
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              记录吃过的餐厅，收藏想吃的美味。当犹豫不决时，让扭蛋机为你决定。
            </p>
          </motion.div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:pb-24 lg:pt-0">
          <div className="flex flex-col gap-16 lg:flex-row lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                "flex-1",
                mobileView === "shimei" ? "hidden lg:block" : "block"
              )}
            >
              <RestaurantList
                restaurants={restaurants}
                categories={categories}
                onCreate={handleCreateRestaurant}
                onUpdate={handleUpdateRestaurant}
                onDelete={handleDeleteRestaurant}
                onCategoryCreate={handleCreateCategory}
                onCategoryUpdate={handleUpdateCategory}
                onCategoryDelete={handleDeleteCategory}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={cn(
                "lg:w-[420px] xl:w-[460px] lg:sticky lg:top-24 lg:self-start",
                mobileView === "shiguo" ? "hidden lg:block" : "block"
              )}
            >
              <GachaSection
                restaurants={restaurants}
                categories={categories}
              />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
