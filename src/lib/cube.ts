// 魔術方塊模型：以 54 張貼紙表示，每張貼紙記錄所在位置與朝向。
// 座標系：x 向右 (R)、y 向上 (U)、z 向前 (F)，每個方向取值 -1、0、1。

export type Vec = [number, number, number];
export type Face = "U" | "D" | "F" | "B" | "R" | "L";

export interface Sticker {
  id: number;
  color: Face;
  pos: Vec;
  n: Vec;
}

export interface Move {
  name: string; // 例如 R、u、x、M
  amount: 1 | -1 | 2; // 1 = 順時針，-1 = 逆時針，2 = 180 度
}

export const FACE_NORMALS: Record<Face, Vec> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
  R: [1, 0, 0],
  L: [-1, 0, 0],
};

// 配色：黃色在上、白色在下、綠色在前
export const FACE_COLORS: Record<Face, string> = {
  U: "#facc15",
  D: "#f8fafc",
  F: "#16a34a",
  B: "#2563eb",
  R: "#f97316",
  L: "#dc2626",
};

export const FACE_NAMES: Record<Face, string> = {
  U: "黃",
  D: "白",
  F: "綠",
  B: "藍",
  R: "橘",
  L: "紅",
};

interface MoveDef {
  axis: 0 | 1 | 2;
  layers: number[];
  quarter: 1 | -1; // 順時針時繞正軸旋轉的方向（+1 = +90°）
}

const ALL = [-1, 0, 1];

const MOVE_DEFS: Record<string, MoveDef> = {
  R: { axis: 0, layers: [1], quarter: -1 },
  L: { axis: 0, layers: [-1], quarter: 1 },
  U: { axis: 1, layers: [1], quarter: -1 },
  D: { axis: 1, layers: [-1], quarter: 1 },
  F: { axis: 2, layers: [1], quarter: -1 },
  B: { axis: 2, layers: [-1], quarter: 1 },
  M: { axis: 0, layers: [0], quarter: 1 },
  E: { axis: 1, layers: [0], quarter: 1 },
  S: { axis: 2, layers: [0], quarter: -1 },
  r: { axis: 0, layers: [0, 1], quarter: -1 },
  l: { axis: 0, layers: [-1, 0], quarter: 1 },
  u: { axis: 1, layers: [0, 1], quarter: -1 },
  d: { axis: 1, layers: [-1, 0], quarter: 1 },
  f: { axis: 2, layers: [0, 1], quarter: -1 },
  b: { axis: 2, layers: [-1, 0], quarter: 1 },
  x: { axis: 0, layers: ALL, quarter: -1 },
  y: { axis: 1, layers: ALL, quarter: -1 },
  z: { axis: 2, layers: ALL, quarter: -1 },
};

export function solvedCube(): Sticker[] {
  const stickers: Sticker[] = [];
  let id = 0;
  for (const face of Object.keys(FACE_NORMALS) as Face[]) {
    const n = FACE_NORMALS[face];
    const axis = n.findIndex((v) => v !== 0);
    for (const a of ALL) {
      for (const b of ALL) {
        const pos: Vec = [0, 0, 0];
        const others = [0, 1, 2].filter((i) => i !== axis);
        pos[axis] = n[axis];
        pos[others[0]] = a;
        pos[others[1]] = b;
        stickers.push({ id: id++, color: face, pos, n: [...n] });
      }
    }
  }
  return stickers;
}

// 繞座標軸旋轉 +90°（右手定則）
function rotate90(v: Vec, axis: 0 | 1 | 2): Vec {
  const [x, y, z] = v;
  if (axis === 0) return [x, -z, y];
  if (axis === 1) return [z, y, -x];
  return [-y, x, z];
}

function rotate(v: Vec, axis: 0 | 1 | 2, quarters: number): Vec {
  let out = v;
  const k = ((quarters % 4) + 4) % 4;
  for (let i = 0; i < k; i++) out = rotate90(out, axis);
  return out;
}

export function moveInfo(move: Move) {
  const def = MOVE_DEFS[move.name];
  return {
    axis: def.axis,
    layers: def.layers,
    // 以「繞正軸」計算的旋轉角度（度）
    angle: def.quarter * move.amount * 90,
  };
}

export function isInLayer(sticker: Sticker, move: Move): boolean {
  const def = MOVE_DEFS[move.name];
  return def.layers.includes(sticker.pos[def.axis]);
}

export function applyMove(stickers: Sticker[], move: Move): Sticker[] {
  const def = MOVE_DEFS[move.name];
  const quarters = def.quarter * move.amount;
  return stickers.map((s) =>
    def.layers.includes(s.pos[def.axis])
      ? {
          ...s,
          pos: rotate(s.pos, def.axis, quarters),
          n: rotate(s.n, def.axis, quarters),
        }
      : s,
  );
}

export function applyMoves(stickers: Sticker[], moves: Move[]): Sticker[] {
  return moves.reduce(applyMove, stickers);
}

const TOKEN = /^([RLUDFBMESrludfbxyz])(w?)(2'?|'2?|’)?$/;

export function parseAlg(alg: string): Move[] {
  return alg
    .replace(/[()[\]]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const m = TOKEN.exec(token);
      if (!m) throw new Error(`無法解析的轉動：${token}`);
      let name = m[1];
      if (m[2] && "RLUDFB".includes(name)) name = name.toLowerCase();
      const suffix = m[3] ?? "";
      const amount: Move["amount"] = suffix.includes("2")
        ? 2
        : suffix
          ? -1
          : 1;
      return { name, amount };
    });
}

export function invertMove(move: Move): Move {
  return { name: move.name, amount: move.amount === 2 ? 2 : (-move.amount as 1 | -1) };
}

export function invertMoves(moves: Move[]): Move[] {
  return [...moves].reverse().map(invertMove);
}

export function formatMove(move: Move): string {
  return move.name + (move.amount === 2 ? "2" : move.amount === -1 ? "'" : "");
}

const MOVE_LABEL: Record<string, string> = {
  R: "右面",
  L: "左面",
  U: "上面",
  D: "下面",
  F: "前面",
  B: "後面",
  M: "中間直層",
  E: "中間橫層",
  S: "前後中層",
  r: "右邊兩層",
  l: "左邊兩層",
  u: "上面兩層",
  d: "下面兩層",
  f: "前面兩層",
  b: "後面兩層",
  x: "整顆方塊（跟 R 同方向）",
  y: "整顆方塊（跟 U 同方向）",
  z: "整顆方塊（跟 F 同方向）",
};

// 拿著方塊時最直覺的方向說法（正面朝自己）
const MOVE_HINT: Record<string, [string, string]> = {
  R: ["右排往上推", "右排往下拉"],
  L: ["左排往下拉", "左排往上推"],
  U: ["頂層往左轉", "頂層往右轉"],
  D: ["底層往右轉", "底層往左轉"],
  F: ["前面像時鐘順轉", "前面像時鐘逆轉"],
  B: ["從後面看順時針", "從後面看逆時針"],
};

export function describeMove(move: Move): { label: string; turn: string; hint: string } {
  const turn = move.amount === 2 ? "轉 180°" : move.amount === 1 ? "順時針 90°" : "逆時針 90°";
  const hints = MOVE_HINT[move.name];
  const hint = hints ? (move.amount === 2 ? "轉半圈，方向不拘" : hints[move.amount === 1 ? 0 : 1]) : "";
  return { label: MOVE_LABEL[move.name] ?? move.name, turn, hint };
}

export function isSolved(stickers: Sticker[]): boolean {
  const byNormal = new Map<string, Face>();
  for (const s of stickers) {
    const key = s.n.join(",");
    const seen = byNormal.get(key);
    if (seen && seen !== s.color) return false;
    byNormal.set(key, s.color);
  }
  return true;
}

export type Goal = "solved" | "cross" | "first-layer" | "f2l";

// 以中心塊為準判斷目標，所以整顆方塊轉向（x、y、z）後依然正確
export function checkGoal(stickers: Sticker[], goal: Goal): boolean {
  if (goal === "solved") return isSolved(stickers);
  const key = (v: Vec) => v.join(",");
  const centers = new Map<string, Face>();
  const byPos = new Map<string, Sticker[]>();
  for (const s of stickers) {
    if (s.pos.filter((v) => v !== 0).length === 1) centers.set(key(s.n), s.color);
    const k = key(s.pos);
    byPos.set(k, [...(byPos.get(k) ?? []), s]);
  }
  const white = [...centers].find(([, c]) => c === "D")![0].split(",").map(Number) as Vec;
  const dot = (p: Vec) => p[0] * white[0] + p[1] * white[1] + p[2] * white[2];
  const pieceOk = (p: Sticker[]) => p.every((s) => centers.get(key(s.n)) === s.color);
  return [...byPos.values()].every((piece) => {
    const p = piece[0].pos;
    const d = dot(p);
    const isEdge = p.filter((v) => v !== 0).length === 2;
    if (goal === "cross") return !(d === 1 && isEdge) || pieceOk(piece);
    if (goal === "first-layer") return d !== 1 || pieceOk(piece);
    return d === -1 || pieceOk(piece);
  });
}

const SCRAMBLE_FACES =["R", "L", "U", "D", "F", "B"];
const AXIS_OF: Record<string, number> = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };

export function randomScramble(length = 20): Move[] {
  const moves: Move[] = [];
  while (moves.length < length) {
    const name = SCRAMBLE_FACES[Math.floor(Math.random() * 6)];
    const last = moves[moves.length - 1];
    const prev = moves[moves.length - 2];
    if (last && last.name === name) continue;
    // 避免像 R L R 這種同軸重複
    if (
      last &&
      prev &&
      AXIS_OF[last.name] === AXIS_OF[name] &&
      prev.name === name
    )
      continue;
    const amount = ([1, -1, 2] as const)[Math.floor(Math.random() * 3)];
    moves.push({ name, amount });
  }
  return moves;
}
