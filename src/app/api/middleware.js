import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const secretKey = process.env.SECRET_KEY; // Cambia a tu clave secreta real
const prisma = new PrismaClient();

export async function VerifyToken(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  console.log("Token:", token);

  if (!token) {
    // Si no hay token, devolvemos un error 401 y detenemos el flujo
    return new NextResponse(
      JSON.stringify({ message: "No token provided, access denied" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // select token in session model
  // const session = await prisma.session.findFirst({
  //   where: {
  //     token: token,
  //   },
  // });

  // if (!session) {
  //   // Si no hay token, devolvemos un error 401 y detenemos el flujo
  //   return new NextResponse(
  //     JSON.stringify({ message: "No token provided, access denied" }),
  //     { status: 401, headers: { "Content-Type": "application/json" } }
  //   );
  // } else {
  //   //si la sesion existe pero expiro
  //   if (new Date() > session.expires) {
  //     //delete token from database
  //     await prisma.session.delete({ where: { id: session.id } });
  //     return new NextResponse(JSON.stringify({ message: "Token expired" }), {
  //       status: 401,
  //       headers: { "Content-Type": "application/json" },
  //     });
  //   }
  // }

  try {
    // Verificamos el token
    jwt.verify(token, secretKey);
    // Si el token es válido, continua
    return new NextResponse(JSON.stringify({ message: "Token verified" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // Si el token es inválido, devolvemos un error 403 y detenemos el flujo
    //delete token from database
    // await prisma.session.delete({ where: { id: session.id } });

    return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
}
