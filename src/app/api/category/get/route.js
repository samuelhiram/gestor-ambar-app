import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

//get all categories
export const GET = withAuth(async (req) => {
  const categories = await prisma.category.findMany();

  //order by latest to oldest
  categories.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return new NextResponse(JSON.stringify({ categories }));
});
