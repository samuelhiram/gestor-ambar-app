import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
const prisma = new PrismaClient();

//create a just one ubication
export const POST = withAuth(async (req) => {
  const body = await req.json();
  const { name, location } = body;

  const ubication = await prisma.ubication.create({
    data: {
      name,
      //connect with location
      location: {
        connect: {
          id: location,
        },
      },
    },
  });

  return new NextResponse(JSON.stringify({ ubication }));
});
