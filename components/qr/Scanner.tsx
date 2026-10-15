"use client";
import {useTranslations as useUiTranslations} from "next-intl";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import jsQR from "jsqr";

export {parseRouteSlug} from "@/lib/qr";
import {parseRouteSlug} from "@/lib/qr";

type BarcodeDetectorLike = { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> };

export default function Scanner() {
  const tx = useUiTranslations("ui");

  const router = useRouter();
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"starting" | "scanning" | "denied" | "unsupported">("starting");
  const [error, setError] = useState("");
  const [manual, setManual] = useState("");

  function handle(raw: string) {
    const slug = parseRouteSlug(raw);
    if (slug) { router.push(`/rotalar/${slug}`); return true; }
    setError(tx("thisQrCodeIsNot_bb9e1"));
    return false;
  }

  useEffect(() => {
    let stop = false; let stream: MediaStream | undefined; let raf = 0; let lastBad = 0;
    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) { setState("unsupported"); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      } catch { setState("denied"); return; }
      if (stop || !video.current) return;
      video.current.srcObject = stream; await video.current.play(); setState("scanning");
      const Detector = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => BarcodeDetectorLike }).BarcodeDetector;
      const detector = Detector ? new Detector({ formats: ["qr_code"] }) : null;
      const tick = async () => {
        if (stop || !video.current || !canvas.current) return;
        const v = video.current;
        if (v.readyState === v.HAVE_ENOUGH_DATA) {
          let value: string | null = null;
          if (detector) { try { value = (await detector.detect(v))[0]?.rawValue ?? null; } catch { /* kare atlandı */ } }
          else {
            const c = canvas.current; const w = (c.width = v.videoWidth); const h = (c.height = v.videoHeight);
            const ctx = c.getContext("2d", { willReadFrequently: true })!; ctx.drawImage(v, 0, 0, w, h);
            value = jsQR(ctx.getImageData(0, 0, w, h).data, w, h)?.data ?? null;
          }
          if (value && Date.now() - lastBad > 2500) { if (handle(value)) return; lastBad = Date.now(); }
        }
        raf = requestAnimationFrame(tick);
      };
      tick();
    }
    start();
    return () => { stop = true; cancelAnimationFrame(raf); stream?.getTracks().forEach((t) => t.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="relative mx-auto mt-6 aspect-square w-full max-w-[340px] overflow-hidden rounded-[32px] border-4 border-white/90 bg-black">
        <video ref={video} playsInline muted className="h-full w-full object-cover" aria-label={tx("cameraView_b8757")} />
        <canvas ref={canvas} hidden />
        {state === "scanning" && <div className="pointer-events-none absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 rounded bg-[#E3814F] shadow-[0_0_14px_#E3814F]" />}
        {state !== "scanning" && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm">
            {state === "starting" && tx("openingCamera_8e57c")}
            {state === "denied" && tx("cameraPermissionWasDeniedAllow_25c52")}
            {state === "unsupported" && tx("theCameraIsNotAvailable_8182d")}
          </div>
        )}
      </div>
      {error && <p role="alert" className="mt-4 rounded-2xl bg-[#FBE4DC] px-4 py-2.5 text-center text-[13px] font-semibold text-[#8E2C12]">{error}</p>}
      <form className="mx-auto mt-6 flex max-w-[340px] gap-2" onSubmit={(e) => { e.preventDefault(); setError(""); handle(manual); }}>
        <input value={manual} onChange={(e) => setManual(e.target.value)} placeholder={tx("routeCodeOrLink_bb904")} aria-label={tx("routeCode_ee00c")} className="h-12 min-w-0 flex-1 rounded-full border border-white/25 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/60 focus:border-white/60" />
        <button className="terra-grad h-12 rounded-full px-5 text-sm font-bold text-white">{tx("open_7205e")}</button>
      </form>
    </div>
  );
}
