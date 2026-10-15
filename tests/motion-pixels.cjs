const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),sharp=require('sharp');
async function main(){const results=[];for(const width of [390,1280])for(const name of ['ana-tr','ana-en','rota-tr','rota-en','harita','profil']){
  const read=async phase=>{const png=`tmp-g007/${phase}-${name}-${width}.png`,webp=`docs/ekip/ekranlar/G-007/${phase}-${name}-${width}.webp`;const source=fs.existsSync(png)?png:webp;return {...await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true}),source};};
  const before=await read('once'),after=await read('sonra');assert.equal(before.info.width,width);assert.equal(after.info.width,width);assert.equal(before.info.height,after.info.height,name);
  let different=0;for(let i=0;i<before.data.length;i+=4)if(before.data.subarray(i,i+4).compare(after.data.subarray(i,i+4)))different++;
  const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
  results.push({name,width,height:before.info.height,differingPixels:different,beforePixelSha256:hash(before.data),afterPixelSha256:hash(after.data),sourceFormat:path.extname(before.source)});
  assert.equal(different,0,`${name} ${width}`);
}fs.writeFileSync('docs/ekip/G-007-piksel.json',JSON.stringify(results,null,2)+'\n');console.log('PASS: all 12 full-page images match pixel-for-pixel.');}
main().catch(e=>{console.error(e);process.exitCode=1;});
