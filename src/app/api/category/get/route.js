import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
const prisma = new PrismaClient();

//get all categories
export const GET = withAuth(async (req) => {
  const categories = await prisma.category.findMany();
  return new NextResponse(JSON.stringify({ categories }));
});
