import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const secretKey = process.env.SECRET_KEY; // Cambia a tu clave secreta real

export async function middleware(req) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Verificamos el token
    jwt.verify(token, secretKey);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Aplica el middleware solo a ciertas rutas
export const config = {
  matcher: ["/api/:path*"], // Aplica solo a las rutas dentro de /api
};
