const assert = require('node:assert/strict');
const {chromium} = require(process.env.CODEX_PLAYWRIGHT || 'C:/Users/ftorr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:3001';
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe', args:['--disable-gpu','--disable-dev-shm-usage']});
  try {
    const context = await browser.newContext({viewport:{width:1280,height:900}, locale:'tr-TR'});
    await context.addInitScript(() => localStorage.setItem('afyon-onb-v1','1'));
    await context.addCookies([{name:'NEXT_LOCALE', value:'en', url:base}]);
    const page = await context.newPage();
    for (const [login, profile] of [['/en/sign-in','/en/profile'], ['/giris','/profil']]) {
      const english = login.startsWith('/en');
      const accountLabel = english ? 'Guest account' : 'Misafir hesabı';
      const guestLabel = english ? 'Continue as a guest' : 'Misafir olarak devam et';
      await page.goto(base + login + '?next=' + encodeURIComponent(profile));
      await page.getByRole('button',{name:guestLabel,exact:true}).click();
      await page.waitForURL(base + profile, {timeout:45000});
      await page.getByText(accountLabel,{exact:true}).waitFor({timeout:30000});
      await page.reload();
      await page.getByText(accountLabel,{exact:true}).waitFor();
      // Exercise a real Server Action validation response without writing data.
      await page.getByRole('button',{name:english ? 'Edit' : 'Düzenle',exact:true}).click();
      const nameInput=page.getByRole('textbox',{name:english ? 'Name' : 'Ad',exact:true});
      await nameInput.fill('A');
      await nameInput.evaluate(input=>{input.form.noValidate=true;});
      await page.getByRole('button',{name:english ? 'Save' : 'Kaydet',exact:true}).click();
      await page.getByRole('alert').filter({hasText:english ? 'Names must be between 2 and 40 characters.' : 'Ad 2–40 karakter olmalı.'}).waitFor();
      await page.reload();
      await page.getByText(accountLabel,{exact:true}).waitFor();
      if (profile.startsWith('/en')) {
        await page.getByRole('link',{name:'Türkçe',exact:true}).first().click();
        await page.waitForURL(base + '/profil');
        await page.getByText('Misafir hesabı',{exact:true}).waitFor();
        await page.getByRole('link',{name:'English',exact:true}).first().click();
        await page.waitForURL(base + '/en/profile');
        await page.getByText('Guest account',{exact:true}).waitFor();
      }
      await page.getByRole('button',{name:english ? 'Sign out' : 'Çıkış yap',exact:true}).click();
      await page.waitForURL(base + login);
      const guestButton = page.getByRole('button',{name:guestLabel,exact:true});
      await guestButton.waitFor();
      assert.equal(await guestButton.count(),1);
      console.log('PASS guest login, reload, locale session and logout: ' + login);
    }
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode=1; });

