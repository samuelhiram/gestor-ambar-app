import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

// Crear un nuevo item
export const POST = withAuth(async (req) => {
  const body = await req.json();

  try {
    var {
      barCode,
      name,
      description,
      quantity,
      unitId,
      typeId,
      categoryId,
      userId,
      ubicationId,
    } = body;

    // Validar que los campos requeridos están presentes
    if (
      !name ||
      !quantity ||
      !unitId ||
      !typeId ||
      !categoryId ||
      !userId ||
      !ubicationId
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Todos los campos son obligatorios." }),
        { status: 400 }
      );
    }

    // Convertir quantity a número si es necesario
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity)) {
      return new NextResponse(
        JSON.stringify({ error: "Quantity debe ser un número válido." }),
        { status: 400 }
      );
    }

    //si string de barcode es una cadena vacia, asignar null
    if (barCode === "") {
      barCode = null;
    }

    // Crear el item en la base de datos conectando las relaciones
    try {
      const item = await prisma.item.create({
        data: {
          barCode,
          name,
          description,
          quantity: parsedQuantity,
          unit: { connect: { id: unitId } }, // Conectar con unidad
          type: { connect: { id: typeId } }, // Conectar con tipo
          category: { connect: { id: categoryId } }, // Conectar con categoría
          user: { connect: { id: userId } }, // Conectar con usuario
          ubication: { connect: { id: ubicationId } }, // Conectar con ubicación
        },
      });
      return new NextResponse(JSON.stringify({ item }), { status: 201 });
    } catch (error) {
      console.error("Error al crear el item", error);
      return new NextResponse(
        JSON.stringify({ error: "Error al crear el item." }),
        { status: 500 }
      );
    }
    // Respuesta exitosa
  } catch (error) {
    console.error("Error al crear el item", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al crear el item." }),
      { status: 500 }
    );
  }
});
