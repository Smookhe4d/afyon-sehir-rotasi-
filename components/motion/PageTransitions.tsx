"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * G-014: sayfa geçişleri. Tarayıcının View Transitions özelliğiyle uygulama içi bağlantılar
 * iOS'taki gibi sağdan itilerek açılır, geri gidince ters yönde kapanır. Sekmeler arasında yumuşak geçiş olur.
 * G-016: ortak görsel büyütme kaldırıldı (köşeler ve yazılar kayboluyordu). Tüm ileri geçişler tek, kısa bir itme.
 * Özelliği desteklemeyen tarayıcıda ve hareket azaltma açıkken normal gezinme sürer.
 */
export default function PageTransitions() {
  const router = useRouter();
  const path = usePathname();
  const done = useRef<(() => void) | null>(null);

  useEffect(() => { done.current?.(); done.current = null; }, [path]);

  useEffect(() => {
    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } };
    if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const run = (kind: string, go: () => void) => {
      document.documentElement.dataset.vt = kind;
      const vt = doc.startViewTransition!(() => new Promise<void>((resolve) => {
        done.current = resolve; go();
        setTimeout(() => { if (done.current === resolve) { done.current = null; resolve(); } }, 900);
      }));
      vt.finished.finally(() => { delete document.documentElement.dataset.vt; });
    };
    (window as unknown as { __vtBack?: (go: () => void) => void }).__vtBack = (go) => run("back", go);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      const kind = a.dataset.tab ? "tab" : a.dataset.vtBack !== undefined ? "back" : "push";
      run(kind, () => router.push(url.pathname + url.search + url.hash));
    };
    // Geri tuşu: ters yönde
    const onPop = () => { document.documentElement.dataset.vt = "back"; setTimeout(() => { delete document.documentElement.dataset.vt; }, 700); };
    // G-016: parmak değer değmez sayfayı önceden iste, açılış beklemesi kısalsın.
    const pre = new Set<string>();
    const onDown = (e: PointerEvent) => {
      const a = (e.target as HTMLElement).closest("a"); if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href); if (url.origin !== location.origin) return;
      const k = url.pathname + url.search; if (pre.has(k)) return; pre.add(k); router.prefetch(k);
    };
    document.addEventListener("pointerdown", onDown, { passive: true, capture: true });
    document.addEventListener("click", onClick, true);
    addEventListener("popstate", onPop);
    // iOS Safari'de :active basma hâlinin çalışması için
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => { document.removeEventListener("pointerdown", onDown, true); document.removeEventListener("click", onClick, true); removeEventListener("popstate", onPop); document.removeEventListener("touchstart", noop); };
  }, [router]);
  return null;
}
