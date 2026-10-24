import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import vm from 'node:vm';

const html=readFileSync(new URL('../admin/index.html',import.meta.url),'utf8');
const homepage=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'Inline application source exists');
function part(start,end){
 const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,'Missing source section '+start);
 return source.slice(a,b);
}
const validator=part('function validateWorkspace(d){','async function encrypt(){');
const encryption=part('async function encrypt(){','async function decrypt(');
const saving=part('async function save(){','function download(){');
const makeContext=async(overrides={})=>{
 const key=await webcrypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 const writes=[];
 const ctx={
  crypto:webcrypto,key,session:0,STORAGE:'life-hq-device-v1',
  saved:{v:1,salt:Buffer.alloc(16,2).toString('base64')},
  data:{posts:[{id:'post-1',title:'Save the date',caption:'L-I-F-E launch in MK',status:'Draft',date:'2026-10-24',time:'12:00'}],contacts:[]},
  enc:new TextEncoder(),
  b64:x=>Buffer.from(x).toString('base64'),
  localStorage:{setItem:(k,v)=>writes.push({k,v})},
  ...overrides
 };
 vm.createContext(ctx);
 vm.runInContext(validator+encryption,ctx);
 return {ctx,writes};
};

test('PASS 1: source parses and accurately describes client-only protection',()=>{
 assert.doesNotThrow(()=>new vm.Script(source));
 assert.match(html,/Temporary device-only mode/);
 assert.match(html,/not Google account verification/);
 assert.match(html,/Workspace email label \(not Google sign-in\)/);
 assert.match(source,/PBKDF2/);
 assert.match(source,/AES-GCM/);
 assert.match(source,/life-hq-device-v1/);
});

test('PASS 2: schema validator accepts existing records and rejects damaged records',async()=>{
 const {ctx}=await makeContext();
 const good=vm.runInContext('validateWorkspace(data)',ctx);
 assert.equal(good.posts.length,1);
 for (const bad of [
  {posts:[null],contacts:[]},
  {posts:[{id:'x',title:'Name',caption:17}],contacts:[]},
  {posts:[],contacts:[null]},
  {posts:[],contacts:[{id:'x',name:7}]},
  {posts:'not an array',contacts:[]}
 ]){
   ctx.bad=bad;
   assert.throws(()=>vm.runInContext('validateWorkspace(bad)',ctx),/Invalid/);
 }
});

test('PASS 3: AES-GCM encrypted saves preserve previous backup format',async()=>{
 const {ctx,writes}=await makeContext();
 await vm.runInContext('encrypt()',ctx);
 assert.equal(writes.length,1);
 assert.equal(writes[0].k,'life-hq-device-v1');
 const record=JSON.parse(writes[0].v);
 assert.deepEqual(Object.keys(record).sort(),['iv','payload','salt','v']);
 const clear=await webcrypto.subtle.decrypt({name:'AES-GCM',iv:Buffer.from(record.iv,'base64')},ctx.key,Buffer.from(record.payload,'base64'));
 assert.equal(JSON.parse(new TextDecoder().decode(clear)).posts[0].title,'Save the date');
});

test('PASS 4: failed storage writes or session changes never commit stale ciphertext',async()=>{
 const prior={v:1,salt:Buffer.alloc(16,2).toString('base64')};
 const {ctx}=await makeContext({saved:prior,localStorage:{setItem(){throw Error('QuotaExceededError')}}});
 await assert.rejects(vm.runInContext('encrypt()',ctx),/QuotaExceededError/);
 assert.equal(ctx.saved,prior);
 const x=await makeContext();
 let unblock;
 const barrier=new Promise(resolve=>{unblock=resolve});
 x.ctx.crypto={getRandomValues:webcrypto.getRandomValues.bind(webcrypto),subtle:{encrypt:async(...args)=>{await barrier;return webcrypto.subtle.encrypt(...args)}}};
 const running=vm.runInContext('encrypt()',x.ctx);
 x.ctx.session++;
 unblock();
 await assert.rejects(running,/session changed/);
 assert.equal(x.writes.length,0);
});

test('PASS 5: serialized writes, features, accessibility and separate public site',async()=>{
 const key={disabled:false},queue=[];
 const ctx={
  pendingSaves:0,saveQueue:Promise.resolve(),lastSaveFailed:false,
  q:()=>key,
  encrypt:async()=>{queue.push('start');await new Promise(r=>setTimeout(r,6));queue.push('finish')},
  render:()=>{},info:()=>{},data:{posts:[],contacts:[]},
 };
 vm.createContext(ctx);vm.runInContext(saving,ctx);
 const results=await Promise.all([vm.runInContext('save()',ctx),vm.runInContext('save()',ctx),vm.runInContext('save()',ctx)]);
 assert.deepEqual(results,[true,true,true]);
 assert.deepEqual(queue,['start','finish','start','finish','start','finish']);
 assert.equal(key.disabled,false);assert.equal(ctx.pendingSaves,0);
 for(const label of ['Posts & drafts','Publishing calendar','Press & invitations','Encrypted backups']){
  assert.ok(html.includes(label),label);
 }
 assert.match(html,/@media\(max-width:700px\)/);
 assert.match(html,/focus-visible/);
 assert.match(homepage,/30 January 2027/);
 assert.match(homepage,/docs\.google\.com\/forms/);
});
