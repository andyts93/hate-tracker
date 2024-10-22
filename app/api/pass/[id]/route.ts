import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { rows: [record] } = await sql`SELECT * FROM passes WHERE id = ${params.id}`;
    if (record.uses_left <= 0) throw new Error("No uses left");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: params.id }, { status: 201 });
}
