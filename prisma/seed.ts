import { PrismaClient } from "@prisma/client";
import levelData from "province-city-china/dist/level.json";
import townData from "province-city-china/dist/town.json";

const prisma = new PrismaClient();

type LevelItem = {
  code: string;
  name: string;
  province?: string;
  city?: string;
  area?: string;
  children?: LevelItem[];
};

type TownItem = {
  code: string;
  name: string;
  province: string;
  city: string;
  area: string;
  town: string;
};

async function main() {
  const categories = [
    { id: "寿司", name: "寿司", sortOrder: 0 },
    { id: "烧烤", name: "烧烤", sortOrder: 1 },
    { id: "火锅", name: "火锅", sortOrder: 2 },
    { id: "家常菜", name: "家常菜", sortOrder: 3 },
    { id: "奶茶", name: "奶茶", sortOrder: 4 },
    { id: "咖啡", name: "咖啡", sortOrder: 5 },
  ];

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  const guangdong = (levelData as LevelItem[]).find((item) => item.code === "440000");
  if (!guangdong) {
    throw new Error("未找到广东省行政区划数据");
  }

  const level1 = [{ id: guangdong.code, name: guangdong.name, level: 1, parentId: null }];
  const level2: { id: string; name: string; level: number; parentId: string | null }[] = [];
  const level3: { id: string; name: string; level: number; parentId: string | null }[] = [];

  for (const city of guangdong.children || []) {
    level2.push({ id: city.code, name: city.name, level: 2, parentId: guangdong.code });
    for (const district of city.children || []) {
      level3.push({ id: district.code, name: district.name, level: 3, parentId: city.code });
    }
  }

  const level4 = (townData as TownItem[])
    .filter((town) => town.code.startsWith("44"))
    .map((town) => ({
      id: `${town.code}-${town.town}`,
      name: town.name,
      level: 4,
      parentId: town.code,
    }));

  await prisma.region.createMany({ data: level1, skipDuplicates: true });
  await prisma.region.createMany({ data: level2, skipDuplicates: true });
  await prisma.region.createMany({ data: level3, skipDuplicates: true });
  await prisma.region.createMany({ data: level4, skipDuplicates: true });

  console.log(`Seed completed. 共写入 ${1 + level2.length + level3.length + level4.length} 个地区。`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
