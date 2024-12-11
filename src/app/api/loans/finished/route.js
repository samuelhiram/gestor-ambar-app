import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (req) => {
  try {
    // Obtener el cuerpo de la solicitud
    const body = await req.json();
    const { loanId, userId } = body;

    if (!loanId) {
      return new NextResponse(
        JSON.stringify({ error: "El loanId es requerido" }),
        { status: 400 }
      );
    }

    console.log("Terminando préstamo:", loanId);

    // Obtener los ítems asociados al préstamo
    const loanItems = await prisma.loanItem.findMany({
      where: { loanId },
      select: {
        id: true,
        quantity: true,
        item: {
          select: {
            id: true,
            quantity: true, // Cantidad actual en inventario
            name: true,
          },
        },
      },
    });

    if (!loanItems || loanItems.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No se encontraron ítems para este préstamo" }),
        { status: 404 }
      );
    }

    // Actualizar el inventario sumando las cantidades prestadas
    for (const loanItem of loanItems) {
      const { item, quantity } = loanItem;

      // Actualizar la cantidad en inventario
      await prisma.item.update({
        where: { id: item.id },
        data: {
          quantity: item.quantity + quantity,
        },
      });

      // Crear la entrada correspondiente
      await prisma.entryes.create({
        data: {
          itemId: item.id, // Relación con el ítem
          userId: userId, // Relación con el usuario (asegúrate de que `userId` esté disponible)
          quantity, // Cantidad devuelta
          status: "active", // Puedes cambiar el estado según tus necesidades
        },
      });
    }

    // Actualizar el estado del préstamo a "finished"
    const updatedLoan = await prisma.loans.update({
      where: { id: loanId },
      data: { status: "finished" },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Préstamo terminado exitosamente",
        updatedLoan,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al terminar el préstamo:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al terminar el préstamo" }),
      { status: 500 }
    );
  }
});
