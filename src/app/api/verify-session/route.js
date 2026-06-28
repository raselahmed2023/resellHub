import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session) return NextResponse.json(null, { status: 401 });
  return NextResponse.json(session);
}