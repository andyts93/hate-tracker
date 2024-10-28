import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (!body.reaction) throw new Error("Reaction is required");

    await sql`INSERT INTO quick_thoughts (person_id, reaction) VALUES (${body.person_id}, ${body.reaction})`;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
}
