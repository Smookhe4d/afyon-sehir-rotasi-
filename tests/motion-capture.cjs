// Deterministic visual baseline: production server, fixed weather and empty map style.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const sharp = require('sharp');
const {chromium, devices} = require(process.env.CODEX_PLAYWRIGHT || 'C:/Users/ftorr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.argv[2] || 'http://localhost:3000', phase = process.argv[3] || 'once';
const output = path.resolve('docs/ekip/ekranlar/G-007'), raw = path.resolve('tmp-g007');
const cases = [['ana-tr','/'],['ana-en','/en'],['rota-tr','/rotalar/frig-yolu-afyonkarahisar'],['rota-en','/en/routes/frig-yolu-afyonkarahisar'],['harita','/harita'],['profil','/profil']];
async function fixtures(context) {
  await context.addCookies([{name:'NEXT_LOCALE',value:'tr',url:base}]);
  await context.addInitScript(() => localStorage.setItem('afyon-onb-v1','1'));
  await context.route('https://api.open-meteo.com/**', r => r.fulfill({json:{current:{temperature_2m:20,apparent_temperature:19,weather_code:0,wind_speed_10m:8,is_day:1},daily:{time:['2026-10-15','2026-10-16','2026-10-17','2026-10-18'],weather_code:[0,0,0,0],temperature_2m_max:[24,24,24,24],temperature_2m_min:[10,10,10,10],precipitation_probability_max:[0,0,0,0]}}}));
  await context.route('https://tiles.openfreemap.org/styles/liberty', r => r.fulfill({json:{version:8,sources:{},layers:[{id:'background',type:'background',paint:{'background-color':'#FAF5EC'}}]}}));
}
async function shot(page, name, width, fullPage=true) {
  const height=fullPage?await page.evaluate(()=>document.documentElement.scrollHeight):page.viewportSize().height;
  const png = await page.screenshot({fullPage,clip:{x:0,y:0,width,height}, animations:'disabled'});
  fs.writeFileSync(path.join(raw,`${phase}-${name}-${width}.png`),png);
  const webp = await sharp(png).webp({quality:75}).toBuffer();
  assert.equal((await sharp(webp).metadata()).width,width); assert.ok(webp.length<=400000,`${name}: ${webp.length}`);
  fs.writeFileSync(path.join(output,`${phase}-${name}-${width}.webp`),webp);
  if(phase==='sonra') {
    const old=path.join(raw,`once-${name}-${width}.png`);
    if(fs.existsSync(old)) {
      const a=await sharp(old).ensureAlpha().raw().toBuffer({resolveWithObject:true}), b=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      let pixels=0; if(a.info.width===b.info.width&&a.info.height===b.info.height) for(let i=0;i<a.data.length;i+=4) {if(a.data.subarray(i,i+4).compare(b.data.subarray(i,i+4)))pixels++;}
      else pixels=-1;
      const result={name,width,before:a.info,after:b.info,differingPixels:pixels};
      fs.appendFileSync(path.join(raw,'pixel-results.jsonl'),JSON.stringify(result)+'\n'); console.log(JSON.stringify(result));
    }
  }
}
async function main(){fs.mkdirSync(output,{recursive:true});fs.mkdirSync(raw,{recursive:true});const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--disable-gpu','--enable-unsafe-swiftshader']});try{
  for(const width of [390,1280].filter(w=>!process.env.G007_WIDTH||w===Number(process.env.G007_WIDTH))){const context=await browser.newContext(width===390?{...devices['iPhone 13'],viewport:{width:390,height:844},deviceScaleFactor:1}:{viewport:{width,height:900},deviceScaleFactor:1});await fixtures(context);const page=await context.newPage();
    for(const [name,url]of cases.filter(([name])=>!process.env.G007_CASE||name===process.env.G007_CASE)){await page.goto(base+url);await page.waitForLoadState('networkidle');await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).map(image=>{image.loading='eager';return image.decode().catch(()=>{});}));});await page.waitForTimeout(1100);
      if(await page.locator('.maplibregl-map').count())await page.waitForTimeout(2500);
      // Capture from the top without pre-scrolling: identical lazy-image loading in both phases.
      await shot(page,name,width);
    }await context.close();
  }
  if(phase==='sonra'&&!process.env.G007_CASE)for(const mode of ['reduce','no-js']){const context=await browser.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});await fixtures(context);const page=await context.newPage();for(const [name,url] of cases.slice(0,4).filter(([n])=>n.endsWith('tr'))){await page.goto(base+url);await page.waitForLoadState('networkidle');await page.waitForTimeout(700);await shot(page,`${name}-${mode}`,390);assert.ok(await page.locator('h1').isVisible());}await context.close();}
}finally{await browser.close();}}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={fixtures};
