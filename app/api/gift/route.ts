import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/sql";

export async function GET(request: NextRequest) {
  const rows = await sql`SELECT * FROM gifts`;

  return NextResponse.json(rows);
}
