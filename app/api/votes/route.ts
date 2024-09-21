import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const vote = body.vote;

  try {
    if (!vote) throw new Error("Vote is mandatory");
    await sql`INSERT INTO records (vote) VALUES (${vote})`;
  } catch (error) {
    NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
}

export async function GET() {
  const { rows: avg } = await sql`SELECT ROUND(AVG(vote), 2) avg FROM records`;
  const { rows: graph } =
    await sql`SELECT created_at, vote FROM records ORDER BY created_at DESC LIMIT 20`;
  const { rows: hatePeak } =
    await sql`SELECT created_at, vote FROM records ORDER BY vote DESC LIMIT 1`;
  const { rows: lovePeak } =
    await sql`SELECT created_at, vote FROM records ORDER BY vote ASC LIMIT 1`;
  const { rows: hateHits } =
    await sql`SELECT COUNT(id) vote FROM records WHERE vote > 0;`;
  const { rows: loveHits } =
    await sql`SELECT COUNT(id) vote FROM records WHERE vote < 0;`;
  const { rows: hours } =
    await sql`SELECT CONCAT(TO_CHAR(TIMEZONE('Europe/Rome', created_at), 'HH24'), ':00') AS vote FROM records GROUP BY TO_CHAR(TIMEZONE('Europe/Rome', created_at), 'HH24') ORDER BY AVG(vote)`;

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
    },
    { status: 200 },
  );
}
