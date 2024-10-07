import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const secretKey = process.env.SECRET_KEY; // Cambia a tu clave secreta real

export function withAuth(handler) {
  return async (req) => {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return new NextResponse(JSON.stringify({ message: "Token missing" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // Verificar el token
      jwt.verify(token, secretKey);
      // Ejecuta el handler si la verificación fue exitosa
      return handler(req);
    } catch (error) {
      return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}
