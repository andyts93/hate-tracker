import { NextResponse } from "next/server";

import { sql } from "@/sql";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (!body.message) throw new Error("Message is required");

    await sql`INSERT INTO rocket_messages (person_id, message) VALUES (${body.person_id}, ${body.message})`;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
}
