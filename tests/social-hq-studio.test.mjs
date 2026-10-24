import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../admin/index.html',import.meta.url),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'Script present');
function slice(start,end){
 const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,'Missing '+start);
 return source.slice(a,b);
}
function context(globals,body){const c=vm.createContext({...globals});vm.runInContext(body,c);return c}
const checks=slice('function safeUrl(value){','function posts(){');
const csv=slice('function csvCell(v){','function exportCsv(kind){');
const validate=slice('function validateWorkspace(d){','async function encrypt(){');
const launch={venueName:'Verified Example Hall',bookingUrl:'https://example.org/tickets',ticketDetails:'Verified free reservation terms',venueApproved:true,ticketsApproved:true};
function preparedPost(status='Ready'){
 return {title:'L-I-F-E event details',caption:'We are ready for the L-I-F-E event.',status,topic:'Venue / tickets',format:'Image',altText:'A simple L-I-F-E rainbow logo',networks:['Instagram'],ctaUrl:'https://example.org/tickets',publishedUrl:''};
}
test('release gate blocks venue before 3 December 2026 even if checklist is confirmed',()=>{
 const c=context({URL,data:{launchChecks:launch},dateUK:()=> '2026-12-02'},checks);
 c.p=preparedPost();
 const errors=vm.runInContext('releaseChecks(p,true,false)',c);
 assert.ok(errors.some(x=>x.includes('3 December 2026')));
});
test('release gate blocks unconfirmed tickets and unsafe internal placeholders',()=>{
 const c=context({URL,data:{launchChecks:{}},dateUK:()=> '2026-12-03'},checks);
 c.p=preparedPost();
 let problems=vm.runInContext('releaseChecks(p,true,false)',c);
 assert.ok(problems.some(x=>x.includes('Confirm the venue')));
 c.data.launchChecks=launch;
 c.p.caption='PRIVATE DRAFT — NOT READY TO PUBLISH';
 problems=vm.runInContext('releaseChecks(p,true,false)',c);
 assert.ok(problems.some(x=>x.includes('Remove internal instructions')));
});
test('release gate requires explicit review, alt text and manual published confirmation',()=>{
 const c=context({URL,data:{launchChecks:launch},dateUK:()=> '2026-12-05'},checks);
 c.p=preparedPost();
 assert.ok(vm.runInContext('releaseChecks(p,false,false)',c).some(x=>x.includes('reviewed')));
 c.p.altText='';
 assert.ok(vm.runInContext('releaseChecks(p,true,false)',c).some(x=>x.includes('alt text')));
 c.p.altText='Accessible logo description';
 c.p.status='Published';
 assert.ok(vm.runInContext('releaseChecks(p,true,false)',c).some(x=>x.includes('confirming you posted')));
 assert.equal(vm.runInContext('releaseChecks(p,true,true).length',c),0);
});
test('non-HTTPS links rejected in draft and ready states',()=>{
 const c=context({URL,data:{launchChecks:launch},dateUK:()=> '2026-12-05'},checks);
 c.p=preparedPost('Draft');c.p.ctaUrl='javascript:alert(1)';
 assert.ok(vm.runInContext('releaseChecks(p,false,false)',c).some(x=>x.includes('https://')));
});
test('CSV export protects Excel/Numbers from formula injection',()=>{
 const c=context({},csv);
 const value=vm.runInContext('csvCell("=IMPORTXML(\\"bad\\")")',c);
 assert.ok(value.startsWith('"\'='));
 assert.ok(value.includes('""bad""'));
 assert.equal(vm.runInContext('csvCell("Safe")',c),'"Safe"');
});
test('new advertising and launch records undergo validation, old workspaces remain valid',()=>{
 const c=context({},validate);
 c.data={posts:[{id:'p',title:'old',caption:'old'}],contacts:[]};
 assert.doesNotThrow(()=>vm.runInContext('validateWorkspace(data)',c));
 c.data.launchChecks={...launch};
 c.data.adPlans=[{id:'a',name:'Meta launch',platform:'Meta Facebook/Instagram Ads',status:'Idea',budget:100,spent:0}];
 assert.doesNotThrow(()=>vm.runInContext('validateWorkspace(data)',c));
 c.data.adPlans[0].budget=-50;
 assert.throws(()=>vm.runInContext('validateWorkspace(data)',c),/Invalid advertising value/);
});
test('no false API, financial, or analytics claims appear in the new workflow',()=>{
 assert.match(html,/figures recorded manually/);
 assert.match(html,/not connected to Meta, Google, TikTok or LinkedIn/);
 assert.match(html,/This form cannot spend money/);
 assert.match(html,/Nothing publishes/);
 assert.match(html,/40 days after 24 October 2026/);
 assert.match(html,/confirmed venue/);
 assert.ok(!source.includes('lifeInfull2026!'));
});
