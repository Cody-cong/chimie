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

const OLD_REGION_ID_MAP: Record<string, string> = {
  "region-guangdong": "440000",
  "region-foshan": "440600",
  "region-shunde": "440606",
  "region-lunjiao": "440606-003000",
};

async function main() {
  // 分类
  const categories = [
    { name: "寿司", sortOrder: 0 },
    { name: "烧烤", sortOrder: 1 },
    { name: "火锅", sortOrder: 2 },
    { name: "家常菜", sortOrder: 3 },
    { name: "奶茶", sortOrder: 4 },
    { name: "咖啡", sortOrder: 5 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.name },
      update: {},
      create: {
        id: category.name,
        name: category.name,
        sortOrder: category.sortOrder,
      },
    });
  }

  // 构建广东四级行政区划数据
  const guangdong = (levelData as LevelItem[]).find((item) => item.code === "440000");
  if (!guangdong) {
    throw new Error("未找到广东省行政区划数据");
  }

  const regions: { id: string; name: string; level: number; parentId: string | null }[] = [];

  // 省
  regions.push({ id: guangdong.code, name: guangdong.name, level: 1, parentId: null });

  // 市、区县
  for (const city of guangdong.children || []) {
    regions.push({
      id: city.code,
      name: city.name,
      level: 2,
      parentId: guangdong.code,
    });

    for (const district of city.children || []) {
      regions.push({
        id: district.code,
        name: district.name,
        level: 3,
        parentId: city.code,
      });
    }
  }

  // 乡镇/街道
  const guangdongTowns = (townData as TownItem[]).filter((town) => town.code.startsWith("44"));
  for (const town of guangdongTowns) {
    regions.push({
      id: `${town.code}-${town.town}`,
      name: town.name,
      level: 4,
      parentId: town.code,
    });
  }

  // 写入新的行政区划数据
  for (const region of regions) {
    await prisma.region.upsert({
      where: { id: region.id },
      update: {
        name: region.name,
        level: region.level,
        parentId: region.parentId,
      },
      create: region,
    });
  }

  // 将旧 region id 关联的餐厅迁移到新 id
  for (const [oldId, newId] of Object.entries(OLD_REGION_ID_MAP)) {
    await prisma.restaurant.updateMany({
      where: { regionId: oldId },
      data: { regionId: newId },
    });
  }

  // 清理不再使用的旧 region 记录
  await prisma.region.deleteMany({
    where: { id: { in: Object.keys(OLD_REGION_ID_MAP) } },
  });

  console.log(`Seed completed. 共写入 ${regions.length} 个地区。`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
