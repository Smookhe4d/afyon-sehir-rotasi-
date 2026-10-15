const assert = require('node:assert/strict');
const {chromium} = require(process.env.CODEX_PLAYWRIGHT || 'C:/Users/ftorr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:3001';
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', args:['--disable-gpu','--disable-dev-shm-usage']});
  try {
    const context = await browser.newContext({viewport:{width:1280,height:900}, locale:'tr-TR'});
    await context.addInitScript(() => localStorage.setItem('afyon-onb-v1','1'));
    const page = await context.newPage();
    for (const [login, profile] of [['/en/sign-in','/en/profile'], ['/giris','/profil']]) {
      await page.goto(base + login + '?next=' + encodeURIComponent(profile));
      await page.getByRole('button',{name:'Misafir olarak devam et',exact:true}).click();
      await page.waitForURL(base + profile, {timeout:45000});
      await page.getByText('Misafir hesabı',{exact:true}).waitFor({timeout:30000});
      await page.reload();
      await page.getByText('Misafir hesabı',{exact:true}).waitFor();
      if (profile.startsWith('/en')) {
        await page.getByRole('link',{name:'Türkçe',exact:true}).first().click();
        await page.waitForURL(base + '/profil');
        await page.getByText('Misafir hesabı',{exact:true}).waitFor();
        await page.getByRole('link',{name:'English',exact:true}).first().click();
        await page.waitForURL(base + '/en/profile');
        await page.getByText('Misafir hesabı',{exact:true}).waitFor();
      }
      await page.getByRole('button',{name:'Çıkış yap',exact:true}).click();
      await page.waitForURL(base + login);
      assert.equal(await page.getByRole('button',{name:'Misafir olarak devam et',exact:true}).count(),1);
      console.log('PASS guest login, reload, locale session and logout: ' + login);
    }
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode=1; });

