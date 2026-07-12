"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface MobileHomeProps {
  restaurantsCount: number;
  onSelect: (view: "shiguo" | "shimei") => void;
}

const cards = [
  {
    id: "shiguo" as const,
    icon: "🍜",
    title: "食过",
    subtitle: "管理餐厅",
    description: "记录吃过的餐厅，收藏想吃的美味",
    gradient: "from-amber-200/60 to-orange-200/40",
    iconBg: "bg-amber-100",
  },
  {
    id: "shimei" as const,
    icon: "🎲",
    title: "食咩",
    subtitle: "随机抽签",
    description: "不知道吃什么？交给扭蛋机决定",
    gradient: "from-rose-200/60 to-pink-200/40",
    iconBg: "bg-rose-100",
  },
];

export function MobileHome({ restaurantsCount, onSelect }: MobileHomeProps) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-5 px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-center"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          今天，吃点什么好？
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          已记录 {restaurantsCount} 家餐厅
        </p>
      </motion.div>

      {cards.map((card, index) => (
        <motion.button
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(card.id)}
          className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${card.gradient} p-6 text-left shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md active:shadow-inner`}
        >
          <div className="relative z-10 flex items-start justify-between">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg} text-3xl shadow-sm`}
            >
              {card.icon}
            </div>
            <ChevronRight className="h-6 w-6 text-foreground/40 transition-transform group-hover:translate-x-1" />
          </div>
          <div className="relative z-10 mt-5">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {card.title}
              </h2>
              <span className="text-sm font-medium text-muted-foreground">
                {card.subtitle}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {card.description}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
