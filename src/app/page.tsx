import Link from "next/link";
import HeroCube from "@/components/cube/HeroCube";
import { STEPS } from "@/lib/steps";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid items-center gap-10 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
        <div>
          <p className="mb-4 inline-block rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
            三階魔術方塊 · 新手入門
          </p>
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-ink sm:text-5xl">
            七個步驟，
            <br />
            學會還原魔術方塊
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            不需要天份，也不用背幾十個公式。跟著 3D 互動方塊一步一步看，每個公式都能播放、暫停、倒轉，
            看懂每一步方塊怎麼動。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/notation"
              className="rounded-full bg-accent px-6 py-3 font-semibold text-on-accent transition hover:opacity-90"
            >
              從轉動符號開始
            </Link>
            <Link
              href="/playground"
              className="rounded-full border border-line bg-surface px-6 py-3 font-semibold text-ink transition hover:border-accent"
            >
              先玩玩看
            </Link>
          </div>
        </div>
        <div className="flex justify-center overflow-hidden">
          <HeroCube />
        </div>
      </section>

      <section className="py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">層先法：一層一層完成</h2>
            <p className="mt-2 text-muted">先做底層，再做中層，最後完成頂層。每一步都建立在上一步之上。</p>
          </div>
          <Link href="/learn" className="text-sm font-semibold text-accent hover:underline">
            查看全部步驟 →
          </Link>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.slug}>
              <Link
                href={`/learn/${step.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent"
              >
                <span className="font-mono text-sm font-semibold text-accent">步驟 {i + 1}</span>
                <span className="mt-1 text-lg font-semibold text-ink">{step.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-muted">{step.short}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/playground"
              className="flex h-full flex-col justify-center hud-panel rounded-2xl p-5 transition hover:-translate-y-0.5"
            >
              <span className="text-lg font-semibold">練習場 →</span>
              <span className="mt-2 text-sm opacity-75">打亂方塊、計時，用學到的公式自己還原一次。</span>
            </Link>
          </li>
        </ol>
      </section>

      <section className="grid gap-6 py-12 md:grid-cols-3">
        {[
          { title: "可以拖曳的 3D 方塊", body: "每個情況都用真的方塊狀態呈現，拖曳就能從各個角度看。" },
          { title: "一步一步播放公式", body: "播放、暫停、上一步、下一步，點任一個轉動就能跳到那裡。" },
          { title: "公式短又好記", body: "新手解法的公式都不長，很多還是左右鏡像，記住一個就等於學會兩個。" },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-line bg-surface-2 p-6">
            <h3 className="font-semibold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
