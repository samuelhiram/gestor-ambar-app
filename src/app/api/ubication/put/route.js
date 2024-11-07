import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
const prisma = new PrismaClient();

//update just one ubication
export const PUT = withAuth(async (req) => {
  const body = await req.json();
  const { id, name } = body;

  const ubication = await prisma.ubication.update({
    where: {
      id: id,
    },
    data: {
      name,
    },
  });

  return new NextResponse(JSON.stringify({ ubication }));
});
