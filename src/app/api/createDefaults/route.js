import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

//create default user with prisma
const prisma = new PrismaClient();

export async function GET() {
  //get user by env email
  if (!process.env.DATABASE_URL) {
    return new NextResponse(
      JSON.stringify({ message: "No DATABASE_URL env variable" })
    );
  }
  const location = await prisma.location.findFirst();
  if (!location) {
    const location = await prisma.location.create({
      data: {
        name: process.env.DEFAULT_USER_LOCATION,
      },
    });
    await prisma.location.create({
      data: {
        name: "Unidad Otay",
      },
    });
    console.log("Default locations created");
    //////////////////////////////////////
    //////////////////////////////////////
    const user = await prisma.user.findUnique({
      where: {
        email: process.env.DEFAULT_USER_EMAIL,
      },
      include: {
        location: true,
      },
    });
    //////////////////////////////////////
    if (!user) {
      const hashedpassword = await bcrypt.hash(
        process.env.DEFAULT_USER_PASSWORD,
        10
      );
      const createdUser = await prisma.user.create({
        data: {
          email: process.env.DEFAULT_USER_EMAIL,
          control_number: process.env.DEFAULT_USER_CONTROL_NUMBER,
          role: process.env.DEFAULT_USER_ROLE,
          fullName: process.env.DEFAULT_USER_FULL_NAME,
          password: hashedpassword,
          locationId: location.id,
        },
      });
      console.log("Default user created");
    } else {
      console.log(
        "default admin user in db: ",
        user.email,
        "user admin location",
        user.location.name
      );
    }
  } else {
    console.log("default location: ", location.name);
  }
  return new NextResponse(JSON.stringify({ message: "Default user created" }), {
    status: 200,
  });
}
