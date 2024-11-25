import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const { entries, userId } = body;
    const createdEntries = await prisma.entryes.createMany({
      data: entries.map((entry) => ({
        quantity: entry.value,
        itemId: entry.id,
        userId,
        status: "active",
      })),
    });

    //update quantityes in items
    let updatedItems = [];
    for (const entry of entries) {
      const item = await prisma.item.findUnique({
        where: {
          id: entry.id,
        },
      });
      updatedItems = await prisma.item.update({
        where: {
          id: entry.id,
        },
        data: {
          quantity: item.quantity + entry.value,
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Entries created successfully",
        updatedItems,
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
