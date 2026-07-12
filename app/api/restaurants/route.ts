import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildRegionPath } from "@/lib/utils";

export async function GET() {
  const [restaurants, regions] = await Promise.all([
    prisma.restaurant.findMany({
      include: {
        category: true,
        region: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.region.findMany(),
  ]);

  const result = restaurants.map((restaurant) => ({
    ...restaurant,
    regionPath: buildRegionPath(restaurant.regionId, regions),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, address, regionId, categoryId, phone, mapUrl, imageUrl } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "店名不能为空" }, { status: 400 });
  }

  const [restaurant, regions] = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: name.trim(),
        address: address?.trim() || null,
        regionId: regionId || null,
        categoryId: categoryId || null,
        phone: phone?.trim() || null,
        mapUrl: mapUrl?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
      },
      include: {
        category: true,
        region: true,
      },
    }),
    prisma.region.findMany(),
  ]);

  return NextResponse.json({
    ...restaurant,
    regionPath: buildRegionPath(restaurant.regionId, regions),
  });
}
