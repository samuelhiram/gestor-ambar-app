import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (req) => {
  try {
    // Obtener el body de la solicitud (la lista de usuarios a eliminar)
    const body = await req.json();
    const { selectedItems } = body;

    console.log(selectedItems);

    //update all status to inactive
    for (let i = 0; i < selectedItems.length; i++) {
      await prisma.item.update({
        where: {
          id: selectedItems[i],
        },
        data: {
          status: "inactive",
        },
      });
    }

    return new NextResponse(JSON.stringify({ message: "ok" }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
