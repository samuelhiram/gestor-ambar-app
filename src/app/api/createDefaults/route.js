import prisma from "../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return new NextResponse(
      JSON.stringify({ message: "No DATABASE_URL env variable" }),
      { status: 500 }
    );
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // Check and create default item types
      const itemType = await prisma.itemType.findFirst();
      if (!itemType) {
        await prisma.itemType.createMany({
          data: [{ name: "Herramienta" }, { name: "Insumo" }],
        });
        console.log("Default item types created");
      }

      // Check and create default locations
      const location = await prisma.location.findFirst();
      if (!location) {
        const defaultLocation = await prisma.location.create({
          data: {
            name: process.env.DEFAULT_USER_LOCATION || "Default Location",
          },
        });
        await prisma.location.create({
          data: { name: "Unidad Otay" },
        });
        console.log("Default locations created");

        // Check and create default admin user
        const user = await prisma.user.findFirst({
          where: {
            email: process.env.DEFAULT_USER_EMAIL,
          },
        });
        if (!user) {
          const hashedPassword = await bcrypt.hash(
            process.env.DEFAULT_USER_PASSWORD || "defaultpassword",
            10
          );
          await prisma.user.create({
            data: {
              email: process.env.DEFAULT_USER_EMAIL,
              control_number: process.env.DEFAULT_USER_CONTROL_NUMBER,
              role: process.env.DEFAULT_USER_ROLE || "admin",
              fullName: process.env.DEFAULT_USER_FULL_NAME || "Admin User",
              password: hashedPassword,
              locationId: defaultLocation.id,
            },
          });
          console.log("Default user created");
        } else {
          console.log("Default admin user already exists: ", user.email);
        }
      } else {
        console.log("Default locations already created");
      }
    });

    return new NextResponse(
      JSON.stringify({ message: "Default data setup complete" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error setting up default data:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error setting up default data" }),
      { status: 500 }
    );
  }
}
