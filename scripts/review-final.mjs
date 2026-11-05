import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch();const page=await browser.newPage();
for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:8038/',{waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>null)));await Promise.all([...document.images].map(async img=>{img.loading='eager';await img.decode()}))});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.locator('h1').evaluate(el=>getComputedStyle(el).opacity),'1');await page.screenshot({path:`../interactive-qa/final-home-${width}.png`,fullPage:true});}
await browser.close();console.log('Final homepage checked at four widths, headline fully visible.');
