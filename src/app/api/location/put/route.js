import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";
export const PUT = withAuth(async (req) => {
  try {
    //get the body of the request
    const body = await req.json();
    const unit = body;

    var { id, name } = unit;
    //trim all the values
    name = name.trim();
    //capitalize name
    name = name.toLowerCase();
    name = name.replace(/\b\w/g, (l) => l.toUpperCase());

    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        name,
      },
    });
    return new NextResponse(JSON.stringify({ updatedLocation }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
