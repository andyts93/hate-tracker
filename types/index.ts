import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Vote = {
  id: number;
  created_at: string;
  vote: number;
  note: string;
};

export type GraphPoint = {
  created_at?: string;
  vote: number;
};

export type Stats = {
  hatePeak: GraphPoint;
  lovePeak: GraphPoint;
  hateHits: GraphPoint;
  loveHits: GraphPoint;
  loveHour: GraphPoint;
  hateHour: GraphPoint;
};

export type Person = {
  id: string;
  name: string;
};
