import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

//return all units
export const GET = withAuth(async (req) => {
  const units = await prisma.unit.findMany({
    include: {
      item: true,
    },
  });

  //order by latest to oldest
  units.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return new NextResponse(JSON.stringify({ units }));
});
