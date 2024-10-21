import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getTranslations } from "next-intl/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const t = await getTranslations("API");

  try {
    if (!body.password) throw new Error(t("Person.passwordRequired"));

    const password = await bcrypt.hash(body.password, 10);

    await sql`UPDATE people SET password = ${password} WHERE id = ${params.id}`;

    return NextResponse.json({ id: params.id }, { status: 201 });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);

    return NextResponse.json(
      { error: t("Person.errorPassword") },
      { status: 500 },
    );
  }
}
