import { sql } from "@/sql";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const rows = await sql`SELECT * FROM gifts`;

  return NextResponse.json(rows);
}
