"use client";

import { useEffect, useState } from "react";
import { GachaMachine } from "./gacha-machine";
import { GachaResult } from "./gacha-result";
import { api } from "@/lib/api";
import { Category, Region, Restaurant } from "@/types";

interface GachaSectionProps {
  restaurants: Restaurant[];
  categories: Category[];
}

export function GachaSection({ restaurants, categories }: GachaSectionProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [result, setResult] = useState<Restaurant | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    api.getRegions().then(setRegions).catch(console.error);
  }, []);

  const handleResult = (restaurant: Restaurant) => {
    setResult(restaurant);
    setShowResult(true);
  };

  const handleAgain = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <section id="shimei" className="scroll-mt-20">
      <div className="flex flex-col items-center gap-8 rounded-3xl border border-border/50 bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-sm p-8 shadow-sm sm:p-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center justify-center gap-2">
            <span className="text-2xl">🎲</span>
            食咩
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            不知道吃什么？交给扭蛋机决定
          </p>
        </div>

        <GachaMachine
          restaurants={restaurants}
          categories={categories}
          regions={regions}
          onResult={handleResult}
        />
      </div>

      <GachaResult
        restaurant={result}
        open={showResult}
        onOpenChange={setShowResult}
        onAgain={handleAgain}
      />
    </section>
  );
}
