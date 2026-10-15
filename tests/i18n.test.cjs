const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");

function load(name, mocks = {}) {
  const filename = path.resolve(root, name);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod.require = id => {
    if (id in mocks) return mocks[id];
    if (id === "next-intl/routing") return {defineRouting: config => config};
    if (id.startsWith("@/") || id.startsWith(".")) {
      const file = id.startsWith("@/") ? path.join(root, id.slice(2)) : path.resolve(path.dirname(filename), id);
      if (file.endsWith(".json") && fs.existsSync(file)) return require(file);
      for (const extension of [".ts", ".tsx"]) if (fs.existsSync(file + extension)) return load(file + extension, mocks);
    }
    return require(id);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX}
  }).outputText, filename);
  return mod.exports;
}

const {localizePath, internalPath, safeReturnPath} = load("i18n/paths.ts");
const {routing} = load("i18n/routing.ts");

test("all 15 canonical route patterns round-trip in both languages", () => {
  for (const key of Object.keys(routing.pathnames)) {
    const canonical = key.replace("[slug]", "frig-yolu-afyonkarahisar").replace("[id]", "ayazini");
    for (const locale of routing.locales) {
      const localized = localizePath(canonical, locale);
      assert.equal(internalPath(localized), canonical);
      assert.equal(localizePath(localized, locale), localized);
    }
  }
});
test("query, fragment, group codes and nested login return paths survive", () => {
  assert.equal(localizePath("/harita?rota=frig-yolu-afyonkarahisar&grup=K7M2QX#stop", "en"), "/en/map?rota=frig-yolu-afyonkarahisar&grup=K7M2QX#stop");
  const login = new URL(localizePath("/giris?next=/rotalar/frig-yolu-afyonkarahisar", "en"), "https://test.invalid");
  assert.equal(login.pathname, "/en/sign-in");
  assert.equal(login.searchParams.get("next"), "/en/routes/frig-yolu-afyonkarahisar");
  assert.equal(localizePath("/auth/callback?code=test", "en"), "/auth/callback?code=test");
});
test("unsafe return destinations cannot leave this origin", () => {
  for (const value of ["//evil.invalid", "/\\evil.invalid", "https://evil.invalid", "/\nevil.invalid"]) {
    assert.equal(safeReturnPath(value, "en"), "/en");
  }
  assert.equal(safeReturnPath("/en/profile", "en"), "/en/profile");
});
test("printed Turkish QR codes and new English URLs resolve to the same route", () => {
  const {parseRouteSlug} = load("lib/qr.ts");
  const slug = "frig-yolu-afyonkarahisar";
  for (const value of [slug, "/rotalar/" + slug, "https://afyon-sehir-rotasi.vercel.app/rotalar/" + slug, "/en/routes/" + slug, "https://afyon-sehir-rotasi.vercel.app/en/routes/" + slug]) {
    assert.equal(parseRouteSlug(value), slug);
  }
  assert.equal(parseRouteSlug("/en/routes/missing-route"), null);
});
test("distance punctuation and duration carry work in both languages", () => {
  const {formatDistance} = load("lib/map/geo.ts");
  const {formatDuration} = load("lib/map/nav.ts");
  assert.equal(formatDistance(1200, "tr"), "1,2 km");
  assert.equal(formatDistance(1200, "en"), "1.2 km");
  assert.equal(formatDistance(128, "tr"), "130 m");
  assert.equal(formatDuration(900, "tr"), "15 dk");
  assert.equal(formatDuration(900, "en"), "15 min");
  assert.equal(formatDuration(3900, "tr"), "1 sa 5 dk");
  assert.equal(formatDuration(3900, "en"), "1 h 5 min");
  assert.equal(formatDuration(3599, "en"), "1 h 0 min");
  assert.equal(formatDuration(7199, "tr"), "2 sa 0 dk");
});
test("one invalidation refreshes both public aliases and internal cache entries", () => {
  const paths = [];
  const {revalidateLocalizedPath} = load("i18n/revalidate.ts", {"next/cache": {revalidatePath: value => paths.push(value)}});
  revalidateLocalizedPath("/en/routes/frig-yolu-afyonkarahisar");
  assert.deepEqual(new Set(paths), new Set([
    "/rotalar/frig-yolu-afyonkarahisar", "/tr/rotalar/frig-yolu-afyonkarahisar",
    "/en/routes/frig-yolu-afyonkarahisar", "/en/rotalar/frig-yolu-afyonkarahisar"
  ]));
});
test("a registered user's route comment invalidates Turkish and English views", async () => {
  const invalidated = [];
  const inserted = [];
  const actions = load("app/actions.ts", {
    "next/cache": {revalidatePath: value => invalidated.push(value)},
    "@/lib/session": {getSession: async () => ({
      user: {id: "local-test-user"},
      profile: {is_guest: false},
      supabase: {from: table => ({insert: async row => {inserted.push({table, row}); return {error: null};}})}
    })}
  });
  const result = await actions.addRouteComment("frig-yolu-afyonkarahisar", "G-002 local test comment");
  assert.deepEqual(result, {ok: true});
  assert.equal(inserted[0].table, "comments");
  assert.equal(inserted[0].row.route_slug, "frig-yolu-afyonkarahisar");
  assert.ok(invalidated.includes("/en/routes/frig-yolu-afyonkarahisar"));
  assert.ok(invalidated.includes("/rotalar/frig-yolu-afyonkarahisar"));
});
test("missing English messages inherit Turkish without an error placeholder", async () => {
  const configure = load("i18n/request.ts", {
    "next-intl/server": {getRequestConfig: callback => callback},
    "next-intl": {IntlErrorCode: {MISSING_MESSAGE: "MISSING_MESSAGE"}},
    "@/messages/en.json": {nav: {home: "Explore"}}
  }).default;
  const config = await configure({requestLocale: Promise.resolve("en")});
  assert.equal(config.messages.nav.home, "Explore");
  assert.equal(config.messages.common.back, "Geri");
  assert.equal(config.getMessageFallback({namespace: "common", key: "back"}), "Geri");
});
test("auth callback keeps both languages and validates return destinations", async () => {
  const success = load("app/auth/callback/route.ts", {
    "@/lib/supabase/server": {createClient: async () => ({auth: {exchangeCodeForSession: async () => ({error: null})}})}
  }).GET;
  for (const [locale, destination] of [["tr", "/profil"], ["en", "/en/profile"]]) {
    const response = await success(new Request("https://test.invalid/auth/callback?code=test&locale=" + locale + "&next=" + encodeURIComponent(destination)));
    assert.equal(response.headers.get("location"), "https://test.invalid" + destination);
  }
  const response = await success(new Request("https://test.invalid/auth/callback?code=test&locale=en&next=//evil.invalid"));
  assert.equal(response.headers.get("location"), "https://test.invalid/en");
  const failure = await success(new Request("https://test.invalid/auth/callback?locale=en"));
  assert.equal(failure.headers.get("location"), "https://test.invalid/en/sign-in?hata=oturum");
});
test("sign-out returns to the sign-in page in the selected language", async () => {
  const post = load("app/auth/cikis/route.ts", {
    "@/lib/supabase/server": {createClient: async () => ({auth: {signOut: async () => ({error: null})}})}
  }).POST;
  for (const [locale, destination] of [["tr", "/giris"], ["en", "/en/sign-in"]]) {
    const form = new FormData();
    form.set("locale", locale);
    const response = await post(new Request("https://test.invalid/auth/cikis", {method: "POST", body: form}));
    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "https://test.invalid" + destination);
  }
});
test("token refresh preserves next-intl rewrite, request locale and response cookies", async () => {
  const {NextRequest, NextResponse} = require("next/server");
  const oldUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const oldKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-key";
  try {
    const {middleware} = load("middleware.ts", {
      "next-intl/middleware": {__esModule: true, default: () => request => {
        const headers = new Headers(request.headers);
        headers.set("X-NEXT-INTL-LOCALE", "en");
        const response = NextResponse.rewrite(new URL("/en/rotalar/test", request.url), {request: {headers}});
        response.cookies.set("other-cookie", "kept");
        return response;
      }},
      "@supabase/ssr": {createServerClient: (_url, _key, options) => ({auth: {getSession: async () => {
        options.cookies.setAll([{name: "auth-token", value: "fresh", options: {path: "/", httpOnly: true}}]);
        return {data: {session: null}};
      }}})}
    });
    const request = new NextRequest("https://test.invalid/en/routes/test", {headers: {cookie: "auth-token=expired"}});
    const response = await middleware(request);
    assert.equal(response.headers.get("x-middleware-rewrite"), "https://test.invalid/en/rotalar/test");
    assert.equal(response.headers.get("x-middleware-request-x-next-intl-locale"), "en");
    assert.match(response.headers.get("x-middleware-request-cookie"), /auth-token=fresh/);
    assert.equal(response.cookies.get("auth-token").value, "fresh");
    assert.equal(response.cookies.get("other-cookie").value, "kept");
  } finally {
    if (oldUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = oldUrl;
    if (oldKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = oldKey;
  }
});
