import { extname } from "path";

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

import { sql } from "@/sql";
import { BottleMessage } from "@/types";
import { cache } from "@/cache";

export async function POST(request: Request) {
  const body = await request.formData();

  const data: BottleMessage = {
    text: String(body.get("message")),
    person_id: String(body.get("person_id")),
    image: "",
  };

  if (body.get("image")) {
    const file = body.get("image") as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Usa Sharp per ottimizzare l'immagine
    const optimizedBuffer = await sharp(buffer)
      .jpeg({ quality: 80 })
      .toBuffer();

    const blob = await put(
      `${uuidv4()}.${extname(file.name)}`,
      optimizedBuffer,
      {
        access: "public",
      },
    );

    data.image = blob.url;
  }

  try {
    if (!data.text) throw new Error("Message is required");
    if (!data.person_id) throw new Error("Person ID is required");

    await sql`INSERT INTO messages (text, person_id, image) VALUES (${data.text}, ${data.person_id}, ${data.image})`;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  await cache.del(`message-${data.person_id}`);

  return NextResponse.json({}, { status: 201 });
}
