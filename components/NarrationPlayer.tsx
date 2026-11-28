"use client";
import { olay } from "@/lib/olay";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export type NarrationLine = { s: "E" | "K"; t: string; a: number; b: number };
type Props = { title: string; src: string; dur: number; lines: NarrationLine[]; label?: string };

const NAMES = { E: "Elif", K: "Kerem" } as const;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** G-022: kayıtlı iki anlatıcılı sesli anlatım. Kullanıcı başlatır, metin satırları sesle birlikte ilerler. */
export default function NarrationPlayer({ title, src, dur, lines, label }: Props) {
  const t = useTranslations("g022");
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [rate, setRate] = useState(1);
  const [open, setOpen] = useState(false);
  const cur = lines.findIndex((l, i) => time >= l.a && (i === lines.length - 1 || time < lines[i + 1].a));
  const line = cur >= 0 ? lines[cur] : lines[0];
  const listRef = useRef<HTMLOListElement>(null);
  // G-026: grup turunda anlatımı turist rehberi yönetir. Üyede kontroller gizlenir, rehberin komutları uygulanır.
  const [role, setRole] = useState<"" | "lider" | "uye">("");
  const [blocked, setBlocked] = useState(false);
  const remote = useRef(false);
  useEffect(() => { setRole((document.body.dataset.grupRol as "lider" | "uye" | undefined) ?? ""); }, []);
  useEffect(() => {
    if (role !== "uye") return;
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ src: string; action: "play" | "pause"; t: number }>).detail;
      const a = audio.current; if (!a) return;
      if (d.src !== src) { if (d.action === "play") a.pause(); return; }
      remote.current = true;
      if (Math.abs(a.currentTime - d.t) > 1.5) a.currentTime = d.t;
      if (d.action === "play") a.play().then(() => setBlocked(false)).catch(() => setBlocked(true)); else a.pause();
    };
    addEventListener("grup-ses-al", on);
    return () => removeEventListener("grup-ses-al", on);
  }, [role, src]);
  // G-027: anlatımın başlatılması ve sonuna kadar dinlenmesi kaydedilir (her oynatıcı için bir kez)
  const logged = useRef<Set<string>>(new Set());
  const log = (kind: "ses_basla" | "ses_bitir") => {
    if (logged.current.has(kind)) return; logged.current.add(kind);
    const m = /\/rotalar\/([^/]+)/.exec(location.pathname);
    olay({ kind, route_slug: m?.[1] ?? "-", stop_id: src.split("/").pop()?.replace(/\.mp3$/, ""), role: role || "bireysel", value: Math.round(audio.current?.currentTime ?? 0) });
  };
  const tell = (action: "play" | "pause") => {
    if (role !== "lider") return;
    dispatchEvent(new CustomEvent("grup-ses-gonder", { detail: { src, action, t: audio.current?.currentTime ?? 0 } }));
  };

  useEffect(() => {
    const a = audio.current;
    // Aynı anda tek anlatım çalsın: başka bir oynatıcı başlarsa bu durur.
    const other = (e: Event) => { if ((e as CustomEvent).detail !== a) a?.pause(); };
    addEventListener("narration-play", other);
    return () => { removeEventListener("narration-play", other); a?.pause(); };
  }, []);

  useEffect(() => {
    if (!open || cur < 0) return;
    listRef.current?.querySelector<HTMLElement>(`[data-i="${cur}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [cur, open]);

  const toggle = async () => {
    const a = audio.current; if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        if ("mediaSession" in navigator) navigator.mediaSession.metadata = new MediaMetadata({ title, artist: "rotAfyon", album: t("narrators") });
      } catch { /* kullanıcı etkileşimi gerekir */ }
    } else a.pause();
  };
  const seek = (s: number) => { const a = audio.current; if (!a) return; a.currentTime = Math.max(0, Math.min(dur, s)); setTime(a.currentTime); };
  const nextRate = () => { const r = rate === 1 ? 1.25 : rate === 1.25 ? 0.9 : 1; setRate(r); if (audio.current) audio.current.playbackRate = r; };

  return (
    <div className="mt-4">
      <audio ref={audio} src={src} preload="metadata"
        onPlay={(e) => { setPlaying(true); dispatchEvent(new CustomEvent("narration-play", { detail: e.currentTarget })); tell("play"); log("ses_basla"); }} onPause={() => { setPlaying(false); tell("pause"); }}
        onSeeked={() => { if (role === "lider" && audio.current && !audio.current.paused) tell("play"); }} onEnded={() => { setPlaying(false); log("ses_bitir"); }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} />
      <div className="rounded-[26px] bg-white p-3.5 shadow-[0_18px_36px_-20px_rgba(44,18,66,.6)]">
        {role === "uye" && (
          <div className="mb-2 flex items-center gap-2 rounded-2xl bg-cream px-3 py-2 text-[13px] font-semibold text-navy" role="status">
            <span className="min-w-0 flex-1">{blocked ? t("tapToListen") : playing ? t("guidePlaying") : t("guideControls")}</span>
            {blocked && <button type="button" onClick={() => { audio.current?.play().then(() => setBlocked(false)).catch(() => {}); }} className="h-10 rounded-full bg-ac2 px-4 text-[13px] font-bold text-navy">{t("play")}</button>}
          </div>
        )}
        <div className={role === "uye" ? "hidden" : "flex items-center gap-3"}>
          <button type="button" onClick={toggle} aria-label={playing ? t("pause") : t("play")}
            className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-ac2 text-navy shadow-[0_10px_20px_-10px_var(--ac2)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
          </button>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold text-mute">{label ?? t("narrators")}</span>
            <b className="block text-[16.5px] text-navy">{time > 0 ? `${fmt(time)} / ${fmt(dur)}` : t("listen", { min: Math.max(1, Math.round(dur / 60)) })}</b>
          </span>
          <button type="button" onClick={nextRate} aria-label={t("speed")} className="h-10 min-w-[52px] rounded-full bg-ac-soft px-3 text-[13px] font-bold text-ac">{rate}x</button>
        </div>
        <div className={role === "uye" ? "hidden" : "mt-3 flex items-center gap-2"}>
          <button type="button" onClick={() => seek(time - 15)} aria-label={t("back15")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" /><text x="12" y="15.5" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="700">15</text></svg>
          </button>
          <input type="range" min={0} max={dur} step={0.5} value={time} onChange={(e) => seek(Number(e.target.value))} aria-label={t("position")}
            className="h-1.5 min-w-0 flex-1 cursor-pointer accent-[var(--ac)]" />
          <button type="button" onClick={() => seek(time + 15)} aria-label={t("fwd15")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M20 12a8 8 0 1 1-3-6.2M20 4v4h-4" /><text x="12" y="15.5" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="700">15</text></svg>
          </button>
        </div>
        {(playing || time > 0) && !open && (
          <p className="mt-2.5 rounded-2xl bg-cream px-3 py-2.5 text-[14px] leading-snug text-ink-2" aria-live="off">
            <b className={line.s === "E" ? "text-ac" : "text-navy"}>{NAMES[line.s]}:</b> {line.t}
          </p>
        )}
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mt-2 h-10 w-full rounded-full border border-line text-[13px] font-bold text-navy">
          {open ? t("hideText") : t("showText")}
        </button>
        {open && (
          <ol ref={listRef} data-lenis-prevent className="mt-2 max-h-[300px] space-y-1 overflow-y-auto overscroll-contain">
            {lines.map((l, i) => (
              <li key={i} data-i={i}>
                <button type="button" disabled={role === "uye"} onClick={() => { seek(l.a); if (audio.current?.paused) void toggle(); }}
                  className={`w-full rounded-xl px-2.5 py-2 text-left text-[13.5px] leading-snug ${i === cur ? "bg-ac-soft text-navy" : "text-ink-2"}`}>
                  <b className={l.s === "E" ? "text-ac" : "text-navy"}>{NAMES[l.s]}:</b> {l.t}
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
