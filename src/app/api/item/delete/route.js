import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (req) => {
  try {
    // Obtener el body de la solicitud (la lista de usuarios a eliminar)
    const body = await req.json();
    const { selectedItems } = body;

    //delte all entries for each item
    const deletedEntries = await Promise.all(
      selectedItems.map(async (item) => {
        const { id } = item;
        return prisma.entryes.deleteMany({ where: { itemId: id } });
      })
    );

    // delete all out
    const deletedOuts = await Promise.all(
      selectedItems.map(async (item) => {
        const { id } = item;
        return prisma.outs.deleteMany({ where: { itemId: id } });
      })
    );

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
