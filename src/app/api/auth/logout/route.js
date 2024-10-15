import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
import { getIdByReqHeaders } from "../../getId";
//get secret key from environment variable
const secretKey = process.env.SECRET_KEY;
const prisma = new PrismaClient();
export const POST = withAuth(async (req) => {
  try {
    //get token from req headers
    // const authHeader = req.headers.get("Authorization");
    // const token = authHeader?.split(" ")[1];
    // const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = getIdByReqHeaders(req);
    // Borrar todas las sesiones anteriores del usuario
    await prisma.session.deleteMany({
      where: {
        userId: userId,
      },
    });
    // Registrar el logout en el log
    await prisma.log.create({
      data: {
        userId: userId,
        action: "sesión terminada",
      },
    });
    return new NextResponse(JSON.stringify({ message: "logout" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST /login:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
      }
    );
  }
});
