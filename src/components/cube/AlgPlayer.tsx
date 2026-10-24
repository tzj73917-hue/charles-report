"use client";

import { useEffect, useMemo, useState } from "react";
import {
  applyMoves,
  describeMove,
  formatMove,
  invertMove,
  invertMoves,
  parseAlg,
  solvedCube,
} from "@/lib/cube";
import Cube3D from "./Cube3D";
import { useCube } from "./useCube";

interface Props {
  alg: string;
  // 預設以公式的反向打亂，讓方塊呈現「這個公式要解決的情況」
  startSolved?: boolean;
  size?: number;
  caption?: string;
  // split：左邊方塊、右邊逐步公式說明
  layout?: "compact" | "split";
  title?: string;
  description?: string;
  // 每一步的解說（長度與公式步數相同），顯示在「目前步驟」框裡
  notes?: string[];
}

export default function AlgPlayer({
  alg,
  startSolved,
  size = 34,
  caption,
  layout = "compact",
  title,
  description,
  notes,
}: Props) {
  const moves = useMemo(() => parseAlg(alg), [alg]);
  const start = useMemo(
    () => (startSolved ? solvedCube() : applyMoves(solvedCube(), invertMoves(moves))),
    [moves, startSolved],
  );
  const [speed, setSpeed] = useState(1);
  const cube = useCube(() => start, speed);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);

  const done = pos >= moves.length;
  const { busy, enqueue } = cube;

  useEffect(() => {
    if (!playing || busy) return;
    const t = setTimeout(() => {
      if (pos >= moves.length) {
        setPlaying(false);
        return;
      }
      enqueue(moves[pos]);
      setPos(pos + 1);
    }, layout === "split" ? 350 : 80);
    return () => clearTimeout(t);
  }, [playing, busy, enqueue, pos, moves, layout]);

  function next() {
    if (cube.busy || done) return;
    setPlaying(false);
    cube.enqueue(moves[pos]);
    setPos(pos + 1);
  }

  function prev() {
    if (cube.busy || pos === 0) return;
    setPlaying(false);
    cube.enqueue(invertMove(moves[pos - 1]));
    setPos(pos - 1);
  }

  function reset() {
    setPlaying(false);
    setPos(0);
    cube.reset(start);
  }

  function jumpTo(i: number) {
    if (cube.busy) return;
    setPlaying(false);
    cube.reset(applyMoves(start, moves.slice(0, i)));
    setPos(i);
  }

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (done) {
      cube.reset(start);
      setPos(0);
    }
    setPlaying(true);
  }

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-line bg-surface px-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink";

  const controls = (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" className={btn} onClick={reset} aria-label="重設">
          ⟲
        </button>
        <button type="button" className={btn} onClick={prev} disabled={pos === 0} aria-label="上一步">
          ◀
        </button>
        <button
          type="button"
          className={`${btn} min-w-20 !border-accent !bg-accent !text-on-accent hover:opacity-90`}
          onClick={togglePlay}
        >
          {playing ? "暫停" : done ? "重播" : "播放"}
        </button>
        <button type="button" className={btn} onClick={next} disabled={done} aria-label="下一步">
          ▶
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
          title="切換速度"
        >
          {speed}×
        </button>
      </div>
      <p className="text-xs text-muted">
        步驟 {pos} / {moves.length}
      </p>
    </>
  );

  if (layout === "split") {
    // 正在轉（或剛轉完）的那一步；還沒開始時指向第一步
    const focus = pos === 0 ? 0 : pos - 1;
    const focusInfo = describeMove(moves[focus]);
    return (
      <figure className="grid gap-6 rounded-2xl border border-line bg-surface-2 p-4 sm:p-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
        <div className="flex flex-col items-center gap-3">
          <Cube3D stickers={cube.stickers} anim={cube.anim} duration={cube.duration} size={size} />
          {controls}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {title && <h3 className="text-xl font-semibold text-ink">{title}</h3>}
          {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted">公式</p>
            <p className="alg inline-block text-lg">{alg}</p>
          </div>

          <div
            className="rounded-xl border border-accent bg-accent-soft px-4 py-3"
            aria-live="polite"
          >
            <p className="text-xs text-muted">
              {done ? "完成！" : pos === 0 ? "第一步" : `第 ${pos} 步`}
            </p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-2xl font-bold text-accent">{formatMove(moves[focus])}</span>
              <span className="text-ink">
                {focusInfo.label} {focusInfo.turn}
              </span>
              {focusInfo.hint && <span className="text-sm text-muted">· {focusInfo.hint}</span>}
            </p>
            {notes?.[focus] && <p className="mt-2 text-sm leading-relaxed text-ink">💡 {notes[focus]}</p>}
          </div>

          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" aria-label="公式步驟">
            {moves.map((m, i) => {
              const info = describeMove(m);
              const current = i === pos - 1;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    title={`跳到第 ${i + 1} 步之前`}
                    className={`flex w-full flex-col items-start rounded-lg border px-3 py-2 text-left transition ${
                      current
                        ? "border-accent bg-accent-soft"
                        : i < pos
                          ? "border-line bg-surface opacity-50"
                          : "border-line bg-surface hover:border-accent"
                    }`}
                  >
                    <span className="flex w-full items-baseline justify-between gap-2">
                      <span className="font-mono text-lg font-bold text-ink">{formatMove(m)}</span>
                      <span className="font-mono text-[10px] text-muted">{i + 1}</span>
                    </span>
                    <span className="text-xs text-muted">
                      {info.label}
                      {info.hint ? `・${info.hint}` : `・${info.turn}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {caption && <figcaption className="text-sm text-muted">{caption}</figcaption>}
        </div>
      </figure>
    );
  }

  return (
    <figure className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface-2 p-4">
      <Cube3D stickers={cube.stickers} anim={cube.anim} duration={cube.duration} size={size} />

      <div className="flex flex-wrap justify-center gap-1.5 font-mono text-sm" aria-label="公式步驟">
        {moves.map((m, i) => (
          <button
            key={i}
            type="button"
            onClick={() => jumpTo(i)}
            className={`rounded-md px-1.5 py-0.5 transition ${
              i === pos - 1
                ? "bg-accent text-on-accent"
                : i < pos
                  ? "text-muted"
                  : "text-ink hover:bg-line"
            }`}
            title={`跳到第 ${i + 1} 步之前`}
          >
            {formatMove(m)}
          </button>
        ))}
      </div>

      {controls}
      {caption && <figcaption className="text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
