// Run against npm run start: node tests/check-local.cjs
const assert = require("node:assert/strict");
const pairs = [
  ["/", "/en"], ["/rotalar", "/en/routes"],
  ["/rotalar/frig-yolu-afyonkarahisar", "/en/routes/frig-yolu-afyonkarahisar"],
  ["/duraklar/ayazini", "/en/stops/ayazini"], ["/harita", "/en/map"],
  ["/rotani-belirle", "/en/plan-your-route"], ["/sosyal", "/en/community"],
  ["/profil", "/en/profile"], ["/giris", "/en/sign-in"], ["/qr", "/en/qr"],
  ["/geri-bildirim", "/en/feedback"], ["/hakkinda", "/en/about"],
  ["/gizlilik", "/en/privacy"], ["/sartlar", "/en/terms"], ["/yonetim", "/en/admin"]
];
const base = process.argv[2] || "http://localhost:3000";
async function main() {
  for (const [tr, en] of pairs) for (const [path, locale] of [[tr, "tr"], [en, "en"]]) {
    const response = await fetch(base + path, {redirect: "manual", headers: {"accept-language": "en-US,en;q=0.9"}});
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, new RegExp('<html[^>]+lang="' + locale + '"'), path);
    for (const language of ["tr", "en", "x-default"]) {
      assert.match(html, new RegExp('<link[^>]+hrefLang="' + language + '"', "i"), path + " " + language);
    }
    assert.match(html, new RegExp('property="og:locale" content="' + (locale === "tr" ? "tr_TR" : "en_US") + '"'), path);
    if (locale === "en") {
      assert.match(html, /href="\/en\/routes"/, path + " navigation");
      // The explicit Turkish language choice must now point directly to /rotalar.
      const contentLinks = html.replace(/<a\b[^>]*(?:aria-label="Türkçe"|hrefLang="tr")[^>]*>/gi, "");
      assert.doesNotMatch(contentLinks, /href="\/rotalar(?:\/|")/, path + " leaked Turkish content link");
    }
  }
  const cookies = await fetch(base + "/", {redirect: "manual", headers: {"accept-language": "en-US"}});
  assert.equal(cookies.status, 200);
  assert.ok(!(cookies.headers.get("set-cookie") || "").includes("NEXT_LOCALE"), "first visit must not save a language choice");
  for (const [source, target] of [["/en/rotalar", "/en/routes"], ["/tr/rotalar", "/rotalar"]]) {
    const response = await fetch(base + source, {method: "HEAD", redirect: "manual"});
    assert.equal(response.status, 307, source);
    assert.equal(new URL(response.headers.get("location"), base).pathname, target, source);
  }
  for (const path of ["/yok-boyle", "/en/nope", "/rotalar/olmayan", "/en/stops/olmayan", "/duraklar/olmayan", "/en/routes/olmayan"]) {
    const head = await fetch(base + path, {method: "HEAD", redirect: "manual"});
    assert.equal(head.status, 404, "HEAD " + path);
    const response = await fetch(base + path, {redirect: "manual"});
    const html = await response.text();
    assert.equal(response.status, 404, "GET " + path);
    assert.match(html, path.startsWith("/en") ? /This path leads nowhere/ : /Bu yol bir yere çıkmıyor/);
    assert.match(html, /name="robots" content="noindex"/);
  }
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  assert.match(sitemap, /\/en\/routes\/frig-yolu-afyonkarahisar/);
  assert.match(sitemap, /\/en\/stops\/ayazini/);
  assert.match(sitemap, /hreflang="x-default"/);
  console.log("PASS: 30 page URLs, lang/hreflang/Open Graph, locale links, no auto-redirect, no first-visit choice cookie, six HTTP 404s (HEAD and GET) and sitemap.");
}
main().catch(error => {console.error(error); process.exitCode = 1;});
