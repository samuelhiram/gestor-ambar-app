import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const DELETE = withAuth(async (req) => {
  try {
    const body = await req.json();
    const responsible = body;
    const { id } = responsible;
    const deletedResponsible = await prisma.responsible.delete({
      where: { id },
    });
    return new NextResponse(JSON.stringify({ deletedResponsible }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
