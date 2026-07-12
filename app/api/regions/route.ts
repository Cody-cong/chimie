import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hasParentId = searchParams.has("parentId");
  const parentId = searchParams.get("parentId");

  const regions = await prisma.region.findMany({
    where: hasParentId
      ? { parentId: parentId === "null" || parentId === null ? null : parentId }
      : undefined,
    orderBy: { name: "asc" },
  });

  return NextResponse.json(regions);
}
