import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const { outs, userId } = body;
    const createdEntries = await prisma.outs.createMany({
      data: outs.map((out) => ({
        quantity: out.value,
        itemId: out.id,
        userId,
        status: "active",
      })),
    });

    //update quantityes in items
    for (const out of outs) {
      const item = await prisma.item.findUnique({
        where: {
          id: out.id,
        },
      });
      await prisma.item.update({
        where: {
          id: out.id,
        },
        data: {
          quantity: item.quantity - out.value,
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Outs created successfully",
        createdEntries,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "Error",
      }),
      { status: 400 }
    );
  }
});
