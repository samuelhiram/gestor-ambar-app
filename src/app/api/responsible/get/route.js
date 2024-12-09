import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req) => {
  let responsibles = await prisma.responsible.findMany({});
  responsibles = responsibles.map((responsible) => {
    return {
      ...responsible,
      createdAt: new Date(responsible.createdAt).toString().split("GMT")[0],
    };
  });
  responsibles = responsibles.reverse();
  return new NextResponse(JSON.stringify({ responsibles }));
});
