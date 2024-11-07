import { sql } from "@/sql";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const rows =
    await sql`SELECT B.*, A.created_at gifted_at FROM gift_person A JOIN gifts B ON A.gift_id = B.id WHERE A.person_id = ${params.id}`;

  return NextResponse.json(rows);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  try {
    if (!body.gift_id) throw new Error("Gift ID is required");

    await sql`INSERT INTO gift_person (person_id, gift_id) VALUES (${params.id}, ${body.gift_id})`;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
}
