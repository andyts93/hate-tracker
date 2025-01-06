import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
export default function MissingMeterScoreDisplay({ score }: { score: number }) {
  const emptyValues = Array.from({ length: 4 - score });
  const fullValues = Array.from({ length: score });

  return (
    <div className="flex gap-0.5">
      {fullValues.map((_, idx) => (
        <IoIosHeart key={idx} className="text-white" />
      ))}
      {emptyValues.map((_, idx) => (
        <IoIosHeartEmpty key={idx} className="text-white" />
      ))}
    </div>
  );
}
