"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/history", label: "歷史" },
  { href: "/notation", label: "轉動符號" },
  { href: "/learn", label: "七步教學" },
  { href: "/algorithms", label: "公式總表" },
  { href: "/playground", label: "練習場" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-ink" onClick={() => setOpen(false)}>
          <span className="grid h-7 w-7 grid-cols-3 gap-px overflow-hidden rounded-md bg-neutral-900 p-px" aria-hidden>
            {["#facc15", "#16a34a", "#dc2626", "#2563eb", "#f8fafc", "#f97316", "#16a34a", "#facc15", "#2563eb"].map(
              (c, i) => (
                <span key={i} className="rounded-[2px]" style={{ background: c }} />
              ),
            )}
          </span>
          <span className="flex flex-col leading-none">
            <span>方塊學堂</span>
            <span className="mt-1 font-mono text-[9px] tracking-[0.3em] text-accent">CUBE//LAB</span>
          </span>
        </Link>

        <nav className="hidden gap-1 sm:flex">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-accent-soft text-accent shadow-[inset_0_0_0_1px_var(--accent)]" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-ink sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="選單"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-line px-4 py-2 sm:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-3 text-sm font-medium ${
                pathname.startsWith(l.href) ? "text-accent" : "text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
