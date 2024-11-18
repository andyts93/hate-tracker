"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { BiSliderAlt } from "react-icons/bi";
import { IoEyeOffSharp, IoTicketSharp } from "react-icons/io5";
import { PiBeerBottleFill } from "react-icons/pi";

import HomeBox from "@/components/home-box";

export default function Home() {
  const [name, setName] = useState<string>("");
  const t = useTranslations();

  return (
    <>
      <div className="py-6 md:py-24 bg-slate-800/50">
        <div className="container mx-auto px-[2rem] md:px-[4rem] lg:px-[8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center mt-6 gap-[30px]">
            <div className="md:me-6">
              <h1 className="font-bold lg:leading-normal leading-tight text-[42px] lg:text-[54px] mb-5 text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-red-500">
                {t("Home.title")}
              </h1>
              <p className="text-slate-400 text-lg mb-8">
                {t("Home.subtitle")}
              </p>
              <a
                className="rounded-full px-4 py-4 bg-purple-500 transition-all duration-300 shadow-brutal-sm shadow-white border border-white hover:shadow-none hover:bg-purple-600"
                href="#start"
              >
                {t("Home.startJourney")}
              </a>
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
                className="mx-auto w-60 md:w-72 rotate-12 relative z-2"
                src="/mockup.png"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl py-6 md:py-16 px-4 flex-grow">
        <h3 className="text-center text-purple-400 uppercase text-xl font-semibold mb-6">
          {t("Home.features")}
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <HomeBox
            description={t("Home.voteDescription")}
            icon={<BiSliderAlt className="text-4xl text-purple-400" />}
            title={t("Home.vote")}
          />

          <HomeBox
            description={t("Home.notesPhotosDescription")}
            icon={<IoEyeOffSharp className="text-4xl text-red-400" />}
            title={t("Home.notesPhotos")}
          />

          <HomeBox
            description={t("Home.bottleMessagesDescription")}
            icon={<PiBeerBottleFill className="text-4xl text-purple-400" />}
            title={t("Home.bottleMessages")}
          />

          <HomeBox
            description={t("Home.passesDescription")}
            icon={<IoTicketSharp className="text-4xl text-red-400" />}
            title={t("Home.passes")}
          />
        </div>
      </section>

      <section className="bg-slate-900/40" id="start">
        <div className="container mx-auto max-w-7xl py-6 md:py-16 px-4 flex-grow">
          <div className="grid md:grid-cols-2 mt-8">
            <div>
              <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-red-500">
                {t("Home.startJourney")}
              </h3>
              <p className="text-slate-300 text-md font-light mb-2">
                {t("Home.startJourneyDescription")}
              </p>
              <p className="text-slate-300 text-md font-light underline">
                {t("Home.disclaimer")}
              </p>
            </div>
            <div className="relative mt-16 md:mt-0">
              <svg
                className="overflow-hidden absolute md:w-[500px] w-[300px] fill-purple-400 rotate-12 start-8 -top-12 md:top-0"
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
                alt="Signup"
                className="w-60 md:w-80 z-10 relative mx-auto rotate-12"
                src="/mockup-2.png"
              />
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
