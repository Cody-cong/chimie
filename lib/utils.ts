import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface RegionNode {
  id: string;
  name: string;
  parentId: string | null;
}

export function buildRegionPath(regionId: string | null, regions: RegionNode[]): string[] {
  if (!regionId) return [];

  const regionMap = new Map(regions.map((r) => [r.id, r]));
  const path: string[] = [];
  let current: RegionNode | undefined = regionMap.get(regionId);

  while (current) {
    path.unshift(current.name);
    if (!current.parentId) break;
    current = regionMap.get(current.parentId);
  }

  return path;
}
