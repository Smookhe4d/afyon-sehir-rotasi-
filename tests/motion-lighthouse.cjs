const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.CODEX_PLAYWRIGHT || 'C:/Users/ftorr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {fixtures}=require('./motion-capture.cjs');
const base=process.argv[2] || 'http://localhost:3000',phase=process.argv[3] || 'once';
async function main(){
  const packagePath=process.env.CODEX_LIGHTHOUSE || 'C:/Users/ftorr/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/lighthouse/core/index.js';
  const {default:lighthouse}=await import(pathToFileURL(packagePath));
  const context=await chromium.launchPersistentContext(path.resolve('tmp-g007/lh-profile'),{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--remote-debugging-port=9222','--disable-gpu','--enable-unsafe-swiftshader']});
  try{await fixtures(context);const page=await context.newPage();await page.goto(base);await page.evaluate(()=>localStorage.setItem('afyon-onb-v1','1'));
    for(let run=1;run<=Number(process.argv[4]||1);run++)for(const [name,url]of [['ana','/'],['rota','/rotalar/frig-yolu-afyonkarahisar']]){
      const {lhr}=await lighthouse(base+url,{port:9222,onlyCategories:['performance'],disableStorageReset:true,output:'json',logLevel:'error'});
      fs.writeFileSync(`tmp-g007/lighthouse-${phase}-${name}-${run}.json`,JSON.stringify(lhr));
      const summary={phase,name,run,version:lhr.lighthouseVersion,score:lhr.categories.performance.score*100,cls:lhr.audits['cumulative-layout-shift'].numericValue,lcp:lhr.audits['largest-contentful-paint'].numericValue,fcp:lhr.audits['first-contentful-paint'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue};
      fs.appendFileSync('tmp-g007/lighthouse-results.jsonl',JSON.stringify(summary)+'\n');console.log(summary);
    }
  }finally{await context.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
