"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { applyMove, type Move, type Sticker } from "@/lib/cube";

export interface CubeAnim {
  move: Move;
  running: boolean;
}

interface Queued {
  id: number;
  move: Move;
}

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

// 管理方塊狀態與轉動動畫：轉動會排隊依序播放
export function useCube(initial: () => Sticker[], speed = 1) {
  const [stickers, setStickers] = useState<Sticker[]>(initial);
  const [queue, setQueue] = useState<Queued[]>([]);
  const [running, setRunning] = useState(false);
  const nextId = useRef(0);
  const reduceMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );

  const current = queue[0];
  const baseDuration = reduceMotion ? 0 : 320 / speed;
  const duration = current?.move.amount === 2 ? baseDuration * 1.4 : baseDuration;

  // 等兩個畫格讓起始角度生效後才開始過場
  useEffect(() => {
    if (!current || running) return;
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      if (duration === 0) {
        setStickers((s) => applyMove(s, current.move));
        setQueue((q) => q.slice(1));
        return;
      }
      id2 = requestAnimationFrame(() => setRunning(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [current, running, duration]);

  // 過場結束後寫入新狀態
  useEffect(() => {
    if (!current || !running) return;
    const t = setTimeout(() => {
      setStickers((s) => applyMove(s, current.move));
      setQueue((q) => q.slice(1));
      setRunning(false);
    }, duration + 20);
    return () => clearTimeout(t);
  }, [current, running, duration]);

  const enqueue = useCallback((moves: Move | Move[]) => {
    const list = Array.isArray(moves) ? moves : [moves];
    setQueue((q) => [...q, ...list.map((move) => ({ id: nextId.current++, move }))]);
  }, []);

  const reset = useCallback((next: Sticker[]) => {
    setQueue([]);
    setRunning(false);
    setStickers(next);
  }, []);

  const anim: CubeAnim | null = current ? { move: current.move, running } : null;

  return { stickers, anim, duration, enqueue, reset, busy: queue.length > 0 };
}
