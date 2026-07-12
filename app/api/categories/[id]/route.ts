import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "分类名称不能为空" }, { status: 400 });
  }

  const existing = await prisma.category.findFirst({
    where: {
      name: name.trim(),
      NOT: { id },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "分类名称已存在" }, { status: 400 });
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name: name.trim() },
  });

  return NextResponse.json(category);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.category.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
