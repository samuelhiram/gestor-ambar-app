import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY; // Cambia a tu clave secreta real

export function VerifyToken(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  console.log("Token:", token);

  if (!token) {
    // Si no hay token, devolvemos un error 401 y detenemos el flujo
    return new NextResponse(
      JSON.stringify({ message: "No token provided, access denied" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Verificamos el token
    jwt.verify(token, secretKey);
    // Si el token es válido, continua
    return NextResponse.next();
  } catch (err) {
    // Si el token es inválido, devolvemos un error 403 y detenemos el flujo
    return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
}
