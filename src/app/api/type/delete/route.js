import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const DELETE = withAuth(async (req) => {
  try {
    const body = await req.json();
    const type = body;
    const { id } = type;
    const deletedType = await prisma.itemType.delete({
      where: { id },
    });
    return new NextResponse(JSON.stringify({ deletedType }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
