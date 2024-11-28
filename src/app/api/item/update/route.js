import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided or invalid format");
    }
    const updatedItems = [];
    const errors = [];

    for (const item of items) {
      try {
        const {
          id,
          name,
          category,
          description,
          ubicationId,
          typeId,
          unitId,
          code,
        } = item;
        // console.log("item", item);

        if (!id || !name || !category || !ubicationId || !typeId || !unitId) {
          throw new Error(`Invalid data for item with ID: ${id}`);
        }

        const updatedItem = await prisma.item.update({
          where: { id },
          data: {
            name: name.trim(),
            category: { connect: { id: category } },
            description: description?.trim() || null,
            ubication: { connect: { id: ubicationId } },
            type: { connect: { id: typeId } },
            unit: { connect: { id: unitId } },
            barCode: code?.trim() || null,
          },
        });

        updatedItems.push(updatedItem);
      } catch (err) {
        errors.push({ itemId: item?.id || "unknown", error: err.message });
      }
    }

    // Obtener los ítems actualizados con los datos relacionados
    let updatedItemsDb = await prisma.item.findMany({
      where: {
        id: { in: updatedItems.map((item) => item.id) },
      },
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
    });

    //modify the item object save all outs in a object called "listedouts"
    updatedItemsDb = updatedItemsDb.map((item) => {
      return {
        ...item,
        out: item.outs,
      };
    });

    //reorder entryes from latest to oldest
    updatedItemsDb = updatedItemsDb.map((item) => {
      return {
        ...item,
        entry: item.entry.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
    });

    //reorder outs from latest to oldest
    updatedItemsDb = updatedItemsDb.map((item) => {
      return {
        ...item,
        outs: item.outs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
    });

    //count all the item entry
    updatedItemsDb = updatedItemsDb.map((item) => {
      const entry = item.entry.reduce((acc, entry) => acc + entry.quantity, 0);
      return { ...item, entryes: entry };
    });

    //count all the item outs
    updatedItemsDb = updatedItemsDb.map((item) => {
      const outs = item.outs.reduce((acc, out) => acc + out.quantity, 0);
      return { ...item, outs };
    });

    //remove barCode field
    updatedItemsDb = updatedItemsDb.map((item) => {
      const { barCode, ...rest } = item;
      return rest;
    });

    //make all a json of 1 level
    updatedItemsDb = updatedItemsDb.map((item) => {
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
    updatedItemsDb = updatedItemsDb.map((item) => {
      return {
        ...item,
        createdAt: new Date(item.createdAt).toString().split("GMT")[0],
      };
    });
    //reorder from newest to oldest
    updatedItemsDb = updatedItemsDb.reverse();

    //reorder entryes from latest to oldest
    updatedItemsDb = updatedItemsDb.map((item) => {
      return {
        ...item,
        entry: item.entry.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
      };
    });

    return new NextResponse(
      JSON.stringify({
        updatedItemsDb,
      })
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
