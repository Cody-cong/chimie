"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { Region } from "@/types";

interface RegionSelectorProps {
  value: string;
  onChange: (regionId: string) => void;
}

export function RegionSelector({ value, onChange }: RegionSelectorProps) {
  const [level1, setLevel1] = useState<Region[]>([]);
  const [level2, setLevel2] = useState<Region[]>([]);
  const [level3, setLevel3] = useState<Region[]>([]);
  const [level4, setLevel4] = useState<Region[]>([]);

  const [selectedIds, setSelectedIds] = useState<{
    l1: string;
    l2: string;
    l3: string;
    l4: string;
  }>({ l1: "", l2: "", l3: "", l4: "" });

  useEffect(() => {
    api.getRegions(null).then(setLevel1);
  }, []);

  useEffect(() => {
    if (!value) {
      setSelectedIds({ l1: "", l2: "", l3: "", l4: "" });
      return;
    }

    const restore = async () => {
      const region = (await api.getRegions()).find((r) => r.id === value);
      if (!region) return;

      const chain: Region[] = [];
      let current: Region | undefined = region;
      while (current) {
        chain.unshift(current);
        if (!current.parentId) break;
        current = (await api.getRegions()).find((r) => r.id === current?.parentId);
      }

      setSelectedIds({
        l1: chain[0]?.id || "",
        l2: chain[1]?.id || "",
        l3: chain[2]?.id || "",
        l4: chain[3]?.id || "",
      });

      if (chain[0]) {
        api.getRegions(chain[0].id).then(setLevel2);
      }
      if (chain[1]) {
        api.getRegions(chain[1].id).then(setLevel3);
      }
      if (chain[2]) {
        api.getRegions(chain[2].id).then(setLevel4);
      }
    };

    restore();
  }, [value]);

  const handleLevelChange = (
    level: number,
    regionId: string | null,
    nextSetter: (regions: Region[]) => void,
    nextNextSetter?: (regions: Region[]) => void,
    finalSetter?: (regions: Region[]) => void
  ) => {
    const safeId = regionId ?? "";
    const newSelected = { ...selectedIds };
    if (level === 1) {
      newSelected.l1 = safeId;
      newSelected.l2 = "";
      newSelected.l3 = "";
      newSelected.l4 = "";
      setLevel2([]);
      setLevel3([]);
      setLevel4([]);
      if (safeId) {
        api.getRegions(safeId).then(setLevel2);
      }
    } else if (level === 2) {
      newSelected.l2 = safeId;
      newSelected.l3 = "";
      newSelected.l4 = "";
      setLevel3([]);
      setLevel4([]);
      if (safeId) {
        api.getRegions(safeId).then(setLevel3);
      }
    } else if (level === 3) {
      newSelected.l3 = safeId;
      newSelected.l4 = "";
      setLevel4([]);
      if (safeId) {
        api.getRegions(safeId).then(setLevel4);
      }
    } else if (level === 4) {
      newSelected.l4 = safeId;
    }

    setSelectedIds(newSelected);

    if (level === 4) {
      onChange(safeId);
    } else {
      onChange("");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Select
        value={selectedIds.l1}
        onValueChange={(id) => handleLevelChange(1, id, setLevel2)}
      >
        <SelectTrigger className="bg-white/50">
          {selectedIds.l1 ? (
            level1.find((r) => r.id === selectedIds.l1)?.name
          ) : (
            <span className="text-muted-foreground">选择省/大区</span>
          )}
        </SelectTrigger>
        <SelectContent>
          {level1.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedIds.l2}
        onValueChange={(id) => handleLevelChange(2, id, setLevel3)}
        disabled={!selectedIds.l1}
      >
        <SelectTrigger className="bg-white/50">
          {selectedIds.l2 ? (
            level2.find((r) => r.id === selectedIds.l2)?.name
          ) : (
            <span className="text-muted-foreground">选择市</span>
          )}
        </SelectTrigger>
        <SelectContent>
          {level2.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedIds.l3}
        onValueChange={(id) => handleLevelChange(3, id, setLevel4)}
        disabled={!selectedIds.l2}
      >
        <SelectTrigger className="bg-white/50">
          {selectedIds.l3 ? (
            level3.find((r) => r.id === selectedIds.l3)?.name
          ) : (
            <span className="text-muted-foreground">选择区/县</span>
          )}
        </SelectTrigger>
        <SelectContent>
          {level3.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedIds.l4}
        onValueChange={(id) => handleLevelChange(4, id, () => {})}
        disabled={!selectedIds.l3}
      >
        <SelectTrigger className="bg-white/50">
          {selectedIds.l4 ? (
            level4.find((r) => r.id === selectedIds.l4)?.name
          ) : (
            <span className="text-muted-foreground">选择街道/镇</span>
          )}
        </SelectTrigger>
        <SelectContent>
          {level4.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
