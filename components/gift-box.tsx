import dayjs from "dayjs";

import { Coin } from "./icons";

import { Gift } from "@/types";

export default function GiftBox({
  authenticated,
  gift,
  children,
}: {
  authenticated: boolean;
  gift: Gift;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-white rounded-md p-2">
      {!authenticated ? (
        <p className="text-md text-black mb-2 text-right font-bold flex items-center justify-end gap-1">
          <Coin />
          {gift.price}
        </p>
      ) : (
        <p className="text-xs text-gray-700 mb-2 text-right flex items-center justify-end gap-1">
          {dayjs(gift.gifted_at).format("DD MMM HH:mm")}
        </p>
      )}
      <div dangerouslySetInnerHTML={{ __html: gift.svg }} />
      <p className="text-xs text-black font-semibold mt-2 text-center">
        {gift.name}
      </p>
      {children}
    </div>
  );
}
