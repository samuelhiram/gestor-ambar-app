import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req) => {
  let items = await prisma.item.findMany({
    include: {
      unit: true,
      type: true,
      category: true,
      user: true,
      ubication: true,
    },
  });
  //reformat createdAt date
  items = items.map((item) => {
    return {
      ...item,
      createdAt: new Date(item.createdAt).toString().split("GMT")[0],
    };
  });
  //reorder from newest to oldest
  items = items.reverse();
  return new NextResponse(JSON.stringify({ items }));
});
