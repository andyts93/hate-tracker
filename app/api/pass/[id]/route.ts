import { NextResponse } from "next/server";

import { cache } from "@/cache";
import { sql } from "@/sql";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const [pass] = await sql`SELECT * FROM passes WHERE id = ${params.id}`;

    if (pass.uses_left <= 0) throw new Error("No uses left");
    await sql`UPDATE passes SET uses_left = uses_left - 1 WHERE id = ${params.id}`;

    await cache.del(`passes-${pass.person_id}`);

    return NextResponse.json({ pass }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
