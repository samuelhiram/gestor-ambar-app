import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

//create a just one ubication
export const POST = withAuth(async (req) => {
  const body = await req.json();
  var { name } = body;

  //capitalize all name consider spaces
  name = name
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");

  const responsible = await prisma.responsible.create({
    data: {
      fullName: name,
    },
  });

  return new NextResponse(JSON.stringify({ responsible }));
});
