import {chromium,webkit} from 'playwright';
import fs from 'node:fs';
const out='../mobile-audit';fs.mkdirSync(out,{recursive:true});const results=[];
for(const [engine,launcher] of [['chromium',chromium],['webkit',webkit]]){
 let browser;try{browser=await launcher.launch()}catch(e){results.push({engine,unavailable:String(e).split('\n')[0]});continue}
 for(const width of [320,360,390,430,768]){
 const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});const p=await context.newPage();
 for(const route of ['/','/work/','/services/','/about/','/contact/','/resume/','/aviation/',...JSON.parse(fs.readFileSync('src/data/projects.json','utf8')).map(p=>`/work/${p.id}/`)]){
 await p.goto('http://127.0.0.1:8038'+route);await p.evaluate(()=>document.fonts.ready);
 const data=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),smallNav:[...document.querySelectorAll('nav a')].map(e=>({text:e.textContent.trim(),height:e.getBoundingClientRect().height,font:getComputedStyle(e).fontSize}))}));results.push({engine,width,route,...data});
 if(engine==='chromium'&&[320,390].includes(width)&&['/','/contact/','/work/'].includes(route))await p.screenshot({path:`${out}/${route.replaceAll('/','-')}-${width}.png`,fullPage:true});
 }
 if(engine==='chromium'&&width===390){await p.goto('http://127.0.0.1:8038/');await p.locator('.reel-track').scrollIntoViewIfNeeded();const box=await p.locator('.reel-track').boundingBox();const cdp=await context.newCDPSession(p);const x=box.x+300,y=Math.max(60,box.y+100);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*20,y}]});await p.waitForTimeout(20)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(500);results.push({engine,touchSwipe:await p.locator('.reel-track').evaluate(e=>e.scrollLeft),stayedOnHome:new URL(p.url()).pathname==='/'});await p.getByRole('button',{name:'Next',exact:true}).tap();await p.waitForTimeout(500);results.push({engine,tapNext:await p.locator('.reel-status').textContent()});}
 await context.close();}
 await browser.close();}
fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify({checks:results.length,issues:results.filter(r=>r.overflow||r.unavailable||r.broken?.length),nav:results[0]?.smallNav,touch:results.filter(r=>'touchSwipe'in r||'tapNext'in r)},null,2));
