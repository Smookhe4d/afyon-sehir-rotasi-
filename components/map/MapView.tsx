"use client";
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-[#F4EDE0] text-sm font-semibold text-mute">Harita yükleniyor…</div>,
});
export default RouteMap;
