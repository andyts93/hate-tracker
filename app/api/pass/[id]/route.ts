import { sql } from "@/sql";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const [pass] = await sql`SELECT * FROM passes WHERE id = ${params.id}`;

    if (pass.uses_left <= 0) throw new Error("No uses left");
    await sql`UPDATE passes SET uses_left = uses_left - 1 WHERE id = ${params.id}`;

    return NextResponse.json({ pass }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
