import prisma from "../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { units, categories, ubications } from "./defaultData";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return new NextResponse(
      JSON.stringify({ message: "No DATABASE_URL env variable" }),
      { status: 500 }
    );
  }

  //verificar la tabla units
  const unit = await prisma.unit.findFirst();

  //si no tiene nada
  if (!unit) {
    //crear la tabla
    await prisma.unit.createMany({
      data: units,
    });
    console.log("Default units created");
  } else {
    console.log("Default units already created");
  }

  //verificar la tabla categories

  const category = await prisma.category.findFirst();

  //si no tiene nada

  if (!category) {
    //crear la tabla
    //parsear todos los partidaNumber a strings
    categories.forEach((category) => {
      category.partidaNumber = category.partidaNumber.toString();
    });

    await prisma.category.createMany({
      data: categories,
    });
    console.log("Default categories created");
  } else {
    console.log("Default categories already created");
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

        //si no hay ubications
        //verificar ubications
        const ubication = await prisma.ubication.findFirst();

        //si no tiene nada
        if (!ubication) {
          //crear la tabla
          //añadir a cada ubication el defaultLocation
          //          locationId: defaultLocation.id,

          ubications.forEach((ubication) => {
            ubication.locationId = defaultLocation.id;
          });

          await prisma.ubication.createMany({
            data: ubications,
          });
          console.log("Default ubications created");
        } else {
          console.log("Default ubications already created");
        }

        // Check and create default admin user
        const user = await prisma.user.findFirst({
          where: {
            email: process.env.DEFAULT_USER_EMAIL,
          },
        });
        if (!user) {
          const hashedPassword = await bcrypt.hash(
            process.env.DEFAULT_USER_PASSWORD || "defaultpassword",
            12
          );
          await prisma.user.create({
            data: {
              email: process.env.DEFAULT_USER_EMAIL,
              control_number: process.env.DEFAULT_USER_CONTROL_NUMBER,
              role: process.env.DEFAULT_USER_ROLE,
              fullName: process.env.DEFAULT_USER_FULL_NAME,
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
