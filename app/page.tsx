"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { BiSliderAlt } from "react-icons/bi";
import { IoEyeOffSharp, IoTicketSharp } from "react-icons/io5";
import { PiBeerBottleFill } from "react-icons/pi";

import HomeBox from "@/components/home-box";

export default function Home() {
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
    <>
      <div className="py-6 md:py-24 bg-slate-800/50">
        <div className="container mx-auto px-[2rem] md:px-[4rem] lg:px-[8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center mt-6 gap-[30px]">
            <div className="md:me-6">
              <h1 className="font-bold lg:leading-normal leading-normal text-[42px] lg:text-[54px] mb-5 text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-red-500">
                {t("Home.title")}
              </h1>
              <p className="text-slate-400 text-lg">{t("Home.subtitle")}</p>
            </div>
            <div className="relative mt-12 md:mt-0">
              <svg
                className="overflow-hidden absolute md:w-[600px] w-[300px] fill-red-400 rotate-12 start-8 -top-12 md:top-0"
                fill="none"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g strokeWidth="0" />
                <g strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" />{" "}
                </g>
              </svg>
              <img
                alt="mockup"
                className="mx-auto w-72 rotate-12 relative z-2"
                src="/mockup.png"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl py-6 md:py-16 px-4 flex-grow">
        <h3 className="text-center text-purple-400 uppercase text-xl font-semibold mb-6">
          Features
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <HomeBox
            description="Vote from -10 to +10 your hate level and get a graph of your mood over time"
            icon={<BiSliderAlt className="text-4xl text-purple-400" />}
            title="Vote"
          />

          <HomeBox
            description="Add notes and photos to your mood. You can decide to make it public or not and when"
            icon={<IoEyeOffSharp className="text-4xl text-red-400" />}
            title="Notes & photos"
          />

          <HomeBox
            description="Leave a message to your haters on their page. It will be visible for 24 hours only"
            icon={<PiBeerBottleFill className="text-4xl text-purple-400" />}
            title="Bottle messages"
          />

          <HomeBox
            description="Create passes for your haters. Want to create a free pass for a dinner out? You can do it here"
            icon={<IoTicketSharp className="text-4xl text-red-400" />}
            title="Passes"
          />
        </div>
      </section>

      <section className="bg-slate-900/40">
        <div className="container mx-auto max-w-7xl py-6 md:py-16 px-4 flex-grow">
          <div className="grid md:grid-cols-2 mt-8">
            <div>
              <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-red-500">
                Start your journey now!
              </h3>
              <p className="text-slate-300 text-md font-light mb-2">
                Use the form below to create your hater&apos;s or yours page.
              </p>
              <p className="text-slate-300 text-md font-light underline">
                {t("Home.disclaimer")}
              </p>
              <form className="mt-4" onSubmit={createNew}>
                <div className="flex flex-col border border-gray-900 p-4 rounded">
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
            </div>
          </div>
        </div>
      </section>
      {/* <p className="mt-4 text-center">{t("Home.subtitle")}</p>
        <p className="mt-1 underline text-center">{t("Home.disclaimer")}</p>

        <form className="mt-8" onSubmit={createNew}>
          <div className="flex flex-col border border-gray-700 p-2 shadow-brutal-sm shadow-gray-600 rounded">
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
            <button className="px-2 py-1 rounded bg-green-500 mt-2 text-sm">
              {t("Forms.create")}
            </button>
          </div>
        </form> */}
    </>
  );
}
