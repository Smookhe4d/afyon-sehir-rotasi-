"use client";
import {useLocale as useUiLocale} from "next-intl";
import {useTranslations as useUiTranslations} from "next-intl";

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
const matchingVoices = (language: string) => window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(language)).sort((a, b) => (score(b) + (b.lang.toLowerCase() === (language === "en" ? "en-us" : "tr-tr") ? 20 : 0)) - (score(a) + (a.lang.toLowerCase() === (language === "en" ? "en-us" : "tr-tr") ? 20 : 0)));

export default function AudioGuide({ title, text }: { title: string; text: string }) {
  const language = useUiLocale();
  const tx = useUiTranslations("ui");

  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [state, setState] = useState<State>("idle");
  const run = useRef(0);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setSupported(true);
    setState("idle");
    const load = () => { const v = matchingVoices(language); setVoices(v); setVoiceName((cur) => v.some(voice => voice.name === cur) ? cur : v[0]?.name || ""); };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => { run.current++; window.speechSynthesis.removeEventListener("voiceschanged", load); window.speechSynthesis.cancel(); };
  }, [language]);

  const start = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const id = ++run.current;
    const voice = voices.find((v) => v.name === voiceName) ?? voices[0];
    // Cümleleri ayrı okutmak hem uzun metinlerde kesilmeyi önler hem de doğal duraklar verir.
    const parts = `${title}. ${text}`.replace(/\s+/g, " ").match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = language === "en" ? "en-US" : "tr-TR"; if (voice) u.voice = voice;
      u.rate = i === 0 ? 0.88 : 0.93; u.pitch = 1;
      if (i === parts.length - 1) u.onend = () => { if (run.current === id) setState("idle"); };
      u.onerror = () => { if (run.current === id) setState("idle"); };
      synth.speak(u);
    });
    setState("playing");
  }, [title, text, voices, voiceName, language]);

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
      <div className="rounded-[26px] bg-white p-3.5 shadow-[0_18px_36px_-20px_rgba(44,18,66,.6)]">
        <div className="flex items-center gap-3">
          <button type="button" onClick={toggle} aria-label={state === "playing" ? tx("pause_37568") : tx("listenToTheAudioGuide_ab2f5")}
            className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-ac2 text-navy shadow-[0_10px_20px_-10px_var(--ac2)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{state === "playing" ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
          </button>
          <span className="min-w-0 flex-1"><span className="block text-[12.5px] font-semibold text-mute">{tx("listenToTheDescription_78f98")}</span><b className="block text-[16.5px] text-navy">{state === "idle" ? tx("audioGuide_90c2d") : state === "playing" ? tx("playing_60f4d") : tx("paused_0cf0c")}</b></span>
          {state !== "idle" && <button type="button" onClick={stop} className="h-10 rounded-full bg-ac-soft px-3.5 text-[13px] font-bold text-ac">{tx("stop_acc8c")}</button>}
        </div>
        <div aria-hidden className="mt-2.5 flex h-[30px] items-center gap-[3px]">
          {Array.from({ length: 34 }, (_, k) => <i key={k} className={`flex-1 rounded-[2px] bg-ac transition-opacity ${state === "playing" ? "opacity-100 [animation:onb-wave_1.1s_ease-in-out_infinite]" : "opacity-25"}`} style={{ height: 8 + Math.round(Math.abs(Math.sin(k * 1.7) * 20 + Math.cos(k * 0.6) * 6)), animationDelay: `${k * 45}ms` }} />)}
        </div>
      </div>
      {voices.length > 1 && (
        <label className="mt-2 flex items-center gap-2 px-2 text-[11px] font-semibold text-mute">{tx("voice_e8bff")}<select value={voiceName} onChange={(e) => { setVoiceName(e.target.value); if (state !== "idle") stop(); }} className="min-w-0 flex-1 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] text-navy">
            {voices.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/Microsoft |Google /, "")}</option>)}
          </select>
        </label>
      )}
      {basic && <p className="mt-1.5 px-2 text-[11px] leading-snug text-mute">{tx("thisIsYourDeviceS_cacb9")}</p>}
    </div>
  );
}
