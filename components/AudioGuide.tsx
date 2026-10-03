"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type State = "idle" | "playing" | "paused";

/** Tarayıcının yerleşik Türkçe sesiyle sesli rehber (ek maliyet ve veri yok). */
export default function AudioGuide({ title, text }: { title: string; text: string }) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<State>("idle");
  const run = useRef(0);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => { run.current++; if (typeof window !== "undefined") window.speechSynthesis?.cancel(); };
  }, []);

  const start = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const id = ++run.current;
    const parts = `${title}. ${text}`.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("tr"));
    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = "tr-TR"; if (voice) u.voice = voice; u.rate = 0.95;
      if (i === parts.length - 1) u.onend = () => { if (run.current === id) setState("idle"); };
      u.onerror = () => { if (run.current === id) setState("idle"); };
      synth.speak(u);
    });
    setState("playing");
  }, [title, text]);

  if (!supported || !text) return null;
  const toggle = () => {
    const synth = window.speechSynthesis;
    if (state === "idle") start();
    else if (state === "playing") { synth.pause(); setState("paused"); }
    else { synth.resume(); setState("playing"); }
  };
  const stop = () => { run.current++; window.speechSynthesis.cancel(); setState("idle"); };

  return (
    <div className="mt-4 flex items-center gap-2.5 rounded-full border border-line bg-white/80 p-1.5 pr-4">
      <button type="button" onClick={toggle} aria-label={state === "playing" ? "Duraklat" : "Sesli rehberi dinle"}
        className="terra-grad flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{state === "playing" ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
      </button>
      <span className="min-w-0 flex-1 text-sm font-bold text-navy">{state === "idle" ? "Sesli rehber" : state === "playing" ? "Dinleniyor…" : "Duraklatıldı"}<span className="block text-[11px] font-medium text-mute">Anlatımı sesli dinleyin</span></span>
      {state !== "idle" && <button type="button" onClick={stop} className="text-xs font-bold text-terra">Durdur</button>}
    </div>
  );
}
