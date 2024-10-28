import { useState } from "react";
import { ReactionBarSelector } from "@charkour/react-reactions";
import { TfiThought } from "react-icons/tfi";
import { useTranslations } from "next-intl";

import { quickThoughtReaction } from "./reactions";
import { FullPageLoader } from "./full-page-loader";

import { Person } from "@/types";
import toast from "react-hot-toast";

export default function QuickThoughtBox({ person, onReact }: { person?: Person, onReact?: () => void }) {
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslations("Page.quickThought");

  const react = async (key: string) => {
    try {
      await fetch(`/api/quick-thought`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ person_id: person?.id, reaction: key }),
      });
    } catch (err: any) {
      toast.error(err.message);
    }
    onReact?.();
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <div className="bg-sky-500 py-2 px-4 rounded shadow-brutal shadow-sky-700 mt-4 w-full">
        <p className="mb-2 text-sm font-semibold flex items-center mt-1">
          <TfiThought className="text-xl mr-2" />
          <span>{t("title", { name: person?.name })}</span>
        </p>
        <div className="flex justify-center mt-2">
          <ReactionBarSelector
            iconSize={16}
            reactions={quickThoughtReaction}
            style={{
              backgroundColor: "#0369a1",
              paddingLeft: 5,
              paddingRight: 10,
            }}
            onSelect={react}
          />
        </div>
      </div>
    </>
  );
}
