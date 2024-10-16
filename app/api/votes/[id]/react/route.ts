import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  try {
    if (!body.key) throw new Error("Reaction is required");
    await sql`UPDATE records SET reaction = ${body.key} WHERE id = ${params.id}`;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: params.id }, { status: 201 });
}
