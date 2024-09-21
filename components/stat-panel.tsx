import dayjs from "dayjs";

import { GraphPoint } from "@/types";

export const StatPanel = ({
  title,
  stat,
  statColor,
}: {
  title: string;
  stat: GraphPoint | undefined;
  statColor: string;
}) => {
  return (
    <div className="flex flex-col text-center border border-gray-700 p-1 shadow-brutal-sm shadow-gray-600">
      <h2 className="text-gray-400">{title}</h2>
      <p className="font-bold text-xl" style={{ color: statColor }}>
        {stat?.vote || "-"}
      </p>
      <p className="text-gray-500 text-xs">
        {stat?.created_at
          ? dayjs(stat?.created_at).format("DD MMM HH:mm")
          : "-"}
      </p>
    </div>
  );
};
