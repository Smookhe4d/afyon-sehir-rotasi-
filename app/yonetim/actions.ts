"use server";
import {getTranslations as getUiTranslations} from "next-intl/server";

import { revalidateLocalizedPath } from "@/i18n/revalidate";
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
  const tx = await getUiTranslations("ui");

  const s = await admin(); if (!s) return fail(tx("notAuthorized_33d4c"));
  if (!STATUSES.includes(status)) return fail(tx("invalidStatus_2b79b"));
  const { error } = await s.supabase.from("feedback").update({ status, admin_note: note.trim().slice(0, 1000) || null }).eq("id", id);
  if (error) return fail(tx("couldNotSave_fd987"));
  revalidateLocalizedPath("/yonetim"); return { ok: true };
}
export async function deleteFeedback(id: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const s = await admin(); if (!s) return fail(tx("notAuthorized_33d4c"));
  const { error } = await s.supabase.from("feedback").delete().eq("id", id);
  if (error) return fail(tx("couldNotDelete_51ceb"));
  revalidateLocalizedPath("/yonetim"); return { ok: true };
}
export async function addAnnouncement(title: string, body: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const s = await admin(); if (!s) return fail(tx("notAuthorized_33d4c"));
  const t = title.trim(), b = body.trim();
  if (t.length < 3 || t.length > 100 || b.length < 3 || b.length > 600) return fail(tx("titlesMustBe3100_a1bee"));
  const { error } = await s.supabase.from("announcements").insert({ title: t, body: b });
  if (error) return fail(tx("couldNotAdd_1aa02"));
  revalidateLocalizedPath("/yonetim"); revalidateLocalizedPath("/"); return { ok: true };
}
export async function toggleAnnouncement(id: string, active: boolean): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const s = await admin(); if (!s) return fail(tx("notAuthorized_33d4c"));
  const { error } = await s.supabase.from("announcements").update({ active }).eq("id", id);
  if (error) return fail(tx("couldNotUpdate_4f6aa"));
  revalidateLocalizedPath("/yonetim"); revalidateLocalizedPath("/"); return { ok: true };
}
export async function deleteAnnouncement(id: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const s = await admin(); if (!s) return fail(tx("notAuthorized_33d4c"));
  const { error } = await s.supabase.from("announcements").delete().eq("id", id);
  if (error) return fail(tx("couldNotDelete_51ceb"));
  revalidateLocalizedPath("/yonetim"); revalidateLocalizedPath("/"); return { ok: true };
}
