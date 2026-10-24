"use client";

import { useMemo } from "react";
import { solvedCube, type Sticker } from "@/lib/cube";
import Cube3D from "./Cube3D";

const pieceKind = (s: Sticker) => s.pos.filter((v) => v !== 0).length; // 1 中心、2 邊塊、3 角塊

// 每一步完成時「已經確定」的貼紙；其他的以灰色表示還不用管
const SHOWN: Record<string, (s: Sticker) => boolean> = {
  "white-cross": (s) => pieceKind(s) === 1 || (s.pos[1] === -1 && pieceKind(s) === 2),
  "white-corners": (s) => pieceKind(s) === 1 || s.pos[1] === -1,
  "middle-layer": (s) => pieceKind(s) === 1 || s.pos[1] <= 0,
  "yellow-cross": (s) =>
    pieceKind(s) === 1 || s.pos[1] <= 0 || (pieceKind(s) === 2 && s.n[1] === 1),
  "yellow-face": (s) => pieceKind(s) === 1 || s.pos[1] <= 0 || s.n[1] === 1,
  "yellow-corners": (s) =>
    pieceKind(s) === 1 || s.pos[1] <= 0 || s.n[1] === 1 || pieceKind(s) === 3,
  "yellow-edges": () => true,
};

const BOTTOM_VIEW = { rx: 32, ry: -38 };
const TOP_VIEW = { rx: -28, ry: -38 };

export default function StepGoal({ slug, size = 40 }: { slug: string; size?: number }) {
  const stickers = useMemo(() => solvedCube(), []);
  const fromBelow = slug === "white-cross" || slug === "white-corners";
  return (
    <div className="flex flex-col items-center gap-2">
      <Cube3D
        stickers={stickers}
        anim={null}
        duration={0}
        size={size}
        shown={SHOWN[slug]}
        initialView={fromBelow ? BOTTOM_VIEW : TOP_VIEW}
        showBase={!fromBelow}
      />
      <p className="text-xs text-muted">
        {fromBelow ? "從底下往上看（白色面在下）" : "從上方看（黃色面在上）"}・灰色＝這一步還不用管・可拖曳旋轉
      </p>
    </div>
  );
}
