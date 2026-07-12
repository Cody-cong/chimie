"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Restaurant, Category, Region, GachaMode } from "@/types";

interface GachaMachineProps {
  restaurants: Restaurant[];
  categories: Category[];
  regions: Region[];
  onResult: (restaurant: Restaurant) => void;
}

type Phase = "idle" | "shaking" | "dropping" | "rolling" | "opening";

const BALL_COLORS = [
  "bg-rose-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-sky-400",
  "bg-violet-400",
  "bg-orange-400",
];

export function GachaMachine({
  restaurants,
  categories,
  regions,
  onResult,
}: GachaMachineProps) {
  const [mode, setMode] = useState<GachaMode>("all");
  const [categoryId, setCategoryId] = useState<string>("");
  const [regionId, setRegionId] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Restaurant | null>(null);

  const regionDescendantIds = useMemo(() => {
    if (!regionId || regions.length === 0) return new Set<string>();

    const descendants = new Set<string>();
    const queue = [regionId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      descendants.add(current);
      for (const region of regions) {
        if (region.parentId === current && !descendants.has(region.id)) {
          queue.push(region.id);
        }
      }
    }

    return descendants;
  }, [regions, regionId]);

  const eligibleRestaurants = useMemo(() => {
    if (mode === "category") {
      return categoryId
        ? restaurants.filter((r) => r.categoryId === categoryId)
        : [];
    }
    if (mode === "region") {
      return regionId
        ? restaurants.filter((r) => r.regionId && regionDescendantIds.has(r.regionId))
        : [];
    }
    return restaurants;
  }, [restaurants, mode, categoryId, regionId, regionDescendantIds]);

  const canStart = eligibleRestaurants.length > 0;

  const startGacha = () => {
    if (!canStart || phase !== "idle") return;

    const picked =
      eligibleRestaurants[Math.floor(Math.random() * eligibleRestaurants.length)];
    setResult(picked);
    setPhase("shaking");

    setTimeout(() => {
      setPhase("dropping");
      setTimeout(() => {
        setPhase("rolling");
        setTimeout(() => {
          setPhase("opening");
          setTimeout(() => {
            onResult(picked);
            setPhase("idle");
            setResult(null);
          }, 1200);
        }, 900);
      }, 700);
    }, 3200);
  };

  useEffect(() => {
    setCategoryId("");
    setRegionId("");
  }, [mode]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={mode === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("all")}
        >
          全部随机
        </Button>
        <Button
          variant={mode === "category" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("category")}
        >
          分类随机
        </Button>
        <Button
          variant={mode === "region" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("region")}
        >
          地区随机
        </Button>
      </div>

      {mode === "category" && (
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={categoryId === category.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCategoryId(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}

      {mode === "region" && (
        <GachaRegionSelector regions={regions} value={regionId} onChange={setRegionId} />
      )}

      <div className="relative w-full max-w-[360px] sm:max-w-[400px] h-[420px]">
        <motion.div
          animate={
            phase === "shaking"
              ? { rotate: [-2, 2, -2, 2, -1, 1, 0], x: [-4, 4, -4, 4, -2, 2, 0] }
              : { rotate: 0, x: 0 }
          }
          transition={{ duration: 0.6, repeat: phase === "shaking" ? Infinity : 0 }}
          className="relative"
        >
          <div className="relative mx-auto h-56 w-56 rounded-full border-4 border-white/60 bg-white/20 backdrop-blur-md shadow-inner overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
            <AnimatePresence>
              {(phase === "idle" || phase === "shaking") && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute h-8 w-8 rounded-full ${BALL_COLORS[i % BALL_COLORS.length]} shadow-md`}
                      initial={{
                        x: 80 + Math.cos(i * 0.9) * 50,
                        y: 80 + Math.sin(i * 0.9) * 50,
                      }}
                      animate={
                        phase === "shaking"
                          ? {
                              x: [
                                80 + Math.cos(i * 0.9) * 50,
                                80 + Math.cos(i * 0.9 + 1) * 60,
                                80 + Math.cos(i * 0.9 - 1) * 40,
                                80 + Math.cos(i * 0.9) * 50,
                              ],
                              y: [
                                80 + Math.sin(i * 0.9) * 50,
                                40 + Math.sin(i * 1.5) * 30,
                                120 + Math.sin(i * 1.2) * 40,
                                80 + Math.sin(i * 0.9) * 50,
                              ],
                            }
                          : {
                              x: 80 + Math.cos(i * 0.9) * 50,
                              y: 80 + Math.sin(i * 0.9) * 50,
                            }
                      }
                      transition={
                        phase === "shaking"
                          ? { duration: 0.25, repeat: Infinity }
                          : { duration: 0.5 }
                      }
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="relative -mt-12 mx-auto h-40 w-48 rounded-t-3xl rounded-b-xl bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-md border border-white/60 shadow-xl">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 h-12 w-24 rounded-full bg-black/5" />
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 h-10 w-20 rounded-b-xl bg-black/10"
              animate={phase === "dropping" ? { scaleY: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {phase === "dropping" && result && (
            <motion.div
              initial={{ y: 160, x: "50%", opacity: 1, scale: 1 }}
              animate={{ y: 260, x: "50%", opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeIn" }}
              className="absolute left-1/2 top-0 h-12 w-12 -ml-6 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg z-10"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "rolling" && result && (
            <motion.div
              initial={{ x: "50%", y: 260, rotate: 0 }}
              animate={{ x: 120, y: 320, rotate: 360 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute left-1/2 top-0 h-14 w-14 -ml-7 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-xl z-20 flex items-center justify-center"
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "opening" && result && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-72 -translate-x-1/2 text-center z-30"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1 }}
                className="text-4xl"
              >
                ✨
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        size="lg"
        className="h-14 rounded-full px-10 text-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
        onClick={startGacha}
        disabled={!canStart || phase !== "idle"}
      >
        {phase !== "idle" ? "抽奖中..." : "开始抽奖"}
      </Button>

      {mode === "category" && !categoryId && (
        <p className="text-sm text-muted-foreground">请先选择一个分类</p>
      )}
      {mode === "region" && !regionId && (
        <p className="text-sm text-muted-foreground">请先选择一个地区</p>
      )}
    </div>
  );
}

function GachaRegionSelector({
  regions,
  value,
  onChange,
}: {
  regions: Region[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [selected, setSelected] = useState<{ l1: string; l2: string; l3: string; l4: string }>({
    l1: "",
    l2: "",
    l3: "",
    l4: "",
  });

  const regionMap = useMemo(() => new Map(regions.map((r) => [r.id, r])), [regions]);

  useEffect(() => {
    if (!value) {
      setSelected({ l1: "", l2: "", l3: "", l4: "" });
      return;
    }

    const chain: Region[] = [];
    let current: Region | undefined = regionMap.get(value);
    while (current) {
      chain.unshift(current);
      if (!current.parentId) break;
      current = regionMap.get(current.parentId);
    }

    setSelected({
      l1: chain[0]?.id || "",
      l2: chain[1]?.id || "",
      l3: chain[2]?.id || "",
      l4: chain[3]?.id || value,
    });
  }, [value, regionMap]);

  const getChildren = (parentId: string | null) =>
    regions.filter((r) => r.parentId === parentId);

  const handleChange = (level: number, id: string | null) => {
    const safeId = id ?? "";
    const next = { ...selected };
    if (level === 1) {
      next.l1 = safeId;
      next.l2 = "";
      next.l3 = "";
      next.l4 = "";
    } else if (level === 2) {
      next.l2 = safeId;
      next.l3 = "";
      next.l4 = "";
    } else if (level === 3) {
      next.l3 = safeId;
      next.l4 = "";
    } else {
      next.l4 = safeId;
    }
    setSelected(next);
    onChange(safeId);
  };

  return (
    <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
      <Select value={selected.l1} onValueChange={(id) => handleChange(1, id)}>
        <SelectTrigger className="bg-white/50">
          <SelectValue placeholder="省/大区" />
        </SelectTrigger>
        <SelectContent>
          {getChildren(null).map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selected.l2}
        onValueChange={(id) => handleChange(2, id)}
        disabled={!selected.l1}
      >
        <SelectTrigger className="bg-white/50">
          <SelectValue placeholder="市" />
        </SelectTrigger>
        <SelectContent>
          {getChildren(selected.l1).map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selected.l3}
        onValueChange={(id) => handleChange(3, id)}
        disabled={!selected.l2}
      >
        <SelectTrigger className="bg-white/50">
          <SelectValue placeholder="区/县" />
        </SelectTrigger>
        <SelectContent>
          {getChildren(selected.l2).map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selected.l4}
        onValueChange={(id) => handleChange(4, id)}
        disabled={!selected.l3}
      >
        <SelectTrigger className="bg-white/50">
          <SelectValue placeholder="街道/镇" />
        </SelectTrigger>
        <SelectContent>
          {getChildren(selected.l3).map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
