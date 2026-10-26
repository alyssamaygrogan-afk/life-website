/* L-I-F-E Social Media HQ PWA: cache the PUBLIC app shell only.
   Never cache encrypted workspace data, uploads, API responses or URLs outside /admin/. */
'use strict';
const CACHE_NAME='life-hq-static-v6';
const SHELL=['/admin/','/admin/manifest.webmanifest','/admin/app-icon.svg','/admin/apple-touch-icon.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('life-hq-static-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))),
  self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 const url=new URL(req.url);
 if(!url.pathname.startsWith('/admin/'))return;
 const eligible=url.pathname==='/admin/'||url.pathname==='/admin/index.html'||url.pathname==='/admin/manifest.webmanifest'||url.pathname==='/admin/app-icon.svg'||url.pathname==='/admin/apple-touch-icon.png';
 if(!eligible)return;
 event.respondWith(
  fetch(req).then(response=>{
   if(response.ok&&response.type==='basic'){
    const copy=response.clone();
    const cachePath=url.pathname==='/admin/index.html'?'/admin/':url.pathname;
    event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(cachePath,copy)));
   }
   return response;
  }).catch(async()=>{
   const cache=await caches.open(CACHE_NAME);
   return (await cache.match(url.pathname==='/admin/index.html'?'/admin/':url.pathname))||Response.error();
  })
 );
});
