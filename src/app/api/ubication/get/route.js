import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
const prisma = new PrismaClient();

//get all ubication
export const GET = withAuth(async (req) => {
  const ubication = await prisma.ubication.findMany({
    include: {
      location: true,
      items: true,
    },
  });

  console.log(ubication);

  //reorder latest to oldest
  ubication.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return new NextResponse(JSON.stringify({ ubication }));
});
