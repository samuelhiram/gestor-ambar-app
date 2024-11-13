import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

//update just one ubication
export const PUT = withAuth(async (req) => {
  const body = await req.json();
  const { id, name } = body;

  const ubication = await prisma.ubication.update({
    where: {
      id: id,
    },
    data: {
      name,
    },
  });

  return new NextResponse(JSON.stringify({ ubication }));
});
