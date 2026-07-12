"use client";

import { MapPin, ExternalLink, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Restaurant } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GachaResultProps {
  restaurant: Restaurant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgain: () => void;
}

export function GachaResult({
  restaurant,
  open,
  onOpenChange,
  onAgain,
}: GachaResultProps) {
  if (!restaurant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            🎉 今日食咩？
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="flex flex-col items-center gap-4 py-6"
        >
          {restaurant.imageUrl && (
            <div className="relative h-40 w-full overflow-hidden rounded-2xl">
              <Image
                src={restaurant.imageUrl}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="text-center">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">
              {restaurant.name}
            </h3>
            {restaurant.category && (
              <Badge variant="secondary" className="mt-2">
                {restaurant.category.name}
              </Badge>
            )}
          </div>

          {restaurant.regionPath.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.regionPath.join(" · ")}</span>
            </div>
          )}

          {restaurant.address && (
            <p className="text-center text-sm text-muted-foreground">
              {restaurant.address}
            </p>
          )}

          <div className="flex w-full gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 gap-2 rounded-full"
              onClick={() => {
                onOpenChange(false);
                setTimeout(onAgain, 300);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              再抽一次
            </Button>
            {restaurant.mapUrl && (
              <a
                href={restaurant.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "default" }), "flex-1 gap-2 rounded-full")}
              >
                <ExternalLink className="h-4 w-4" />
                打开地图
              </a>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
