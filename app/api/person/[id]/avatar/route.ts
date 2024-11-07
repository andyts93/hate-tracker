import { extname } from "path";

import { put } from "@vercel/blob";
import { sql } from "@/sql";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.formData();
  let avatar;

  if (body.get("image")) {
    const file = body.get("image") as File;
    const blob = await put(`${uuidv4()}.${extname(file.name)}`, file, {
      access: "public",
    });

    avatar = blob.url;
  }

  try {
    if (!avatar) throw new Error("Avatar is required");

    await sql`UPDATE people SET avatar = ${avatar} WHERE id = ${params.id}`;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
}
