import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const source=readFileSync(fileURLToPath(new URL('../index.html',import.meta.url)),'utf8');
function section(start,end){
 const i=source.indexOf(start),j=source.indexOf(end,i+start.length);
 assert.ok(i>=0&&j>i,'Expected audited source function: '+start);
 return source.slice(i,j);
}
const modules=section('function isPublicStatus(status){','function posts(){');
const setup=(today='2026-10-28')=>{
 const data={media:[
  {id:'picture',profileId:'life',type:'image/png',size:100},
  {id:'second',profileId:'life',type:'image/png',size:100},
  {id:'bear',profileId:'bears-adventures',type:'image/png',size:100}
 ],posts:[],trash:[],launchChecks:{}};
 const funcs=new Function('data','dateUK','profileOf','safeUrl',modules+'return {releaseChecks,postMediaProblems};')(
  data,()=>today,p=>p.profileId||'life',s=>{try{return new URL(s).protocol==='https:'}catch{return false}});
 const valid={title:'Rainbow card',caption:'Text',profileId:'life',status:'Ready',
  format:'Image',mediaRefs:['localmedia:picture'],assetRef:'localmedia:picture',
  altText:'Rainbow lettering on black',networks:['Facebook'],topic:'General'};
 return {data,funcs,valid};
};

test('full editor accepts an approved image with saved artwork',()=>{
 const {funcs,valid}=setup();assert.deepEqual(funcs.releaseChecks(valid,true,false),[]);
});
test('approved images require actual attachments and metadata',()=>{
 const {funcs,valid}=setup();
 assert.match(funcs.releaseChecks({...valid,assetRef:'',mediaRefs:[]},true,false).join(' '),/Attach/);
 assert.match(funcs.releaseChecks({...valid,assetRef:'localmedia:missing',mediaRefs:['localmedia:missing']},true,false).join(' '),/missing/);
});
test('different profiles cannot borrow saved artwork',()=>{
 const {funcs,valid}=setup();
 assert.match(funcs.releaseChecks({...valid,assetRef:'localmedia:bear',mediaRefs:['localmedia:bear']},true,false).join(' '),/profile/);
});
test('formats, alt text and duplicate attachments are validated',()=>{
 const {funcs,valid}=setup();
 assert.match(funcs.releaseChecks({...valid,altText:''},true,false).join(' '),/description/);
 assert.match(funcs.releaseChecks({...valid,mediaRefs:['localmedia:picture','localmedia:picture']},true,false).join(' '),/duplicate/);
 assert.match(funcs.releaseChecks({...valid,format:'Carousel'},true,false).join(' '),/two/);
 assert.deepEqual(funcs.releaseChecks({...valid,format:'Carousel',mediaRefs:['localmedia:picture','localmedia:second']},true,false),[]);
});
test('Published requires the public post URL and confirmation',()=>{
 const {funcs,valid}=setup(),p={...valid,status:'Published',format:'Text',mediaRefs:[],assetRef:''};
 assert.match(funcs.releaseChecks(p,true,true).join(' '),/verified public post URL/);
 assert.match(funcs.releaseChecks({...p,publishedUrl:'https://example.org/post'},true,false).join(' '),/confirming/);
 assert.deepEqual(funcs.releaseChecks({...p,publishedUrl:'https://example.org/post'},true,true),[]);
});
test('LIFE venue embargo still prevents premature approvals',()=>{
 const {funcs,valid}=setup();
 assert.match(funcs.releaseChecks({...valid,topic:'Venue / tickets'},true,false).join(' '),/3 December 2026/);
});
test('in-use images referenced by live or recycled posts are counted',()=>{
 const {data}=setup();
 const mediaReferenceCount=new Function('data',
  section('function mediaReferenceCount(mediaId){','async function permanentlyRemove(binId){')+
  'return mediaReferenceCount;')(data);
 data.posts.push({id:'one',mediaRefs:['localmedia:picture']});
 data.trash.push({kind:'post',record:{assetRef:'localmedia:second'}});
 assert.equal(mediaReferenceCount('picture'),1);
 assert.equal(mediaReferenceCount('second'),1);
 assert.equal(mediaReferenceCount('bear'),0);
});
test('ZIP cancel does not report imported drafts',()=>{
 assert.match(source,/Import seven drafts'\)\)return false;/);
 assert.match(source,/notice\.textContent=imported\?/);
 assert.match(source,/Nothing published\.'\);\s*return true;\s*\}catch\(err\)/);
});
test('post save failures and image uploads have rollback paths',()=>{
 assert.match(source,/else\{data\.posts=beforePosts;formProblem/);
 assert.match(source,/data\.media=originalMedia;draftMediaRefs=originalRefs/);
 assert.match(source,/for\(var mediaId of written\)\{try\{await mediaRemove/);
});
test('browser scripts remain syntactically valid',()=>{
 const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
 assert.ok(scripts.length>=2);
 scripts.forEach(code=>{new Function(code);});
});
