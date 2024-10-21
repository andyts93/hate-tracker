import { sql } from "@vercel/postgres";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (!body.name) throw new Error("Name is required");
    const id = uuidv4();

    await sql`INSERT INTO people (id, name) VALUES (${id}, ${body.name})`;

    return NextResponse.json({ id }, { status: 201 });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);
    const t = await getTranslations("API");

    return NextResponse.json(
      { error: t("Person.errorCreate") },
      { status: 500 },
    );
  }
}
