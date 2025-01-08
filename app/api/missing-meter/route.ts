import { NextResponse } from "next/server";

import { sql } from "@/sql";
import { cache } from "@/cache";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (!body.score) throw new Error("Score is required");

    await sql`INSERT INTO missing_meter (person_id, score) VALUES (${body.person_id}, ${body.score})`;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  await cache.del(`missingmeter-${body.person_id}`);

  return NextResponse.json({}, { status: 201 });
}
