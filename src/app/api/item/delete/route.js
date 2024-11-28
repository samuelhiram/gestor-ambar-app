import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (req) => {
  try {
    // Obtener el body de la solicitud (la lista de usuarios a eliminar)
    const body = await req.json();
    const { selectedItems } = body;

    const deletedItems = await prisma.item.deleteMany({
      where: { id: { in: selectedItems.map((item) => item) } },
    });
    return new NextResponse(JSON.stringify({ deletedItems }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
