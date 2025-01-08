import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { sql } from "@/sql";
import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await auth(req, res);
    console.log(session?.expires);
//   const body = await request.json();
//   const t = await getTranslations("API");

//   try {
//     if (!body.password) throw new Error(t("Person.passwordRequired"));

//     const password = await bcrypt.hash(body.password, 10);

//     await sql`UPDATE people SET password = ${password} WHERE id = ${params.id}`;

//     return NextResponse.json({ id: params.id }, { status: 201 });
//   } catch (error: any) {
//     // eslint-disable-next-line no-console
//     console.error(error);

//     return NextResponse.json(
//       { error: t("Person.errorPassword") },
//       { status: 500 },
//     );
//   }
}
