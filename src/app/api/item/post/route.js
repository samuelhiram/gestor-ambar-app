import prisma from "../../lib/prisma";

import { NextResponse } from "next/server";

import { withAuth } from "@/lib/withAuth";

//create a new category
export const POST = withAuth(async (req) => {
  //
  const body = await req.json();
  //
  try {
    const {
      barCode,
      name,
      description,
      quantity,
      unitId,
      typeId,
      categoryId,
      locationId,
      userId,
      ubicationId,
    } = body;
    // Crear un nuevo Item en la base de datos
    const item = await prisma.item.create({
      data: {
        barCode,
        name,
        description,
        quantity,
        unitId,
        typeId,
        categoryId,
        locationId,
        userId,
        ubicationId,
      },
    });
    //
    res.status(201).json(item); // Devuelve el objeto creado
  } catch (error) {
    res.status(500).json({ error: "Error creando el Item" });
  }
  return new NextResponse(JSON.stringify({ category }));
});
