const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium,devices}=require(process.env.CODEX_PLAYWRIGHT || 'C:/Users/ftorr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {fixtures}=require('./motion-capture.cjs');
const base=process.argv[2] || 'http://localhost:3000',out=path.resolve('docs/ekip/ekranlar/G-007');
async function visit(page,url){await page.goto(base+url);await page.waitForLoadState('networkidle');await page.waitForTimeout(900);}
async function main(){fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--disable-gpu','--enable-unsafe-swiftshader']});try{
  // Direct-entry language and permanent onboarding suppression, including returning home.
  for(const url of ['/en','/rotalar/frig-yolu-afyonkarahisar','/en/routes/frig-yolu-afyonkarahisar','/duraklar/ayazini','/en/stops/ayazini','/qr','/en/qr']){
    const context=await browser.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},deviceScaleFactor:1});const page=await context.newPage();await visit(page,url);
    assert.equal(await page.locator('dialog[open], [role=dialog]').count(),0,url);
    assert.equal((await context.cookies()).find(c=>c.name==='NEXT_LOCALE')?.value,url.startsWith('/en')?'en':'tr');
    assert.equal(await page.evaluate(()=>localStorage.getItem('afyon-onb-v1')),'1');
    await page.getByRole('link',{name:url.startsWith('/en')?'Explore':'Keşfet',exact:true}).first().click();await page.waitForLoadState('networkidle');
    assert.equal(await page.locator('dialog[open], [role=dialog]').count(),0,'No delayed onboarding: '+url);await context.close();
  }
  // Root remains the only initial choice, then introduction in either selected language.
  for(const lang of ['tr','en']){const context=await browser.newContext({...devices['iPhone 13'],viewport:{width:390,height:844},deviceScaleFactor:1});const page=await context.newPage();await visit(page,'/');await page.locator('dialog[open]').waitFor();await page.locator('dialog').getByRole('link',{name:lang==='tr'?'Türkçe':'English',exact:true}).click();await page.getByRole('dialog',{name:lang==='tr'?'Tanıtım':'Introduction'}).waitFor();await page.getByRole('button',{name:lang==='tr'?'Atla':'Skip',exact:true}).click();await context.close();}
  for(const width of [390,1280]){
    const context=await browser.newContext(width===390?{...devices['iPhone 13'],viewport:{width:390,height:844},deviceScaleFactor:1}:{viewport:{width,height:900}});
    await fixtures(context);const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await visit(page,'/');assert.equal(await page.locator('html').getAttribute('data-smooth-scroll'),width===1280?'on':null);
    assert.equal(await page.locator('main').evaluate(e=>getComputedStyle(e.parentElement).animationName),'none');
    assert.equal(await page.locator('[data-parallax]').evaluate(e=>getComputedStyle(e).transform),'none');
    await page.mouse.move(width/2,300);await page.mouse.wheel(0,400);await page.waitForTimeout(1200);
    assert.ok(await page.evaluate(()=>scrollY)>100);
    const transform=await page.locator('[data-parallax]').evaluate(e=>e.style.transform);assert.ok(transform.includes('translateY'));
    await page.waitForTimeout(300);assert.equal(await page.locator('[data-parallax]').evaluate(e=>e.style.transform),transform,'Parallax persists when stopped');
    // Existing horizontal strip is excluded and hidden cards never receive a reveal.
    const strip=page.locator('[data-motion-list]');assert.notEqual(await strip.getAttribute('data-lenis-prevent'),null);
    if(width===390){assert.equal(await strip.locator(':scope > a').last().getAttribute('data-motion-order'),null);await strip.evaluate(e=>e.scrollLeft=e.scrollWidth);await page.waitForTimeout(600);assert.equal(await strip.locator(':scope > a').last().getAttribute('data-motion-order'),null);await strip.evaluate(e=>e.scrollLeft=0);}
    const homeY=await page.evaluate(()=>scrollY);
    await strip.locator('a').first().click();await page.waitForURL(/\/rotalar\//);await page.waitForTimeout(1300);
    assert.equal(await page.evaluate(()=>scrollY),0,'New route starts at top');
    assert.notEqual(await page.locator('[data-lenis-prevent]').count(),0);
    await page.goBack();await page.waitForTimeout(1300);const restored=await page.evaluate(()=>scrollY);assert.ok(Math.abs(restored-homeY)<5,`Back restores home scroll: ${homeY} -> ${restored}`);
    await visit(page,'/rotalar/frig-yolu-afyonkarahisar');
    await page.mouse.move(width/2,500);await page.mouse.wheel(0,700);await page.waitForTimeout(1200);
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);
    await page.getByRole('button',{name:'Grupla',exact:true}).click();await page.getByRole('dialog').waitFor();
    assert.notEqual(await page.getByRole('dialog').getAttribute('data-lenis-prevent'),null);
    await page.getByRole('dialog').click({position:{x:5,y:5}});await page.waitForTimeout(400);
    const press=page.getByRole('button',{name:'Grupla',exact:true});await press.hover();await page.mouse.down();await page.waitForTimeout(160);const scale=await press.evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).a);assert.ok(Math.abs(scale-.97)<.01,'Press scale');await page.mouse.up();await page.waitForTimeout(900);assert.equal(await press.evaluate(e=>e.style.transform),'','Spring returns to identity');if(await page.getByRole('dialog').count())await page.getByRole('dialog').click({position:{x:5,y:5}});
    // Same-page anchors continue to scroll without a page reset.
    await visit(page,'/rotalar/frig-yolu-afyonkarahisar');
    await page.evaluate(()=>{const heading=document.querySelector('article h1');heading.id='motion-anchor-test';const anchor=document.createElement('a');anchor.href='#motion-anchor-test';anchor.textContent='anchor test';anchor.id='motion-anchor-link';document.querySelector('main').append(anchor);});await page.locator('#motion-anchor-link').click();await page.waitForTimeout(1200);assert.equal(new URL(page.url()).hash,'#motion-anchor-test');assert.ok(await page.evaluate(()=>scrollY)>0);await page.evaluate(()=>document.querySelector('#motion-anchor-link').remove());
    assert.deepEqual(errors,[]);
    await page.close();await context.close();
    for(const [name,url]of [['ana','/'],['rota','/rotalar/frig-yolu-afyonkarahisar']]){
      const recording=await browser.newContext({...width===390?{...devices['iPhone 13'],viewport:{width:390,height:844},deviceScaleFactor:1}:{viewport:{width,height:900}},recordVideo:{dir:'tmp-g007/video',size:{width,height:width===390?844:900}}});await fixtures(recording);
      const videoPage=await recording.newPage();await visit(videoPage,url);await videoPage.mouse.move(width/2,300);await videoPage.mouse.wheel(0,600);await videoPage.waitForTimeout(1400);await videoPage.mouse.wheel(0,600);await videoPage.waitForTimeout(1000);await videoPage.mouse.wheel(0,-1200);await videoPage.waitForTimeout(1400);
      const video=videoPage.video();await videoPage.close();await recording.close();await video.saveAs(path.join(out,`${name}-${width}.webm`));assert.ok(fs.statSync(path.join(out,`${name}-${width}.webm`)).size<=4000000);
    }
  }
  const reduce=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});await fixtures(reduce);const page=await reduce.newPage();await visit(page,'/');assert.equal(await page.locator('html').getAttribute('data-smooth-scroll'),null);await page.mouse.wheel(0,400);await page.waitForTimeout(400);assert.equal(await page.locator('[data-parallax]').evaluate(e=>e.style.transform),'');assert.equal(await page.locator('[data-enter]').first().evaluate(e=>e.style.opacity),'');await reduce.close();
  console.log('PASS: direct entry, root choice, onboarding, mobile/desktop motion, persistent parallax, horizontal strip, page reset/back restoration, dialog exclusion, reduced motion.');
}finally{await browser.close();}}
main().catch(e=>{console.error(e);process.exitCode=1;});
