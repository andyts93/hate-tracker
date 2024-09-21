"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Person } from "@/types";

export default function LastViewed() {
  const [list, setList] = useState<Person[]>([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("last-viewed") || "[]");

    setList(list);
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-center uppercase bg-gradient-to-br from-purple-500 to-red-500 bg-clip-text text-transparent">
        Last viewed pages
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-4">
        {list.map((l) => (
          <Link
            key={l.id}
            className="border border-gray-700 px-4 py-2 shadow-brutal-sm shadow-gray-600 rounded"
            href={`/${l.id}`}
          >
            <h3 className="font-bold text-2xl">{l.name}</h3>
          </Link>
        ))}
      </div>
    </>
  );
}
