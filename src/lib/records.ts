"use client";

import { useMemo, useSyncExternalStore } from "react";

// 各關卡的最佳紀錄，存在瀏覽器的 localStorage（無法使用時只保留在記憶體）
export interface LevelRecord {
  bestTime: number;
  bestMoves: number;
  stars: number;
}

export type Records = Record<string, LevelRecord>;

const KEY = "cube-level-records-v1";
const listeners = new Set<() => void>();
let memory = "";

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

export function useRecords(): Records {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "");
  return useMemo(() => {
    try {
      return raw ? (JSON.parse(raw) as Records) : {};
    } catch {
      return {};
    }
  }, [raw]);
}

export function saveRecord(levelId: string, time: number, moves: number, stars: number) {
  let records: Records = {};
  try {
    records = JSON.parse(getSnapshot() || "{}");
  } catch {}
  const old = records[levelId];
  records[levelId] = {
    bestTime: Math.min(time, old?.bestTime ?? Infinity),
    bestMoves: Math.min(moves, old?.bestMoves ?? Infinity),
    stars: Math.max(stars, old?.stars ?? 0),
  };
  memory = JSON.stringify(records);
  try {
    localStorage.setItem(KEY, memory);
  } catch {}
  listeners.forEach((l) => l());
}

export function clearRecords() {
  memory = "";
  try {
    localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}
