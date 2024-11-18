"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function CreatePageForm() {
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const t = useTranslations();

  const createNew = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/person", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const json = await response.json();

      if (!response.ok) return toast.error(json.error);

      router.push(`/${json.id}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form className="mt-4" onSubmit={createNew}>
      <div className="flex flex-col">
        <label className="text-sm text-gray-400 mb-1" htmlFor="name">
          {t("Forms.name")}
        </label>
        <input
          className="bg-gray-700 px-2 py-1 focus:outline-none rounded"
          id="name"
          placeholder={t("Forms.namePlaceholder")}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="px-2 py-1 rounded bg-green-600 mt-2 text-sm">
          {t("Forms.create")}
        </button>
      </div>
    </form>
  );
}
