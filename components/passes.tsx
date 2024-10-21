import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import { FullPageLoader } from "./full-page-loader";

import { Pass, Person } from "@/types";

interface PassesProps {
  passes: Pass[];
  person?: Person;
  authenticated: boolean;
  onSaved: () => void;
}

const defaultFormData = {
  icon: "😀",
  title: "",
  conditions: "",
  uses_max: undefined,
  expiration: "",
};

export default function Passes({
  passes,
  person,
  authenticated,
  onSaved,
}: PassesProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    icon?: string;
    title?: string;
    conditions?: string;
    uses_max?: number | string;
    expiration?: any;
  }>(defaultFormData);

  const pickEmoji = (emoji: EmojiClickData) => {
    setFormData({ ...formData, icon: emoji.emoji });
    setEmojiOpen(false);
  };

  const savePass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expires: formData.expiration
            ? formData.expiration.toDate(getLocalTimeZone())
            : null,
          person_id: person?.id,
        }),
      });

      setLoading(false);

      if (res.ok) {
        setFormData(defaultFormData);
        setShowCreateForm(false);
        toast.success(t("sent"));
        onSaved();
      } else {
        const json = await res.json();

        toast.error(json.error);
      }
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <div className="bg-teal-500 py-2 px-4 rounded shadow-brutal shadow-teal-700 mt-4 w-full">
        <p className="text-sm mb-2">
          {person?.name} has {passes.length} passes.{" "}
          {!authenticated && (
            <button
              className="underline font-semibold"
              onClick={() => setShowCreateForm(true)}
            >
              Create new
            </button>
          )}
        </p>
        <div className="flex flex-col gap-2">
          {passes.map((p: Pass) => (
            <div key={p.id} className="bg-gray-900 rounded-md p-2">
              <h3 className="font-bold flex gap-2 items-center">
                <span>{p.icon}</span>
                <span>{p.title}</span>
                <span className="flex-1 text-right text-xs font-light">
                  {p.expires_at ? `Expiration: ${dayjs(p.expires_at).format("DD MMM")}` : null}
                </span>
              </h3>
              <p className="text-sm">{p.conditions}</p>
              <p className="text-right font-bold text-lg">
                {p.uses_left}/{p.uses_max}
              </p>
            </div>
          ))}
        </div>
        {!authenticated && showCreateForm && (
          <form className="flex flex-col gap-1" onSubmit={savePass}>
            <div className="flex gap-2">
              <button
                className="w-8 bg-default-100 rounded-lg text-center"
                type="button"
                onClick={() => setEmojiOpen(!emojiOpen)}
              >
                {formData.icon}
              </button>
              <input
                className="bg-default-100 px-2 py-1 focus:outline-none rounded-lg w-full text-sm"
                placeholder="Pass name"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <EmojiPicker
              lazyLoadEmojis={true}
              open={emojiOpen}
              previewConfig={{ defaultCaption: "Set an icon for the pass" }}
              theme={Theme.DARK}
              onEmojiClick={pickEmoji}
            />
            <textarea
              className="bg-default-100 px-2 py-1 focus:outline-none rounded-lg w-full resize-none text-sm"
              placeholder="Set the pass conditions"
              rows={3}
              value={formData.conditions}
              onChange={(e) =>
                setFormData({ ...formData, conditions: e.target.value })
              }
            />
            <input
              className="bg-default-100 px-2 py-1 focus:outline-none rounded-lg w-full text-sm"
              placeholder="Max uses"
              type="number"
              value={formData.uses_max}
              onChange={(e) =>
                setFormData({ ...formData, uses_max: e.target.value ?? "" })
              }
            />
            <DatePicker
              label="Expiration"
              minValue={today(getLocalTimeZone())}
              onChange={(value: any) => {
                setFormData({ ...formData, expiration: value });
              }}
            />
            <button
              className="px-2 py-1 rounded-lg bg-teal-700 mt-2 text-sm"
              type="submit"
            >
              {t("Forms.save")}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
