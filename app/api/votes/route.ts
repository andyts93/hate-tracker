import { extname } from "path";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

import { sql, sqlCache } from "@/sql";
import { BottleMessage, Pass, Person, Vote, VoteResponse } from "@/types";
import { cache } from "@/cache";

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

  if (data.latitude === 0 && data.longitude === 0) {
    data.latitude = null;
    data.longitude = null;
  }

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

  await cache.mdel([
    `graph-${data.person_id}`,
    `hatePeak-${data.person_id}`,
    `lovePeak-${data.person_id}`,
    `hateHits-${data.person_id}`,
    `loveHits-${data.person_id}`,
    `hours-${data.person_id}`,
  ]);

  return NextResponse.json({}, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const MODULES = [
    "avg",
    "graph",
    "stats",
    "person",
    "message",
    "passes",
    "quickThoughts",
    "gift",
    "missingMeter",
  ];

  const requestModules = searchParams.get("modules")?.split(",") || MODULES;
  let response: VoteResponse = {};

  if (requestModules.includes("avg")) {
    const [avg] =
      await sql`SELECT ROUND(AVG(vote), 2) avg FROM records WHERE person_id = ${searchParams.get("person_id")}`;

    response.avg = avg.avg;
  }

  if (requestModules.includes("graph")) {
    // const graph =
    //   await sql`SELECT * FROM records WHERE person_id = ${searchParams.get("person_id")} ORDER BY created_at ASC`;
    const graph = await sqlCache(
      `graph-${searchParams.get("person_id")}`,
      `SELECT * FROM records WHERE person_id = '${searchParams.get("person_id")}' ORDER BY created_at ASC`,
    );

    response.graph = graph as Vote[];
  }

  if (requestModules.includes("stats")) {
    const [hatePeak] = await sqlCache(
      `hatePeak-${searchParams.get("person_id")}`,
      `SELECT created_at, vote FROM records WHERE person_id = '${searchParams.get("person_id")}' AND vote > 0 ORDER BY vote DESC LIMIT 1`,
    );
    const [lovePeak] = await sqlCache(
      `lovePeak-${searchParams.get("person_id")}`,
      `SELECT created_at, vote FROM records WHERE person_id = '${searchParams.get("person_id")}' AND vote < 0 ORDER BY vote ASC LIMIT 1`,
    );
    const [hateHits] = await sqlCache(
      `hateHits-${searchParams.get("person_id")}`,
      `SELECT COUNT(id) vote FROM records WHERE person_id = '${searchParams.get("person_id")}' AND vote > 0;`,
    );
    const [loveHits] = await sqlCache(
      `loveHits-${searchParams.get("person_id")}`,
      `SELECT COUNT(id) vote FROM records WHERE person_id = '${searchParams.get("person_id")}' AND vote < 0;`,
    );
    const hours = await sqlCache(
      `hours-${searchParams.get("person_id")}`,
      `SELECT CONCAT(TO_CHAR(TIMEZONE('Europe/Rome', created_at), 'HH24'), ':00') AS vote FROM records WHERE person_id = '${searchParams.get("person_id")}' GROUP BY TO_CHAR(TIMEZONE('Europe/Rome', created_at), 'HH24') ORDER BY AVG(vote)`,
    );

    response = {
      ...response,
      hatePeak,
      lovePeak,
      hateHits,
      loveHits,
      loveHour: hours[0],
      hateHour: hours[hours.length - 1],
    };
  }

  if (requestModules.includes("person")) {
    // const [people] =
    //   await sql`SELECT * FROM people WHERE id = ${searchParams.get("person_id")}`;
    const [people] = await sqlCache(
      `person-${searchParams.get("person_id")}`,
      `SELECT * FROM people WHERE id = '${searchParams.get("person_id")}'`,
    );

    response.person = people as Person;
  }

  if (requestModules.includes("message")) {
    // const [messages] =
    //   await sql`SELECT * FROM messages WHERE person_id = ${searchParams.get("person_id")} AND created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 1`;
    const [messages] = await sqlCache(
      `message-${searchParams.get("person_id")}`,
      `SELECT * FROM messages WHERE person_id = '${searchParams.get("person_id")}' AND created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 1`,
    );

    response.message = messages as BottleMessage;
  }

  if (requestModules.includes("passes")) {
    // const passes =
    //   await sql`SELECT *, CASE WHEN uses_left <= 0 OR expires_at < NOW() THEN 1 ELSE 0 END AS expired FROM passes WHERE person_id = ${searchParams.get("person_id")} ORDER BY expired ASC, expires_at ASC`;
    const passes = await sqlCache(
      `passes-${searchParams.get("person_id")}`,
      `SELECT *, CASE WHEN uses_left <= 0 OR expires_at < NOW() THEN 1 ELSE 0 END AS expired FROM passes WHERE person_id = '${searchParams.get("person_id")}' ORDER BY expired ASC, expires_at ASC`,
    );

    response.passes = passes as Pass[];
  }

  if (requestModules.includes("quickThoughts")) {
    // const [quickThought] =
    //   await sql`SELECT * FROM quick_thoughts WHERE person_id = ${searchParams.get("person_id")} AND created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 1`;
    const [quickThought] = await sqlCache(
      `quickThoughts-${searchParams.get("person_id")}`,
      `SELECT * FROM quick_thoughts WHERE person_id = '${searchParams.get("person_id")}' AND created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 1`,
    );

    response.quickThought = quickThought;
  }

  if (requestModules.includes("gift")) {
    // const [gift] =
    //   await sql`SELECT B.*, A.created_at gifted_at FROM gift_person A JOIN gifts B ON A.gift_id = B.id WHERE A.person_id = ${searchParams.get("person_id")} AND A.created_at > NOW() - INTERVAL '24 hours' ORDER BY gifted_at DESC LIMIT 1`;
    const [gift] = await sqlCache(
      `gift-${searchParams.get("person_id")}`,
      `SELECT B.*, A.created_at gifted_at FROM gift_person A JOIN gifts B ON A.gift_id = B.id WHERE A.person_id = '${searchParams.get("person_id")}' AND A.created_at > NOW() - INTERVAL '24 hours' ORDER BY gifted_at DESC LIMIT 1`,
    );

    response.gift = gift;
  }

  if (requestModules.includes("missingMeter")) {
    const [missingMeter] = await sqlCache(
      `missingmeter-${searchParams.get("person_id")}`,
      `SELECT score, created_at FROM missing_meter WHERE person_id = '${searchParams.get("person_id")}' AND created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 1`,
    );

    response.missingMeter = missingMeter;
  }

  return NextResponse.json(response, { status: 200 });
}
