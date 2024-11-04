import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
const prisma = new PrismaClient();

//create a new category
export const POST = withAuth(async (req) => {
  const body = await req.json();
  const { partidaNumber, name } = body;

  const category = await prisma.category.create({
    data: {
      partidaNumber,
      name,
    },
  });

  return new NextResponse(JSON.stringify({ category }));
});
