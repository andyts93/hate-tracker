import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();

  if (!session)
    return NextResponse.json(
      { error: "You need to be logged in to use this function " },
      { status: 403 },
    );

  const body = await request.json();

  try {
    if (!body.name) throw new Error("Name is required");
    const id = uuidv4();

    await sql`INSERT INTO people (id, name, user_id) VALUES (${id}, ${body.name}, ${session.user?.id})`;

    return NextResponse.json({ id }, { status: 201 });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);

    return NextResponse.json(
      { error: "Error while creating the person, please try again" },
      { status: 500 },
    );
  }
}
