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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
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
import { PiMusicNotesFill } from "react-icons/pi";
import { v4 as uuid4 } from "uuid";
import { LatLngTuple } from "leaflet";
import { RiMapPin5Fill } from "react-icons/ri";
import { BsCloudUploadFill } from "react-icons/bs";
import { useTranslations } from "next-intl";
import { Avatar } from "@nextui-org/avatar";

import { StatPanel } from "@/components/stat-panel";
import {
  BottleMessage,
  Gift,
  GraphPoint,
  Pass,
  Person,
  QuickThought,
  Stats,
  Vote,
  VoteResponse,
} from "@/types";
import { FullPageLoader } from "@/components/full-page-loader";
import { sentences } from "@/config/sentences";
import { LocationPicker } from "@/components/location-picker";
import Heatmap from "@/components/heatmap";
import { quickThoughtReaction, reactions } from "@/components/reactions";
import Post from "@/components/post";
import BottleMessageForm from "@/components/bottle-message";
import Passes from "@/components/passes";
import ProfileBox from "@/components/profile-box";
import RocketMessage from "@/components/rocket-message";
import { adjustCompareData } from "@/services/graph";
import QuickThoughtBox from "@/components/quick-thought";
import Gifts from "@/components/gifts";
import GiftBox from "@/components/gift-box";

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
  const [spotifyToken, setSpotifyToken] = useState<string | undefined>("");
  const [spotifyTracks, setSpotifyTracks] = useState<any[]>([]);
  const voteImagesRef = useRef<HTMLInputElement>(null);
  const [voteImageKey, setVoteImageKey] = useState<string>(uuid4());

  const [randomSentence, setRandomSentence] = useState<string>("");
  const {
    isOpen: isMapModalOpen,
    onOpen: onMapModalOpen,
    onOpenChange: onMapModalOpenChange,
  } = useDisclosure();
  const [location, setLocation] = useState<LatLngTuple | null>(null);
  const [positions, setPositions] = useState<LatLngTuple[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [bottleMessage, setBottleMessage] = useState<
    BottleMessage | undefined
  >();
  const t = useTranslations();
  const [fileName, setFileName] = useState<string>(t("Forms.uploadImage"));
  const [actionPanelShown, setActionPanelShown] = useState<
    | "login"
    | "bottleMessage"
    | "passes"
    | "profile"
    | "rocketMessage"
    | "quickThought"
    | "gift"
    | undefined
  >();
  const [passes, setPasses] = useState<Pass[]>([]);
  const [account, setAccount] = useState<string | undefined>("");
  const [updateChart, setUpdateChart] = useState<boolean>(false);
  const [quickThougth, setQuickThougth] = useState<QuickThought>();
  const [lastGift, setLastGift] = useState<Gift>();
  const [showMore, setShowMore] = useState<boolean>(false);

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
    setRecords(
      json.graph.reverse().map((el: Vote) => {
        el.show_note =
          authenticated || (el.note_visible && dayjs(el.ttv).isBefore(dayjs()));
        const foundReaction = reactions.find((r) => r.key === el.reaction);

        if (foundReaction) {
          el.reactionObject = {
            node: foundReaction.node as JSX.Element,
            label: foundReaction.label,
            by: "Anonymous",
          };
        }

        return el;
      }),
    );
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

    setPositions(
      json.graph
        .filter((el: Vote) => el.latitude && el.longitude)
        .map((el: Vote) => [Number(el.latitude), Number(el.longitude)]),
    );

    setBottleMessage(json.message);
    setPasses(json.passes);
    setQuickThougth(json.quickThought);
    setLastGift(json.gift);
  };

  const save = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("vote", vote.toString());
    formData.append("person_id", params.id);
    formData.append("note", note);
    formData.append(
      "showOn",
      showNote ? showOn?.toDate(getLocalTimeZone()) : null,
    );
    formData.append("showNote", showNote.toString());
    if (voteImagesRef.current?.files && voteImagesRef.current.files[0]) {
      formData.append("image", voteImagesRef.current.files[0]);
    }
    if (location && location[0] > 0 && location[1] > 0) {
      formData.append("latitude", location[0].toString());
      formData.append("longitude", location[1].toString());
    }
    if (audioUrl) {
      try {
        const response = await fetch(audioUrl);
        const audioBlob = await response.blob();
        const audioFile = new File([audioBlob], "audio.webm", {
          type: "audio/webm",
        });

        formData.append("audio", audioFile);
      } catch (err: any) {
        toast.error("Unable to upload audio");
      }
    }

    await fetch("/api/votes", {
      method: "POST",
      body: formData,
    });
    await getSpotifySuggestions();
    currentVote.current = vote as number;
    setVote(0);
    setNote("");
    setShowNote(false);
    setShowOn(now(getLocalTimeZone()));
    onOpen();
    setVoteImageKey(uuid4());
    getRandomSentence();
    setLocation(null);
    await reload();
  };

  const getRandomSentence = () => {
    const list = sentences[currentVote.current < 0 ? "love" : "hate"];

    setRandomSentence(list[Math.floor(Math.random() * list.length)]);
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
      toast.success(t("Page.setPassword.set"));
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
      setActionPanelShown(undefined);
      setCookie("auth", params.id, { maxAge: 30 * 24 * 60 * 60 });
      toast.success("Login successful!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const spotifyLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI}&scope=user-library-read,user-top-read&state=${window.location.href}`;
  };

  const getSpotifySuggestions = async () => {
    if (!getCookie("spotify_token") && getCookie("spotify_refresh_token")) {
      try {
        const response = await fetch(
          `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${getCookie("spotify_refresh_token")}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(
                `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`,
              ).toString("base64")}`,
            },
          },
        );
        const json = await response.json();

        setCookie("spotify_token", json.access_token, {
          maxAge: json.expires_in,
        });
      } catch (err: any) {
        toast.error(err.message);
      }
    } else if (
      !getCookie("spotify_token") &&
      !getCookie("spotify_refresh_token")
    ) {
      return;
    }

    try {
      const genres = currentVote.current > 0 ? ["sad"] : ["happy", "romance"];
      const extraAttributes =
        currentVote.current < 0 ? "&min_danceability=0.8" : "&max_energy=0.2";

      const trackResponse = await fetch(
        `https://api.spotify.com/v1/recommendations?seed_genres=${genres.join(",")}&limit=6&${extraAttributes}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("spotify_token")}`,
          },
        },
      );
      const trackJson = await trackResponse.json();

      setSpotifyTracks(trackJson.tracks);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    reload().then();
    setAuthenticated(getCookie("auth") === params.id);
    setAccount(getCookie("auth"));
    setSpotifyToken(getCookie("spotify_token"));
    fetch(`/api/visit`, {
      method: "POST",
      body: JSON.stringify({
        person_id: params.id,
        auth_cookie: getCookie("auth"),
      }),
    }).then();
  }, []);

  const handleLocationSelect = (lat: number, long: number) => {
    setLocation([lat, long]);
  };

  const handleFileChange = () => {
    const file = voteImagesRef.current?.files
      ? voteImagesRef.current?.files[0]
      : null;

    if (file) {
      setFileName(file.name);
    } else {
      setFileName("Upload image");
    }
  };

  const compare = async () => {
    if (!account) return;

    try {
      const response = await fetch(
        `/api/votes?person_id=${account}&modules=graph`,
      );
      const json: VoteResponse = await response.json();

      if (json.graph) {
        const comparedData = adjustCompareData(records, json.graph);

        if (comparedData) {
          setGraphData(comparedData);
          setUpdateChart(true);
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <main className="container mx-auto max-w-7xl py-4 md:py-16 px-4 flex-grow">
      <div className="flex justify-center min-h-screen">
        <Modal
          hideCloseButton={true}
          isOpen={isMapModalOpen}
          placement="center"
          size="full"
          onOpenChange={onMapModalOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Set location</ModalHeader>
                <ModalBody>
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                </ModalBody>
                <ModalFooter>
                  <button
                    className="px-4 py-1 rounded-2xl bg-red-600"
                    onClick={() => {
                      setLocation(null);
                      onClose();
                    }}
                  >
                    Reset & Close
                  </button>
                  <button
                    className="px-4 py-1 rounded-2xl bg-green-600"
                    onClick={onClose}
                  >
                    Save position
                  </button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

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
                <p className="text-center italic text-sm">{randomSentence}</p>
              </div>
              {spotifyTracks.length > 0 && (
                <div className="grid grid-cols-3 md:grid-col-6 gap-2">
                  {spotifyTracks.map((track: any) => (
                    <Link
                      key={track.id}
                      className="bg-gray-800 rounded-md mt-2 overflow-hidden"
                      href={track.external_urls.spotify}
                      target="_blank"
                    >
                      <img
                        alt={track.album.name}
                        src={track.album.images[0].url}
                      />
                      <div className="px-2 py-1">
                        <h3 className="text-sm font-bold mb-1">{track.name}</h3>
                        <p className="text-xs">
                          {track.artists.map((a: any) => a.name).join(", ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
        <ul className="lightrope">
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
</ul>
        <div className="flex flex-col items-center pt-14">
          <div className="relative">
            <Avatar
              className="mb-2"
              name={person?.name}
              size="lg"
              src={person?.avatar}
            />
            <svg
              className="absolute -top-6 -right-6 w-12 h-12 rotate-45"
              fill="#000000"
              viewBox="0 -0.04 74.25 74.25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g
                  data-name="6"
                  id="_6"
                  transform="translate(-562.336 -261.58)"
                >
                  {" "}
                  <path
                    d="M572.624,311.75l16.162-42.11a8.254,8.254,0,0,1,7.72-5.31h3.3c3.158,0,4.908,1.7,6.84,3.63l.01.02,14.99,16.28a4.154,4.154,0,0,1,.66,4.66l-.29.6-.45.89a4.139,4.139,0,0,1-4.11,2.29l-1.1-.1,7.361,19.151Z"
                    data-name="Path 39"
                    fill="#ee6159"
                    id="Path_39"
                  />{" "}
                  <path
                    d="M623.737,314.5a.118.118,0,0,1-.019,0H572.624a2.748,2.748,0,0,1-2.567-3.735l16.162-42.11a11.066,11.066,0,0,1,10.287-7.075h3.3c4.349,0,6.809,2.46,8.785,4.436a2.663,2.663,0,0,1,.2.223L623.67,282.4a6.951,6.951,0,0,1,1.1,7.753l-.744,1.5a6.919,6.919,0,0,1-3.781,3.39l5.931,15.429a2.753,2.753,0,0,1-2.434,4.033ZM576.625,309h43.09l-5.925-15.414a2.749,2.749,0,0,1,2.814-3.726l1.1.1a1.47,1.47,0,0,0,.158.009,1.4,1.4,0,0,0,1.239-.778l.729-1.469a1.408,1.408,0,0,0-.215-1.609l-14.982-16.271c-.019-.021-.038-.042-.056-.064-1.78-1.774-2.837-2.7-4.771-2.7h-3.3a5.538,5.538,0,0,0-5.151,3.54Z"
                    data-name="Path 40"
                    fill="#151515"
                    id="Path_40"
                  />{" "}
                  <g data-name="Group 18" id="Group_18">
                    {" "}
                    <circle
                      cx="12.012"
                      cy="12.012"
                      data-name="Ellipse 4"
                      fill="#ffffff"
                      id="Ellipse_4"
                      r="12.012"
                      transform="translate(609.811 277.524)"
                    />{" "}
                    <path
                      d="M621.821,304.3a14.771,14.771,0,1,1,4.715-.776A14.752,14.752,0,0,1,621.821,304.3Zm0-24.03a9.264,9.264,0,1,0,8.776,6.307A9.252,9.252,0,0,0,621.824,280.271Z"
                      data-name="Path 41"
                      fill="#151515"
                      id="Path_41"
                    />{" "}
                  </g>{" "}
                  <g data-name="Group 19" id="Group_19">
                    {" "}
                    <line
                      data-name="Line 12"
                      fill="#ec534e"
                      id="Line_12"
                      transform="translate(602.454 291.312)"
                      x2="7.627"
                      y2="0.753"
                    />{" "}
                    <path
                      d="M610.084,294.815c-.09,0-.182,0-.273-.013l-7.627-.753a2.75,2.75,0,0,1,.541-5.474l7.627.754a2.75,2.75,0,0,1-.268,5.486Z"
                      data-name="Path 42"
                      fill="#151515"
                      id="Path_42"
                    />{" "}
                  </g>{" "}
                  <g data-name="Group 20" id="Group_20">
                    {" "}
                    <rect
                      data-name="Rectangle 4"
                      fill="#ffffff"
                      height="21.25"
                      id="Rectangle_4"
                      rx="5.53"
                      transform="translate(565.086 311.75)"
                      width="66.17"
                    />{" "}
                    <path
                      d="M625.726,335.75h-55.11a8.29,8.29,0,0,1-8.28-8.28V317.28a8.29,8.29,0,0,1,8.28-8.28h55.11a8.29,8.29,0,0,1,8.28,8.28v10.19A8.29,8.29,0,0,1,625.726,335.75Zm-55.11-21.25a2.783,2.783,0,0,0-2.78,2.78v10.19a2.783,2.783,0,0,0,2.78,2.78h55.11a2.783,2.783,0,0,0,2.78-2.78V317.28a2.783,2.783,0,0,0-2.78-2.78Z"
                      data-name="Path 43"
                      fill="#151515"
                      id="Path_43"
                    />{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-center uppercase bg-gradient-to-br from-purple-500 to-red-500 bg-clip-text text-transparent">
            {t("Page.title", { name: person?.name || "friend" })}
            <br />
            {t("Page.subtitle")}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {t("Page.wantTrack")}
            <Link className="text-orange-500 hover:underline" href={"/"}>
              {t("Common.here")}
            </Link>
            .
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              className="text-sm px-2 py-1 bg-gray-800 rounded flex items-center gap-2 hover:bg-gray-700"
              onClick={copyUrl}
            >
              <IoShareOutline />
              <span>{t("Page.shareLink")}</span>
            </button>
            <button
              className="text-sm px-2 py-1 bg-gray-800 rounded flex items-center gap-2 hover:bg-gray-700"
              onClick={onQrOpen}
            >
              <IoQrCodeOutline />
              <span>{t("Page.showQr")}</span>
            </button>
          </div>
          {!hasPassword && !loading ? (
            <>
              <div className="mt-6 bg-orange-500 p-2 rounded shadow-brutal shadow-orange-700">
                <RiAlarmWarningLine className="mx-auto text-6xl mb-2" />
                <p className="mb-2">
                  {t("Page.setPassword.start", {
                    name: person?.name || "friend",
                  })}
                </p>
                <p>{t("Page.setPassword.send")}</p>
              </div>
              <form className="flex flex-col mt-4" onSubmit={savePassword}>
                <label
                  className="text-sm text-gray-400 mb-1"
                  htmlFor="password"
                >
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
                  {t("Forms.save")}
                </button>
              </form>
            </>
          ) : (
            <>
              {bottleMessage && (
                <div className="bg-amber-400 py-2 px-4 rounded shadow-brutal shadow-amber-600 mt-4 w-full text-gray-800">
                  <p className="mb-2 text-sm">
                    {t("Page.bottleMessage.message")}
                  </p>
                  <p className="text-sm italic border-l-4 border-amber-500 pl-1 mb-2">
                    &ldquo;{bottleMessage.text}&ldquo;
                  </p>
                  {bottleMessage.image && (
                    <img
                      alt={bottleMessage.text}
                      className="max-w-72 rounded-md mx-auto w-full mb-2"
                      src={bottleMessage.image}
                    />
                  )}
                  <p className="text-xs text-gray-700 text-right">
                    {dayjs(bottleMessage.created_at).format("DD MMM HH:mm")}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap justify-center mt-4 gap-2">
                {!authenticated && (
                  <>
                    <button
                      className="text-sm px-2 py-1 bg-blue-500 rounded flex items-center gap-2 hover:bg-blue-700"
                      onClick={() => setActionPanelShown("login")}
                    >
                      Login
                    </button>
                    <button
                      className="text-sm px-2 py-1 bg-purple-400 rounded flex items-center gap-2 hover:bg-purple-700"
                      onClick={() => setActionPanelShown("bottleMessage")}
                    >
                      {t("Page.bottleMessage.button")}
                    </button>
                    <button
                      className="text-sm px-2 py-1 bg-indigo-400 rounded flex items-center gap-2 hover:bg-indigo-700"
                      onClick={() => setActionPanelShown("rocketMessage")}
                    >
                      {t("Page.rocketMessage.button")}
                    </button>
                    <button
                      className="text-sm px-2 py-1 bg-sky-500 rounded flex items-center gap-2 hover:bg-sky-700"
                      onClick={() => setActionPanelShown("quickThought")}
                    >
                      {t("Page.quickThought.button")}
                    </button>
                  </>
                )}
                <button
                  className="text-sm px-2 py-1 bg-teal-500 rounded flex items-center gap-2 hover:bg-teal-700"
                  onClick={() => setActionPanelShown("passes")}
                >
                  {t("Page.passes.button", {
                    num: passes.filter((p) => !p.expired).length,
                  })}
                </button>
                <button
                  className="text-sm px-2 py-1 bg-amber-600 rounded flex items-center gap-2 hover:bg-amber-800"
                  onClick={() => setActionPanelShown("gift")}
                >
                  {t("Page.gifts.button")}
                </button>
                {authenticated && (
                  <button
                    className="text-sm px-2 py-1 bg-purple-500 rounded flex items-center gap-2 hover:bg-purple-700"
                    onClick={() => setActionPanelShown("profile")}
                  >
                    {t("Page.profile.button")}
                  </button>
                )}
              </div>
              {actionPanelShown === "login" && (
                <div className="bg-blue-500 py-2 px-4 rounded shadow-brutal shadow-blue-700 mt-4 w-full">
                  <p className="mb-2 text-sm">{t("Page.setPassword.insert")}</p>
                  <form className="flex gap-2" onSubmit={login}>
                    <input
                      className="bg-gray-700 px-2 py-1 focus:outline-none rounded text-sm flex-1"
                      id="password"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="px-6 py-1 rounded bg-blue-600 text-sm">
                      Login
                    </button>
                  </form>
                </div>
              )}
              {actionPanelShown === "bottleMessage" && (
                <BottleMessageForm person={person} onSaved={reload} />
              )}
              {actionPanelShown === "passes" && (
                <Passes
                  authenticated={authenticated}
                  passes={passes}
                  person={person}
                  onSaved={reload}
                />
              )}
              {actionPanelShown === "profile" && person && (
                <ProfileBox
                  person={person}
                  onSaved={async () => {
                    await reload();
                    setActionPanelShown(undefined);
                  }}
                />
              )}
              {actionPanelShown === "rocketMessage" && (
                <RocketMessage
                  person={person}
                  onFinished={() => setActionPanelShown(undefined)}
                />
              )}
              {actionPanelShown === "quickThought" && (
                <QuickThoughtBox person={person} onReact={reload} />
              )}
              {actionPanelShown === "gift" && (
                <Gifts
                  authenticated={authenticated}
                  person={person}
                  onReact={async () => {
                    setActionPanelShown(undefined);
                    await reload();
                  }}
                />
              )}
              {quickThougth && (
                <>
                  <p className="text-sm mt-4 mb-2">
                    {t("Page.quickThought.message", {
                      time: dayjs(quickThougth.created_at).format(
                        "DD MMM HH:mm",
                      ),
                    })}
                  </p>
                  <p className="text-4xl px-4 py-2 bg-gray-800 rounded-md">
                    {
                      quickThoughtReaction.find(
                        (r) => r.key === quickThougth.reaction,
                      )?.node
                    }
                  </p>
                </>
              )}
              {lastGift && (
                <div className="bg-gray-700 py-2 px-4 rounded shadow-brutal shadow-gray-600 mt-4 max-w-48">
                  <p className="mb-1 text-xs font-semibold text-center">
                    {t("Page.gifts.message")}
                  </p>
                  <GiftBox authenticated={authenticated} gift={lastGift} />
                </div>
              )}
              {authenticated && (
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
                    label={t("Page.hateLabel")}
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
                    <h3 className="font-semibold mb-2">
                      {t("Page.noteLabel")}
                    </h3>
                    <textarea
                      className="bg-gray-700 px-2 py-1 focus:outline-none rounded resize-none w-full text-white h-32 text-sm disabed:opacity-70"
                      disabled={!authenticated}
                      placeholder={t("Page.notePlaceholder")}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    {/* <VoiceRecorder
                    className="bg-gray-800 rounded p-2"
                    onRecorded={(audioUrl: string | undefined) => {
                      setAudioUrl(audioUrl);
                    }}
                  /> */}
                    <div className="flex justify-between w-full mt-2 items-center gap-4">
                      <input
                        key={voteImageKey}
                        ref={voteImagesRef}
                        accept="image/*"
                        className="hidden"
                        id="note-image"
                        multiple={false}
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label
                        className="flex gap-2 items-center text-xs bg-gray-800 rounded px-2 py-1"
                        htmlFor="note-image"
                      >
                        <BsCloudUploadFill />
                        <span>{fileName}</span>
                      </label>
                      <button
                        className="flex gap-2 items-center text-xs bg-gray-800 rounded px-2 py-1"
                        onClick={onMapModalOpen}
                      >
                        <RiMapPin5Fill />
                        <span>
                          {location
                            ? t("Forms.editLocation")
                            : t("Forms.addLocation")}
                        </span>
                      </button>
                    </div>
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
                        {t("Page.showNote")}
                      </Switch>
                      <DatePicker
                        hideTimeZone
                        description={t("Forms.showOnDescription")}
                        isDisabled={!showNote}
                        label={t("Forms.showOnLabel")}
                        maxValue={today(getLocalTimeZone()).add({ months: 1 })}
                        minValue={today(getLocalTimeZone())}
                        value={showOn}
                        variant="flat"
                        onChange={(value: any) => setShowOn(value)}
                      />
                    </div>
                  </div>
                  <button
                    className="px-4 py-1 rounded-2xl bg-green-600 mt-4 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
                    disabled={!authenticated}
                    onClick={() => save()}
                  >
                    {!authenticated && <IoLockClosed />}
                    {t("Forms.save")}
                  </button>
                  {!spotifyToken && (
                    <div className="bg-gray-900 rounded-md p-2 w-full mt-4">
                      <p className="text-sm">
                        <PiMusicNotesFill className="inline" />{" "}
                        {t("Page.spotifyLogin")}
                      </p>
                      <button
                        className="mx-auto px-4 py-1 rounded-2xl bg-green-600 mt-2 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
                        onClick={spotifyLogin}
                      >
                        Spotify login
                      </button>
                    </div>
                  )}
                </>
              )}
              <p className="text-center text-3xl font-black mt-6">
                {t("Page.average")}
                <br />
                {average || "-"}
              </p>
              <div className="mt-6 overflow-x-auto">
                <Line data={graphData} options={options} redraw={updateChart} />
              </div>
              {lastRecord && (
                <p className="text-center">
                  {t("Page.lastRecord", {
                    hour: dayjs(lastRecord).format("DD MMM HH:mm"),
                  })}
                </p>
              )}
              {!authenticated && account && (
                <button
                  className="mt-2 px-6 py-1 rounded bg-blue-600 text-sm"
                  onClick={compare}
                >
                  {t("Page.compare")}
                </button>
              )}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatPanel
                  stat={stats?.hatePeak}
                  statColor="#ef4444"
                  title={t("Page.hatePeak")}
                />
                <StatPanel
                  stat={stats?.lovePeak}
                  statColor="#84cc16"
                  title={t("Page.lovePeak")}
                />
                <StatPanel
                  stat={stats?.hateHits}
                  statColor=""
                  title={t("Page.hateHits")}
                />
                <StatPanel
                  stat={stats?.loveHits}
                  statColor=""
                  title={t("Page.loveHits")}
                />
                <StatPanel
                  stat={stats?.hateHour}
                  statColor=""
                  title={t("Page.mostHatedHour")}
                />
                <StatPanel
                  stat={stats?.loveHour}
                  statColor=""
                  title={t("Page.mostLovedHour")}
                />
              </div>
              {positions.length > 0 && <Heatmap coords={positions} />}
              <div className="flex flex-col w-full mt-4 divide-y divide-gray-800">
                {records.slice(0, 5).map((r: Vote) => (
                  <Post
                    key={r.id}
                    authenticated={authenticated}
                    r={r}
                    onReact={() => reload()}
                  />
                ))}
                {!showMore && (
                  <button className="py-2" onClick={() => setShowMore(true)}>
                    {t("Page.showMore")}
                  </button>
                )}
                {showMore &&
                  records
                    .slice(5)
                    .map((r: Vote) => (
                      <Post
                        key={r.id}
                        authenticated={authenticated}
                        r={r}
                        onReact={() => reload()}
                      />
                    ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
