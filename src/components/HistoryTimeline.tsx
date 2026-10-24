"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

export interface TimelineItem {
  year: string;
  title: string;
  body: string;
}

// 橫向年表：可用箭頭、拖曳、觸控滑動或點年份切換
export default function HistoryTimeline({ items }: { items: TimelineItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  // 按鈕觸發的平滑捲動進行中時，不讓捲動位置覆蓋目標索引
  const lock = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  // 依捲動位置找出目前最靠左的卡片
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      if (lock.current) return;
      const cards = [...el.children] as HTMLElement[];
      const left = el.scrollLeft;
      let best = 0;
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - el.offsetLeft - left) < Math.abs(cards[best].offsetLeft - el.offsetLeft - left))
          best = i;
      });
      // 捲到最右邊時，最後一張也要算到
      if (left + el.clientWidth >= el.scrollWidth - 4) best = cards.length - 1;
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(i: number) {
    const el = track.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(items.length - 1, i));
    const card = el.children[idx] as HTMLElement;
    setActive(idx);
    if (lock.current) clearTimeout(lock.current);
    lock.current = setTimeout(() => (lock.current = null), 700);
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return; // 觸控用原生滑動
    drag.current = { x: e.clientX, left: track.current!.scrollLeft, moved: false };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.moved) track.current!.scrollLeft = d.left - dx;
  }

  function onPointerUp() {
    if (drag.current?.moved) {
      setDragging(false);
      goTo(active);
    }
    drag.current = null;
  }

  const arrow =
    "grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink";

  return (
    <div>
      {/* 年份軸 */}
      <div className="relative mb-6 overflow-x-auto pb-2 [scrollbar-width:none]">
        <div className="relative flex min-w-max items-center gap-1">
          <span className="absolute top-1/2 right-3 left-3 h-0.5 -translate-y-1/2 bg-line" aria-hidden />
          {items.map((t, i) => (
            <button
              key={t.year}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${t.year} ${t.title}`}
              aria-current={i === active}
              className={`relative z-10 rounded-full border px-3 py-1 font-mono text-xs font-semibold whitespace-nowrap transition ${
                i === active
                  ? "scale-110 border-accent bg-accent text-on-accent"
                  : i < active
                    ? "border-accent bg-surface text-accent"
                    : "border-line bg-surface text-muted hover:text-ink"
              }`}
            >
              {t.year}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 [scrollbar-width:thin] ${
          dragging ? "cursor-grabbing snap-none select-none" : "cursor-grab"
        }`}
        tabIndex={0}
        aria-label="魔術方塊年表，可左右滑動"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(active + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(active - 1);
          }
        }}
      >
        {items.map((t, i) => (
          <article
            key={t.year}
            className={`w-[80%] shrink-0 snap-start rounded-2xl border bg-surface p-6 transition duration-500 sm:w-[22rem] ${
              i === active ? "border-accent shadow-lg shadow-accent/10" : "border-line opacity-70"
            }`}
          >
            <p className="font-mono text-3xl font-bold text-accent">{t.year}</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{t.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          <span className="font-mono font-semibold text-ink">{active + 1}</span> / {items.length}
          <span className="ml-3 hidden sm:inline">拖曳、滑動或用鍵盤 ← → 瀏覽</span>
        </p>
        <div className="flex gap-2">
          <button type="button" className={arrow} onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="上一個">
            ←
          </button>
          <button
            type="button"
            className={arrow}
            onClick={() => goTo(active + 1)}
            disabled={active === items.length - 1}
            aria-label="下一個"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
