import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

//get secret key from environment variable
const secretKey = process.env.SECRET_KEY;

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  console.log("email: ", username, "password: ", password);

  if (!username) {
    return NextResponse.json(
      { message: "Username is required" },
      { status: 400 }
    );
  }

  // Genera el token con una expiración de 1 hora
  const token = jwt.sign({ username }, secretKey, { expiresIn: "40s" });

  return NextResponse.json({ token });
}
