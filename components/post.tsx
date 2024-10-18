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
} from "@nextui-org/modal";
import { useState } from "react";

import AudioPlayer from "./audio-player";
import { reactions } from "./reactions";

import { Vote } from "@/types";

interface PostProps {
  r: Vote;
  authenticated: boolean;
  onReact?: (vote: Vote, key: string) => void;
}

export default function Post({ r, authenticated, onReact }: PostProps) {
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onOpenChange: onImageModalOpenChange,
  } = useDisclosure();
  const [modalCurrentVote, setModalCurrentVote] = useState<Vote>();

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
    onReact?.(vote, key);
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
              <p className="text-sm blur-sm">{r.note}</p>
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
          {!r.reactionObject && r.show_note && !authenticated && (
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
          )}
        </div>
      </div>
    </>
  );
}
