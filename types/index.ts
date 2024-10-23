import { ReactionCounterObject } from "@charkour/react-reactions";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Vote = {
  id?: number;
  created_at?: string;
  vote: number;
  note: string;
  note_visible: boolean;
  ttv?: string | null;
  image?: string | null;
  person_id?: string;
  latitude?: number;
  longitude?: number;
  show_note?: boolean;
  reaction?: string;
  reactionObject?: ReactionCounterObject;
  audio_file?: string;
  gif_reaction?: string;
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
  avatar?: string;
};

export type BottleMessage = {
  id?: number;
  text: string;
  person_id: string;
  image?: string;
  created_at?: string;
};

export type Pass = {
  id?: number;
  person_id?: string;
  title?: string;
  icon?: string;
  description?: string;
  conditions?: string;
  uses_max?: number | string;
  uses_left?: number;
  created_at?: string;
  expires_at?: string;
};
