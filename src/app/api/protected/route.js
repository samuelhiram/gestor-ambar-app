import { NextResponse } from "next/server";
import { VerifyToken } from "../middleware";

export async function GET(req) {
  const authResponse = await VerifyToken(req);

  if (authResponse?.status !== 200) {
    // Si el token no es válido, devolvemos la respuesta de error del middleware
    return authResponse;
  }

  // Si el token es válido, retorna los datos protegidos
  return new Response(
    JSON.stringify({
      message: "Access granted to protected data",
      sensitiveData: "12345",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
