import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildRegionPath } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, address, regionId, categoryId, phone, mapUrl, imageUrl } = body;

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    return NextResponse.json({ error: "店名不能为空" }, { status: 400 });
  }

  const [restaurant, regions] = await Promise.all([
    prisma.restaurant.update({
      where: { id },
      data: {
        name: name?.trim(),
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.restaurant.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
