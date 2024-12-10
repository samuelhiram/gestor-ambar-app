import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

// Create a new loan
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const { responsibleId, items, userId } = body;

    // Validación de los datos recibidos
    if (
      !responsibleId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Datos inválidos proporcionados" }),
        { status: 400 }
      );
    }

    console.log("Creando préstamo para:", responsibleId, items);

    // Validar y actualizar cantidades de cada item
    for (const item of items) {
      const itemToUpdate = await prisma.item.findUnique({
        where: { id: item.id },
      });

      if (!itemToUpdate) {
        return new NextResponse(
          JSON.stringify({ error: `El item con ID ${item.id} no existe` }),
          { status: 404 }
        );
      }

      if (itemToUpdate.quantity < item.quantity) {
        return new NextResponse(
          JSON.stringify({
            error: `Cantidad insuficiente para el item ${itemToUpdate.name}`,
          }),
          { status: 400 }
        );
      }

      // Reducir cantidad disponible en el inventario
      await prisma.item.update({
        where: { id: item.id },
        data: {
          quantity: itemToUpdate.quantity - item.quantity,
        },
      });
    }

    // Crear el préstamo y registrar las cantidades
    const loan = await prisma.loans.create({
      data: {
        responsibleId,
        loanItems: {
          create: items.map((item) => ({
            itemId: item.id,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        loanItems: true,
      },
    });

    // Crear registros en la tabla `outs` para los movimientos de salida
    for (const item of items) {
      await prisma.outs.create({
        data: {
          itemId: item.id,
          quantity: item.quantity,
          userId,
        },
      });
    }

    return new NextResponse(JSON.stringify({ loan }), { status: 201 });
  } catch (error) {
    console.error("Error creando préstamo:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al crear el préstamo" }),
      { status: 500 }
    );
  }
});
