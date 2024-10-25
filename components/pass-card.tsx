import type { Pass } from "@/types";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface PassProps {
  pass: Pass;
  authenticated: boolean;
  onUsed?: () => void;
}

export default function PassCard({ pass, authenticated, onUsed }: PassProps) {
  const t = useTranslations("PassCard");

  const use = async () => {
    try {
      const res = await fetch(`/api/pass/${pass.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success(t("used"));
        onUsed?.();
      } else {
        const json = await res.json();

        toast.error(json.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative bg-gray-300 rounded-md flex overflow-hidden max-w-96 h-full max-h-72">
      {pass.expired ? (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 flex items-center justify-center">
          <span className="-rotate-12 text-5xl font-semibold text-red-500 uppercase">
            {t("expired")}
          </span>
        </div>
      ) : null}
      <div className="flex flex-col w-full">
        <h2 className="text-lg font-semibold px-3 h-10 bg-rose-600 flex items-center">
          {pass.title}
        </h2>
        <div className="p-3">
          <div className="flex flex-col mb-2">
            <p className="text-sm text-black font-semibold">
              {pass.conditions}
            </p>
            <p className="text-xs text-gray-600 uppercase font-light">
              {t("conditions")}
            </p>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <p className=" text-black font-semibold">
                {pass.expires_at
                  ? dayjs(pass.expires_at).format("DD MMM")
                  : "ND"}
              </p>
              <p className="text-xs text-gray-600 uppercase font-light">
                {t("expiration")}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-black font-semibold">{pass.uses_max}</p>
              <p className="text-xs text-gray-600 uppercase font-light">
                {t("uses_max")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-24 border-l-[0.18em] border-dashed border-white pass-right relative after:bg-teal-600 before:bg-teal-600">
        <div className="bg-rose-600 p-3 h-10 flex items-center justify-center">
          {pass.icon}
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-2xl font-bold text-rose-600">
            {Number(pass.uses_left) >= 0 ? pass.uses_left : pass.uses_max}
          </p>
          <p className="text-gray-600 uppercase text-sm">{t("uses_left")}</p>
          {authenticated && !pass.expired && (
            <button
              className="text-xs text-white bg-rose-600 px-2 py-1 rounded-md mt-2"
              onClick={use}
            >
              {t("use")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
