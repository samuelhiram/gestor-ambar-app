import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
const prisma = new PrismaClient();

export const DELETE = withAuth(async (req) => {
  try {
    const body = await req.json();
    const unit = body;
    const { id } = unit;
    const deletedUnit = await prisma.unit.delete({
      where: { id },
    });
    return new NextResponse(JSON.stringify({ deletedUnit }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
