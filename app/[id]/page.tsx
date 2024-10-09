"use client";

import { Slider } from "@nextui-org/slider";
import { TiHeartFullOutline } from "react-icons/ti";
import { FaRegAngry } from "react-icons/fa";
import { IoLockClosed, IoShareOutline, IoQrCodeOutline } from "react-icons/io5";
import { FormEvent, useEffect, useRef, useState } from "react";
import { RiAlarmWarningLine } from "react-icons/ri";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { PiConfettiDuotone } from "react-icons/pi";
import { useQRCode } from "next-qrcode";
import toast from "react-hot-toast";
import { getCookie, setCookie } from "cookies-next";
import { Switch } from "@nextui-org/switch";
import { BsIncognito } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { DatePicker } from "@nextui-org/date-picker";
import { now, getLocalTimeZone, today } from "@internationalized/date";

import { StatPanel } from "@/components/stat-panel";
import { GraphPoint, Person, Stats, Vote } from "@/types";
import { FullPageLoader } from "@/components/full-page-loader";
import { sentences } from "@/config/sentences";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
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
  const [records, setRecords] = useState<Vote[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isQrOpen,
    onOpen: onQrOpen,
    onOpenChange: onQrOpenChange,
  } = useDisclosure();
  const currentVote = useRef<number>(0);
  const [hasPassword, setHasPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string | undefined>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [showOn, setShowOn] = useState<any>(now(getLocalTimeZone()));

  const { Canvas } = useQRCode();

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
    setRecords(json.graph.reverse());
    setStats({
      hatePeak: json.hatePeak,
      lovePeak: json.lovePeak,
      hateHits: json.hateHits,
      loveHits: json.loveHits,
      loveHour: json.loveHour,
      hateHour: json.hateHour,
    });
    setPerson(json.person);
    setHasPassword(Boolean(json.person.password));
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
      body: JSON.stringify({
        vote,
        person_id: params.id,
        note,
        showOn: showNote ? showOn?.toDate(getLocalTimeZone()) : null,
        showNote,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    currentVote.current = vote as number;
    setVote(0);
    setNote("");
    setShowNote(false);
    setShowOn(now(getLocalTimeZone()));
    onOpen();
    await reload();
  };

  const getRandomSentence = () => {
    const list = sentences[currentVote.current < 0 ? "love" : "hate"];

    return list[Math.floor(Math.random() * list.length)];
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const savePassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/person/${person?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const json = await response.json();

      if (!response.ok) return toast.error(json.error);
      setPassword("");
      toast.success("Password set!");
      setHasPassword(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const login = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, person_id: params.id }),
      });
      const json = await response.json();

      if (!response.ok) return toast.error(json.error);
      setPassword("");
      setAuthenticated(true);
      setCookie("auth", params.id, { maxAge: 30 * 24 * 60 * 60 });
      toast.success("Login successful!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    reload().then();
    setAuthenticated(getCookie("auth") === params.id);
  }, []);

  return (
    <div className="flex justify-center min-h-screen px-4">
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody>
            <h3 className="text-2xl font-bold text-center uppercase bg-gradient-to-br from-purple-500 to-red-500 bg-clip-text text-transparent flex items-center gap-2 justify-center">
              <PiConfettiDuotone className="text-pink-400" /> Congrats!
            </h3>
            <p className="mb-2">
              You have just expressed your feelings, it feels much better now,
              right?
            </p>
            <div className="bg-gray-800 p-4 mb-2 rounded shadow-brutal-sm shadow-gray-700">
              <p
                className="text-7xl text-center font-black mb-2"
                style={{
                  color:
                    currentVote.current < 0
                      ? "rgb(132, 204, 22)"
                      : "rgb(239, 68, 68)",
                }}
              >
                {currentVote.current > 0 && <span>+</span>}
                {currentVote.current}
              </p>
              <p className="text-center italic text-sm">
                {getRandomSentence()}
              </p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      {isQrOpen && (
        <Modal
          isOpen={isQrOpen}
          placement="center"
          onOpenChange={onQrOpenChange}
        >
          <ModalContent>
            <ModalHeader>Share QR code</ModalHeader>
            <ModalBody className="flex items-center pb-4">
              <Canvas
                options={{ margin: 2, scale: 10 }}
                text={window.location.href}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
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
        <div className="flex justify-center gap-4 mt-2">
          <button
            className="text-sm px-2 py-1 bg-gray-800 rounded flex items-center gap-2 hover:bg-gray-700"
            onClick={copyUrl}
          >
            <IoShareOutline />
            <span>Share link</span>
          </button>
          <button
            className="text-sm px-2 py-1 bg-gray-800 rounded flex items-center gap-2 hover:bg-gray-700"
            onClick={onQrOpen}
          >
            <IoQrCodeOutline />
            <span>Show QR code</span>
          </button>
        </div>
        {!hasPassword && !loading ? (
          <>
            <div className="mt-6 bg-orange-500 p-2 rounded shadow-brutal shadow-orange-700">
              <RiAlarmWarningLine className="mx-auto text-6xl mb-2" />
              <p className="mb-2">
                To start tracking, {person?.name} must set a password. This will
                permit just them to update their scores and see their notes.
              </p>
              <p>
                Send this link to them and let them set their password by
                themselves, don&apos;t be a dick!
              </p>
            </div>
            <form className="flex flex-col mt-4" onSubmit={savePassword}>
              <label className="text-sm text-gray-400 mb-1" htmlFor="password">
                Password
              </label>
              <input
                className="bg-gray-700 px-2 py-1 focus:outline-none rounded"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="px-2 py-1 rounded bg-green-500 mt-2 text-sm">
                Save
              </button>
            </form>
          </>
        ) : (
          <>
            {!authenticated ? (
              <div className="bg-blue-400 py-2 px-4 rounded shadow-brutal shadow-blue-600 mt-4 w-full">
                <p className="mb-2">To vote please insert your password</p>
                <form className="flex flex-col" onSubmit={login}>
                  <input
                    className="bg-gray-700 px-2 py-1 focus:outline-none rounded"
                    id="password"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="px-2 py-1 rounded bg-blue-600 mt-2 text-sm">
                    Login
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Slider
                  className="max-w-md mt-4"
                  color="warning"
                  defaultValue={0}
                  endContent={
                    <FaRegAngry className="text-2xl text-orange-400" />
                  }
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
                <div className="bg-gray-900 w-full p-2 mt-2 rounded-md">
                  <h3 className="font-semibold mb-2">Note</h3>
                  <textarea
                    className="bg-gray-700 px-2 py-1 focus:outline-none rounded resize-none w-full text-white h-32 text-sm disabed:opacity-70"
                    disabled={!authenticated}
                    placeholder="Write an optional note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="flex w-full mt-4 justify-between gap-4 items-center">
                    <Switch
                      disabled={!authenticated}
                      isSelected={showNote}
                      thumbIcon={({ isSelected, className }) =>
                        isSelected ? (
                          <IoMdEye className={className} />
                        ) : (
                          <BsIncognito className={className} />
                        )
                      }
                      onValueChange={(value) => setShowNote(value)}
                    >
                      Show?
                    </Switch>
                    <DatePicker
                      hideTimeZone
                      description="When you want the note to be visible"
                      isDisabled={!showNote}
                      label="Show on"
                      maxValue={today(getLocalTimeZone()).add({ months: 1 })}
                      minValue={today(getLocalTimeZone())}
                      value={showOn}
                      variant="flat"
                      onChange={(value: any) => setShowOn(value)}
                    />
                  </div>
                </div>
                <button
                  className="px-4 py-1 rounded-2xl bg-green-500 mt-4 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
                  disabled={!authenticated}
                  onClick={() => save()}
                >
                  {!authenticated && <IoLockClosed />}
                  Save
                </button>
              </>
            )}
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
              <StatPanel
                stat={stats?.hateHits}
                statColor=""
                title="Hate hits"
              />
              <StatPanel
                stat={stats?.loveHits}
                statColor=""
                title="Love hits"
              />
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
            <div className="mt-6">
              <Table className="w-full">
                <TableHeader>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>Vote</TableColumn>
                  <TableColumn>Notes</TableColumn>
                  <TableColumn>Visible on</TableColumn>
                </TableHeader>
                <TableBody>
                  {records.map((r: Vote) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        {dayjs(r.created_at).format("DD MMM HH:mm")}
                      </TableCell>
                      <TableCell>
                        <span
                          style={{
                            color:
                              r.vote < 0
                                ? "rgb(132, 204, 22)"
                                : "rgb(239, 68, 68)",
                          }}
                        >
                          {r.vote}
                        </span>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <span
                          className={
                            authenticated ||
                            (r.note_visible && dayjs(r.ttv).isBefore(dayjs()))
                              ? ""
                              : "blur-sm"
                          }
                        >
                          {r.note}
                        </span>
                      </TableCell>
                      <TableCell>
                        {r.note_visible && dayjs(r.ttv).isAfter(dayjs()) ? (
                          <span>{dayjs(r.ttv).format("DD MMM HH:mm")}</span>
                        ) : !r.note_visible ? (
                          <BsIncognito />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
