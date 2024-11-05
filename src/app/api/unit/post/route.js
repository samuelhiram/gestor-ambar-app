import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
const prisma = new PrismaClient();

//create a just one unit
export const POST = withAuth(async (req) => {
  const body = await req.json();
  const { name } = body;

  const unit = await prisma.unit.create({
    data: {
      name,
    },
  });

  return new NextResponse(JSON.stringify({ unit }));
});
