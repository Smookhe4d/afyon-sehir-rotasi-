"use client";
import { useEffect } from "react";
export default function SwRegister() {
  useEffect(() => { if ("serviceWorker" in navigator && location.hostname !== "localhost") navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then((r) => r.update()).catch(() => {}); }, []);
  return null;
}
