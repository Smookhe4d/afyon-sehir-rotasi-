"use client";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="skeleton h-full w-full" aria-label="Harita yükleniyor" />,
});
export default MapView;
