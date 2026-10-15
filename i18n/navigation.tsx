import {createNavigation} from "next-intl/navigation";
import type {ComponentProps} from "react";
import type {UrlObject} from "url";
import {routing} from "./routing";
import {internalPath, localizePath} from "./paths";

const navigation = createNavigation(routing);
type Href = string | UrlObject;
type TypedHref = ComponentProps<typeof navigation.Link>["href"];
type RouterHref = Parameters<ReturnType<typeof navigation.useRouter>["push"]>[0];

function routeHref(href: Href): TypedHref {
  if (typeof href !== "string") return href as TypedHref;
  if (!href.startsWith("/") || href.startsWith("//")) return href as TypedHref;
  const url = new URL(href, "https://internal.invalid");
  const path = internalPath(url.pathname);
  const slug = path.match(/^\/rotalar\/([^/]+)$/);
  const id = path.match(/^\/duraklar\/([^/]+)$/);
  return {
    pathname: slug ? "/rotalar/[slug]" : id ? "/duraklar/[id]" : path,
    ...(slug ? {params: {slug: slug[1]}} : id ? {params: {id: id[1]}} : {}),
    query: Object.fromEntries(url.searchParams),
    hash: url.hash
  } as TypedHref;
}

export function Link({href, ...props}: Omit<ComponentProps<typeof navigation.Link>, "href"> & {href: Href}) {
  return <navigation.Link {...props} href={routeHref(href)} />;
}
export const usePathname = navigation.usePathname;
// Analytics needs the actual public URL, rather than a dynamic route template.
export {usePublicPathname} from "./client";
export function useRouter() {
  const router = navigation.useRouter();
  return {
    ...router,
    push: (href: Href, options?: Parameters<typeof router.push>[1]) => router.push(routeHref(href) as RouterHref, options),
    replace: (href: Href, options?: Parameters<typeof router.replace>[1]) => router.replace(routeHref(href) as RouterHref, options),
    prefetch: (href: Href, options?: Parameters<typeof router.prefetch>[1]) => router.prefetch(routeHref(href) as RouterHref, options)
  };
}
export const redirect = navigation.redirect;
export const getPathname = navigation.getPathname;
export {localizePath};

// Standalone root 404 has no locale provider and always links to Turkish.
export {default as RootLink} from "next/link";
