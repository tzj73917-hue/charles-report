import type { Metadata } from "next";
import Link from "next/link";
import { STEPS } from "@/lib/steps";

export const metadata: Metadata = { title: "七步教學" };

const PIECES = [
  { name: "中心塊", count: "6 個", body: "每面正中間那格，只有 1 個顏色。它們永遠不會移動，決定了每一面最後的顏色。" },
  { name: "邊塊", count: "12 個", body: "夾在兩個中心之間，有 2 個顏色。" },
  { name: "角塊", count: "8 個", body: "在方塊的角落，有 3 個顏色。" },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <p className="font-mono text-sm font-semibold text-accent">層先法</p>
        <h1 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">七步還原魔術方塊</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          開始之前，先認識方塊的三種零件。還原方塊的重點不是「把一面湊成同色」，而是把每一個零件放回它該在的位置。
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {PIECES.map((p) => (
          <div key={p.name} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold text-ink">{p.name}</h2>
              <span className="font-mono text-sm text-muted">{p.count}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </section>

      <p className="mt-6 rounded-2xl bg-accent-soft p-5 text-sm leading-relaxed text-ink">
        這個網站的方塊配色是：<b>黃色在上、白色在下、綠色在前、橘色在右、紅色在左、藍色在後</b>。
        如果你的方塊配色不同也沒關係，只要記得白色和黃色是對面就好。
      </p>

      <ol className="mt-10 flex flex-col gap-3">
        {STEPS.map((step, i) => (
          <li key={step.slug}>
            <Link
              href={`/learn/${step.slug}`}
              className="group flex items-center gap-5 rounded-2xl border border-line bg-surface p-5 transition hover:border-accent"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-lg font-bold text-accent">
                {i + 1}
              </span>
              <span className="flex-1">
                <span className="block text-lg font-semibold text-ink">{step.title}</span>
                <span className="mt-0.5 block text-sm text-muted">{step.short}</span>
              </span>
              <span className="text-muted transition group-hover:translate-x-1 group-hover:text-accent">→</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
