"use server";
import { NextResponse } from "next/server";
import { VerifyToken } from "../../middleware";

import { PrismaClient } from "@prisma/client";

//get secret key from environment variable
const prisma = new PrismaClient();

//get session from database
export async function GET(req) {
  const authResponse = VerifyToken(req);

  if (authResponse?.status !== 200) {
    // Si el token no es válido, devolvemos la respuesta de error del middleware
    return authResponse;
  }

  //get userId from req
  const userId = req.userId;

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

    return NextResponse.json({ token: session.token });
  } else {
    //stop the flow
    return new NextResponse(JSON.stringify({ message: "No session found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
