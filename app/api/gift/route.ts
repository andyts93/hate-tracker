import { NextResponse } from "next/server";

import { sql } from "@/sql";

export async function GET() {
  const rows = await sql`SELECT * FROM gifts`;

  return NextResponse.json(rows);
}
