import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

// Get all loans superficially
export const GET = withAuth(async () => {
  try {
    // Obtener todos los préstamos con datos básicos
    const loans = await prisma.loans.findMany({
      where: {
        status: "finished", // Filtro para obtener solo préstamos activos
      },
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
        responsible: {
          select: {
            fullName: true, // Incluir solo el nombre completo del responsable
          },
        },
      },
    });

    //format date to locale
    loans.forEach((loan) => {
      loan.createdAt = new Date(loan.createdAt).toLocaleString();
      loan.updatedAt = new Date(loan.updatedAt).toLocaleString();
    });

    // Formatear para devolver un conteo de ítems por préstamo
    const formattedLoans = loans.map((loan) => ({
      id: loan.id,
      responsibleId: loan.responsibleId,
      responsibleName: loan.responsible.fullName || "Sin nombre",
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
      status: loan.status,
      itemsCount: loan.loanItems.length, // Conteo de ítems asociados
    }));

    //reordenar por mar reciente a menos reciente
    formattedLoans.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return new NextResponse(JSON.stringify({ formattedLoans }), {
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
