import type { Pass, Person } from "@/types";

import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import useEmblaCarousel from "embla-carousel-react";

import { FullPageLoader } from "./full-page-loader";
import PassCard from "./pass-card";

interface PassesProps {
  passes: Pass[];
  person?: Person;
  authenticated: boolean;
  onSaved: () => void;
}

const defaultFormData: Pass = {
  icon: "😀",
  title: "",
  conditions: "",
  uses_max: undefined,
  expires_at: "",
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
  const [formData, setFormData] = useState<Pass>(defaultFormData);
  const [emblaRef] = useEmblaCarousel({ loop: true });

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
          expires: formData.expires_at
            ? (formData.expires_at as any).toDate(getLocalTimeZone())
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

  const reset = () => {
    setFormData(defaultFormData);
    setShowCreateForm(false);
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <div className="bg-teal-600 py-2 px-4 rounded shadow-brutal shadow-teal-800 mt-4 w-full overflow-x-hidden">
        <p className="text-sm mb-2">
          {t("Page.passes.title", { name: person?.name, num: passes.filter(p => !p.expired).length })}{" "}
          {!authenticated && (
            <button
              className="underline font-semibold"
              onClick={() => setShowCreateForm(true)}
            >
              {t("Page.passes.create")}
            </button>
          )}
        </p>
        {!authenticated && showCreateForm && (
          <>
            <form
              className="flex flex-col gap-1 my-2 bg-black p-2 rounded-md"
              onSubmit={savePass}
            >
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
                  maxLength={23}
                  placeholder={t("Forms.passName")}
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
                previewConfig={{ defaultCaption: t("Forms.passIcon") }}
                theme={Theme.DARK}
                onEmojiClick={pickEmoji}
              />
              <textarea
                className="bg-default-100 px-2 py-1 focus:outline-none rounded-lg w-full resize-none text-sm"
                placeholder={t("Forms.passConditions")}
                rows={3}
                value={formData.conditions}
                onChange={(e) =>
                  setFormData({ ...formData, conditions: e.target.value })
                }
              />
              <input
                className="bg-default-100 px-2 py-1 focus:outline-none rounded-lg w-full text-sm"
                placeholder={t("Forms.passUses")}
                type="number"
                value={formData.uses_max}
                onChange={(e) =>
                  setFormData({ ...formData, uses_max: e.target.value ?? "" })
                }
              />
              <DatePicker
                label={t("Forms.passExpiration")}
                minValue={today(getLocalTimeZone())}
                onChange={(value: any) => {
                  setFormData({ ...formData, expires_at: value });
                }}
              />
              <div className="flex">
                <button
                  className="px-2 py-1 rounded-l-lg bg-red-500 mt-2 text-sm flex-1"
                  type="button"
                  onClick={reset}
                >
                  {t("Forms.cancel")}
                </button>
                <button
                  className="px-2 py-1 rounded-r-lg bg-teal-700 mt-2 text-sm flex-1"
                  type="submit"
                >
                  {t("Forms.save")}
                </button>
              </div>
            </form>
            <PassCard authenticated={false} pass={formData} />
          </>
        )}
        {!showCreateForm && (
          <>
            <div className="md:grid grid-cols-3 hidden gap-4">
              {passes.map((p: Pass) => (
                <PassCard
                  key={p.id}
                  authenticated={authenticated}
                  pass={p}
                  onUsed={onSaved}
                />
              ))}
            </div>
            <div ref={emblaRef} className="embla md:hidden">
              <div className="embla__container">
                {passes.map((p: Pass) => (
                  <div key={p.id} className="embla__slide">
                    <PassCard
                      authenticated={authenticated}
                      pass={p}
                      onUsed={onSaved}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
