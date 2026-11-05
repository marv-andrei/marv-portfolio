import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:8038';
const output=process.env.QA_OUTPUT||'../rebuild-qa';fs.mkdirSync(output,{recursive:true});
const projects=JSON.parse(fs.readFileSync('src/data/projects.json','utf8'));
const routes=['/','/work/','/about/','/services/','/contact/','/resume/','/aviation/',...projects.map(p=>`/work/${p.id}/`)];
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const checks=[];
for(const width of [1440,768,390,320]){
 await page.setViewportSize({width,height:1000});
 for(const route of routes){
  const response=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(response.status(),200,route);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>null)}));});await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>null))));await page.locator('footer').scrollIntoViewIfNeeded();await page.evaluate(()=>scrollTo(0,0));
  const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));
  assert.equal(result.overflow,false,`${width} ${route} overflow`);assert.equal(result.h1,1,`${route} h1`);assert.doesNotMatch(await page.locator('body').innerText(),/[↗↳←→↓↑]/,`${route} decorative arrows`);assert.deepEqual(result.broken,[],`${route} images`);checks.push({route,width,...result});
  if(width===1440||width===390)await page.screenshot({path:`${output}/${route.replaceAll('/','-')||'home'}-${width}.png`,fullPage:true});
 }
}
await page.goto(base+'/');await page.getByRole('button',{name:'Show Zenith',exact:true}).click();await page.waitForFunction(()=>document.querySelector('[data-index="2"]').getAttribute('aria-pressed')==='true');await page.locator('.reel-track').focus();await page.keyboard.press('End');await page.waitForFunction(()=>document.querySelector('[data-index="4"]').getAttribute('aria-pressed')==='true');await page.keyboard.press('Home');await page.waitForFunction(()=>document.querySelector('[data-index="0"]').getAttribute('aria-pressed')==='true');
await page.goto(base+'/services/');await page.locator('summary').first().click();assert.equal(await page.locator('details[open]').count(),1);assert.equal(await page.locator('nav a[aria-current=page]').innerText(),'Services');
await page.goto(base+'/work/');for(const [filter,count] of [['Shopify',6],['WordPress',1],['GoHighLevel',1],['Funnelish',1],['All',8]]){await page.locator(`[data-filter="${filter}"]`).click();assert.equal(await page.locator('.project:visible').count(),count,filter);}
await page.locator('#artin h3 a').click();assert.match(page.url(),/\/work\/artin\/$/);assert.equal(await page.locator('.case-links a').count(),2);
await page.goto(base+'/contact/');await page.getByRole('button',{name:'Funnel support',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Funnel support',exact:true}).getAttribute('aria-pressed'),'true');assert.match(decodeURIComponent(await page.locator('.brief-email').getAttribute('href')),/Funnel support enquiry/);await page.locator('.copy-email').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'pacinabaomarv@gmail.com');assert.match(await page.locator('.copy-status').innerText(),/copied/);
await page.goto(base+'/');await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Skip to content');await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
const nojs=await browser.newContext({javaScriptEnabled:false});const np=await nojs.newPage();await np.goto(base+'/work/');assert.equal(await np.locator('.project:visible').count(),8);await np.goto(base+'/');assert.equal(await np.locator('.reel-item').count(),5);
const pdf=await page.request.get(base+'/Marv-Pacinabao-Resume.pdf');assert.equal(pdf.status(),200);assert.equal((await pdf.body()).subarray(0,4).toString(),'%PDF');
for(const path of ['/robots.txt','/sitemap.xml','/images/social.jpg','/favicon.svg'])assert.equal((await page.request.get(base+path)).status(),200,path);
assert.deepEqual(errors,[]);fs.writeFileSync(`${output}/verification.json`,JSON.stringify({checks,errors,passed:['project reel navigation and keyboard controls','enquiry draft selector','services navigation and FAQ disclosures','platform filters','case-study navigation','copy email','skip link','reduced motion','no-JS gallery and featured project','PDF download','SEO assets']},null,2));
console.log(`Passed ${checks.length} responsive route checks and all interaction checks`);await browser.close();
