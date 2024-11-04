import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";

const prisma = new PrismaClient();

//delete just one category
export const DELETE = withAuth(async (req) => {
  try {
    //get the body of the request
    const body = await req.json();
    const category = body;

    var { id } = category;

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });
    return new NextResponse(JSON.stringify({ deletedCategory }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
