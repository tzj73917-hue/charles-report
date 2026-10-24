import type { Metadata } from "next";
import Link from "next/link";
import { STEPS } from "@/lib/steps";

export const metadata: Metadata = { title: "公式總表" };

export default function AlgorithmsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <p className="font-mono text-sm font-semibold text-accent">速查</p>
        <h1 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">公式總表</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          所有步驟會用到的公式都在這裡。忘記的時候回來看一眼，點步驟名稱可以看完整說明和動畫。
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-8">
        {STEPS.map((step, i) => (
          <section key={step.slug}>
            <h2 className="mb-3 flex items-baseline gap-3">
              <span className="font-mono text-sm font-semibold text-accent">步驟 {i + 1}</span>
              <Link href={`/learn/${step.slug}`} className="text-xl font-semibold text-ink hover:text-accent">
                {step.title}
              </Link>
            </h2>
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              {step.cases.map((c, j) => (
                <div
                  key={c.alg}
                  className={`flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
                    j > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <span className="text-sm text-ink">{c.title}</span>
                  <code className="font-mono text-base font-semibold break-words text-accent">{c.alg}</code>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
