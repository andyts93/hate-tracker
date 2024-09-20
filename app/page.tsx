"use client";

import { Slider } from "@nextui-org/slider";
import { TiHeartFullOutline } from "react-icons/ti";
import { FaRegAngry } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Home() {
  const [vote, setVote] = useState(0);
  const [average, setAverage] = useState(0);

  const reload = async () => {
    const response = await fetch("/api/votes");
    const json = await response.json();

    setAverage(json.avg);
  }
  const save = async () => {
    await fetch("/api/votes", {
      method: "POST",
      body: JSON.stringify({ vote }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    await reload();
  };

  useEffect(() => {
    reload().then();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-center uppercase bg-gradient-to-br from-purple-500 to-red-500 bg-clip-text text-transparent">You think you hate someone? Well, good for you! Track it here.</h1>
        <Slider
          className="max-w-md mt-6"
          color="warning"
          defaultValue={0}
          endContent={<FaRegAngry className="text-2xl text-orange-400" />}
          fillOffset={0}
          formatOptions={{ signDisplay: "always" }}
          label="Hate level"
          maxValue={10}
          minValue={-10}
          size="lg"
          startContent={
            <TiHeartFullOutline className="text-2xl text-red-500" />
          }
          step={0.5}
          value={vote}
          onChange={setVote}
        />
        <button
          className="px-4 py-1 rounded-2xl bg-green-500 mt-4 mx-24"
          onClick={() => save()}
        >
          Save
        </button>
        <p className="text-center text-3xl font-black mt-6">
          Average
          <br />
          {average || "-"}
        </p>
      </div>
    </div>
  );
}
