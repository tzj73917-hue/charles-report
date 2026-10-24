import type { Metadata } from "next";
import Link from "next/link";
import HistoryTimeline from "@/components/HistoryTimeline";

export const metadata: Metadata = { title: "魔術方塊的歷史" };

const TIMELINE = [
  {
    year: "1974",
    title: "一位建築系教授的教具",
    body: "匈牙利布達佩斯的室內設計與建築教授魯比克・艾爾諾 (Rubik Ernő) 想做一個能讓學生理解立體空間的模型。他面對的難題是：怎麼讓每一塊都能各自轉動，整顆方塊又不會散掉？最後他做出了第一顆魔術方塊。傳說他打亂之後，自己花了大約一個月才轉回來。",
  },
  {
    year: "1975",
    title: "申請專利",
    body: "魯比克在匈牙利為這個「立體邏輯玩具」申請專利，並在 1977 年取得。",
  },
  {
    year: "1977",
    title: "在匈牙利上市",
    body: "方塊以「Bűvös kocka」（匈牙利文的「魔術方塊」）為名，開始在布達佩斯的玩具店販售。",
  },
  {
    year: "1980",
    title: "改名 Rubik's Cube，走向全世界",
    body: "美國 Ideal Toy 公司取得授權，以發明者的名字重新命名為「Rubik's Cube」，在倫敦、巴黎、紐倫堡、紐約等地的玩具展推出，很快就席捲全球。",
  },
  {
    year: "1981",
    title: "轉動符號誕生",
    body: "英國數學家大衛・辛馬斯特 (David Singmaster) 出版了方塊的解法筆記。他用 R、L、U、D、F、B 代表六個面的記法沿用至今，也就是這個網站教的「轉動符號」。",
  },
  {
    year: "1982",
    title: "第一屆世界錦標賽",
    body: "首屆魔術方塊世界錦標賽在布達佩斯舉行，美國選手 Minh Thai 以 22.95 秒奪冠。不過熱潮在 1980 年代中期逐漸退燒。",
  },
  {
    year: "1997",
    title: "速解法在網路上傳開",
    body: "捷克的潔西卡・弗里德里希 (Jessica Fridrich) 把她在 1980 年代發展的速解法放上網路。這套方法後來被稱為 CFOP，成為最多速解選手使用的解法。",
  },
  {
    year: "2003–2004",
    title: "比賽復興",
    body: "2003 年在加拿大多倫多再度舉辦世界錦標賽，2004 年世界魔術方塊協會 (WCA) 成立，從此全世界都有正式比賽和官方紀錄。",
  },
  {
    year: "2010",
    title: "「上帝之數」是 20",
    body: "一群研究者借助大量電腦運算證明：不論方塊被打亂成什麼樣子，最多只需要 20 步（180 度轉動也算 1 步）就能還原。這個數字被稱為「上帝之數」。",
  },
  {
    year: "今天",
    title: "全世界最暢銷的益智玩具之一",
    body: "魔術方塊至今已賣出數億顆。頂尖選手還原三階方塊的時間已經縮短到 4 秒以內，比賽項目也擴展到二階到七階、單手、盲解等等。",
  },
];

const FACTS = [
  { value: "43,252,003,274,489,856,000", label: "種可能的排列", note: "約 4325 京種，也就是 4.3 × 10¹⁹" },
  { value: "20 步", label: "上帝之數", note: "任何打亂狀態最多 20 步就能還原" },
  { value: "1974 年", label: "發明", note: "距今已超過 50 年" },
];

const NAMES = [
  { place: "台灣", name: "魔術方塊" },
  { place: "中國大陸", name: "魔方" },
  { place: "香港", name: "扭計骰" },
  { place: "匈牙利", name: "Bűvös kocka" },
];

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-sm font-semibold text-accent">歷史</p>
        <h1 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">魔術方塊的故事</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          這顆小方塊原本只是一位教授做給學生的教具，後來卻變成全世界最有名的益智玩具。來看看它五十多年來的旅程。
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {FACTS.map((f) => (
          <div key={f.label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-mono text-lg font-bold break-words text-accent">{f.value}</p>
            <p className="mt-1 font-semibold text-ink">{f.label}</p>
            <p className="mt-1 text-sm text-muted">{f.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-bold text-ink">年表</h2>
        <HistoryTimeline items={TIMELINE} />
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-ink">各地的名字</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {NAMES.map((n) => (
            <div key={n.place} className="rounded-2xl border border-line bg-surface-2 p-4 text-center">
              <p className="text-sm text-muted">{n.place}</p>
              <p className="mt-1 text-lg font-semibold text-ink">{n.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 hud-panel rounded-3xl p-8 sm:p-10">
        <h2 className="text-2xl font-bold">輪到你了</h2>
        <p className="mt-2 max-w-xl opacity-80">
          魯比克教授花了一個月才解開，你只要跟著七個步驟，就能學會還原它。
        </p>
        <Link
          href="/notation"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-on-accent transition hover:opacity-90"
        >
          開始學習 →
        </Link>
      </section>
    </div>
  );
}
