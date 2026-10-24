import type { Goal } from "./cube";

export interface Level {
  id: string;
  name: string;
  desc: string;
  goal: Goal;
  scramble: number; // 打亂步數
  learn?: string; // 對應的教學步驟
  // 星等門檻（秒）；短打亂關卡改用步數評分
  timeStars?: [number, number];
}

export const LEVELS: Level[] = [
  { id: "warmup", name: "暖身", desc: "打亂 2 步，把它轉回來", goal: "solved", scramble: 2 },
  { id: "beginner", name: "新手", desc: "打亂 4 步，把它轉回來", goal: "solved", scramble: 4 },
  { id: "novice", name: "入門", desc: "打亂 6 步，把它轉回來", goal: "solved", scramble: 6 },
  {
    id: "cross",
    name: "白色十字",
    desc: "完全打亂，做出白色十字",
    goal: "cross",
    scramble: 20,
    learn: "white-cross",
    timeStars: [60, 180],
  },
  {
    id: "first-layer",
    name: "第一層",
    desc: "完全打亂，完成整個第一層",
    goal: "first-layer",
    scramble: 20,
    learn: "white-corners",
    timeStars: [180, 420],
  },
  {
    id: "f2l",
    name: "前兩層",
    desc: "完全打亂，完成前兩層",
    goal: "f2l",
    scramble: 20,
    learn: "middle-layer",
    timeStars: [300, 600],
  },
  {
    id: "master",
    name: "大師",
    desc: "完全打亂，還原整顆方塊",
    goal: "solved",
    scramble: 20,
    timeStars: [600, 1200],
  },
];

export const FREE_LEVEL: Level = {
  id: "free",
  name: "自由練習",
  desc: "完全打亂，還原整顆方塊",
  goal: "solved",
  scramble: 20,
};

export const GOAL_TEXT: Record<Goal, string> = {
  solved: "還原整顆方塊",
  cross: "做出白色十字（側面顏色要對齊中心）",
  "first-layer": "完成白色面和第一層",
  f2l: "完成前兩層",
};

export function starsFor(level: Level, ms: number, moves: number): number {
  if (level.timeStars) {
    const s = ms / 1000;
    return s <= level.timeStars[0] ? 3 : s <= level.timeStars[1] ? 2 : 1;
  }
  return moves <= level.scramble ? 3 : moves <= level.scramble * 2 + 2 ? 2 : 1;
}

export function starRule(level: Level): string {
  if (level.timeStars) {
    const [a, b] = level.timeStars.map((s) => (s >= 60 ? `${s / 60} 分鐘` : `${s} 秒`));
    return `★★★ ${a} 內 · ★★ ${b} 內`;
  }
  return `★★★ ${level.scramble} 步內 · ★★ ${level.scramble * 2 + 2} 步內`;
}
