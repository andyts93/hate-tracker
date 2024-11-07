import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { AiOutlineGift } from "react-icons/ai";
import { BiCoinStack } from "react-icons/bi";
import dayjs from "dayjs";

import { FullPageLoader } from "./full-page-loader";

import { Gift, Person } from "@/types";
import { Coin } from "./icons";
import GiftBox from "./gift-box";

export default function Gifts({
  person,
  authenticated,
  onReact,
}: {
  person?: Person;
  authenticated: boolean;
  onReact?: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const t = useTranslations("Page.gifts");

  const getGiftList = async () => {
    setLoading(true);
    try {
      const res = await fetch("api/gift");
      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        return toast.error(data.error);
      }
      setGifts(data);
    } catch (err: any) {
      setLoading(false);

      return toast.error(err.message);
    }
  };

  const getPersonGifts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/person/${person?.id}/gift`);
      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        return toast.error(data.error);
      }
      setGifts(data);
    } catch (err: any) {
      setLoading(false);

      return toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!authenticated) {
      getGiftList().then();
    } else {
      getPersonGifts().then();
    }
  }, []);

  const buy = async (gift_id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/person/${person?.id}/gift`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gift_id }),
      });
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
    onReact?.();
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <div className="bg-amber-600 py-2 px-4 rounded shadow-brutal shadow-amber-800 mt-4 w-full">
        <p className="mb-2 text-sm font-semibold flex items-center mt-1">
          <AiOutlineGift className="text-xl mr-2" />
          <span>
            {t(authenticated ? "title-auth" : "title", { name: person?.name })}
          </span>
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {gifts.map((gift) => (
            <GiftBox key={gift.id} authenticated={authenticated} gift={gift}>
              {!authenticated && (
                <button
                  className="text-sm px-2 py-1 bg-amber-600 rounded gap-2 hover:bg-amber-800 text-center mt-2"
                  onClick={() => buy(gift.id)}
                >
                  {t("buy")}
                </button>
              )}
            </GiftBox>
          ))}
        </div>
      </div>
    </>
  );
}
