import { Avatar } from "@nextui-org/avatar";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import CreatePageForm from "@/components/create-page-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/signup");
  }

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
      <div className="bg-gray-800 rounded-md p-4 mt-4">
        <p>Create a new page</p>
        <CreatePageForm />
      </div>
    </main>
  );
}
