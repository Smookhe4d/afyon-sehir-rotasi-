"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

type Result = { ok: true } | { ok: false; error: string };
const fail = (error: string): Result => ({ ok: false, error });
const STATUSES = ["yeni", "inceleniyor", "cozuldu", "reddedildi"];

async function admin() {
  const s = await getSession();
  if (!s.user) return null;
  const { data } = await s.supabase.rpc("is_admin");
  return data === true ? s : null;
}

export async function setFeedbackStatus(id: string, status: string, note: string): Promise<Result> {
  const s = await admin(); if (!s) return fail("Yetkisiz.");
  if (!STATUSES.includes(status)) return fail("Geçersiz durum.");
  const { error } = await s.supabase.from("feedback").update({ status, admin_note: note.trim().slice(0, 1000) || null }).eq("id", id);
  if (error) return fail("Kaydedilemedi.");
  revalidatePath("/yonetim"); return { ok: true };
}
export async function deleteFeedback(id: string): Promise<Result> {
  const s = await admin(); if (!s) return fail("Yetkisiz.");
  const { error } = await s.supabase.from("feedback").delete().eq("id", id);
  if (error) return fail("Silinemedi.");
  revalidatePath("/yonetim"); return { ok: true };
}
export async function addAnnouncement(title: string, body: string): Promise<Result> {
  const s = await admin(); if (!s) return fail("Yetkisiz.");
  const t = title.trim(), b = body.trim();
  if (t.length < 3 || t.length > 100 || b.length < 3 || b.length > 600) return fail("Başlık 3-100, metin 3-600 karakter olmalı.");
  const { error } = await s.supabase.from("announcements").insert({ title: t, body: b });
  if (error) return fail("Eklenemedi.");
  revalidatePath("/yonetim"); revalidatePath("/"); return { ok: true };
}
export async function toggleAnnouncement(id: string, active: boolean): Promise<Result> {
  const s = await admin(); if (!s) return fail("Yetkisiz.");
  const { error } = await s.supabase.from("announcements").update({ active }).eq("id", id);
  if (error) return fail("Güncellenemedi.");
  revalidatePath("/yonetim"); revalidatePath("/"); return { ok: true };
}
export async function deleteAnnouncement(id: string): Promise<Result> {
  const s = await admin(); if (!s) return fail("Yetkisiz.");
  const { error } = await s.supabase.from("announcements").delete().eq("id", id);
  if (error) return fail("Silinemedi.");
  revalidatePath("/yonetim"); revalidatePath("/"); return { ok: true };
}
