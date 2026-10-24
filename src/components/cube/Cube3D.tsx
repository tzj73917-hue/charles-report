"use client";

import { useRef, useState, type PointerEvent } from "react";
import {
  FACE_COLORS,
  isInLayer,
  moveInfo,
  type Sticker,
  type Vec,
} from "@/lib/cube";
import type { CubeAnim } from "./useCube";

interface Props {
  stickers: Sticker[];
  anim: CubeAnim | null;
  duration: number;
  size?: number; // 每個小方塊的邊長（px）
  // 回傳 false 的貼紙會以灰色顯示（例如「這一步還不用管」的部分）
  shown?: (s: Sticker) => boolean;
  initialView?: { rx: number; ry: number };
  showBase?: boolean; // 底下的全息投影台
}

const DEFAULT_VIEW = { rx: -28, ry: -38 };
const DIM_COLOR = "#2b3446";

// 世界座標 y 向上，CSS 的 y 向下，因此 x、z 軸的旋轉方向要反過來
function layerRotation(anim: CubeAnim | null, s: Sticker) {
  if (!anim || !isInLayer(s, anim.move)) return "";
  const { axis, angle } = moveInfo(anim.move);
  const a = anim.running ? angle : 0;
  if (axis === 0) return `rotateX(${-a}deg) `;
  if (axis === 1) return `rotateY(${a}deg) `;
  return `rotateZ(${-a}deg) `;
}

function orient(n: Vec) {
  if (n[0] === 1) return "rotateY(90deg)";
  if (n[0] === -1) return "rotateY(-90deg)";
  if (n[1] === 1) return "rotateX(90deg)";
  if (n[1] === -1) return "rotateX(-90deg)";
  if (n[2] === -1) return "rotateY(180deg)";
  return "";
}

export default function Cube3D({
  stickers,
  anim,
  duration,
  size = 44,
  shown,
  initialView = DEFAULT_VIEW,
  showBase = true,
}: Props) {
  const [view, setView] = useState(initialView);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const stage = size * 5;

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    drag.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setView((v) => ({
      rx: Math.max(-85, Math.min(85, v.rx - dy * 0.5)),
      ry: v.ry + dx * 0.5,
    }));
  }

  function onPointerUp() {
    drag.current = null;
  }

  return (
    <div
      className="relative mx-auto cursor-grab touch-none select-none active:cursor-grabbing"
      style={{ width: stage, height: stage, perspective: size * 22 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => setView(initialView)}
      role="img"
      aria-label="3D 魔術方塊，可拖曳旋轉視角，雙擊恢復預設視角"
    >
      <div
        className="pointer-events-none absolute inset-[12%] rounded-full"
        style={{ background: "radial-gradient(circle, rgb(34 228 255 / 0.16), transparent 70%)" }}
        aria-hidden
      />
      {showBase && <div className="holo-ring" aria-hidden />}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${view.rx}deg) rotateY(${view.ry}deg)`,
        }}
      >
        {stickers.map((s) => {
          const [x, y, z] = s.pos;
          const cx = (x + s.n[0] / 2) * size;
          const cy = -(y + s.n[1] / 2) * size;
          const cz = (z + s.n[2] / 2) * size;
          const rotating = anim?.running && isInLayer(s, anim.move);
          return (
            <div
              key={s.id}
              className="absolute bg-neutral-900"
              style={{
                width: size,
                height: size,
                left: -size / 2,
                top: -size / 2,
                backfaceVisibility: "hidden",
                transform: `${layerRotation(anim, s)}translate3d(${cx}px, ${cy}px, ${cz}px) ${orient(s.n)}`,
                transition: rotating
                  ? `transform ${duration}ms cubic-bezier(.4,0,.2,1)`
                  : "none",
              }}
            >
              <div
                className="absolute rounded-[18%]"
                style={{
                  inset: size * 0.06,
                  background: !shown || shown(s) ? FACE_COLORS[s.color] : DIM_COLOR,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
