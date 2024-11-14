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

    return new NextResponse(JSON.stringify({ body }));

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
    //
    //
    //
    //
    //
    return new NextResponse(JSON.stringify({ item }));
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "post item - > Unknow error." }),
      { status: 400 }
    );
  }
});
