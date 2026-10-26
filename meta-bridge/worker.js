/**
 * L-I-F-E Social Media HQ — Meta Graph API connection bridge.
 * Cloudflare Workers Free + KV; requires your own Meta app and explicit OAuth.
 * No publishing endpoints: approval and content hosting must be built separately.
 * Public repo contains NO user account secrets or Meta access tokens.
 *
 * Binding: META_KV (KV namespace)
 * Secrets: META_APP_ID, META_APP_SECRET, HQ_ADMIN_KEY, META_TOKEN_ENCRYPTION_KEY
 * Vars: SITE_ORIGIN, META_REDIRECT_URI, GRAPH_VERSION
 */
const SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'instagram_basic',
  'instagram_content_publish',
].join(',');
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function b64(bytes){
  let out=''; const a=new Uint8Array(bytes);
  for(let i=0;i<a.length;i+=4096)out+=String.fromCharCode(...a.subarray(i,i+4096));
  return btoa(out).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}
function un64(value){
  const s=value.replace(/-/g,'+').replace(/_/g,'/');
  return Uint8Array.from(atob(s+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0));
}
function secureEq(a,b){
  const left=encoder.encode(String(a||'')),right=encoder.encode(String(b||''));
  let diff=left.length^right.length;
  for(let i=0;i<Math.max(left.length,right.length);i++)diff|=(left[i]||0)^(right[i]||0);
  return diff===0&&left.length>=32;
}
function randomId(){return b64(crypto.getRandomValues(new Uint8Array(32)))}
function version(env){return /^v\d{1,3}\.\d$/.test(env.GRAPH_VERSION||'')?env.GRAPH_VERSION:'v26.0'}
function cors(env,origin){
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  if(origin===env.SITE_ORIGIN){
    headers['Access-Control-Allow-Origin']=origin;
    headers['Access-Control-Allow-Headers']='Content-Type, X-LIFE-HQ-Key';
    headers['Access-Control-Allow-Methods']='GET, POST, OPTIONS';
    headers['Vary']='Origin';
  }
  return headers;
}
function reply(body,status,env,origin){
  return new Response(JSON.stringify(body),{status:status||200,headers:{...cors(env,origin),'Content-Type':'application/json;charset=utf-8'}});
}
function html(body,status){
  return new Response('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>L-I-F-E HQ Meta Connection</title><style>body{font:17px/1.6 system-ui;background:#0b1021;color:white;padding:35px;margin:0}.card{max-width:560px;margin:40px auto;background:#17233b;border-radius:16px;padding:26px}a{color:#8be0d9}h1{margin-top:0}</style><main class="card"><h1>L-I-F-E Social Media HQ</h1>'+body+'</main></html>',{status:status||200,headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"}});
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function required(env){
  return !!(env.META_KV&&env.META_APP_ID&&env.META_APP_SECRET&&env.HQ_ADMIN_KEY&&env.META_TOKEN_ENCRYPTION_KEY&&env.META_REDIRECT_URI&&env.SITE_ORIGIN);
}
async function tokenKey(env){
  const bytes=un64(env.META_TOKEN_ENCRYPTION_KEY||'');
  if(bytes.length!==32)throw Error('META_TOKEN_ENCRYPTION_KEY must be a base64url-encoded 32-byte key');
  return await crypto.subtle.importKey('raw',bytes,'AES-GCM',false,['encrypt','decrypt']);
}
async function seal(value,env){
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const plain=encoder.encode(JSON.stringify(value));
  const crypt=await crypto.subtle.encrypt({name:'AES-GCM',iv},await tokenKey(env),plain);
  return JSON.stringify({iv:b64(iv),ciphertext:b64(crypt),version:1});
}
async function unseal(value,env){
  if(!value)return null;
  const body=JSON.parse(value);
  if(body.version!==1)throw Error('Encrypted data version mismatch');
  const decoded=await crypto.subtle.decrypt({name:'AES-GCM',iv:un64(body.iv)},await tokenKey(env),un64(body.ciphertext));
  return JSON.parse(decoder.decode(decoded));
}
async function metaGet(path,token,env){
  const u=new URL('https://graph.facebook.com/'+version(env)+'/'+path);
  u.searchParams.set('access_token',token);
  const res=await fetch(u,{headers:{'Accept':'application/json'}});
  const body=await res.json().catch(()=>({}));
  if(!res.ok||body.error)throw Error('Meta Graph API error: '+(body.error&&body.error.message||'request rejected'));
  return body;
}
async function exchangeCode(code,env){
  const redirect=env.META_REDIRECT_URI;
  const u=new URL('https://graph.facebook.com/'+version(env)+'/oauth/access_token');
  u.searchParams.set('client_id',env.META_APP_ID);
  u.searchParams.set('client_secret',env.META_APP_SECRET);
  u.searchParams.set('redirect_uri',redirect);
  u.searchParams.set('code',code);
  let res=await fetch(u,{headers:{'Accept':'application/json'}});
  let body=await res.json().catch(()=>({}));
  if(!res.ok||!body.access_token)throw Error('Meta did not grant access. Check Meta app settings and permissions.');
  const long=new URL('https://graph.facebook.com/'+version(env)+'/oauth/access_token');
  long.searchParams.set('grant_type','fb_exchange_token');
  long.searchParams.set('client_id',env.META_APP_ID);
  long.searchParams.set('client_secret',env.META_APP_SECRET);
  long.searchParams.set('fb_exchange_token',body.access_token);
  res=await fetch(long,{headers:{'Accept':'application/json'}});
  body=await res.json().catch(()=>({}));
  if(!res.ok||!body.access_token)throw Error('Could not obtain a longer-lived Meta user token.');
  return body.access_token;
}
async function listPages(token,env){
  const response=await metaGet('me/accounts?fields=id,name,access_token,tasks,instagram_business_account{id,username}&limit=100',token,env);
  const pages=Array.isArray(response.data)?response.data:[];
  return pages.filter(p=>p&&p.id&&p.name&&p.access_token).map(p=>({
    id:String(p.id),name:String(p.name),pageToken:p.access_token,
    instagramId:p.instagram_business_account&&String(p.instagram_business_account.id)||null,
    instagramUsername:p.instagram_business_account&&String(p.instagram_business_account.username||'')||null,
  }));
}
function publicPage(p){
  return {id:p.id,name:p.name,instagramId:p.instagramId||null,instagramUsername:p.instagramUsername||null};
}
async function jsonBody(request){
  const len=Number(request.headers.get('Content-Length')||0);
  if(len>8192)throw Error('Request too large');
  const text=await request.text();
  if(text.length>8192)throw Error('Request too large');
  return JSON.parse(text||'{}');
}
export default {
  async fetch(request,env){
    const u=new URL(request.url),origin=request.headers.get('Origin')||'';
    if(u.pathname==='/health'&&request.method==='GET'){
      return reply({service:'life-hq-meta-bridge',ready:required(env),publisher_enabled:false},200,env,origin);
    }
    if(!required(env))return reply({error:'The Meta connection service has not been configured yet'},503,env,origin);
    if(request.method==='OPTIONS'){
      return origin===env.SITE_ORIGIN?new Response(null,{status:204,headers:cors(env,origin)}):new Response(null,{status:403});
    }
    if(u.pathname==='/oauth/callback'&&request.method==='GET'){
      const state=u.searchParams.get('state')||'';
      const error=u.searchParams.get('error')||'';
      const code=u.searchParams.get('code')||'';
      if(!/^[A-Za-z0-9_-]{43}$/.test(state))return html('<p>The connection request has expired or is invalid. Start again from HQ.</p>',400);
      const flow=await env.META_KV.get('state:'+state);
      if(!flow)return html('<p>Meta connection timed out. Return to HQ and try again.</p>',400);
      await env.META_KV.delete('state:'+state);
      if(error||!code)return html('<p>Meta authorisation was cancelled or not approved. Return to HQ if you wish to retry.</p>',400);
      try{
        const accessToken=await exchangeCode(code,env),pages=await listPages(accessToken,env);
        if(!pages.length)return html('<p>No Facebook Pages were available with the permissions granted. Check that your L-I-F-E Page is managed by this Facebook login and linked to Instagram, then try again.</p>',400);
        await env.META_KV.put('pending:'+flow,await seal(pages,env),{expirationTtl:1200});
        return html('<p>Meta authorisation completed.</p><p>Return to L-I-F-E HQ, choose <strong>Check available Pages</strong>, then select your <strong>L-I-F-E</strong> Page. Nothing has been published or scheduled.</p><p><a href="'+escapeHtml(env.SITE_ORIGIN)+'/admin/">Return to L-I-F-E HQ</a></p>');
      }catch(e){
        return html('<p>The connection could not be completed. '+escapeHtml(e.message||'Unknown error')+'</p><p><a href="'+escapeHtml(env.SITE_ORIGIN)+'/admin/">Return to HQ</a></p>',400);
      }
    }
    // All other endpoints require the owner's private bridge access key.
    const access=request.headers.get('X-LIFE-HQ-Key')||'';
    if(!secureEq(access,env.HQ_ADMIN_KEY))return reply({error:'Access denied. Enter the bridge access key saved privately in Cloudflare.'},401,env,origin);
    try{
      if(u.pathname==='/status'&&request.method==='GET'){
        const selected=await unseal(await env.META_KV.get('connected'),env);
        if(!selected)return reply({service:'life-hq-meta-bridge',connected:false,publisher_enabled:false},200,env,origin);
        let verified=false,reason='';
        try{const page=await metaGet(selected.id+'?fields=id,name',selected.pageToken,env);verified=page.id===selected.id;}
        catch(e){reason='Meta permissions may have expired. Reconnect if necessary.'}
        return reply({service:'life-hq-meta-bridge',connected:verified,page:publicPage(selected),publisher_enabled:false,reason},200,env,origin);
      }
      if(u.pathname==='/auth/start'&&request.method==='POST'){
        const state=randomId(),flow=randomId();
        await env.META_KV.put('state:'+state,flow,{expirationTtl:600});
        const login=new URL('https://www.facebook.com/'+version(env)+'/dialog/oauth');
        login.searchParams.set('client_id',env.META_APP_ID);
        login.searchParams.set('redirect_uri',env.META_REDIRECT_URI);
        login.searchParams.set('state',state);
        login.searchParams.set('scope',SCOPES);
        login.searchParams.set('response_type','code');
        return reply({service:'life-hq-meta-bridge',url:login.href,flow,expiresInSeconds:600},200,env,origin);
      }
      if(u.pathname==='/candidates'&&request.method==='GET'){
        const flow=u.searchParams.get('flow')||'';
        if(!/^[A-Za-z0-9_-]{43}$/.test(flow))return reply({error:'Start a new Meta authorisation from HQ'},400,env,origin);
        const pages=await unseal(await env.META_KV.get('pending:'+flow),env);
        if(!pages)return reply({error:'No Pages are ready yet. Complete the Meta sign-in in the other tab first.'},404,env,origin);
        return reply({service:'life-hq-meta-bridge',pages:pages.map(publicPage)},200,env,origin);
      }
      if(u.pathname==='/select'&&request.method==='POST'){
        const body=await jsonBody(request),flow=String(body.flow||''),pageId=String(body.pageId||'');
        if(!/^[A-Za-z0-9_-]{43}$/.test(flow)||!/^\\d{5,30}$/.test(pageId))return reply({error:'Invalid Meta Page selection'},400,env,origin);
        const pages=await unseal(await env.META_KV.get('pending:'+flow),env);
        const page=pages&&pages.find(p=>p.id===pageId);
        if(!page)return reply({error:'That Page is unavailable or the connection attempt expired'},404,env,origin);
        await env.META_KV.put('connected',await seal(page,env));
        await env.META_KV.delete('pending:'+flow);
        return reply({service:'life-hq-meta-bridge',connected:true,page:publicPage(page),publisher_enabled:false},200,env,origin);
      }
      if(u.pathname==='/disconnect'&&request.method==='POST'){
        await env.META_KV.delete('connected');
        return reply({service:'life-hq-meta-bridge',connected:false,publisher_enabled:false},200,env,origin);
      }
      return reply({error:'Unknown endpoint. This service does not publish posts.'},404,env,origin);
    }catch(e){return reply({error:String(e.message||'Unexpected error').slice(0,320)},400,env,origin)}
  }
};
