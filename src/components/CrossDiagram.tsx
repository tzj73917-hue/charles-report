import { FACE_COLORS } from "@/lib/cube";

const W = FACE_COLORS.D;
const DIM = "#2b3446";

// 把方塊往上翻、白色面對著自己時看到的樣子：綠在上、藍在下、紅在左、橘在右
const SIDES = {
  top: { color: FACE_COLORS.F, label: "前（綠）" },
  bottom: { color: FACE_COLORS.B, label: "後（藍）" },
  left: { color: FACE_COLORS.L, label: "左（紅）" },
  right: { color: FACE_COLORS.R, label: "右（橘）" },
};

function Cell({ color }: { color: string }) {
  return <span className="block aspect-square rounded-[18%] border border-black/60" style={{ background: color }} />;
}

export default function CrossDiagram() {
  // 5×5 格：中間 3×3 是白色面，外圈是四個側面最靠近白色面的那一排
  const grid: (string | null)[][] = [
    [null, DIM, SIDES.top.color, DIM, null],
    [DIM, DIM, W, DIM, DIM],
    [SIDES.left.color, W, W, W, SIDES.right.color],
    [DIM, DIM, W, DIM, DIM],
    [null, DIM, SIDES.bottom.color, DIM, null],
  ];

  return (
    <figure className="flex flex-col items-center gap-3">
      <div className="relative grid w-56 grid-cols-5 gap-1 p-6">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-muted">{SIDES.top.label}</span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted">{SIDES.bottom.label}</span>
        <span className="absolute top-1/2 left-0 -translate-x-1/3 -translate-y-1/2 [writing-mode:vertical-rl] text-xs text-muted">
          {SIDES.left.label}
        </span>
        <span className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 [writing-mode:vertical-rl] text-xs text-muted">
          {SIDES.right.label}
        </span>
        {grid.flatMap((row, r) =>
          row.map((c, i) =>
            c ? (
              <Cell key={`${r}-${i}`} color={c} />
            ) : (
              <span key={`${r}-${i}`} />
            ),
          ),
        )}
      </div>
      <figcaption className="max-w-xs text-center text-xs leading-relaxed text-muted">
        把方塊往上翻、讓白色面對著自己（綠色那面朝上）。中間是白色十字；外圈是四個側面最靠近白色的那一排，正中間那格要和那一面的中心同色（括號裡的顏色）。灰色＝還不用管。
      </figcaption>
    </figure>
  );
}
