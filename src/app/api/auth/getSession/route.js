"use server";
import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

//get session from database
export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url); // Obtén los parámetros de búsqueda
  const userId = searchParams.get("userId");
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      session: true,
      location: true,
    },
  });
  // console.log("-----------------> user", user);
  const session = await prisma.session.findFirst({
    where: {
      userId: userId,
    },
  });

  if (session) {
    //get the actual date
    const now = new Date();
    //get the expiration date
    const expirationDate = new Date(session.expiresAt);

    //if the expiration date is less than the actual date, then return an error
    if (expirationDate < now) {
      //delete the session
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });
      return new NextResponse(JSON.stringify({ message: "Session expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    //delete password from user
    delete user.password;
    return new NextResponse(JSON.stringify({ user }));
  } else {
    //stop the flow
    return new NextResponse(JSON.stringify({ message: "No session found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
});
