import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

// Get all loans superficially
export const GET = withAuth(async () => {
  try {
    // Obtener todos los préstamos con datos básicos
    const loans = await prisma.loans.findMany({
      select: {
        id: true,
        responsibleId: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        loanItems: {
          select: {
            id: true,
          },
        },
      },
      include: {
        responsible: { select: { name: true } },
      },
    });

    // Formatear para devolver un conteo de ítems por préstamo
    const formattedLoans = loans.map((loan) => ({
      id: loan.id,
      responsibleId: loan.responsibleId,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
      status: loan.status,
      itemsCount: loan.loanItems.length, // Conteo de ítems asociados
    }));

    return new NextResponse(JSON.stringify({ loans: formattedLoans }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error obteniendo préstamos:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al obtener los préstamos" }),
      { status: 500 }
    );
  }
});
