import { Avatar } from "@nextui-org/avatar";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import CreatePageForm from "@/components/create-page-form";
import { sql } from "@/sql";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/signup");
  }

  let pages =
    await sql`SELECT * FROM people WHERE user_id = ${session?.user?.id}`;
  const linkedPages =
    await sql`SELECT * FROM people WHERE id IN (${pages.map((page) => page.linked_page).join()})`;

  pages = pages.map((page) => {
    const linkedPage = linkedPages.find(
      (linkedPage) => linkedPage.id === page.linked_page,
    );

    return {
      ...page,
      linkedPage: linkedPage || null,
    };
  });
  console.log(pages);

  return (
    <main className="container max-w-7xl py-6 md:py-16 px-4 flex-growcontainer mx-auto">
      <div className="flex items-center gap-4">
        <Avatar
          name={session?.user?.name || undefined}
          size="lg"
          src={session?.user?.image || undefined}
        />
        <h2>{session?.user?.name}</h2>
      </div>
      <table className="table w-full my-4">
        <thead>
          <tr>
            <th>Page</th>
            <th>Linked Page</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id}>
              <td>
                <Link className="flex items-center gap-2" href={`/${page.id}`}>
                  <Avatar name={page.name} src={page.avatar} />
                  {page.name}
                </Link>
              </td>
              <td>
                <Link
                  className="flex items-center gap-2"
                  href={`/${page.linkedPage?.id}`}
                >
                  <Avatar
                    name={page.linkedPage?.name}
                    src={page.linkedPage?.avatar}
                  />
                  {page.linkedPage?.name || "No linked page"}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-gray-800 rounded-md p-4 mt-4">
        <p>Create a new page</p>
        <CreatePageForm />
      </div>
    </main>
  );
}
