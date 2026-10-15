// Local browser checks use the existing Playwright runtime and installed Chrome.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),sharp=require('sharp');
const {chromium,devices}=require(process.env.CODEX_PLAYWRIGHT || 'C:/Users/ftorr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.argv[2] || 'http://localhost:3000';
const output=path.resolve(process.env.G005_SCREENSHOT_DIR || 'docs/ekip/ekran/G-005');
async function visit(page,url){await page.goto(base+url);await page.waitForLoadState('networkidle');}
async function capture(page,name,width){const buffer=await sharp(await page.screenshot({animations:'disabled'})).webp({quality:80}).toBuffer();assert.equal((await sharp(buffer).metadata()).width,width);assert.ok(buffer.length<=400000,name);fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,name+'-'+width+'.webp'),buffer);}
function fakeSpeech(){window.__spoken=[];window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};const voices=[{name:'Test English Natural',lang:'en-US',localService:true},{name:'Test Turkish Natural',lang:'tr-TR',localService:true}];const events=new EventTarget();Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>voices,speak:u=>window.__spoken.push({text:u.text,lang:u.lang,voice:u.voice?.lang}),cancel:()=>{},pause:()=>{},resume:()=>{},addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events)}});}
async function main(){const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--disable-gpu','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});try{
  const fresh=await browser.newContext({...devices['iPhone 13'],deviceScaleFactor:1,locale:'tr-TR'});
  const first=await fresh.newPage();await visit(first,'/');
  const dialog=first.getByRole('dialog',{name:'Dil seçin Choose your language'});await dialog.waitFor();
  assert.equal(await first.evaluate(()=>navigator.maxTouchPoints>0),true);
  await capture(first,'sonra-ilk-dil-secimi',390);
  const englishChoice=dialog.getByRole('link',{name:'English',exact:true});assert.equal(await englishChoice.getAttribute('lang'),'en');assert.equal(await englishChoice.getAttribute('hreflang'),'en');
  await englishChoice.click();await first.waitForURL(base+'/en');
  await first.getByRole('dialog',{name:'Introduction'}).waitFor();await first.getByRole('button',{name:'Skip',exact:true}).click();
  await first.reload();await first.waitForLoadState('networkidle');assert.equal(await first.getByRole('dialog').count(),0);
  assert.equal(await first.locator('dialog[open]').count(),0);
  assert.equal((await fresh.cookies()).find(c=>c.name==='NEXT_LOCALE').value,'en');
  await visit(first,'/en/profile');
  const language=first.getByRole('region',{name:'Language',exact:true});await language.waitFor();
  const turkish=language.getByRole('link',{name:'Türkçe',exact:true});assert.equal(await turkish.getAttribute('href'),'/profil');assert.equal(await turkish.getAttribute('lang'),'tr');assert.equal(await turkish.getAttribute('hreflang'),'tr');
  const prefixed=[];const track=request=>{if(new URL(request.url()).pathname.startsWith('/tr/'))prefixed.push(request.url());};first.on('request',track);await turkish.click();await first.waitForURL(base+'/profil');await first.waitForLoadState('networkidle');first.off('request',track);assert.deepEqual(prefixed,[]);assert.equal((await fresh.cookies()).find(c=>c.name==='NEXT_LOCALE').value,'tr');
  await fresh.close();
  const uiTr=require('../messages/tr.json').ui,uiEn=require('../messages/en.json').ui;
  const phrases=Object.keys(uiTr).filter(key=>uiTr[key]!==uiEn[key]&&uiTr[key].length>14).map(key=>uiTr[key]);
  for(const width of [390,1280]){
    const context=await browser.newContext(width===390?{...devices['iPhone 13'],deviceScaleFactor:1,locale:'en-US'}:{viewport:{width,height:900},locale:'en-US'});
    await context.addCookies([{name:'NEXT_LOCALE',value:'en',url:base}]);await context.addInitScript(()=>localStorage.setItem('afyon-onb-v1','1'));await context.addInitScript(fakeSpeech);
    const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
    for(const [name,url]of [['ana','/en'],['rota','/en/routes/frig-yolu-afyonkarahisar'],['durak','/en/stops/ayazini'],['harita','/en/map'],['profil','/en/profile'],['giris','/en/sign-in']]){
      if(name==='profil'){await visit(page,'/en/sign-in?next=/en/profile');await page.getByRole('button',{name:'Continue as a guest',exact:true}).click();await page.waitForURL(base+'/en/profile');await page.getByText('Guest account',{exact:true}).waitFor();await page.waitForLoadState('networkidle');}
      else await visit(page,url);
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      const text=await page.locator('body').innerText();for(const phrase of phrases)assert.ok(!text.includes(phrase),name+': untranslated '+phrase);
      assert.equal(await page.locator('header a[hreflang]').count(),0,'No language pills in top navigation');
      if(name==='ana')await page.getByRole('heading',{name:'Explore',exact:true}).waitFor();
      if(name==='rota'){await page.getByRole('heading',{name:'Frig Yolu: Afyonkarahisar Cultural Route',exact:true}).waitFor();assert.ok(text.includes('Covering the part of mountainous Phrygia'));}
      if(name==='durak'){
        await page.getByRole('button',{name:'Listen to the audio guide',exact:true}).click();
        const spoken=await page.evaluate(()=>window.__spoken);assert.ok(spoken.length>1);assert.ok(spoken.every(u=>u.lang==='en-US'&&u.voice==='en-US'));assert.ok(spoken.some(u=>u.text.includes('has been inhabited since')));
        await page.getByRole('button',{name:'Stop',exact:true}).click();
      }
      await capture(page,'sonra-'+name+'-en',width);
      if(name==='profil'){const setting=page.getByRole('region',{name:'Language',exact:true});await setting.scrollIntoViewIfNeeded();await capture(page,'sonra-profil-dil-en',width);}
    }
    await visit(page,'/duraklar/ayazini');await page.getByRole('button',{name:'Sesli rehberi dinle',exact:true}).click();assert.ok((await page.evaluate(()=>window.__spoken)).every(u=>u.lang==='tr-TR'&&u.voice==='tr-TR'));
    assert.deepEqual(errors,[]);await context.close();
  }
  const navigation=await browser.newContext({viewport:{width:390,height:844},permissions:['geolocation'],geolocation:{longitude:30.539,latitude:38.751}});
  await navigation.addCookies([{name:'NEXT_LOCALE',value:'en',url:base}]);await navigation.addInitScript(()=>localStorage.setItem('afyon-onb-v1','1'));await navigation.addInitScript(fakeSpeech);
  const navPage=await navigation.newPage();
  await navPage.route('https://tiles.openfreemap.org/styles/liberty',route=>route.fulfill({json:{version:8,sources:{},layers:[{id:'background',type:'background',paint:{'background-color':'#FAF5EC'}}]}}));
  await navPage.route('https://routing.openstreetmap.de/**',route=>route.fulfill({json:{routes:[{distance:1200,duration:900,geometry:{coordinates:[[30.539,38.751],[30.54,38.76]]},legs:[{steps:[{distance:90,name:'Kadınana Caddesi',maneuver:{type:'depart'}},{distance:120,name:'Kadınana Caddesi',maneuver:{type:'turn',modifier:'left'}}]}]}]}}));
  await visit(navPage,'/en/map?rota=frig-yolu-afyonkarahisar&takip=1&durak=ayazini');
  await navPage.getByText('Turn left · Kadınana Caddesi',{exact:true}).waitFor({timeout:45000});
  await navPage.getByRole('button',{name:'Spoken directions',exact:true}).click();
  await navPage.waitForFunction(()=>window.__spoken.some(u=>u.lang==='en-US'&&u.text.includes('Turn left')));
  assert.ok((await navPage.evaluate(()=>window.__spoken)).every(u=>u.lang==='en-US'&&u.voice==='en-US'));
  await navigation.close();
  console.log('PASS: first-visit language choice, saved preference, profile language setting, direct Turkish href, bilingual narration and English map directions/speech; 15 WebP screenshots.');
}finally{await browser.close();}}
main().catch(error=>{console.error(error);process.exitCode=1});
