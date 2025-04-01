import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getTranslations } from "next-intl/server";

import { sql } from "@/sql";

export async function POST(request: Request) {
  const body = await request.json();
  const t = await getTranslations("API");

  try {
    if (!body.password) throw new Error("Password is mandatory");
    if (!body.person_id) throw new Error("Person id is required");

    const rows = await sql`SELECT * FROM people WHERE id = ${body.person_id}`;

    if (!bcrypt.compareSync(body.password, rows[0].password)) {
      throw new Error(t("Person.incorrectPassword"));
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
}
