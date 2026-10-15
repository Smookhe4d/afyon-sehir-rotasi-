import {revalidatePath} from "next/cache";
import {internalPath, localizePath} from "./paths";
import {routing} from "./routing";

export function revalidateLocalizedPath(path: string) {
  const canonical = internalPath(new URL(path, "https://internal.invalid").pathname);
  const paths = new Set<string>();
  for (const locale of routing.locales) {
    paths.add(localizePath(canonical, locale));
    // Invalidate the rewritten App Router path as well as its public URL.
    paths.add("/" + locale + (canonical === "/" ? "" : canonical));
  }
  paths.forEach(value => revalidatePath(value));
}
