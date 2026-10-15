import {createServerClient} from "@supabase/ssr";
import {NextResponse, type NextRequest} from "next/server";
import createMiddleware from "next-intl/middleware";
import {routing} from "@/i18n/routing";
import {internalPath, localizePath} from "@/i18n/paths";

// Only explicit choices write NEXT_LOCALE, never a first visit.
const handleI18n = createMiddleware({...routing, localeCookie: false});

export async function middleware(request: NextRequest) {
  const authEndpoint = request.nextUrl.pathname.startsWith("/auth/");
  const response = authEndpoint ? NextResponse.next({request}) : handleI18n(request);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({name, value}) => request.cookies.set(name, value));
        // Preserve the rewrite and locale request headers while forwarding
        // refreshed cookies to Server Components in this same request.
        const forwarded = new Headers(request.headers);
        for (const name of (response.headers.get("x-middleware-override-headers") ?? "").split(",").filter(Boolean)) {
          const value = response.headers.get("x-middleware-request-" + name);
          if (name !== "cookie" && value !== null) forwarded.set(name, value);
        }
        const next = NextResponse.next({request: {headers: forwarded}});
        for (const [name, value] of next.headers) {
          if (name.startsWith("x-middleware-request-") || name === "x-middleware-override-headers") response.headers.set(name, value);
        }
        list.forEach(({name, value, options}) => response.cookies.set(name, value, options));
      }
    }
  });
  // Preserve existing behavior. Auth verification changes belong to G-004.
  const {data: {session}} = await supabase.auth.getSession();
  const user = session?.user ?? null;
  const path = request.nextUrl.pathname;
  if (!authEndpoint && user && !user.is_anonymous && internalPath(path) === "/giris") {
    const locale = path.startsWith("/en/") ? "en" : "tr";
    const target = NextResponse.redirect(new URL(localizePath("/", locale), request.url));
    response.cookies.getAll().forEach(cookie => target.cookies.set(cookie));
    return target;
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|api/|.*\\.).*)"]
};
