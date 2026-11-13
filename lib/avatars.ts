/** G-015: fotoğraf yüklemek istemeyenler için 9 hazır avatar. Değer profiles.avatar_url alanında "avatar:<id>" olarak tutulur. */
export const AVATARS = [
  { id: "pusula", icon: "compass", a: "#60117B", b: "#8A2FA8" },
  { id: "dag", icon: "mountains", a: "#3C4A28", b: "#6E7A3A" },
  { id: "hashas", icon: "flower", a: "#B2456E", b: "#D9577A" },
  { id: "termal", icon: "drop", a: "#0F4C5C", b: "#2F8C93" },
  { id: "kale", icon: "castle-turret", a: "#4B3426", b: "#8A6244" },
  { id: "kahve", icon: "coffee", a: "#6B3A1E", b: "#B36A3A" },
  { id: "yaprak", icon: "leaf", a: "#2E6B4A", b: "#58A06F" },
  { id: "kus", icon: "bird", a: "#16264F", b: "#3C5A9A" },
  { id: "gunes", icon: "sun", a: "#C25A2B", b: "#FA9024" },
] as const;
export type AvatarId = (typeof AVATARS)[number]["id"];
export const AVATAR_BUCKET = "avatars";
export const avatarById = (v?: string | null) => (v?.startsWith("avatar:") ? AVATARS.find((a) => a.id === v.slice(7)) : undefined);
export const AVATAR_CACHE = "rotafyon-avatar";
