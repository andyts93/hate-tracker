import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (!body.person_id) throw new Error("Person ID is mandatory");
    await sql`INSERT INTO visits (person_id, auth_cookie) VALUES (${body.person_id}, ${body.auth_cookie})`;
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({}, { status: 201 });
}
