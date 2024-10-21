import { extname } from "path";

import { sql } from "@vercel/postgres";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

import { Vote } from "@/types";

dayjs.extend(utc);

export async function POST(request: Request) {
  const body = await request.formData();

  const data: Vote = {
    vote: Number(body.get("vote")),
    person_id: String(body.get("person_id")),
    note: String(body.get("note") || ""),
    note_visible: Boolean(body.get("showNote") === "true"),
    ttv:
      body.get("showOn") !== "null"
        ? dayjs(String(body.get("showOn")))
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")
        : null,
    image: "",
    latitude: Number(body.get("latitude")),
    longitude: Number(body.get("longitude")),
    audio_file: "",
  };

  if (body.get("image")) {
    const file = body.get("image") as File;
    const blob = await put(`${uuidv4()}.${extname(file.name)}`, file, {
      access: "public",
    });

    data.image = blob.url;
  }

  if (body.get("audio")) {
    const file = body.get("audio") as File;
    const blob = await put(`${uuidv4()}.webm`, file, {
      access: "public",
    });

    data.audio_file = blob.url;
  }

  try {
    if (!data.vote) throw new Error("Vote is mandatory");
    if (!data.person_id) throw new Error("Person ID is mandatory");
    await sql`INSERT INTO records (vote, person_id, note, note_visible, ttv, image, latitude, longitude, audio_file) VALUES (${data.vote}, ${data.person_id}, ${data.note}, ${data.note_visible}, ${data.ttv}, ${data.image}, ${data.latitude}, ${data.longitude}, ${data.audio_file})`;
  } catch (error) {
    NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const { rows: avg } =
    await sql`SELECT ROUND(AVG(vote), 2) avg FROM records WHERE person_id = ${searchParams.get("person_id")}`;
  const { rows: graph } =
    await sql`SELECT * FROM records WHERE person_id = ${searchParams.get("person_id")} ORDER BY created_at DESC`;
  const { rows: hatePeak } =
    await sql`SELECT created_at, vote FROM records WHERE person_id = ${searchParams.get("person_id")} AND vote > 0 ORDER BY vote DESC LIMIT 1`;
  const { rows: lovePeak } =
    await sql`SELECT created_at, vote FROM records WHERE person_id = ${searchParams.get("person_id")} AND vote < 0 ORDER BY vote ASC LIMIT 1`;
  const { rows: hateHits } =
    await sql`SELECT COUNT(id) vote FROM records WHERE person_id = ${searchParams.get("person_id")} AND vote > 0;`;
  const { rows: loveHits } =
    await sql`SELECT COUNT(id) vote FROM records WHERE person_id = ${searchParams.get("person_id")} AND vote < 0;`;
  const { rows: hours } =
    await sql`SELECT CONCAT(TO_CHAR(TIMEZONE('Europe/Rome', created_at), 'HH24'), ':00') AS vote FROM records WHERE person_id = ${searchParams.get("person_id")} GROUP BY TO_CHAR(TIMEZONE('Europe/Rome', created_at), 'HH24') ORDER BY AVG(vote)`;
  const { rows: people } =
    await sql`SELECT * FROM people WHERE id = ${searchParams.get("person_id")}`;
  const { rows: messages } =
    await sql`SELECT * FROM messages WHERE person_id = ${searchParams.get("person_id")} AND created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 1`;
  const { rows: passes } =
    await sql`SELECT * FROM passes WHERE person_id = ${searchParams.get("person_id")}`;

  return NextResponse.json(
    {
      avg: avg[0].avg,
      graph: graph.reverse(),
      hatePeak: hatePeak[0],
      lovePeak: lovePeak[0],
      hateHits: hateHits[0],
      loveHits: loveHits[0],
      loveHour: hours[0],
      hateHour: hours[hours.length - 1],
      person: people[0],
      message: messages[0],
      passes,
    },
    { status: 200 },
  );
}
