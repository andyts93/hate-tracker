import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { useTranslations } from "next-intl";
import { LuInfo } from "react-icons/lu";
import { BsRocketTakeoff } from "react-icons/bs";
import toast from "react-hot-toast";
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";

import { FullPageLoader } from "./full-page-loader";

import { Person } from "@/types";

interface RocketMessageProps {
  person?: Person;
  onFinished?: () => void;
}

export default function RocketMessage({
  person,
  onFinished,
}: RocketMessageProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showRocket, setShowRocket] = useState<boolean>(false);
  const [dotLottie, setDotLottie] = useState<DotLottie>();

  const t = useTranslations();

  const saveMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/rocket-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, person_id: person?.id }),
      });

      setLoading(false);

      if (res.ok) {
        setMessage("");
        setShowRocket(true);
        toast.success(t("Page.rocketMessage.sent"));
      } else {
        const json = await res.json();

        toast.error(json.error);
      }
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // This function will be called when the animation is completed.
    function onComplete() {
      onFinished?.();
    }

    // Listen to events emitted by the DotLottie instance when it is available.
    if (dotLottie) {
      dotLottie.addEventListener("complete", onComplete);
    }

    return () => {
      // Remove event listeners when the component is unmounted.
      if (dotLottie) {
        dotLottie.removeEventListener("complete", onComplete);
      }
    };
  }, [dotLottie]);

  const dotLottieRefCallback = (dotLottie: DotLottie) => {
    setDotLottie(dotLottie);
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("Page.rocketMessage.modal.title")}</ModalHeader>
          <ModalBody>
            <p className="mb-2">
              {t("Page.rocketMessage.modal.description", {
                name: person?.name,
              })}
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="bg-indigo-400 rounded shadow-brutal shadow-indigo-600 mt-4 w-full overflow-hidden">
        {showRocket ? (
          <div className="w-full h-96 -mt-10 -mb-3">
            <DotLottieReact
              autoplay
              dotLottieRefCallback={dotLottieRefCallback}
              src="/rocket.lottie"
            />
          </div>
        ) : (
          <div className="py-2 px-4">
            <p className="mb-2 text-sm font-semibold flex items-center mt-1">
              <BsRocketTakeoff className="text-xl mr-2" />
              <span>
                {t("Page.rocketMessage.title", { name: person?.name })}
              </span>
              <button onClick={onOpen}>
                <LuInfo className="ml-1" />
              </button>
            </p>
            <form className="flex flex-col" onSubmit={saveMessage}>
              <textarea
                className="bg-gray-800 px-2 py-1 focus:outline-none rounded text-sm h-24 resize-none mb-2"
                placeholder={t("Page.bottleMessage.messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="px-2 py-1 rounded bg-indigo-600 mt-2 text-sm">
                {t("Page.rocketMessage.send")}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
