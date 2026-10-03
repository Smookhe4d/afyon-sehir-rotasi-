"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type State = "idle" | "playing" | "paused";

/** Cihazdaki en doğal Türkçe sesi seçer: "Natural/Neural/Online/Enhanced/Google" etiketli sesler öne geçer. */
function score(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase();
  let s = 0;
  if (/natural|neural/.test(n)) s += 12;
  if (/online/.test(n)) s += 8;
  if (/premium|enhanced|gelişmiş/.test(n)) s += 8;
  if (/google/.test(n)) s += 6;
  if (/yelda|emel|filiz|ahmet|cem/.test(n)) s += 3;
  if (!v.localService) s += 2;
  if (/espeak/.test(n)) s -= 10;
  return s;
}
const turkish = () => window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("tr")).sort((a, b) => score(b) - score(a));

export default function AudioGuide({ title, text }: { title: string; text: string }) {
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [state, setState] = useState<State>("idle");
  const run = useRef(0);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setSupported(true);
    const load = () => { const v = turkish(); setVoices(v); setVoiceName((cur) => cur || v[0]?.name || ""); };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => { run.current++; window.speechSynthesis.removeEventListener("voiceschanged", load); window.speechSynthesis.cancel(); };
  }, []);

  const start = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const id = ++run.current;
    const voice = voices.find((v) => v.name === voiceName) ?? voices[0];
    // Cümleleri ayrı okutmak hem uzun metinlerde kesilmeyi önler hem de doğal duraklar verir.
    const parts = `${title}. ${text}`.replace(/\s+/g, " ").match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = "tr-TR"; if (voice) u.voice = voice;
      u.rate = i === 0 ? 0.88 : 0.93; u.pitch = 1;
      if (i === parts.length - 1) u.onend = () => { if (run.current === id) setState("idle"); };
      u.onerror = () => { if (run.current === id) setState("idle"); };
      synth.speak(u);
    });
    setState("playing");
  }, [title, text, voices, voiceName]);

  if (!supported || !text) return null;
  const toggle = () => {
    const synth = window.speechSynthesis;
    if (state === "idle") start();
    else if (state === "playing") { synth.pause(); setState("paused"); }
    else { synth.resume(); setState("playing"); }
  };
  const stop = () => { run.current++; window.speechSynthesis.cancel(); setState("idle"); };
  const basic = voices.length > 0 && score(voices[0]) < 6;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2.5 rounded-full border border-line bg-white/90 p-1.5 pr-4 shadow-card">
        <button type="button" onClick={toggle} aria-label={state === "playing" ? "Duraklat" : "Sesli rehberi dinle"}
          className="terra-grad flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{state === "playing" ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
        </button>
        <span className="min-w-0 flex-1 text-sm font-bold text-navy">{state === "idle" ? "Sesli rehber" : state === "playing" ? "Dinleniyor…" : "Duraklatıldı"}<span className="block text-[11px] font-medium text-mute">Anlatımı sesli dinleyin</span></span>
        {state !== "idle" && <button type="button" onClick={stop} className="text-xs font-bold text-terra">Durdur</button>}
      </div>
      {voices.length > 1 && (
        <label className="mt-2 flex items-center gap-2 px-2 text-[11px] font-semibold text-mute">Ses
          <select value={voiceName} onChange={(e) => { setVoiceName(e.target.value); if (state !== "idle") stop(); }} className="min-w-0 flex-1 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] text-navy">
            {voices.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/Microsoft |Google /, "")}</option>)}
          </select>
        </label>
      )}
      {basic && <p className="mt-1.5 px-2 text-[11px] leading-snug text-mute">Ses, cihazınızın yerleşik Türkçe sesidir. Daha doğal bir ses için cihaz ayarlarından gelişmiş (Enhanced/Natural) Türkçe sesi indirebilirsiniz.</p>}
    </div>
  );
}
