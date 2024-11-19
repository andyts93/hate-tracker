import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { sql, sqlCache } from "@/sql";
import { cache } from "@/cache";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!body.name) throw new Error("Name is required");
    const id = uuidv4();
    const id2 = uuidv4();

    await sql.transaction([
      sql`INSERT INTO people (id, name, user_id) VALUES (${id}, ${session.user?.name}, ${session.user?.id})`,
      sql`INSERT INTO people (id, name) VALUES (${id2}, ${body.name})`,
      sql`UPDATE people SET linked_page = ${id2} WHERE id = ${id}`,
      sql`UPDATE people SET linked_page = ${id} WHERE id = ${id2}`,
    ]);

    await cache.del("people");

    return NextResponse.json({ id: id2 }, { status: 201 });
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
