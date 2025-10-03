import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async () => {
  const items = await prisma.item.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" }, // evita .reverse()
    select: {
      id: true,
      name: true,
      description: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      // barCode NO se selecciona (equivalente a “remover”)
      unit: { select: { name: true } },
      type: { select: { name: true } },
      category: { select: { name: true, partidaNumber: true } },
      user: { select: { fullName: true } }, // solo lo necesario para aplanar
      ubication: {
        select: {
          name: true,
          location: { select: { name: true } },
        },
      },
      // necesitamos los usuarios completos dentro de entry/outs para mantener compat
      entry: {
        include: { user: true },
        orderBy: { createdAt: "desc" }, // ya vienen ordenados (latest→oldest)
      },
      outs: {
        include: { user: true },
        orderBy: { createdAt: "desc" }, // ya vienen ordenados
      },
      _count: {
        select: { entry: true, outs: true }, // conteos en DB
      },
    },
  });

  const result = items.map((item) => {
    // mismo formateo que usabas (toString().split("GMT")[0])
    const createdAtStr = new Date(item.createdAt).toString().split("GMT")[0];

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      status: item.status,
      updatedAt: item.updatedAt,
      createdAt: createdAtStr,

      // aplanados
      partidaNumber: item.category.partidaNumber,
      unit: item.unit.name,
      type: item.type.name,
      category: item.category.name,
      user: item.user.fullName,
      ubication: item.ubication.name,
      location: item.ubication.location.name,

      // colecciones (ya ordenadas desde la DB)
      entry: item.entry,
      out: item.outs, // alias que conservas para el arreglo de outs

      // conteos (mismo naming que tenías)
      entryes: item._count.entry,
      outs: item._count.outs,
    };
  });

  return NextResponse.json({ items: result });
});
