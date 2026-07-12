"use client";

import { useEffect, useState } from "react";
import { Camera, Loader2, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Restaurant, RestaurantFormData } from "@/types";
import { RegionSelector } from "./region-selector";
import { api } from "@/lib/api";
import Image from "next/image";

interface RestaurantFormProps {
  categories: Category[];
  restaurant?: Restaurant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RestaurantFormData) => Promise<void>;
}

const emptyForm: RestaurantFormData = {
  name: "",
  address: "",
  regionId: "",
  categoryId: "",
  phone: "",
  mapUrl: "",
  imageUrl: "",
};

export function RestaurantForm({
  categories,
  restaurant,
  open,
  onOpenChange,
  onSubmit,
}: RestaurantFormProps) {
  const [form, setForm] = useState<RestaurantFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name,
        address: restaurant.address || "",
        regionId: restaurant.regionId || "",
        categoryId: restaurant.categoryId || "",
        phone: restaurant.phone || "",
        mapUrl: restaurant.mapUrl || "",
        imageUrl: restaurant.imageUrl || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [restaurant, open]);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setIsSubmitting(true);
    await onSubmit({ ...form, name: form.name.trim() });
    setIsSubmitting(false);
    if (!restaurant) {
      setForm(emptyForm);
    }
    onOpenChange(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await api.uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>
            {restaurant ? "编辑餐厅" : "新增餐厅"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-2 space-y-5 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="name">店名 *</Label>
            <Input
              id="name"
              placeholder="例如：鲜寿司"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>分类</Label>
            <Select
              value={form.categoryId}
              onValueChange={(value) => setForm({ ...form, categoryId: value ?? "" })}
            >
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>地区</Label>
            <RegionSelector
              value={form.regionId}
              onChange={(regionId) => setForm({ ...form, regionId })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">地址</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="详细地址"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">联系电话</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="电话号码"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>图片</Label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border bg-white/50 hover:bg-white transition-colors cursor-pointer">
                <Camera className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {isUploading ? "上传中..." : form.imageUrl ? "更换图片" : "上传图片"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
              {form.imageUrl && (
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border">
                  <Image
                    src={form.imageUrl}
                    alt="预览"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <DrawerFooter className="flex-row justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !form.name.trim() || isUploading}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {restaurant ? "保存" : "新增"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
