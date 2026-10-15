"use client";

import {useTranslations as useUiTranslations} from "next-intl";
import dynamic from "next/dynamic";

function MapLoading() { const tx = useUiTranslations("ui"); return <div className="flex h-full w-full items-center justify-center bg-[#F4EDE0] text-sm font-semibold text-mute">{tx("loadingMap_cb8fa")}</div>; }
const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: MapLoading,
});
export default RouteMap;
