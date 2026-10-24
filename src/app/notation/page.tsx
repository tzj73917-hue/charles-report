import type { Metadata } from "next";
import Link from "next/link";
import AlgPlayer from "@/components/cube/AlgPlayer";

export const metadata: Metadata = { title: "轉動符號" };

const FACES = [
  { move: "R", name: "右面 Right", desc: "右邊那一面" },
  { move: "L", name: "左面 Left", desc: "左邊那一面" },
  { move: "U", name: "上面 Up", desc: "最上面那一層" },
  { move: "D", name: "下面 Down", desc: "最下面那一層" },
  { move: "F", name: "前面 Front", desc: "面對你的那一面" },
  { move: "B", name: "後面 Back", desc: "背對你的那一面" },
];

export default function NotationPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-sm font-semibold text-accent">基礎</p>
        <h1 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">看懂轉動符號</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          公式就是一串字母，每個字母代表轉動方塊的某一面。先花五分鐘看懂它，後面的教學就會很輕鬆。
        </p>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">字母 = 哪一面</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <span className="alg">R</span> <span className="alg">L</span> <span className="alg">U</span>{" "}
            <span className="alg">D</span> <span className="alg">F</span> <span className="alg">B</span>{" "}
            分別是右、左、上、下、前、後。拿方塊時面對你的就是前面 (F)。
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">沒有符號 = 順時針</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            想像你正對著那一面看，把它順時針轉 90 度。例如 <span className="alg">R</span> 是正對右面時的順時針，
            看起來就是右面往上翻。
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">&apos; 與 2</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            加上 <span className="alg">&apos;</span>（念作 prime）是逆時針，例如 <span className="alg">R&apos;</span>。
            加上 <span className="alg">2</span> 是轉 180 度，例如 <span className="alg">R2</span>，方向不重要。
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-ink">六個面的轉動</h2>
        <p className="mt-2 text-muted">按「播放」看每個轉動的方向。方塊可以拖曳旋轉視角。</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FACES.map((f) => (
            <div key={f.move}>
              <h3 className="mb-2 flex items-baseline gap-2">
                <span className="alg text-lg">{f.move}</span>
                <span className="font-semibold text-ink">{f.name}</span>
                <span className="text-sm text-muted">· {f.desc}</span>
              </h3>
              <AlgPlayer alg={f.move} startSolved size={30} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-ink">逆時針與 180 度</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold text-ink">
              <span className="alg text-lg">R&apos;</span> 右面逆時針
            </h3>
            <AlgPlayer alg="R'" startSolved size={30} />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-ink">
              <span className="alg text-lg">R2</span> 右面轉 180 度
            </h3>
            <AlgPlayer alg="R2" startSolved size={30} />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-ink">
              <span className="alg text-lg">R U R&apos; U&apos;</span> 連起來就是公式
            </h3>
            <AlgPlayer alg="R U R' U'" startSolved size={30} />
          </div>
        </div>
      </section>

      <section className="mt-14 hud-panel rounded-3xl p-8 sm:p-10">
        <h2 className="text-2xl font-bold">準備好了嗎？</h2>
        <p className="mt-2 max-w-xl opacity-80">
          看懂符號後，就可以開始第一步：在底面做出白色十字。
        </p>
        <Link
          href="/learn/white-cross"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-on-accent transition hover:opacity-90"
        >
          開始步驟 1 →
        </Link>
      </section>
    </div>
  );
}
