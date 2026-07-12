import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "分类名称不能为空" }, { status: 400 });
  }

  const existing = await prisma.category.findFirst({
    where: { name: name.trim() },
  });

  if (existing) {
    return NextResponse.json({ error: "分类名称已存在" }, { status: 400 });
  }

  const maxSortOrder = await prisma.category.aggregate({
    _max: { sortOrder: true },
  });

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1,
    },
  });

  return NextResponse.json(category);
}
