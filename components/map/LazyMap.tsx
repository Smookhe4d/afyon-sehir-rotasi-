"use client";

import {useTranslations as useUiTranslations} from "next-intl";
import dynamic from "next/dynamic";

function MapLoading() { const tx = useUiTranslations("ui"); return <div className="skeleton h-full w-full" aria-label={tx("loadingMap_21311")} />; }
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: MapLoading,
});
export default MapView;
