import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { sql, sqlCache } from "@/sql";
import { cache } from "@/cache";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    if (!body.name) throw new Error("Name is required");
    const id = uuidv4();

    await sql`INSERT INTO people (id, name) VALUES (${id}, ${body.name})`;

    await cache.del("people");

    return NextResponse.json({ id }, { status: 201 });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);
    const t = await getTranslations("API");

    return NextResponse.json(
      { error: t("Person.errorCreate") },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let people = await sqlCache("people", "SELECT * FROM people");

  people = people.filter((p: any) => {
    if (searchParams.has("ids")) {
      return searchParams.get("ids")?.split(",").includes(p.id);
    }

    return true;
  });

  return NextResponse.json(people);
}
