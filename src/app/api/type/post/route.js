import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

//create a just one unit
export const POST = withAuth(async (req) => {
  const body = await req.json();
  const { name } = body;

  const itemType = await prisma.itemType.create({
    data: {
      name,
    },
  });

  return new NextResponse(JSON.stringify({ itemType }));
});
