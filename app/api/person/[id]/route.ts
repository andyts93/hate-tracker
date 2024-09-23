import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  try {
    if (!body.password) throw new Error("Password is required");

    const password = await bcrypt.hash(body.password, 10);

    await sql`UPDATE people SET password = ${password} WHERE id = ${params.id}`;

    return NextResponse.json({ id: params.id }, { status: 201 });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);

    return NextResponse.json(
      { error: "Error while creating the person, please try again" },
      { status: 500 },
    );
  }
}
