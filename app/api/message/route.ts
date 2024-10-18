import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);

  try {
    if (!body.message) throw new Error("Message is required");
    if (!body.person_id) throw new Error("Person ID is required");

    await sql`INSERT INTO messages (text, person_id) VALUES (${body.message}, ${body.person_id})`;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
}
