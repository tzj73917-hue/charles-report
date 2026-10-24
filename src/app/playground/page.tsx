import type { Metadata } from "next";
import Playground from "@/components/cube/Playground";

export const metadata: Metadata = { title: "練習場" };

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8 max-w-2xl">
        <p className="font-mono text-sm font-semibold text-accent">實戰</p>
        <h1 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">練習場</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          從暖身關一路挑戰到大師關！每一關達成目標就能解鎖下一關，並依時間或步數拿到星星。也可以切換到自由練習隨意轉。
        </p>
      </header>
      <Playground />
    </div>
  );
}
