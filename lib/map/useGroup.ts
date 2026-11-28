"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { LngLat } from "./geo";
import {useTranslations} from "next-intl";

export type Member = { id: string; name: string; color: string; pos: LngLat | null; cur: number; leader: boolean; /** G-025: bağlantısı kopan üye son konumuyla kalır */ online: boolean; seen: number };
const COLORS = ["#2F7BF6", "#1F9D6B", "#C2410C", "#7C3AED", "#DB2777", "#0891B2", "#CA8A04", "#475569"];
const colorFor = (id: string) => COLORS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

/** Grup turu: Supabase Realtime (broadcast + presence). Veritabanı tablosu gerekmez; kod, kanal adıdır. */
export function useGroup(opts: { code?: string; leader: boolean; name: string; pos: LngLat | null; cur: number; onStop: (cur: number) => void }) {
  const t = useTranslations("ui");
  const { code, leader, name, pos, cur, onStop } = opts;
  const [members, setMembers] = useState<Member[]>([]);
  const [status, setStatus] = useState<"off" | "connecting" | "ok" | "error">("off");
  const ch = useRef<RealtimeChannel | null>(null);
  const myId = useRef("");
  const latest = useRef({ pos, cur, name, leader });
  const onStopRef = useRef(onStop);
  const synced = useRef(false);
  const known = useRef(new Map<string, Member>());
  const lastAudio = useRef<{ src: string; action: string; t: number; at: number } | null>(null);
  latest.current = { pos, cur, name, leader }; onStopRef.current = onStop;

  const track = useCallback(() => {
    const c = ch.current; if (!c) return;
    const l = latest.current;
    void c.track({ name: l.name, pos: l.pos, cur: l.cur, leader: l.leader }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!code || !name) return;
    // G-025: kimlik kalıcı, siteyi kapatıp açan üye aynı kişi olarak döner
    let id: string | null = null;
    try { id = localStorage.getItem("afyon-gid"); } catch { /* yok say */ }
    if (!id) { id = Math.random().toString(36).slice(2, 10); try { localStorage.setItem("afyon-gid", id); } catch { /* yok say */ } }
    myId.current = id;
    const sb = createClient();
    const c = sb.channel(`grup:${code}`, { config: { presence: { key: id }, broadcast: { self: false } } });
    ch.current = c; setStatus("connecting");
    try { for (const m of JSON.parse(localStorage.getItem(`afyon-grup-uyeler-${code}`) ?? "[]") as Member[]) known.current.set(m.id, { ...m, online: false }); } catch { /* yok say */ }
    c.on("presence", { event: "sync" }, () => {
      const st = c.presenceState() as Record<string, { name: string; pos: LngLat | null; cur: number; leader: boolean }[]>;
      const live = Object.entries(st).map(([key, v]) => ({ id: key, name: v[0]?.name ?? t("traveler_c4a46"), color: colorFor(key), pos: v[0]?.pos ?? null, cur: v[0]?.cur ?? 0, online: true, seen: Date.now(), leader: Boolean(v[0]?.leader) }));
      // G-025: daha önce görülen ama şu an bağlı olmayan üyeler son konum ve zamanla listede kalır
      const now = Date.now();
      for (const m of live) { const prev = known.current.get(m.id); known.current.set(m.id, { ...m, pos: m.pos ?? prev?.pos ?? null, online: true, seen: m.pos ? now : prev?.seen ?? now }); }
      known.current.forEach((m, k) => {
        if (live.some((x) => x.id === k)) return;
        // Aynı adla yeniden bağlanan üyenin eski kaydı silinir, listede iki kez görünmez
        if (live.some((x) => x.name === m.name)) known.current.delete(k); else known.current.set(k, { ...m, online: false });
      });
      try { localStorage.setItem(`afyon-grup-uyeler-${code}`, JSON.stringify([...known.current.values()])); } catch { /* yok say */ }
      const list = [...known.current.values()];
      setMembers(list);
      // G-026: sonradan katılan üye, turist rehberinin o anki anlatımını yakalasın
      if (latest.current.leader && lastAudio.current) void c.send({ type: "broadcast", event: "ses", payload: lastAudio.current });
      // Sonradan katılan üye, rehberin bulunduğu durağa geçer
      if (!latest.current.leader && !synced.current) { const l = list.find((m) => m.leader); if (l) { synced.current = true; onStopRef.current(l.cur); } }
    })
      .on("broadcast", { event: "leave" }, ({ payload }) => {
        known.current.delete(String(payload?.id)); setMembers([...known.current.values()]);
        try { localStorage.setItem(`afyon-grup-uyeler-${code}`, JSON.stringify([...known.current.values()])); } catch { /* yok say */ }
      })
      .on("broadcast", { event: "ses" }, ({ payload }) => { if (!latest.current.leader) dispatchEvent(new CustomEvent("grup-ses-al", { detail: payload })); })
      .on("broadcast", { event: "stop" }, ({ payload }) => { if (!latest.current.leader) onStopRef.current(Number(payload?.cur) || 0); })
      .subscribe((s) => {
        if (s === "SUBSCRIBED") { setStatus("ok"); track(); }
        else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") setStatus("error");
      });
    return () => { ch.current = null; synced.current = false; void sb.removeChannel(c); setStatus("off"); };
  }, [code, name, track, t]);

  // Konum/durak değişince, en fazla 4 sn'de bir paylaş
  const last = useRef(0);
  useEffect(() => {
    if (status !== "ok") return;
    const wait = Math.max(0, 4000 - (Date.now() - last.current));
    const t = setTimeout(() => { last.current = Date.now(); track(); }, wait);
    return () => clearTimeout(t);
  }, [pos, cur, status, track]);

  // G-026: turist rehberinin anlatım komutlarını gruba ilet
  useEffect(() => {
    if (!leader || !code) return;
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ src: string; action: string; t: number }>).detail;
      lastAudio.current = { ...d, at: Date.now() };
      void ch.current?.send({ type: "broadcast", event: "ses", payload: d });
    };
    addEventListener("grup-ses-gonder", on);
    return () => removeEventListener("grup-ses-gonder", on);
  }, [leader, code]);

  const broadcastStop = useCallback((n: number) => { void ch.current?.send({ type: "broadcast", event: "stop", payload: { cur: n } }); }, []);
  /** G-025: üye turdan bilerek ayrılınca diğerlerinin listesinden de çıkar */
  const leave = useCallback(async () => { await ch.current?.send({ type: "broadcast", event: "leave", payload: { id: myId.current } }).catch(() => {}); }, []);
  return { members, status, myId: myId.current, broadcastStop, leave };
}
