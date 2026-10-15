// Uses the bundled Playwright runtime and an installed Chrome, no project dependency.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const sharp = require("sharp");
const runtime = process.env.CODEX_PLAYWRIGHT || "C:/Users/ftorr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const {chromium, devices} = require(runtime);
const base = process.argv[2] || "http://127.0.0.1:3001";
const output = path.resolve("docs/ekip/ekran/G-002");
fs.mkdirSync(output, {recursive: true});
const slug = "frig-yolu-afyonkarahisar";
const trRoute = "/rotalar/" + slug;
const enRoute = "/en/routes/" + slug;

async function visit(page, url) {
  await page.goto(base + url);
  await page.waitForLoadState("networkidle");
  await page.locator("h1").waitFor();
}
async function screenshot(page, name, width) {
  const buffer = await page.screenshot({type: "png", animations: "disabled"});
  const result = await sharp(buffer).webp({quality: 80}).toBuffer();
  const metadata = await sharp(result).metadata();
  assert.equal(metadata.width, width, name);
  assert.ok(result.length <= 400000, name + " exceeds 400 KB");
  fs.writeFileSync(path.join(output, name + "-" + width + ".webp"), result);
}
async function main() {
  const browser = await chromium.launch({headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-gpu", "--disable-dev-shm-usage"]});
  try {
    const mobile = await browser.newContext({...devices["iPhone 13"], deviceScaleFactor: 1, locale: "en-US"});
    await mobile.addInitScript(() => localStorage.setItem("afyon-onb-v1", "1"));
    const phone = await mobile.newPage();
    await visit(phone, "/");
    assert.equal(await phone.evaluate(() => navigator.language), "en-US");
    assert.equal(await phone.evaluate(() => navigator.maxTouchPoints > 0), true);
    const banner = phone.getByRole("complementary", {name: "This site is also available in English."});
    await banner.waitFor({state: "visible"});
    assert.equal(await banner.evaluate(node => getComputedStyle(node).position), "fixed");
    await screenshot(phone, "sonra-ana-tr-bant", 390);
    const before = await phone.locator("main").boundingBox();
    await phone.getByRole("button", {name: "Dismiss language suggestion"}).click();
    const after = await phone.locator("main").boundingBox();
    assert.equal(before.y, after.y, "banner must not push the content");
    await phone.reload();
    await phone.waitForLoadState("networkidle");
    assert.equal(await banner.count(), 0, "dismissal must survive reload");
    await screenshot(phone, "sonra-ana-tr", 390);
    await visit(phone, trRoute);
    await screenshot(phone, "sonra-rota-tr", 390);
    await visit(phone, "/en");
    assert.equal(await phone.locator("html").getAttribute("lang"), "en");
    await screenshot(phone, "sonra-ana-en", 390);
    await visit(phone, enRoute);
    await screenshot(phone, "sonra-rota-en", 390);
    await visit(phone, "/en/not-a-real-page");
    assert.equal(await phone.getByRole("heading", {name: "This path leads nowhere"}).count(), 1);
    await mobile.close();

    const desktop = await browser.newContext({viewport: {width: 1280, height: 900}, deviceScaleFactor: 1, locale: "tr-TR"});
    await desktop.addInitScript(() => localStorage.setItem("afyon-onb-v1", "1"));
    const page = await desktop.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await visit(page, "/");
    await screenshot(page, "sonra-ana-tr", 1280);
    await visit(page, trRoute + "?mod=arac&grup=K7M2QX");
    await screenshot(page, "sonra-rota-tr", 1280);
    await page.getByRole("link", {name: "English", exact: true}).click();
    await page.waitForURL(url => url.pathname === enRoute);
    assert.equal(new URL(page.url()).searchParams.get("grup"), "K7M2QX");
    assert.equal((await desktop.cookies()).find(cookie => cookie.name === "NEXT_LOCALE").value, "en");
    await page.waitForLoadState("networkidle");
    await screenshot(page, "sonra-rota-en", 1280);
    await page.getByRole("link", {name: "Türkçe", exact: true}).click();
    await page.waitForURL(url => url.pathname === trRoute);
    assert.equal(new URL(page.url()).searchParams.get("mod"), "arac");
    await visit(page, "/en");
    await screenshot(page, "sonra-ana-en", 1280);
    assert.equal(errors.length, 0, errors.join("\n"));
    await desktop.close();
    console.log("PASS: mobile touch 390x844, desktop 1280x900, 9 WebP screenshots, English suggestion/dismissal, fixed positioning, route and query-preserving language switches, choice cookie and English 404.");
  } finally {
    await browser.close();
  }
}
main().catch(error => {console.error(error); process.exitCode = 1;});
