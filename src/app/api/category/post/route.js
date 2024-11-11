import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

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
