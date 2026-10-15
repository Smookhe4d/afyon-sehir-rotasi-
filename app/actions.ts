"use server";
import {getTranslations as getUiTranslations} from "next-intl/server";

import { revalidateLocalizedPath } from "@/i18n/revalidate";
import { getRoute } from "@/lib/routes";
import { places } from "@/lib/places";
import { getSession } from "@/lib/session";

type Result = { ok: true } | { ok: false; error: string };
const fail = (error: string): Result => ({ ok: false, error });

async function requireUser() {
  const s = await getSession();
  if (!s.user) return null;
  return { ...s, user: s.user };
}
const registered = (profile: { is_guest: boolean } | null) => profile !== null && !profile.is_guest;

export async function toggleFavorite(slug: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  if (!getRoute(slug)) return fail(tx("routeNotFound_1658a"));
  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { data } = await supabase.from("favorites").select("route_slug").eq("user_id", user.id).eq("route_slug", slug).maybeSingle();
  const { error } = data
    ? await supabase.from("favorites").delete().eq("user_id", user.id).eq("route_slug", slug)
    : await supabase.from("favorites").insert({ user_id: user.id, route_slug: slug });
  if (error) return fail(tx("yourChangesCouldNotBe_1df17"));
  revalidateLocalizedPath(`/rotalar/${slug}`); revalidateLocalizedPath("/profil");
  return { ok: true };
}

export async function startRoute(slug: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  if (!getRoute(slug)) return fail(tx("routeNotFound_1658a"));
  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { error } = await supabase.from("route_progress").upsert({ user_id: user.id, route_slug: slug }, { onConflict: "user_id,route_slug", ignoreDuplicates: true });
  if (error) return fail(tx("theRouteCouldNotBe_33729"));
  revalidateLocalizedPath(`/rotalar/${slug}`); revalidateLocalizedPath("/profil");
  return { ok: true };
}

export async function setVisited(slug: string, placeId: string, visited: boolean): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const route = getRoute(slug);
  if (!route || !places[placeId] || !route.stops.some((s) => s.placeId === placeId)) return fail(tx("stopNotFound_86861"));
  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { data: row } = await supabase.from("route_progress").select("visited_place_ids").eq("user_id", user.id).eq("route_slug", slug).maybeSingle();
  if (!row) return fail(tx("startTheRouteFirst_9874c"));
  const set = new Set<string>(row.visited_place_ids);
  if (visited) set.add(placeId); else set.delete(placeId);
  const all = new Set(route.stops.map((s) => s.placeId));
  const done = [...all].every((id) => set.has(id));
  const { error } = await supabase.from("route_progress")
    .update({ visited_place_ids: [...set], completed_at: done ? new Date().toISOString() : null })
    .eq("user_id", user.id).eq("route_slug", slug);
  if (error) return fail(tx("theStopCouldNotBe_3a84b"));
  revalidateLocalizedPath(`/rotalar/${slug}`); revalidateLocalizedPath("/profil");
  return { ok: true };
}

export async function resetRoute(slug: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { error } = await supabase.from("route_progress").delete().eq("user_id", user.id).eq("route_slug", slug);
  if (error) return fail(tx("couldNotReset_6dbae"));
  revalidateLocalizedPath(`/rotalar/${slug}`); revalidateLocalizedPath("/profil");
  return { ok: true };
}

export async function addRouteComment(slug: string, body: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const text = body.trim();
  if (!getRoute(slug)) return fail(tx("routeNotFound_1658a"));
  if (text.length < 1 || text.length > 500) return fail(tx("commentsMustBeBetween1_fda6d"));
  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user, profile } = _s;
  if (!registered(profile)) return fail(tx("createAnAccountToComment_57a27"));
  const { error } = await supabase.from("comments").insert({ user_id: user.id, route_slug: slug, body: text });
  if (error) return fail(tx("yourCommentCouldNotBe_016ea"));
  revalidateLocalizedPath(`/rotalar/${slug}`);
  return { ok: true };
}

export async function deleteComment(id: string, path: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { error } = await supabase.from("comments").delete().eq("id", id).eq("user_id", user.id);
  if (error) return fail(tx("theCommentCouldNotBe_63fa9"));
  revalidateLocalizedPath(path);
  return { ok: true };
}

export async function createPost(input: { body: string; routeSlug?: string; photoPath?: string }): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const body = input.body.trim();
  if (body.length < 1 || body.length > 1000) return fail(tx("textMustBeBetween1_6f5da"));
  if (input.routeSlug && !getRoute(input.routeSlug)) return fail(tx("routeNotFound_1658a"));
  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user, profile } = _s;
  if (!registered(profile)) return fail(tx("createAnAccountToPost_5402e"));
  if (input.photoPath && !input.photoPath.startsWith(`${user.id}/`)) return fail(tx("invalidPhoto_387ce"));
  const { error } = await supabase.from("posts").insert({ user_id: user.id, body, route_slug: input.routeSlug ?? null, photo_path: input.photoPath ?? null });
  if (error) return fail(tx("yourPostCouldNotBe_bec51"));
  revalidateLocalizedPath("/sosyal"); revalidateLocalizedPath("/profil");
  return { ok: true };
}

export async function deletePost(id: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { data } = await supabase.from("posts").select("photo_path").eq("id", id).eq("user_id", user.id).maybeSingle();
  const { error } = await supabase.from("posts").delete().eq("id", id).eq("user_id", user.id);
  if (error) return fail(tx("thePostCouldNotBe_4dd26"));
  if (data?.photo_path) await supabase.storage.from("post-photos").remove([data.photo_path]);
  revalidateLocalizedPath("/sosyal"); revalidateLocalizedPath("/profil");
  return { ok: true };
}

export async function toggleLike(postId: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { data } = await supabase.from("post_likes").select("post_id").eq("post_id", postId).eq("user_id", user.id).maybeSingle();
  const { error } = data
    ? await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id)
    : await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
  if (error) return fail(tx("yourLikeCouldNotBe_a1eb6"));
  revalidateLocalizedPath("/sosyal");
  return { ok: true };
}

export async function addPostComment(postId: string, body: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const text = body.trim();
  if (text.length < 1 || text.length > 500) return fail(tx("commentsMustBeBetween1_fda6d"));
  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user, profile } = _s;
  if (!registered(profile)) return fail(tx("createAnAccountToComment_57a27"));
  const { error } = await supabase.from("comments").insert({ user_id: user.id, post_id: postId, body: text });
  if (error) return fail(tx("yourCommentCouldNotBe_016ea"));
  revalidateLocalizedPath("/sosyal");
  return { ok: true };
}

export async function saveCustomRoute(input: { title: string; placeIds: string[]; isPublic: boolean }): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const title = input.title.trim();
  if (title.length < 3 || title.length > 80) return fail(tx("routeNamesMustBeBetween_0c426"));
  const ids = [...new Set(input.placeIds)];
  if (ids.length < 2) return fail(tx("selectAtLeast2Stops_8ad12"));
  if (ids.length > 30) return fail(tx("youCanSelectUpTo_26297"));
  if (ids.some((id) => !places[id])) return fail(tx("invalidStop_3b825"));
  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { error } = await supabase.from("custom_routes").insert({ user_id: user.id, title, place_ids: ids, is_public: input.isPublic });
  if (error) return fail(tx("theRouteCouldNotBe_18a31"));
  revalidateLocalizedPath("/rotani-belirle"); revalidateLocalizedPath("/profil");
  return { ok: true };
}

export async function deleteCustomRoute(id: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { error } = await supabase.from("custom_routes").delete().eq("id", id).eq("user_id", user.id);
  if (error) return fail(tx("theRouteCouldNotBe_e8284"));
  revalidateLocalizedPath("/rotani-belirle"); revalidateLocalizedPath("/profil");
  return { ok: true };
}

export async function updateDisplayName(name: string): Promise<Result> {
  const tx = await getUiTranslations("ui");

  const n = name.trim();
  if (n.length < 2 || n.length > 40) return fail(tx("namesMustBeBetween2_e6454"));
  const _s = await requireUser();
  if (!_s) return fail(tx("signInToContinue_9736a"));
  const { supabase, user } = _s;
  const { error } = await supabase.from("profiles").update({ display_name: n }).eq("id", user.id);
  if (error) return fail(tx("yourNameCouldNotBe_fc6b4"));
  revalidateLocalizedPath("/profil"); revalidateLocalizedPath("/sosyal");
  return { ok: true };
}

const KINDS = ["oneri", "sikayet", "katki", "hata"] as const;
export async function sendFeedback(input: { kind: string; placeId?: string; message: string; contact?: string; website?: string }): Promise<Result> {
  const tx = await getUiTranslations("ui");

  if (input.website) return { ok: true }; // bal küpü: botlar bu alanı doldurur
  if (!KINDS.includes(input.kind as (typeof KINDS)[number])) return fail(tx("invalidType_4be39"));
  const message = input.message.trim();
  if (message.length < 5 || message.length > 2000) return fail(tx("messagesMustBeBetween5_a9b0b"));
  const placeId = input.placeId && places[input.placeId] ? input.placeId : null;
  const contact = input.contact?.trim().slice(0, 120) || null;
  const { supabase } = await getSession();
  const { error } = await supabase.from("feedback").insert({ kind: input.kind, place_id: placeId, message, contact });
  if (error) return fail(/PGRST205|42P01|does not exist/i.test(`${error.code} ${error.message}`) ? tx("feedbackIsNotAvailableYet_45928") : tx("couldNotSendPleaseTry_62b45"));
  return { ok: true };
}
