import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

//create default user with prisma
const prisma = new PrismaClient();

export async function GET() {
  //get user by env email
  const user = await prisma.user.findUnique({
    where: {
      email: process.env.DEFAULT_USER_EMAIL,
    },
  });
  if (!user) {
    const hashedpassword = await bcrypt.hash(
      process.env.DEFAULT_USER_PASSWORD,
      10
    );
    await prisma.user.create({
      data: {
        email: process.env.DEFAULT_USER_EMAIL,
        control_number: process.env.DEFAULT_USER_CONTROL_NUMBER,
        role: process.env.DEFAULT_USER_ROLE,
        fullName: process.env.DEFAULT_USER_FULL_NAME,
        location: process.env.DEFAULT_USER_LOCATION,
        password: hashedpassword,
      },
    });
    console.log("Default user created");
  } else {
    console.log("default user: ", user.email);
  }

  return NextResponse.json({ message: "Default user created" });
}
