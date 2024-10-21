import { sql } from "@vercel/postgres";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (!body.title) throw new Error("Title is required");
    if (!body.conditions) throw new Error("Conditions is required");
    if (!body.uses_max) throw new Error("Uses is required");

    await sql`INSERT INTO passes (person_id, title, icon, conditions, uses_max, expires_at, uses_left) VALUES (${body.person_id}, ${body.title}, ${body.icon}, ${body.conditions}, ${body.uses_max}, ${body.expires}, ${body.uses_max})`;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
}
