"use server";
import { revalidatePath } from "next/cache";
import { getRoute } from "@/lib/routes";
import { places } from "@/lib/places";
import { getSession } from "@/lib/session";

type Result = { ok: true } | { ok: false; error: string };
const fail = (error: string): Result => ({ ok: false, error });

async function requireUser() {
  const s = await getSession();
  if (!s.user) throw new Error("Oturum gerekli");
  return { ...s, user: s.user };
}
const registered = (profile: { is_guest: boolean } | null) => profile !== null && !profile.is_guest;

export async function toggleFavorite(slug: string): Promise<Result> {
  if (!getRoute(slug)) return fail("Rota bulunamadı.");
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("favorites").select("route_slug").eq("user_id", user.id).eq("route_slug", slug).maybeSingle();
  const { error } = data
    ? await supabase.from("favorites").delete().eq("user_id", user.id).eq("route_slug", slug)
    : await supabase.from("favorites").insert({ user_id: user.id, route_slug: slug });
  if (error) return fail("İşlem kaydedilemedi.");
  revalidatePath(`/rotalar/${slug}`); revalidatePath("/profil");
  return { ok: true };
}

export async function startRoute(slug: string): Promise<Result> {
  if (!getRoute(slug)) return fail("Rota bulunamadı.");
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("route_progress").upsert({ user_id: user.id, route_slug: slug }, { onConflict: "user_id,route_slug", ignoreDuplicates: true });
  if (error) return fail("Rota başlatılamadı.");
  revalidatePath(`/rotalar/${slug}`); revalidatePath("/profil");
  return { ok: true };
}

export async function setVisited(slug: string, placeId: string, visited: boolean): Promise<Result> {
  const route = getRoute(slug);
  if (!route || !places[placeId] || !route.stops.some((s) => s.placeId === placeId)) return fail("Durak bulunamadı.");
  const { supabase, user } = await requireUser();
  const { data: row } = await supabase.from("route_progress").select("visited_place_ids").eq("user_id", user.id).eq("route_slug", slug).maybeSingle();
  if (!row) return fail("Önce rotayı başlatın.");
  const set = new Set<string>(row.visited_place_ids);
  if (visited) set.add(placeId); else set.delete(placeId);
  const all = new Set(route.stops.map((s) => s.placeId));
  const done = [...all].every((id) => set.has(id));
  const { error } = await supabase.from("route_progress")
    .update({ visited_place_ids: [...set], completed_at: done ? new Date().toISOString() : null })
    .eq("user_id", user.id).eq("route_slug", slug);
  if (error) return fail("Durak güncellenemedi.");
  revalidatePath(`/rotalar/${slug}`); revalidatePath("/profil");
  return { ok: true };
}

export async function resetRoute(slug: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("route_progress").delete().eq("user_id", user.id).eq("route_slug", slug);
  if (error) return fail("Sıfırlanamadı.");
  revalidatePath(`/rotalar/${slug}`); revalidatePath("/profil");
  return { ok: true };
}

export async function addRouteComment(slug: string, body: string): Promise<Result> {
  const text = body.trim();
  if (!getRoute(slug)) return fail("Rota bulunamadı.");
  if (text.length < 1 || text.length > 500) return fail("Yorum 1–500 karakter olmalı.");
  const { supabase, user, profile } = await requireUser();
  if (!registered(profile)) return fail("Yorum yazmak için hesap oluşturmanız gerekir.");
  const { error } = await supabase.from("comments").insert({ user_id: user.id, route_slug: slug, body: text });
  if (error) return fail("Yorum gönderilemedi.");
  revalidatePath(`/rotalar/${slug}`);
  return { ok: true };
}

export async function deleteComment(id: string, path: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("comments").delete().eq("id", id).eq("user_id", user.id);
  if (error) return fail("Yorum silinemedi.");
  revalidatePath(path);
  return { ok: true };
}

export async function createPost(input: { body: string; routeSlug?: string; photoPath?: string }): Promise<Result> {
  const body = input.body.trim();
  if (body.length < 1 || body.length > 1000) return fail("Metin 1–1000 karakter olmalı.");
  if (input.routeSlug && !getRoute(input.routeSlug)) return fail("Rota bulunamadı.");
  const { supabase, user, profile } = await requireUser();
  if (!registered(profile)) return fail("Paylaşım yapmak için hesap oluşturmanız gerekir.");
  if (input.photoPath && !input.photoPath.startsWith(`${user.id}/`)) return fail("Geçersiz fotoğraf.");
  const { error } = await supabase.from("posts").insert({ user_id: user.id, body, route_slug: input.routeSlug ?? null, photo_path: input.photoPath ?? null });
  if (error) return fail("Paylaşım gönderilemedi.");
  revalidatePath("/sosyal"); revalidatePath("/profil");
  return { ok: true };
}

export async function deletePost(id: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("posts").select("photo_path").eq("id", id).eq("user_id", user.id).maybeSingle();
  const { error } = await supabase.from("posts").delete().eq("id", id).eq("user_id", user.id);
  if (error) return fail("Paylaşım silinemedi.");
  if (data?.photo_path) await supabase.storage.from("post-photos").remove([data.photo_path]);
  revalidatePath("/sosyal"); revalidatePath("/profil");
  return { ok: true };
}

export async function toggleLike(postId: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("post_likes").select("post_id").eq("post_id", postId).eq("user_id", user.id).maybeSingle();
  const { error } = data
    ? await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id)
    : await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
  if (error) return fail("Beğeni kaydedilemedi.");
  revalidatePath("/sosyal");
  return { ok: true };
}

export async function addPostComment(postId: string, body: string): Promise<Result> {
  const text = body.trim();
  if (text.length < 1 || text.length > 500) return fail("Yorum 1–500 karakter olmalı.");
  const { supabase, user, profile } = await requireUser();
  if (!registered(profile)) return fail("Yorum yazmak için hesap oluşturmanız gerekir.");
  const { error } = await supabase.from("comments").insert({ user_id: user.id, post_id: postId, body: text });
  if (error) return fail("Yorum gönderilemedi.");
  revalidatePath("/sosyal");
  return { ok: true };
}

export async function saveCustomRoute(input: { title: string; placeIds: string[]; isPublic: boolean }): Promise<Result> {
  const title = input.title.trim();
  if (title.length < 3 || title.length > 80) return fail("Rota adı 3–80 karakter olmalı.");
  const ids = [...new Set(input.placeIds)];
  if (ids.length < 2) return fail("En az 2 durak seçin.");
  if (ids.length > 30) return fail("En fazla 30 durak seçebilirsiniz.");
  if (ids.some((id) => !places[id])) return fail("Geçersiz durak.");
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("custom_routes").insert({ user_id: user.id, title, place_ids: ids, is_public: input.isPublic });
  if (error) return fail("Rota kaydedilemedi.");
  revalidatePath("/rotani-belirle"); revalidatePath("/profil");
  return { ok: true };
}

export async function deleteCustomRoute(id: string): Promise<Result> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("custom_routes").delete().eq("id", id).eq("user_id", user.id);
  if (error) return fail("Rota silinemedi.");
  revalidatePath("/rotani-belirle"); revalidatePath("/profil");
  return { ok: true };
}

export async function updateDisplayName(name: string): Promise<Result> {
  const n = name.trim();
  if (n.length < 2 || n.length > 40) return fail("Ad 2–40 karakter olmalı.");
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("profiles").update({ display_name: n }).eq("id", user.id);
  if (error) return fail("Ad güncellenemedi.");
  revalidatePath("/profil"); revalidatePath("/sosyal");
  return { ok: true };
}
