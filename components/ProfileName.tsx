"use client";
import { useState, useTransition } from "react";
import { updateDisplayName } from "@/app/actions";

export default function ProfileName({ name }: { name: string }) {
  const [edit, setEdit] = useState(false); const [v, setV] = useState(name); const [err, setErr] = useState(""); const [pending, run] = useTransition();
  if (!edit) return <div className="flex items-center gap-2"><h1 className="font-display text-[23px] font-semibold">{name}</h1><button type="button" onClick={() => setEdit(true)} className="text-xs font-bold text-terra">Düzenle</button></div>;
  return (
    <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); run(async () => { const r = await updateDisplayName(v); if (r.ok) { setEdit(false); setErr(""); } else setErr(r.error); }); }}>
      <input value={v} onChange={(e) => setV(e.target.value)} minLength={2} maxLength={40} required aria-label="Ad" className="h-10 w-44 rounded-full border border-line bg-white px-3.5 text-sm outline-none focus:border-terra" />
      <button disabled={pending} className="h-10 rounded-full bg-navy px-4 text-xs font-bold text-white">Kaydet</button>
      {err && <span role="alert" className="text-xs font-semibold text-[#8E2C12]">{err}</span>}
    </form>
  );
}
