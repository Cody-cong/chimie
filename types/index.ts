export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Region {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  children?: Region[];
}

export interface Restaurant {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  mapUrl: string | null;
  imageUrl: string | null;
  categoryId: string | null;
  regionId: string | null;
  category: Category | null;
  region: Region | null;
  regionPath: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantFormData {
  name: string;
  address: string;
  regionId: string;
  categoryId: string;
  phone: string;
  mapUrl: string;
  imageUrl: string;
}

export type GachaMode = "all" | "category" | "region";

export interface GachaState {
  mode: GachaMode;
  categoryId?: string;
  regionId?: string;
}
