"use client";

import { Slider } from "@nextui-org/slider";
import { TiHeartFullOutline } from "react-icons/ti";
import { FaRegAngry } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import Link from "next/link";

import { StatPanel } from "@/components/stat-panel";
import { GraphPoint, Person, Stats } from "@/types";
import { FullPageLoader } from "@/components/full-page-loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function Home({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [vote, setVote] = useState<number | number[]>(0);
  const [note, setNote] = useState<string>("");
  const [average, setAverage] = useState(0);
  const [graphData, setGraphData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });
  const [stats, setStats] = useState<Stats>();
  const [lastRecord, setLastRecord] = useState();
  const [person, setPerson] = useState<Person | undefined>();

  const options: ChartOptions<"line"> = {
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 2,
        borderColor: "rgba(255,224,0,1)",
        fill: "start",
        backgroundColor: "rgba(255,224,0,0.3)",
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        max: 10,
        min: -10,
      },
    },
  };

  const reload = async () => {
    setLoading(true);
    const response = await fetch(`/api/votes?person_id=${params.id}`);
    const json = await response.json();

    setAverage(json.avg);
    setGraphData({
      labels: json.graph.map((el: GraphPoint) =>
        dayjs(el.created_at).format("DD-MM HH:mm"),
      ),
      datasets: [
        {
          data: json.graph.map((el: GraphPoint) => el.vote),
        },
      ],
    });
    setLastRecord(json.graph[json.graph.length - 1]?.created_at);
    setStats({
      hatePeak: json.hatePeak,
      lovePeak: json.lovePeak,
      hateHits: json.hateHits,
      loveHits: json.loveHits,
      loveHour: json.loveHour,
      hateHour: json.hateHour,
    });
    setPerson(json.person);
    setLoading(false);
    const list = JSON.parse(localStorage.getItem("last-viewed") || "[]");

    if (!list.find((l: Person) => l.id === params.id)) {
      list.push(json.person);
      localStorage.setItem("last-viewed", JSON.stringify(list));
    }
  };
  const save = async () => {
    setLoading(true);
    await fetch("/api/votes", {
      method: "POST",
      body: JSON.stringify({ vote, person_id: params.id, note }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setVote(0);
    setNote("");
    await reload();
  };

  useEffect(() => {
    reload().then();
  }, []);

  return (
    <div className="flex justify-center min-h-screen px-4">
      {loading && <FullPageLoader />}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center uppercase bg-gradient-to-br from-purple-500 to-red-500 bg-clip-text text-transparent">
          Hey {person?.name || "friend"}!<br />
          Someone thinks you hate them (or not?). Well, good for you! Track it
          here.
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Want to track someone&apos;s mood? Click{" "}
          <Link className="text-orange-500 hover:underline" href={"/"}>
            here
          </Link>
          .
        </p>
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
          onChange={(e) => setVote(e)}
        />
        <textarea
          className="mt-2 bg-gray-700 px-2 py-1 focus:outline-none rounded resize-none w-full text-white h-32 text-sm"
          placeholder="Write a note if you want"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          className="px-4 py-1 rounded-2xl bg-green-500 mt-4"
          onClick={() => save()}
        >
          Save
        </button>
        <p className="text-center text-3xl font-black mt-6">
          Average
          <br />
          {average || "-"}
        </p>
        <div className="mt-6 overflow-x-auto">
          <Line data={graphData} options={options} />
        </div>
        {lastRecord && (
          <p className="text-center">
            Last record: {dayjs(lastRecord).format("DD MMM HH:mm")}
          </p>
        )}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatPanel
            stat={stats?.hatePeak}
            statColor="#ef4444"
            title="Hate peak"
          />
          <StatPanel
            stat={stats?.lovePeak}
            statColor="#84cc16"
            title="Love peak"
          />
          <StatPanel stat={stats?.hateHits} statColor="" title="Hate hits" />
          <StatPanel stat={stats?.loveHits} statColor="" title="Love hits" />
          <StatPanel
            stat={stats?.hateHour}
            statColor=""
            title="Most hated hour"
          />
          <StatPanel
            stat={stats?.loveHour}
            statColor=""
            title="Most loved hour"
          />
        </div>
      </div>
    </div>
  );
}
