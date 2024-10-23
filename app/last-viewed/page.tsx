"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Avatar } from "@nextui-org/avatar";

import { Person } from "@/types";

export default function LastViewed() {
  const [list, setList] = useState<Person[]>([]);
  const t = useTranslations("LastViewed");

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("last-viewed") || "[]");

    fetch(`/api/person?ids=${list.map((l: Person) => l.id).join(",")}`)
      .then((response) => response.json())
      .then((data) => {
        setList(data);
      });
  }, []);

  return (
    <main className="container mx-auto max-w-7xl py-6 md:py-16 px-4 flex-grow">
      <h1 className="text-3xl font-bold text-center uppercase bg-gradient-to-br from-purple-500 to-red-500 bg-clip-text text-transparent">
        {t("title")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-4">
        {list.map((l) => (
          <Link
            key={l.id}
            className="border border-gray-700 px-4 py-2 shadow-brutal-sm shadow-gray-600 rounded flex items-center gap-4"
            href={`/${l.id}`}
          >
            <Avatar name={l.name} size="lg" src={l.avatar} />
            <h3 className="font-bold text-2xl">{l.name}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
}
