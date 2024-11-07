import { extname } from "path";

import { put } from "@vercel/blob";
import { sql } from "@/sql";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { BottleMessage } from "@/types";

export async function POST(request: Request) {
  const body = await request.formData();

  const data: BottleMessage = {
    text: String(body.get("message")),
    person_id: String(body.get("person_id")),
    image: "",
  };

  if (body.get("image")) {
    const file = body.get("image") as File;
    const blob = await put(`${uuidv4()}.${extname(file.name)}`, file, {
      access: "public",
    });

    data.image = blob.url;
  }

  try {
    if (!data.text) throw new Error("Message is required");
    if (!data.person_id) throw new Error("Person ID is required");

    await sql`INSERT INTO messages (text, person_id, image) VALUES (${data.text}, ${data.person_id}, ${data.image})`;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
}
