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

    //get the item that was updated in them entryes
    var updatedEntryeItems = await prisma.item.findMany({
      include: {
        entry: {
          include: {
            user: true,
          },
        },
        outs: {
          include: {
            user: true,
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
        type: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
            partidaNumber: true,
          },
        },
        user: true,
        ubication: {
          select: {
            name: true,
            location: true,
          },
        },
      },
      where: {
        id: {
          in: entries.map((entry) => entry.id),
        },
      },
    });

    //modify the item object save all outs in a object called "listedouts"
    updatedEntryeItems = updatedEntryeItems.map((item) => {
      return {
        ...item,
        out: item.outs,
      };
    });

    //reorder entryes from latest to oldest
    updatedEntryeItems = updatedEntryeItems.map((item) => {
      return {
        ...item,
        entry: item.entry.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
    });

    //reorder outs from latest to oldest
    updatedEntryeItems = updatedEntryeItems.map((item) => {
      return {
        ...item,
        outs: item.outs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
    });

    //count all the item entry
    updatedEntryeItems = updatedEntryeItems.map((item) => {
      const entry = item.entry.reduce((acc, entry) => acc + 1, 0);
      return { ...item, entryes: entry };
    });

    //count all the item outs
    updatedEntryeItems = updatedEntryeItems.map((item) => {
      const outs = item.outs.reduce((acc, out) => acc + 1, 0);
      return { ...item, outs };
    });

    //remove barCode field
    updatedEntryeItems = updatedEntryeItems.map((item) => {
      const { barCode, ...rest } = item;
      return rest;
    });

    //make all a json of 1 level
    updatedEntryeItems = updatedEntryeItems.map((item) => {
      return {
        ...item,
        partidaNumber: item.category.partidaNumber,
        unit: item.unit.name,
        type: item.type.name,
        category: item.category.name,
        user: item.user.fullName,
        ubication: item.ubication.name,
        location: item.ubication.location.name,
      };
    });

    //reformat createdAt date
    updatedEntryeItems = updatedEntryeItems.map((item) => {
      return {
        ...item,
        createdAt: new Date(item.createdAt).toString().split("GMT")[0],
      };
    });
    //reorder from newest to oldest
    updatedEntryeItems = updatedEntryeItems.reverse();

    //reorder entryes from latest to oldest
    updatedEntryeItems = updatedEntryeItems.map((item) => {
      return {
        ...item,
        entry: item.entry.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
    });

    //update quantityes in updatedEntryeItems
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
        updatedEntryeItems,
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
