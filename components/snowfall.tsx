"use client";
import Snowfall from "react-snowfall";

export default function SnowfallComponent({
  images,
  snowflakeCount,
}: {
  images: CanvasImageSource[];
  snowflakeCount: number;
}) {
  return (
    <Snowfall
      images={images}
      radius={[10, 20]}
      snowflakeCount={snowflakeCount}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 100,
      }}
    />
  );
}
