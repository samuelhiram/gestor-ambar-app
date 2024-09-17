import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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
    console.log("--api--> user not found");
    return NextResponse.json({ invalidCredentials: true }, { status: 400 });
  }

  //verify password with bcrypt

  if (!(await bcrypt.compare(password, user.password))) {
    console.log("--api--> password incorrect");
    return NextResponse.json({ invalidCredentials: true }, { status: 400 });
  }

  console.log("--api--> user found, login success");
  const userId = user.id;

  const token = jwt.sign({ userId }, secretKey, { expiresIn: "40s" });

  //get actual date
  const date = new Date();
  //add 40 seconds to the actual date
  const expires = new Date(date.getTime() + 40 * 1000);

  ///delete all sessions of the user
  await prisma.session.deleteMany({
    where: {
      userId: userId,
    },
  });

  //create session

  await prisma.session.create({
    data: {
      userId: userId,
      token: token,
      expiresAt: expires,
    },
  });

  //add to the log the login of the user
  await prisma.log.create({
    data: {
      userId: userId,
      action: "login",
    },
  });

  return NextResponse.json({ userId: userId, token: token });
}
