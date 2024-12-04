"use client";
import Snowfall from "react-snowfall";

export default function SnowfallComponent() {
  return (
    <Snowfall
        snowflakeCount={100}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 100,
      }}
    />
  );
}
