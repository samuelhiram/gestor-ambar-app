import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

//get all ubication
export const GET = withAuth(async (req) => {
  const ubication = await prisma.ubication.findMany({
    include: {
      location: true,
      items: true,
    },
  });

  //reorder latest to oldest
  ubication.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return new NextResponse(JSON.stringify({ ubication }));
});
