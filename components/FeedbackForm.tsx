"use client";
import {useFormatter as useUiFormatter} from "next-intl";

import {useContent} from "@/i18n/useContent";
import {useTranslations as useUiTranslations} from "next-intl";

import { Link } from "@/i18n/navigation";

import { useState, useTransition } from "react";
import { sendFeedback } from "@/app/actions";

export default function FeedbackForm({ placeId = "", kind0 = "oneri" }: { placeId?: string; kind0?: string }) {
  const num = useUiFormatter().number;

  const {placeList} = useContent();

  const tx = useUiTranslations("ui");

  const kinds = [
  { v: "oneri", l: tx("suggestion_e8cf4"), d: tx("newRouteFeatureOrIdea_2d28f") },
  { v: "katki", l: tx("contribution_480ce"), d: tx("informationPhotoOrCorrection_85b0c") },
  { v: "sikayet", l: tx("complaint_ce07f"), d: tx("dissatisfactionOrInappropriateContent_f74ba") },
  { v: "hata", l: tx("issue_82e75"), d: tx("somethingBrokenOrIncorrect_0375a") },
] as const;

  const [kind, setKind] = useState(kinds.some((k) => k.v === kind0) ? kind0 : "oneri");
  const [place, setPlace] = useState(placeId);
  const [msg, setMsg] = useState("");
  const [contact, setContact] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, run] = useTransition();
  const field = "w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none focus:border-terra";

  if (state?.ok) return (
    <div className="glass mx-5 mt-5 rounded-[28px] p-6 text-center">
      <p className="font-display text-xl font-semibold">{tx("thankYou_de03d")}</p>
      <p className="mt-2 text-sm text-ink-2">{tx("weReceivedYourMessageYour_e9a11")}</p>
    </div>
  );
  return (
    <form className="mx-5 mt-5 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); run(async () => { const r = await sendFeedback({ kind, placeId: place, message: msg, contact, website: hp }); setState(r.ok ? { ok: true, text: "" } : { ok: false, text: r.error }); }); }}>
      <div role="radiogroup" aria-label={tx("type_ddf8c")} className="grid grid-cols-2 gap-2">
        {kinds.map((k) => (
          <button key={k.v} type="button" role="radio" aria-checked={kind === k.v} onClick={() => setKind(k.v)}
            className={`rounded-2xl border px-3.5 py-3 text-left shadow-card ${kind === k.v ? "border-terra bg-[#FCEBDD]" : "border-line bg-white"}`}>
            <span className="block text-sm font-bold">{k.l}</span><span className="text-[11px] text-mute">{k.d}</span>
          </button>
        ))}
      </div>
      <label className="text-xs font-bold text-mute">{tx("relatedStopOptional_dfe56")}<select value={place} onChange={(e) => setPlace(e.target.value)} className={`${field} mt-1 h-12`}>
          <option value="">{tx("general_5621a")}</option>
          {placeList.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="text-xs font-bold text-mute">{tx("yourMessage_208de")}<textarea value={msg} onChange={(e) => setMsg(e.target.value)} required minLength={5} maxLength={2000} rows={6} placeholder={tx("whatDoYouThink_72763")} className={`${field} mt-1 py-3`} />
        <span className="mt-1 block text-right text-[10px] font-medium">{num(msg.length)}/2000</span>
      </label>
      <label className="text-xs font-bold text-mute">{tx("emailOrPhoneOptionalFor_9a915")}<input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} className={`${field} mt-1 h-12`} />
      </label>
      <input value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />
      {state && !state.ok && <p role="alert" className="rounded-2xl bg-[#FBE4DC] px-3.5 py-2.5 text-[13px] font-semibold text-[#8E2C12]">{state.text}</p>}
      <button disabled={pending || msg.trim().length < 5} className="terra-grad h-14 rounded-full font-bold text-white disabled:opacity-50">{pending ? tx("sending_56205") : tx("send_6a23e")}</button>
      <p className="text-center text-[11px] text-mute">{tx("onlyTheSiteAdministratorCan_84644")} <Link href="/gizlilik" className="underline">{tx("privacy_9e93e")}</Link></p>
    </form>
  );
}
