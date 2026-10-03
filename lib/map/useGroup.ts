"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { LngLat } from "./geo";

export type Member = { id: string; name: string; color: string; pos: LngLat | null; cur: number; leader: boolean };
const COLORS = ["#2F7BF6", "#1F9D6B", "#C2410C", "#7C3AED", "#DB2777", "#0891B2", "#CA8A04", "#475569"];
const colorFor = (id: string) => COLORS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

/** Grup turu: Supabase Realtime (broadcast + presence). Veritabanı tablosu gerekmez; kod, kanal adıdır. */
export function useGroup(opts: { code?: string; leader: boolean; name: string; pos: LngLat | null; cur: number; onStop: (cur: number) => void }) {
  const { code, leader, name, pos, cur, onStop } = opts;
  const [members, setMembers] = useState<Member[]>([]);
  const [status, setStatus] = useState<"off" | "connecting" | "ok" | "error">("off");
  const ch = useRef<RealtimeChannel | null>(null);
  const myId = useRef("");
  const latest = useRef({ pos, cur, name, leader });
  const onStopRef = useRef(onStop);
  const synced = useRef(false);
  latest.current = { pos, cur, name, leader }; onStopRef.current = onStop;

  const track = useCallback(() => {
    const c = ch.current; if (!c) return;
    const l = latest.current;
    void c.track({ name: l.name, pos: l.pos, cur: l.cur, leader: l.leader }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!code || !name) return;
    let id = sessionStorage.getItem("afyon-gid");
    if (!id) { id = Math.random().toString(36).slice(2, 10); sessionStorage.setItem("afyon-gid", id); }
    myId.current = id;
    const sb = createClient();
    const c = sb.channel(`grup:${code}`, { config: { presence: { key: id }, broadcast: { self: false } } });
    ch.current = c; setStatus("connecting");
    c.on("presence", { event: "sync" }, () => {
      const st = c.presenceState() as Record<string, { name: string; pos: LngLat | null; cur: number; leader: boolean }[]>;
      const list = Object.entries(st).map(([key, v]) => ({ id: key, name: v[0]?.name ?? "Gezgin", color: colorFor(key), pos: v[0]?.pos ?? null, cur: v[0]?.cur ?? 0, leader: Boolean(v[0]?.leader) }));
      setMembers(list);
      // Sonradan katılan üye, rehberin bulunduğu durağa geçer
      if (!latest.current.leader && !synced.current) { const l = list.find((m) => m.leader); if (l) { synced.current = true; onStopRef.current(l.cur); } }
    })
      .on("broadcast", { event: "stop" }, ({ payload }) => { if (!latest.current.leader) onStopRef.current(Number(payload?.cur) || 0); })
      .subscribe((s) => {
        if (s === "SUBSCRIBED") { setStatus("ok"); track(); }
        else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") setStatus("error");
      });
    return () => { ch.current = null; synced.current = false; void sb.removeChannel(c); setStatus("off"); };
  }, [code, name, track]);

  // Konum/durak değişince, en fazla 4 sn'de bir paylaş
  const last = useRef(0);
  useEffect(() => {
    if (status !== "ok") return;
    const wait = Math.max(0, 4000 - (Date.now() - last.current));
    const t = setTimeout(() => { last.current = Date.now(); track(); }, wait);
    return () => clearTimeout(t);
  }, [pos, cur, status, track]);

  const broadcastStop = useCallback((n: number) => { void ch.current?.send({ type: "broadcast", event: "stop", payload: { cur: n } }); }, []);
  return { members, status, myId: myId.current, broadcastStop };
}
