import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright-core';

const pageHtml=readFileSync(new URL('../admin/index.html',import.meta.url));
const http=createServer((req,res)=>{
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
 res.end(pageHtml);
});
await new Promise(resolve=>http.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+http.address().port+'/admin/';
const binary=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath:binary,args:['--no-sandbox']});
try{
 for(const mode of [{name:'desktop',width:1280,height:820},{name:'mobile',width:390,height:844}]){
  await test('Browser smoke: '+mode.name+' secure workspace flow',async()=>{
   const context=await browser.newContext({viewport:{width:mode.width,height:mode.height},isMobile:mode.name==='mobile',hasTouch:mode.name==='mobile',acceptDownloads:true});
   const page=await context.newPage();const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url);
   assert.equal(await page.locator('#signin').isVisible(),true);
   await page.locator('#email').fill('someone@example.org');
   await page.locator('#password').fill('LongWorkspacePassword!24');
   await page.locator('#unlock').click();
   await page.locator('#autherror').getByText('Use the approved L-I-F-E email.').waitFor();
   assert.equal(await page.locator('#app').isVisible(),false);
   await page.locator('#email').fill('alyssa-may.grogan@lifeinfullecosystem.org');
   await page.locator('#unlock').click();
   await page.locator('#app').waitFor({state:'visible'});
   await page.locator('[data-action="newpost"]').first().click();
   await page.locator('[name="title"]').fill('Save the date');
   await page.locator('[name="caption"]').fill('30 January 2027 in Milton Keynes');
   await page.locator('#postform button.btn.primary').click();
   await page.getByText('Save the date',{exact:true}).first().waitFor();
   const ciphertext=await page.evaluate(()=>localStorage.getItem('life-hq-device-v1'));
   assert.ok(ciphertext&&!ciphertext.includes('Save the date'));
   await page.locator('#lock').click();
   assert.equal(await page.locator('#app').isVisible(),false);
   await page.locator('#password').fill('LongWorkspacePassword!24');
   await page.locator('#unlock').click();
   await page.locator('#app').waitFor({state:'visible'});
   await page.locator('[data-page="posts"]').click();
   await page.getByText('Save the date',{exact:true}).first().waitFor();
   await page.locator('[data-page="calendar"]').click();
   await page.getByText('October 2026').first().waitFor();
   await page.locator('[data-page="contacts"]').click();
   await page.locator('[data-action="newcontact"]').click();
   await page.locator('[name="name"]').fill('MKFM');
   await page.locator('#contactform button.btn.primary').click();
   await page.getByText('MKFM',{exact:true}).first().waitFor();
   await page.locator('[data-page="settings"]').click();
   assert.equal(await page.getByText('Encrypted backups').isVisible(),true);
   assert.deepEqual(errors,[]);
   await context.close();
  });
 }
}finally{
 await browser.close();
 await new Promise(resolve=>http.close(resolve));
}
