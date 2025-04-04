import { NextResponse } from "next/server";

import { sql } from "@/sql";
import { cache } from "@/cache";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  try {
    if (!body.key && !body.gif) throw new Error("Reaction is required");
    const [vote] = await sql`SELECT * FROM records WHERE id = ${params.id}`;

    if (body.key) {
      await sql`UPDATE records SET reaction = ${body.key} WHERE id = ${params.id}`;
    } else {
      await sql`UPDATE records SET gif_reaction = ${body.gif} WHERE id = ${params.id}`;
    }

    await cache.del(`graph-${vote.person_id}`);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: params.id }, { status: 201 });
}
