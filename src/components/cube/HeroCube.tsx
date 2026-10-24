"use client";

import { useEffect, useRef } from "react";
import { invertMoves, randomScramble, solvedCube, type Move } from "@/lib/cube";
import Cube3D from "./Cube3D";
import { useCube } from "./useCube";

// 首頁裝飾用：自動打亂再轉回來，不斷循環
export default function HeroCube({ size = 54 }: { size?: number }) {
  const { stickers, anim, duration, enqueue, busy } = useCube(solvedCube, 0.8);
  const pending = useRef<Move[] | null>(null);

  useEffect(() => {
    if (busy) return;
    const t = setTimeout(() => {
      if (pending.current) {
        enqueue(pending.current);
        pending.current = null;
      } else {
        const moves = randomScramble(8);
        enqueue(moves);
        pending.current = invertMoves(moves);
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [busy, enqueue]);

  return <Cube3D stickers={stickers} anim={anim} duration={duration} size={size} />;
}
