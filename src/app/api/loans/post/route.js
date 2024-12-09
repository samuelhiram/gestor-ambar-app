import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

// Create a new loan
export const POST = withAuth(async (req) => {
  const body = await req.json();
  const { responsibleId, items } = body;

  if (!responsibleId || !items || !Array.isArray(items)) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid data provided" }),
      { status: 400 }
    );
  }

  //por cada item modificar la cantidad en la tabla de items
  for (let i = 0; i < items.length; i++) {
    const item = await prisma.item.findUnique({
      where: {
        id: items[i],
      },
    });
    if (!item) {
      return new NextResponse(JSON.stringify({ error: "Item not found" }), {
        status: 404,
      });
    }
    if (item.quantity === 0) {
      return new NextResponse(JSON.stringify({ error: "Item out of stock" }), {
        status: 400,
      });
    }
    await prisma.items.update({
      where: {
        id: items[i],
      },
      data: {
        quantity: item.quantity - items[i].quantity,
      },
    });
  }

  try {
    const loan = await prisma.loans.create({
      data: {
        responsibleId,
        item: {
          connect: items.map((id) => ({ id })),
        },
      },
      include: {
        responsible: true,
        item: true,
      },
    });

    return new NextResponse(JSON.stringify({ loan }), { status: 201 });
  } catch (error) {
    console.error("Error creating loan:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create loan" }),
      { status: 500 }
    );
  }
});
