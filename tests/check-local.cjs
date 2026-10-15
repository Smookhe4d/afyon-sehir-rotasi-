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
      assert.doesNotMatch(html, /href="\/rotalar(?:\/|")/, path + " leaked Turkish link");
    }
  }
  const cookies = await fetch(base + "/", {redirect: "manual", headers: {"accept-language": "en-US"}});
  assert.equal(cookies.status, 200);
  assert.ok(!(cookies.headers.get("set-cookie") || "").includes("NEXT_LOCALE"), "first visit must not save a language choice");
  for (const path of ["/not-a-real-page", "/en/not-a-real-page"]) {
    const response = await fetch(base + path);
    // Next.js can stream a not-found boundary with HTTP 200 after loading
    // has flushed. In that case its noindex directive must still be present.
    const html = await response.text();
    assert.ok(response.status === 404 || response.status === 200);
    assert.match(html, path.startsWith("/en") ? /This path leads nowhere/ : /Bu yol bir yere çıkmıyor/);
    assert.match(html, /name="robots" content="noindex"/);
  }
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  assert.match(sitemap, /\/en\/routes\/frig-yolu-afyonkarahisar/);
  assert.match(sitemap, /\/en\/stops\/ayazini/);
  assert.match(sitemap, /hreflang="x-default"/);
  console.log("PASS: 30 page URLs, lang/hreflang/Open Graph, locale links, no auto-redirect, no first-visit choice cookie, two 404s and sitemap.");
}
main().catch(error => {console.error(error); process.exitCode = 1;});
