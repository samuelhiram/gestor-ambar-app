import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();

    const { outs, userId } = body;

    const createdOuts = await prisma.outs.createMany({
      data: outs.map((out) => ({
        quantity: out.value,
        itemId: out.id,
        userId,
        status: "active",
      })),
    });

    var updatedOutsItems = await prisma.item.findMany({
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
          in: outs.map((out) => out.id),
        },
      },
    });

    //modify the item object save all outs in a object called "listedouts"
    updatedOutsItems = updatedOutsItems.map((item) => {
      return {
        ...item,
        out: item.outs,
      };
    });

    //reorder entryes from latest to oldest
    updatedOutsItems = updatedOutsItems.map((item) => {
      return {
        ...item,
        entry: item.entry.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
    });

    //reorder outs from latest to oldest
    updatedOutsItems = updatedOutsItems.map((item) => {
      return {
        ...item,
        outs: item.outs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
    });

    //count all the item entry
    updatedOutsItems = updatedOutsItems.map((item) => {
      const entry = item.entry.reduce((acc, entry) => acc + 1, 0);
      return { ...item, entryes: entry };
    });

    //count all the item outs
    updatedOutsItems = updatedOutsItems.map((item) => {
      const outs = item.outs.reduce((acc, out) => acc + 1, 0);
      return { ...item, outs };
    });

    //remove barCode field
    updatedOutsItems = updatedOutsItems.map((item) => {
      const { barCode, ...rest } = item;
      return rest;
    });

    //make all a json of 1 level
    updatedOutsItems = updatedOutsItems.map((item) => {
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
    updatedOutsItems = updatedOutsItems.map((item) => {
      return {
        ...item,
        createdAt: new Date(item.createdAt).toString().split("GMT")[0],
      };
    });
    //reorder from newest to oldest
    updatedOutsItems = updatedOutsItems.reverse();

    //reorder entryes from latest to oldest
    updatedOutsItems = updatedOutsItems.map((item) => {
      return {
        ...item,
        entry: item.entry.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
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
        updatedOutsItems,
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
