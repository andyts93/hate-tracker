import dayjs from "dayjs";
import { MdLockClock } from "react-icons/md";
import { BsIncognito } from "react-icons/bs";
import {
  ReactionBarSelector,
  ReactionCounter,
} from "@charkour/react-reactions";
import toast from "react-hot-toast";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/modal";
import { useState } from "react";
import GifPicker, { TenorImage, Theme } from "gif-picker-react";
import { RiSearchLine } from "react-icons/ri";
import CryptoJS from "crypto-js";

import AudioPlayer from "./audio-player";
import { reactions } from "./reactions";

import { Vote } from "@/types";
import { siteConfig } from "@/config/site";

interface PostProps {
  r: Vote;
  authenticated: boolean;
  onReact?: (vote: Vote) => void;
}

export default function Post({ r, authenticated, onReact }: PostProps) {
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onOpenChange: onImageModalOpenChange,
  } = useDisclosure();
  const [modalCurrentVote, setModalCurrentVote] = useState<Vote>();
  const [showTenorPicker, setShowTenorPicker] = useState<boolean>(false);

  const showImage = (vote: Vote) => {
    setModalCurrentVote(vote);
    onImageModalOpen();
  };

  const reactVote = async (vote: Vote, key: string) => {
    try {
      await fetch(`/api/votes/${vote.id}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });
    } catch (err: any) {
      toast.error(err.message);
    }
    onReact?.(vote);
  };

  const reactGif = async (vote: Vote, gif: TenorImage) => {
    try {
      await fetch(`/api/votes/${vote.id}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gif: gif.url }),
      });
    } catch (err: any) {
      toast.error(err.message);
    }
    onReact?.(vote);
  };

  const encryptString = (text: string) => {
    return CryptoJS.AES.encrypt(text, siteConfig.cryptoKey).toString();
  };

  return (
    <>
      {isImageModalOpen && (
        <Modal
          isOpen={isImageModalOpen}
          placement="center"
          size="full"
          onOpenChange={onImageModalOpenChange}
        >
          <ModalContent>
            <ModalBody className="pt-12">
              {modalCurrentVote && (
                <>
                  <img alt="Note" src={String(modalCurrentVote.image)} />
                  <p className="text-xs">{modalCurrentVote.note}</p>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      <div key={r.id} className="p-3 w-full flex justify-between gap-4">
        <h3
          className="text-xl font-black w-10 text-right"
          style={{
            color: r.vote < 0 ? "rgb(132, 204, 22)" : "rgb(239, 68, 68)",
          }}
        >
          {r.vote}
        </h3>
        <div className="flex-1">
          <p className="text-xs mb-1 text-gray-400 font-light">
            {dayjs(r.created_at).format("DD MMM HH:mm")}
          </p>
          {r.show_note || authenticated ? (
            <>
              <p className="text-sm mb-2">{r.note}</p>
              {r.image && (
                <button onClick={() => showImage(r)}>
                  <img
                    alt={r.note}
                    className="rounded-md"
                    src={String(r.image)}
                  />
                </button>
              )}
              {r.audio_file && <AudioPlayer src={r.audio_file} />}
              {dayjs(r.ttv).isAfter(dayjs()) && (
                <div className="flex items-center gap-2">
                  <MdLockClock className="text-orange-400" />
                  <p className="text-xs italic">
                    Unlocks on <b>{dayjs(r.ttv).format("DD MMM HH:mm")}</b>
                  </p>
                </div>
              )}
              {!r.note_visible && <BsIncognito />}
            </>
          ) : dayjs(r.ttv).isAfter(dayjs()) ? (
            <div className="flex items-center gap-2">
              <MdLockClock className="w-6 h-6 text-orange-400" />
              <p className="text-xs italic">
                Unlocks on <b>{dayjs(r.ttv).format("DD MMM HH:mm")}</b>
              </p>
            </div>
          ) : (
            <div className="relative">
              <p className="text-sm blur-sm break-all">
                {encryptString(r.note).substring(0, 40)}
              </p>
              <BsIncognito className="absolute top-[50%] left-[50%] -mt-5 -ml-5 w-10 h-10 text-white" />
            </div>
          )}
          {r.reactionObject && (
            <ReactionCounter
              className="reactions-container"
              iconSize={24}
              reactions={[r.reactionObject]}
              showReactsOnly={true}
            />
          )}
          {r.gif_reaction && (
            <img
              alt="GIF Reaction"
              className="rounded-md"
              src={r.gif_reaction}
            />
          )}
          {!r.reactionObject &&
            r.show_note &&
            !authenticated &&
            !r.gif_reaction && (
              <>
                <div className="flex items-center">
                  <ReactionBarSelector
                    iconSize={16}
                    reactions={reactions}
                    style={{
                      backgroundColor: "black",
                      paddingLeft: 5,
                      paddingRight: 10,
                    }}
                    onSelect={(key: string) => reactVote(r, key)}
                  />
                  <button
                    className="text-sm px-2 py-1 bg-gray-800 rounded flex items-center gap-2 hover:bg-gray-700 my-1"
                    onClick={() => setShowTenorPicker(!showTenorPicker)}
                  >
                    <RiSearchLine /> GIF
                  </button>
                </div>
                {showTenorPicker && (
                  <GifPicker
                    autoFocusSearch={false}
                    tenorApiKey={String(process.env.NEXT_PUBLIC_TENOR_API_KEY)}
                    theme={Theme.DARK}
                    width={"100%"}
                    onGifClick={(gif: TenorImage) => reactGif(r, gif)}
                  />
                )}
              </>
            )}
        </div>
      </div>
    </>
  );
}
