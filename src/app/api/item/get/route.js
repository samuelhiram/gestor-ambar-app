import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req) => {
  let items = await prisma.item.findMany({
    include: {
      entry: true,
      outs: true,
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
        },
      },
    },
  });

  //reorder entryes from latest to oldest
  items = items.map((item) => {
    return {
      ...item,
      entry: item.entry.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    };
  });

  //reorder outs from latest to oldest
  items = items.map((item) => {
    return {
      ...item,
      outs: item.outs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    };
  });

  //count all the item entry
  items = items.map((item) => {
    const entry = item.entry.reduce((acc, entry) => acc + entry.quantity, 0);
    return { ...item, entryes: entry };
  });

  //count all the item outs
  items = items.map((item) => {
    const outs = item.outs.reduce((acc, out) => acc + out.quantity, 0);
    return { ...item, outs };
  });

  //remove barCode field
  items = items.map((item) => {
    const { barCode, ...rest } = item;
    return rest;
  });

  //make all a json of 1 level
  items = items.map((item) => {
    return {
      ...item,
      partidaNumber: item.category.partidaNumber,
      unit: item.unit.name,
      type: item.type.name,
      category: item.category.name,
      user: item.user.name,
      ubication: item.ubication.name,
    };
  });

  //reformat createdAt date
  items = items.map((item) => {
    return {
      ...item,
      createdAt: new Date(item.createdAt).toString().split("GMT")[0],
    };
  });
  //reorder from newest to oldest
  items = items.reverse();
  return new NextResponse(JSON.stringify({ items }));
});
