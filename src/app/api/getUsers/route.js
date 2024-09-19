import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

export async function POST(req) {
  console.log("--api--> register");
  const body = await req.json();
  const { email, control_number, role, fullName, location, password } = body;
  const hashedpassword = await bcrypt.hash(password, 10);
  //create user in database
  const user = await prisma.user.create({
    data: {
      email: email,
      control_number: control_number,
      role: role,
      fullName: fullName,
      location: location,
      password: hashedpassword,
    },
  });

  if (user) {
    console.log("user: ", user);
  }

  return NextResponse.json({ message: "logging..." });
}
