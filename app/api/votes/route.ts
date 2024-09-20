import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

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
    const { rows, fields } = await sql`SELECT ROUND(AVG(vote), 2) avg FROM records`;
    
    return NextResponse.json(rows[0], { status: 200 });
}