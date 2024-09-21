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

import { GraphPoint, Stats } from "@/types";
import { StatPanel } from "@/components/stat-panel";

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

export default function Home() {
  const [vote, setVote] = useState<number | number[]>(0);
  const [average, setAverage] = useState(0);
  const [graphData, setGraphData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });
  const [stats, setStats] = useState<Stats>();
  const [lastRecord, setLastRecord] = useState();

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
    const response = await fetch("/api/votes");
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
    setLastRecord(json.graph[json.graph.length - 1].created_at);
    setStats({
      hatePeak: json.hatePeak,
      lovePeak: json.lovePeak,
      hateHits: json.hateHits,
      loveHits: json.loveHits,
      loveHour: json.loveHour,
      hateHour: json.hateHour,
    });
  };
  const save = async () => {
    await fetch("/api/votes", {
      method: "POST",
      body: JSON.stringify({ vote }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await reload();
  };

  useEffect(() => {
    reload().then();
  }, []);

  return (
    <div className="flex justify-center min-h-screen px-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-center uppercase bg-gradient-to-br from-purple-500 to-red-500 bg-clip-text text-transparent">
          You think you hate someone? Well, good for you! Track it here.
        </h1>
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
        <div className="mt-6 overflow-x-auto">
          <Line data={graphData} options={options} />
        </div>
        {lastRecord && (
          <p className="text-center">
            Last record: {dayjs(lastRecord).format("DD MMM HH:mm")}
          </p>
        )}
        <div className="mt-6 grid grid-cols-2 gap-4">
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
