import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secretKey = "yourSecretKey";

export function middleware(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { message: "No token provided, access denied" },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, secretKey);
    return NextResponse.next(); // Permite continuar si el token es válido
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
}
