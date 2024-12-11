import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

// Get all items of a loan with their loaned quantities
export const POST = withAuth(async (req) => {
  try {
    // Obtener el cuerpo de la solicitud
    const body = await req.json();
    const loanId = body;

    console.log("Obteniendo ítems del préstamo:", loanId);

    if (!loanId) {
      return new NextResponse(
        JSON.stringify({ error: "El loanId es requerido" }),
        { status: 400 }
      );
    }

    // Consultar los ítems del préstamo
    const loanItems = await prisma.loanItem.findMany({
      where: { loanId },
      select: {
        id: true,
        quantity: true,
        item: {
          select: {
            id: true,
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

    //get the responsible name by the loan id
    const loan = await prisma.loans.findUnique({
      where: {
        id: loanId,
      },
      select: {
        responsible: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    // Formatear la respuesta
    var formattedItems = loanItems.map((loanItem) => ({
      id: loanItem.item.id,
      name: loanItem.item.name,
      quantityLoaned: loanItem.quantity,
    }));

    // obtener las cantidades de los ítems desde el modelo
    var items = await prisma.item.findMany({
      where: {
        id: {
          in: formattedItems.map((item) => item.id),
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    // include item stock quantity by each items from
    formattedItems = formattedItems.map((item) => {
      const itemStock = items.find((i) => i.id === item.id);
      return {
        ...item,
        quantityStock: itemStock.quantity,
      };
    });

    // const responsibleName = loan.responsible.fullName;
    const responsibleId = loan.responsible.id;

    return new NextResponse(JSON.stringify({ responsibleId, formattedItems }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error obteniendo ítems del préstamo:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al obtener los ítems del préstamo" }),
      { status: 500 }
    );
  }
});
