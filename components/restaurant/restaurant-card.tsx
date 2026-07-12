"use client";

import { MapPin, Phone, ExternalLink, Pencil, Trash2, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Restaurant } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
}

export function RestaurantCard({
  restaurant,
  onEdit,
  onDelete,
}: RestaurantCardProps) {
  const regionChain = restaurant.regionPath.length > 0
    ? restaurant.regionPath
    : restaurant.region
    ? [restaurant.region.name]
    : [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
    >
      {restaurant.imageUrl ? (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-stone-100">
          <ImageOff className="h-10 w-10 text-stone-300" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {restaurant.name}
          </h3>
          {restaurant.category && (
            <Badge variant="secondary" className="shrink-0">
              {restaurant.category.name}
            </Badge>
          )}
        </div>

        {regionChain.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{regionChain.join(" · ")}</span>
          </div>
        )}

        {restaurant.address && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {restaurant.address}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center gap-2">
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 gap-1 px-2")}
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="text-xs">电话</span>
            </a>
          )}

          {restaurant.mapUrl && (
            <a
              href={restaurant.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 gap-1 px-2")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="text-xs">地图</span>
            </a>
          )}

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(restaurant)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(restaurant.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
