import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

//update just one category
export const PUT = withAuth(async (req) => {
  try {
    //get the body of the request
    const body = await req.json();
    const category = body;

    var { id, name, partidaNumber } = category;
    //trim all the values
    name = name.trim();
    //capitalize name
    name = name.toLowerCase();
    name = name.replace(/\b\w/g, (l) => l.toUpperCase());

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        partidaNumber,
      },
    });
    return new NextResponse(JSON.stringify({ updatedCategory }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
