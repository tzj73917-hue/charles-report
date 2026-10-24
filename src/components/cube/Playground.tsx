"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import {
  applyMoves,
  checkGoal,
  formatMove,
  parseAlg,
  randomScramble,
  solvedCube,
  type Move,
} from "@/lib/cube";
import { FREE_LEVEL, GOAL_TEXT, LEVELS, starRule, starsFor, type Level } from "@/lib/levels";
import { clearRecords, saveRecord, useRecords } from "@/lib/records";
import Cube3D from "./Cube3D";
import { useCube } from "./useCube";

const FACES = ["U", "D", "F", "B", "R", "L"] as const;
const ROTATIONS = ["x", "y", "z", "M"] as const;
const isRotation = (m: Move) => "xyz".includes(m.name);

type Status = "idle" | "ready" | "solving" | "done";

interface Result {
  time: number;
  moves: number;
  stars: number;
  isBest: boolean;
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const cs = Math.floor((ms % 1000) / 10);
  return `${m > 0 ? `${m}:` : ""}${m > 0 ? String(s % 60).padStart(2, "0") : s % 60}.${String(cs).padStart(2, "0")}`;
}

function Stars({ count, className = "" }: { count: number; className?: string }) {
  return (
    <span className={className} aria-label={`${count} 顆星`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= count ? "text-amber-400" : "text-line"}>
          ★
        </span>
      ))}
    </span>
  );
}

function makeScramble(level: Level) {
  // 避免打亂後剛好已經符合目標
  for (;;) {
    const moves = randomScramble(level.scramble);
    const state = applyMoves(solvedCube(), moves);
    if (!checkGoal(state, level.goal)) return { moves, state };
  }
}

export default function Playground({ size = 52 }: { size?: number }) {
  const cube = useCube(solvedCube);
  const { enqueue, busy, stickers } = cube;
  const records = useRecords();
  const [mode, setMode] = useState<"levels" | "free">("levels");
  const [levelId, setLevelId] = useState(LEVELS[0].id);
  const [status, setStatus] = useState<Status>("idle");
  const [scramble, setScramble] = useState<Move[] | null>(null);
  const [history, setHistory] = useState<Move[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [startAt, setStartAt] = useState(0);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [algText, setAlgText] = useState("");
  const [algError, setAlgError] = useState("");

  const level = mode === "free" ? FREE_LEVEL : LEVELS.find((l) => l.id === levelId)!;
  const levelIndex = LEVELS.indexOf(level);
  const isUnlocked = (i: number) => i === 0 || Boolean(records[LEVELS[i - 1].id]);
  const nextLevel = levelIndex >= 0 ? LEVELS[levelIndex + 1] : undefined;

  function resetSession(next: Status = "idle") {
    setStatus(next);
    setHistory([]);
    setMoveCount(0);
    setResult(null);
  }

  function chooseLevel(id: string) {
    setLevelId(id);
    setScramble(null);
    cube.reset(solvedCube());
    resetSession();
  }

  function switchMode(m: "levels" | "free") {
    setMode(m);
    setScramble(null);
    cube.reset(solvedCube());
    resetSession();
  }

  function start() {
    const { moves, state } = makeScramble(level);
    cube.reset(state);
    setScramble(moves);
    resetSession("ready");
  }

  function doMoves(moves: Move[]) {
    if (moves.length === 0) return;
    enqueue(moves);
    setHistory((h) => [...h, ...moves].slice(-40));
    const turns = moves.filter((m) => !isRotation(m)).length;
    setMoveCount((c) => c + turns);
    // 打亂後第一個真正的轉動開始計時（整顆轉向不算）
    if (status === "ready" && turns > 0) {
      const t = performance.now();
      setStartAt(t);
      setNow(t);
      setStatus("solving");
    }
  }

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key.toUpperCase();
    if (key.length !== 1 || !"UDFBRLXYZM".includes(key)) return;
    e.preventDefault();
    const name = "XYZ".includes(key) ? key.toLowerCase() : key;
    doMoves([{ name, amount: e.shiftKey ? -1 : 1 }]);
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // 動畫結束且達成目標就停錶
  const reached = status === "solving" && !busy && checkGoal(stickers, level.goal);
  useEffect(() => {
    if (!reached) return;
    const id = requestAnimationFrame(() => {
      const time = performance.now() - startAt;
      const stars = starsFor(level, time, moveCount);
      const old = records[level.id];
      if (level !== FREE_LEVEL) saveRecord(level.id, time, moveCount, stars);
      setResult({ time, moves: moveCount, stars, isBest: !old || time < old.bestTime });
      setStatus("done");
    });
    return () => cancelAnimationFrame(id);
  }, [reached, startAt, level, moveCount, records]);

  useEffect(() => {
    if (status !== "solving") return;
    const id = setInterval(() => setNow(performance.now()), 50);
    return () => clearInterval(id);
  }, [status]);

  function runAlg() {
    try {
      const moves = parseAlg(algText);
      setAlgError("");
      doMoves(moves);
    } catch (err) {
      setAlgError((err as Error).message);
    }
  }

  const moveBtn =
    "h-10 rounded-lg border border-line bg-surface font-mono text-sm font-semibold text-ink transition hover:border-accent hover:text-accent active:scale-95";
  const primaryBtn =
    "h-10 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent transition hover:opacity-90";
  const secondaryBtn =
    "h-10 rounded-full border border-line bg-surface px-5 text-sm font-semibold text-ink transition hover:border-accent";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-line bg-surface p-1" role="tablist">
          {(
            [
              ["levels", "等級挑戰"],
              ["free", "自由練習"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                mode === m ? "bg-accent-soft text-accent shadow-[inset_0_0_0_1px_var(--accent)]" : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === "levels" && Object.keys(records).length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("確定要清除所有關卡紀錄嗎？")) clearRecords();
            }}
            className="text-xs text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            清除紀錄
          </button>
        )}
      </div>

      {mode === "levels" && (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {LEVELS.map((l, i) => {
            const unlocked = isUnlocked(i);
            const rec = records[l.id];
            const active = l.id === levelId;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => chooseLevel(l.id)}
                  aria-pressed={active}
                  className={`flex h-full w-full flex-col items-start rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:border-accent disabled:hover:border-line"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <span className="font-mono text-xs font-semibold text-accent">LV {i + 1}</span>
                  <span className="mt-0.5 font-semibold text-ink">{l.name}</span>
                  <span className="mt-1 text-xs leading-snug text-muted">{l.desc}</span>
                  <span className="mt-auto pt-2 text-sm">
                    {!unlocked ? (
                      <span className="text-muted">🔒 未解鎖</span>
                    ) : rec ? (
                      <span className="flex flex-wrap items-center gap-x-2">
                        <Stars count={rec.stars} />
                        <span className="font-mono text-xs text-muted">{formatTime(rec.bestTime)}</span>
                      </span>
                    ) : (
                      <Stars count={0} />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,22rem)]">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface-2 p-4 sm:p-6">
          <div className="w-full text-center">
            <p className="font-mono text-xs font-semibold text-accent">
              {levelIndex >= 0 ? `LV ${levelIndex + 1} · ${level.name}` : level.name}
            </p>
            <p className="mt-1 font-semibold text-ink">目標：{GOAL_TEXT[level.goal]}</p>
            {levelIndex >= 0 && <p className="mt-1 text-xs text-muted">{starRule(level)}</p>}
          </div>

          <div className="max-w-full overflow-hidden">
            <Cube3D stickers={stickers} anim={cube.anim} duration={cube.duration} size={size} />
          </div>

          <div className="min-h-28 w-full text-center" aria-live="polite">
            {status === "idle" && (
              <div className="flex flex-col items-center gap-3">
                <button type="button" onClick={start} className={primaryBtn}>
                  {mode === "free" ? "打亂方塊" : "開始挑戰"}
                </button>
                <p className="text-sm text-muted">拖曳方塊可以旋轉視角，雙擊恢復預設角度</p>
              </div>
            )}

            {status === "ready" && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted">準備好了嗎？轉動任何一面就開始計時（整顆轉向 x、y、z 不會開始計時）</p>
                <button type="button" onClick={start} className={secondaryBtn}>
                  換一個打亂
                </button>
              </div>
            )}

            {status === "solving" && (
              <div className="flex flex-col items-center gap-2">
                <p className="font-mono text-3xl font-semibold tabular-nums text-ink">
                  {formatTime(now - startAt)}
                </p>
                <p className="text-sm text-muted">已轉 {moveCount} 步</p>
                <button type="button" onClick={start} className="text-xs text-muted underline-offset-2 hover:text-ink hover:underline">
                  放棄，重新打亂
                </button>
              </div>
            )}

            {status === "done" && result && (
              <div className="mx-auto flex max-w-sm flex-col items-center gap-2 rounded-2xl border border-accent bg-surface p-5">
                <p className="text-lg font-bold text-ink">🎉 挑戰成功！</p>
                {levelIndex >= 0 && <Stars count={result.stars} className="text-3xl" />}
                <p className="font-mono text-sm text-ink">
                  用時 {formatTime(result.time)} · {result.moves} 步
                </p>
                {levelIndex >= 0 && result.isBest && (
                  <p className="text-xs font-semibold text-accent">新的最佳紀錄！</p>
                )}
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={start} className={secondaryBtn}>
                    再挑戰一次
                  </button>
                  {mode === "levels" && nextLevel && (
                    <button type="button" onClick={() => chooseLevel(nextLevel.id)} className={primaryBtn}>
                      下一關：{nextLevel.name} →
                    </button>
                  )}
                </div>
              </div>
            )}

            {scramble && status !== "done" && (
              <p className="mx-auto mt-3 max-w-md font-mono text-xs break-words text-muted">
                打亂：{scramble.map(formatMove).join(" ")}
              </p>
            )}
            {scramble && status !== "done" && level.scramble <= 6 && (
              <p className="mx-auto mt-1 max-w-md text-xs text-muted">
                提示：把打亂步驟倒過來做，每一步方向相反（R ↔ R&apos;），R2 不變。
              </p>
            )}
            {level.learn && status !== "done" && (
              <p className="mt-2 text-xs">
                <Link href={`/learn/${level.learn}`} className="text-accent hover:underline">
                  忘記怎麼做？複習教學 →
                </Link>
              </p>
            )}
          </div>

          {status !== "idle" && (
            <button
              type="button"
              onClick={() => {
                cube.reset(solvedCube());
                setScramble(null);
                resetSession();
              }}
              className="text-xs text-muted underline-offset-2 hover:text-ink hover:underline"
            >
              恢復完成狀態
            </button>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <section>
            <h3 className="mb-2 text-sm font-semibold text-ink">轉動按鈕</h3>
            <div className="grid grid-cols-3 gap-2">
              {FACES.map((f) =>
                ([1, -1, 2] as const).map((amount) => {
                  const move = { name: f, amount };
                  return (
                    <button key={f + amount} type="button" className={moveBtn} onClick={() => doMoves([move])}>
                      {formatMove(move)}
                    </button>
                  );
                }),
              )}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {ROTATIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={moveBtn}
                  onClick={() => doMoves([{ name: r, amount: 1 }])}
                  title={r === "M" ? "中間層（跟 L 同方向）" : "整顆方塊轉向"}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              鍵盤也可以操作：按 <kbd className="kbd">R</kbd> <kbd className="kbd">U</kbd>{" "}
              <kbd className="kbd">F</kbd>… 順時針，加 <kbd className="kbd">Shift</kbd> 變成逆時針。
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-ink">輸入公式</h3>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                runAlg();
              }}
            >
              <input
                value={algText}
                onChange={(e) => setAlgText(e.target.value)}
                placeholder="例如 R U R' U'"
                className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 font-mono text-sm text-ink outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="h-10 rounded-lg border border-accent bg-accent-soft px-4 text-sm font-semibold text-accent transition hover:bg-accent hover:text-on-accent"
              >
                執行
              </button>
            </form>
            {algError && <p className="mt-1 text-xs text-red-600">{algError}</p>}
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-ink">轉動紀錄</h3>
            <p className="min-h-10 rounded-lg border border-line bg-surface p-3 font-mono text-sm break-words text-muted">
              {history.length ? history.map(formatMove).join(" ") : "還沒有轉動"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
