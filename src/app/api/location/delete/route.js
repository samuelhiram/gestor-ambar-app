import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const DELETE = withAuth(async (req) => {
  try {
    const body = await req.json();
    const location = body;
    const { id } = location;
    const deletedLocation = await prisma.location.delete({
      where: { id },
    });
    return new NextResponse(JSON.stringify({ deletedLocation }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
