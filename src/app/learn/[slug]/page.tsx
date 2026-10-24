import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CrossDiagram from "@/components/CrossDiagram";
import AlgPlayer from "@/components/cube/AlgPlayer";
import StepGoal from "@/components/cube/StepGoal";
import { STEPS, getStep } from "@/lib/steps";

export function generateStaticParams() {
  return STEPS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const found = getStep(slug);
  return { title: found ? `步驟 ${found.index + 1}：${found.step.title}` : "找不到頁面" };
}

export default async function StepPage(props: PageProps<"/learn/[slug]">) {
  const { slug } = await props.params;
  const found = getStep(slug);
  if (!found) notFound();
  const { step, index, prev, next } = found;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="mb-8 flex gap-1.5" aria-label="步驟進度">
        {STEPS.map((s, i) => (
          <Link
            key={s.slug}
            href={`/learn/${s.slug}`}
            title={`步驟 ${i + 1}：${s.title}`}
            className={`h-1.5 flex-1 rounded-full transition ${
              i <= index ? "bg-accent" : "bg-line hover:bg-muted"
            }`}
          />
        ))}
      </nav>

      <header className="max-w-3xl">
        <p className="font-mono text-sm font-semibold text-accent">
          步驟 {index + 1} / {STEPS.length}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">{step.title}</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold tracking-wide text-muted">目標</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{step.goal}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold tracking-wide text-muted">怎麼拿</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{step.hold}</p>
          </div>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink">完成畫面</h2>
        <p className="mt-2 text-sm text-muted">做完這一步，你的方塊應該長這樣。</p>
        <div className="mt-6 grid items-center gap-6 rounded-2xl border border-line bg-surface-2 p-4 sm:p-6 md:grid-cols-2">
          <StepGoal slug={step.slug} />
          {step.slug === "white-cross" ? (
            <CrossDiagram />
          ) : (
            <div className="rounded-xl border border-accent bg-accent-soft p-5">
              <p className="text-xs font-semibold tracking-wide text-muted">檢查重點</p>
              <p className="mt-2 leading-relaxed text-ink">{step.goal}</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-12 max-w-3xl space-y-4 text-base leading-relaxed text-ink">
        {step.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-ink">情況與公式</h2>
        <p className="mt-2 text-sm text-muted">
          方塊一開始就是「這個公式要處理的情況」。按播放看它怎麼被解開，可以拖曳方塊換角度看。
        </p>
        <div className="mt-6 flex flex-col gap-6">
          {step.cases.map((c, i) => (
            <AlgPlayer
              key={c.alg}
              alg={c.alg}
              layout="split"
              size={40}
              title={step.cases.length > 1 ? `情況 ${i + 1}：${c.title}` : c.title}
              description={c.description}
            />
          ))}
        </div>
      </section>

      {step.example && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-ink">完整範例</h2>
          <p className="mt-2 text-sm text-muted">一步一步跟著做，每一步都有解說。</p>
          <div className="mt-6">
            <AlgPlayer
              alg={step.example.alg}
              layout="split"
              size={40}
              title={step.example.title}
              description={step.example.description}
              notes={step.example.notes}
            />
          </div>
        </section>
      )}

      {step.tips.length > 0 && (
        <section className="mt-12 rounded-2xl bg-accent-soft p-6">
          <h2 className="font-semibold text-ink">小提醒</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
            {step.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      <nav className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="rounded-2xl border border-line bg-surface p-5 transition hover:border-accent"
          >
            <span className="text-sm text-muted">← 上一步</span>
            <span className="mt-1 block font-semibold text-ink">{prev.title}</span>
          </Link>
        ) : (
          <Link href="/notation" className="rounded-2xl border border-line bg-surface p-5 transition hover:border-accent">
            <span className="text-sm text-muted">← 複習</span>
            <span className="mt-1 block font-semibold text-ink">轉動符號</span>
          </Link>
        )}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="rounded-2xl border border-line bg-surface p-5 text-right transition hover:border-accent"
          >
            <span className="text-sm text-muted">下一步 →</span>
            <span className="mt-1 block font-semibold text-ink">{next.title}</span>
          </Link>
        ) : (
          <Link
            href="/playground"
            className="rounded-2xl bg-accent p-5 text-right text-on-accent transition hover:opacity-90"
          >
            <span className="text-sm opacity-80">恭喜學完全部步驟！</span>
            <span className="mt-1 block font-semibold">到練習場實戰 →</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
