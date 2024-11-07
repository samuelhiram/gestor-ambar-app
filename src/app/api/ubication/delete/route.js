import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
const prisma = new PrismaClient();

//delete a just one ubication
export const DELETE = withAuth(async (req) => {
  const body = await req.json();

  const { id } = body;
  const ubication = await prisma.ubication.delete({
    where: {
      id: id,
    },
  });

  return new NextResponse(JSON.stringify({ ubication }));
});
