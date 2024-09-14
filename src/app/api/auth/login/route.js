import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

//get secret key from environment variable
const secretKey = process.env.SECRET_KEY;
const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;
  console.log("email: ", email, "password: ", password);

  //search user in database
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  //verify that user exists
  if (!user) {
    console.log("--> user not found");
    return NextResponse.json({ invalidCredentials: true }, { status: 400 });
  }

  if (password !== user.password) {
    console.log("--> password incorrect");
    return NextResponse.json({ invalidCredentials: true }, { status: 400 });
  }

  const userId = user.id;

  const token = jwt.sign({ userId }, secretKey, { expiresIn: "40s" });

  return NextResponse.json({ access_token: token });
}
