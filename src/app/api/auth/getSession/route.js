"use server";
import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

//get secret key from environment variable
const prisma = new PrismaClient();

//get session from database
export async function GET(req) {
  //get userId from req
  // console.log(req);

  const userId = req.userId;

  //get user from database
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  //search session in database
  const session = await prisma.session.findFirst({
    where: {
      userId: userId,
    },
  });

  //if hass session return the token session
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

    return new NextResponse(JSON.stringify({ user }));
  } else {
    //stop the flow
    return new NextResponse(JSON.stringify({ message: "No session found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
