(function(){
"use strict";

/* ---------- configuration ---------- */
const CFG={
  sbUrl:"https://oxubmwphdvrlczsjuksx.supabase.co",
  sbKey:"sb_publishable_dzId3QzkMOJUqs8z5Yq_EA_hUNNDD08",
  tmdb:"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYTI3MjI5ZTc1Y2YzOWVmYjExMGQ5ZDM4YWFkYjcxNCIsIm5iZiI6MTc5MjM3NDE1My4yNjcsInN1YiI6IjZhZDU3NTg5ZGRhMGJlMzkyNDBkOWQ3OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6OwQyGISN2ZQkzbxepjRrzqTRiBzswfJHkJ8u4v_Oy0"
};
const sb=window.supabase&&window.supabase.createClient(CFG.sbUrl,CFG.sbKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

const SHOW_SHELVES=[["watching","Watching"],["notstarted","Not started"],["paused","Paused"],["stopped","Stopped"],["completed","Completed"]];
const MOVIE_SHELVES=[["watched","Watched"],["watchlist","Watchlist"]];
const CONF=[["confirmed","Confirmed"],["probable","Probable"],["guess","Best guess"]];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const ICON={
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  tv:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M8.5 2.5L12 6l3.5-3.5"/></svg>',
  film:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 3v18M16 3v18M4 8h4M4 12h4M4 16h4M16 8h4M16 12h4M16 16h4"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4 7.4 4c2 0 3.5 1.1 4.6 2.6C13.1 5.1 14.6 4 16.6 4c3.5 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4z"/></svg>',
  rewatch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/></svg>'
};

/* ---------- state ---------- */
const S={user:null,authReady:false,authMode:"signin",authMsg:"",authErr:"",items:new Map(),loaded:false,
  tab:"shows",showShelf:"watching",movieShelf:"watched",q:"",openId:null,season:null,diaryYear:new Date().getFullYear(),
  diaryFilter:"all",diaryView:"dated",add:null,picker:null,settings:false,confirm:null,markAsk:null,refreshing:false,
  logNoDate:false,logConf:"confirmed",renderPending:false,lastSheet:"",offline:false};
try{const p=JSON.parse(localStorage.getItem("wd-prefs")||"{}");["tab","showShelf","movieShelf","diaryView"].forEach(k=>{if(p[k])S[k]=p[k]})}catch(e){}
function savePrefs(){try{localStorage.setItem("wd-prefs",JSON.stringify({tab:S.tab,showShelf:S.showShelf,movieShelf:S.movieShelf,diaryView:S.diaryView}))}catch(e){}}

/* ---------- helpers ---------- */
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0");
function today(){const d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function fmtDate(s){if(!s)return"";const[y,m,d]=s.split("-").map(Number);return MONTHS[m-1].slice(0,3)+" "+d+(y!==new Date().getFullYear()?", "+y:"")}
function longDate(s){const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d).toLocaleDateString("en-US",{weekday:"long"})+", "+MONTHS[m-1]+" "+d+", "+y}
const code=(s,e)=>"S"+pad(s)+"E"+pad(e);
const isW=e=>e&&e.w!==null&&e.w!==undefined;
const aired=e=>!e.a||e.a<=today();
const img=(p,w)=>p?"https://image.tmdb.org/t/p/"+w+p:"";
function initials(t){const w=String(t).replace(/^(the|a|an)\s+/i,"").split(/\s+/).filter(Boolean);return(w[0]?w[0][0]:"")+(w[1]?w[1][0]:"")}
function hashHue(s){let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h%360}
function scoreOf(it){return it.score||0}
function lovedOf(it){return scoreOf(it)>=9}
function scorePill(it){const s=scoreOf(it);return s?'<span class="score">'+s+'<small>/10</small></span>':""}
function confBadge(c){return c==="probable"?'<span class="conf conf-probable">Probable</span>':c==="guess"?'<span class="conf conf-guess">Guess</span>':""}
function watchesOf(it){return(it.watches||[]).filter(w=>w&&typeof w==="object")}
function allEps(it){const out=[];(it.seasons||[]).slice().sort((a,b)=>a.n-b.n).forEach(s=>(s.eps||[]).slice().sort((a,b)=>a.n-b.n).forEach(e=>out.push({s:s.n,e})));return out}
function airedEps(it){return allEps(it).filter(x=>aired(x.e))}
function progress(it){const a=airedEps(it);return{w:a.filter(x=>isW(x.e)).length,total:a.length}}
function nextUp(it){const a=airedEps(it);let last=-1;a.forEach((x,i)=>{if(isW(x.e))last=i});for(let i=last+1;i<a.length;i++)if(!isW(a[i].e))return a[i];for(let i=0;i<a.length;i++)if(!isW(a[i].e))return a[i];return null}
function nextAiring(it){const f=allEps(it).filter(x=>!aired(x.e)&&x.e.a).sort((a,b)=>a.e.a.localeCompare(b.e.a));return f[0]||null}
function ended(it){return it.status==="Ended"||it.status==="Canceled"}
function findEp(it,s,e){const se=(it.seasons||[]).find(x=>x.n===s);return se&&se.eps.find(x=>x.n===e)}
function clone(id){return JSON.parse(JSON.stringify(S.items.get(id)))}
function list(kind){return[...S.items].filter(([,it])=>it&&it.kind===kind)}
function lastWatch(it){if(it.kind==="movie")return watchesOf(it).map(w=>w.d).filter(Boolean).sort().pop()||"";let m="";(it.seasons||[]).forEach(s=>s.eps.forEach(e=>{if(e.w&&e.w>m)m=e.w}));return m}
function norm(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").trim()}

function cover(it,cls,w){
  cls=cls||"";w=w||"w342";
  const h=hashHue(it.title||"x");const a="hsl("+h+" 42% 26%)",b="hsl("+((h+38)%360)+" 52% 64%)";
  const t=it.title||"";const fs=t.length<=7?18:t.length<=14?14.5:t.length<=24?12:t.length<=40?10:8.5;
  const fallback='<span class="cv-kind">'+(it.kind==="show"?"Series":"Film")+(it.year?" · "+esc(it.year):"")+'</span><span class="cv-title">'+esc(t)+'</span><span class="cv-ini">'+esc(initials(t))+'</span>';
  if(it.poster)return'<div class="cover img '+cls+'" style="--c1:'+a+';--c2:'+b+';--fs:'+fs+'">'+fallback+'<img src="'+img(it.poster,w)+'" alt="" loading="lazy" decoding="async"></div>';
  return'<div class="cover '+cls+'" style="--c1:'+a+';--c2:'+b+';--fs:'+fs+'">'+fallback+'</div>';
}
document.addEventListener("load",e=>{const t=e.target;if(t&&t.tagName==="IMG"){t.classList.add("ok")}},true);
document.addEventListener("error",e=>{const t=e.target;if(t&&t.tagName==="IMG"){const c=t.closest(".cover");if(c)c.classList.remove("img");t.remove()}},true);

/* ---------- TMDB ---------- */
const tmdbCache=new Map();
async function tmdb(path,params){
  const u=new URL("https://api.themoviedb.org/3"+path);
  Object.entries(params||{}).forEach(([k,v])=>u.searchParams.set(k,v));
  const key=u.toString();if(tmdbCache.has(key))return tmdbCache.get(key);
  const r=await fetch(key,{headers:{Authorization:"Bearer "+CFG.tmdb,accept:"application/json"}});
  if(!r.ok)throw new Error("TMDB "+r.status);
  const j=await r.json();tmdbCache.set(key,j);return j;
}
async function pool(items,n,fn){const out=new Array(items.length);let i=0;await Promise.all(Array.from({length:Math.min(n,items.length)},async()=>{while(i<items.length){const k=i++;out[k]=await fn(items[k])}}));return out}
async function fetchShowSeasons(tmdbId,seasonsMeta){
  const nums=seasonsMeta.filter(s=>s.season_number>0).map(s=>s.season_number);
  const data=await pool(nums,4,n=>tmdb("/tv/"+tmdbId+"/season/"+n).catch(()=>null));
  return nums.map((n,i)=>{const d=data[i];const meta=seasonsMeta.find(s=>s.season_number===n);
    const eps=d&&Array.isArray(d.episodes)?d.episodes.filter(e=>e.episode_number>0).map(e=>({n:e.episode_number,t:e.name||"",a:e.air_date||""}))
      :Array.from({length:(meta&&meta.episode_count)||0},(_,j)=>({n:j+1,t:"",a:""}));
    return{n,eps:eps.map(e=>Object.assign(e,{w:null}))};
  });
}
async function buildFromTmdb(kind,id){
  if(kind==="movie"){
    const d=await tmdb("/movie/"+id,{append_to_response:"credits"});
    const dir=((d.credits&&d.credits.crew)||[]).filter(c=>c.job==="Director").map(c=>c.name).slice(0,2).join(" & ");
    return{kind:"movie",tmdb:id,title:d.title||d.original_title||"Untitled",year:parseInt((d.release_date||"").slice(0,4),10)||null,by:dir,runtime:d.runtime||null,
      genre:(d.genres||[]).slice(0,2).map(g=>g.name).join(", "),blurb:d.overview||"",poster:d.poster_path||null,shelf:"watchlist",score:0,watches:[],notes:"",addedAt:Date.now()};
  }
  const d=await tmdb("/tv/"+id);
  const seasons=await fetchShowSeasons(id,d.seasons||[]);
  return{kind:"show",tmdb:id,title:d.name||d.original_name||"Untitled",year:parseInt((d.first_air_date||"").slice(0,4),10)||null,
    by:((d.networks||[])[0]||{}).name||"",genre:(d.genres||[]).slice(0,2).map(g=>g.name).join(", "),blurb:d.overview||"",poster:d.poster_path||null,
    status:d.status||"",shelf:"notstarted",score:0,seasons,refreshedAt:Date.now(),addedAt:Date.now()};
}
async function refreshShow(id,quiet){
  const it=S.items.get(id);if(!it||it.kind!=="show"||!it.tmdb)return;
  if(!quiet){S.refreshing=true;render()}
  try{
    tmdbCache.forEach((v,k)=>{if(k.includes("/tv/"+it.tmdb))tmdbCache.delete(k)});
    const d=await tmdb("/tv/"+it.tmdb);
    const fresh=await fetchShowSeasons(it.tmdb,d.seasons||[]);
    const cur=clone(id);const old=cur.seasons||[];
    const before=allEps(cur).length;
    const merged=fresh.map(ns=>{const os=old.find(s=>s.n===ns.n);
      const eps=ns.eps.map(ne=>{const oe=os&&os.eps.find(e=>e.n===ne.n);return Object.assign({},ne,{w:oe&&oe.w!==undefined?oe.w:null},oe&&oe.c?{c:oe.c}:{})});
      (os?os.eps:[]).forEach(oe=>{if(!eps.some(e=>e.n===oe.n))eps.push(oe)});
      return{n:ns.n,eps:eps.sort((a,b)=>a.n-b.n)}});
    old.forEach(os=>{if(!merged.some(s=>s.n===os.n))merged.push(os)});
    cur.seasons=merged.sort((a,b)=>a.n-b.n);cur.status=d.status||cur.status;cur.refreshedAt=Date.now();
    if(!cur.poster&&d.poster_path)cur.poster=d.poster_path;
    const added=allEps(cur).length-before;
    autoShelf(cur,true);save(id,cur);
    if(!quiet)toast(added>0?"Added "+added+" new episode"+(added>1?"s":"")+".":"Episode list is up to date.");
  }catch(e){if(!quiet)toast("Couldn't reach TMDB. Try again in a bit.")}
  finally{if(!quiet){S.refreshing=false;render()}}
}

/* ---------- data (Supabase) ---------- */
const pending=new Map(),inflight=new Set();
function cacheKey(){return S.user?"wd-cache-"+S.user.id:""}
function writeCache(){if(!S.user)return;try{localStorage.setItem(cacheKey(),JSON.stringify([...S.items]))}catch(e){}}
let cacheTimer=null;function scheduleCache(){clearTimeout(cacheTimer);cacheTimer=setTimeout(writeCache,400)}
function readCache(){try{const a=JSON.parse(localStorage.getItem(cacheKey())||"null");if(Array.isArray(a)){S.items=new Map(a);S.loaded=true}}catch(e){}}
async function loadAll(){
  try{
    const rows=[];let from=0;
    for(;;){
      const{data,error}=await sb.from("items").select("id,data").range(from,from+999);
      if(error)throw error;rows.push(...data);if(data.length<1000)break;from+=1000;
    }
    const m=new Map();rows.forEach(r=>m.set(r.id,pending.has(r.id)?pending.get(r.id):r.data));
    for(const[id,v]of pending)if(!m.has(id))m.set(id,v);
    S.items=m;S.loaded=true;S.offline=false;writeCache();render();
  }catch(e){
    S.loaded=true;S.offline=true;render();
    if(e&&/relation|does not exist|schema cache/i.test(e.message||""))toast("The diary table isn't set up in Supabase yet.");
    else toast("Couldn't reach your diary. Showing what's saved on this device.");
  }
}
function save(id,doc){
  doc.updatedAt=Date.now();S.items.set(id,doc);render();scheduleCache();
  pending.set(id,doc);flush(id);
}
async function flush(id){
  if(inflight.has(id))return;inflight.add(id);
  try{
    while(pending.has(id)){
      const d=pending.get(id);
      let ok=false;
      for(let attempt=0;attempt<3&&!ok;attempt++){
        const{error}=await sb.from("items").upsert({id,data:d,updated_at:new Date().toISOString()});
        if(!error)ok=true;else await new Promise(r=>setTimeout(r,800*(attempt+1)));
      }
      if(pending.get(id)===d)pending.delete(id);
      if(!ok){S.offline=true;toast("A change didn't sync. It's kept on this device and will retry.");setTimeout(()=>{if(!pending.has(id)){pending.set(id,S.items.get(id));flush(id)}},15000);break}
      else S.offline=false;
    }
  }finally{inflight.delete(id)}
}
async function removeItem(id){
  S.items.delete(id);pending.delete(id);render();scheduleCache();
  const{error}=await sb.from("items").delete().eq("id",id);
  if(error)toast("That delete didn't sync. Try again when you're online.");
}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&S.user&&!pending.size)loadAll()});

/* ---------- auth ---------- */
async function initAuth(){
  if(!sb){S.authReady=true;S.authErr="Couldn't load the sign-in service. Check your connection and reload.";render();return}
  const{data}=await sb.auth.getSession();
  setUser(data&&data.session?data.session.user:null);
  sb.auth.onAuthStateChange((ev,session)=>{const u=session?session.user:null;if((u&&u.id)!==(S.user&&S.user.id))setUser(u)});
}
function setUser(u){
  S.user=u;S.authReady=true;S.items=new Map();S.loaded=false;
  if(u){readCache();render();loadAll()}else render();
}
async function doAuth(){
  const email=((document.getElementById("au-email")||{}).value||"").trim();
  const pw=(document.getElementById("au-pw")||{}).value||"";
  S.authErr="";S.authMsg="";
  if(!email||!pw){S.authErr="Enter your email and a password.";render();return}
  if(S.authMode==="signup"&&pw.length<8){S.authErr="Use at least 8 characters for the password.";render();return}
  S.authBusy=true;render();
  try{
    if(S.authMode==="signup"){
      const{data,error}=await sb.auth.signUp({email,password:pw,options:{emailRedirectTo:location.origin+location.pathname}});
      if(error)throw error;
      if(!data.session){S.authMode="signin";S.authMsg="Check your email for a confirmation link. After you tap it, sign in here."}
    }else{
      const{error}=await sb.auth.signInWithPassword({email,password:pw});
      if(error)throw error;
    }
  }catch(e){
    const m=(e&&e.message)||"";
    S.authErr=/invalid login/i.test(m)?"That email and password don't match.":/not confirmed/i.test(m)?"Confirm your email first. The link is in your inbox.":/already registered/i.test(m)?"That email already has an account. Sign in instead.":m||"Something went wrong. Try again.";
  }finally{S.authBusy=false;render()}
}
async function resetPassword(){
  const email=((document.getElementById("au-email")||{}).value||"").trim();
  if(!email){S.authErr="Enter your email above first.";render();return}
  const{error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
  S.authErr=error?(error.message||"Couldn't send the email."):"";S.authMsg=error?"":"If that email has an account, a reset link is on its way.";render();
}

/* ---------- mutations ---------- */
function autoShelf(it,silent){
  if(it.kind!=="show")return;
  const p=progress(it);
  if(p.total&&p.w===p.total){
    if(ended(it)&&!nextAiring(it)){if(it.shelf!=="completed"){it.shelf="completed";if(!silent)toast("Finished. Moved to Completed.")}}
    else if(it.shelf==="notstarted"||it.shelf==="completed"){it.shelf="watching"}
  }else if(p.w>0&&(it.shelf==="notstarted"||it.shelf==="completed"))it.shelf="watching";
}
function setEps(id,pairs,val){const it=clone(id);pairs.forEach(([s,e])=>{const ep=findEp(it,s,e);if(ep){ep.w=val;if(val===null)delete ep.c}});autoShelf(it);save(id,it)}
function toggleEp(id,s,e){
  const it=S.items.get(id);const ep=findEp(it,s,e);if(!ep)return;
  if(isW(ep)){setEps(id,[[s,e]],null);return}
  setEps(id,[[s,e]],today());
  const a=airedEps(S.items.get(id));const idx=a.findIndex(x=>x.s===s&&x.e.n===e);
  const earlier=idx>0?a.slice(0,idx).filter(x=>!isW(x.e)):[];
  if(earlier.length)toast(earlier.length+" earlier episode"+(earlier.length>1?"s":"")+" not marked",{label:"Mark as seen",fn:()=>setEps(id,earlier.map(x=>[x.s,x.e.n]),"")});
}

/* ---------- toast ---------- */
let toastTimer=null,toastAction=null;
function toast(msg,action){
  const el=document.getElementById("toast");toastAction=action||null;
  el.innerHTML='<div class="toast" role="status"><span>'+esc(msg)+'</span>'+(action?'<button type="button" data-a="toastAct">'+esc(action.label)+'</button>':"")+'</div>';
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.innerHTML="";toastAction=null},action?6500:3400);
}

/* ---------- views ---------- */
function loginView(){
  const up=S.authMode==="signup";
  return'<main class="login"><form class="login-card" data-f="auth">'+
    '<span class="mark">Watch <i>Diary</i></span><p>'+(up?"Create your account. You'll only do this once.":"Sign in to your diary.")+'</p>'+
    '<div class="form" style="margin:0"><label>Email<input id="au-email" type="email" autocomplete="email" inputmode="email" required></label>'+
    '<label>Password<input id="au-pw" type="password" autocomplete="'+(up?"new-password":"current-password")+'" required></label></div>'+
    (S.authErr?'<p class="err" role="alert">'+esc(S.authErr)+'</p>':"")+(S.authMsg?'<p class="ok" role="status">'+esc(S.authMsg)+'</p>':"")+
    '<button class="btn primary" type="submit" '+(S.authBusy?"disabled":"")+'>'+(S.authBusy?'<span class="spin"></span>':"")+(up?"Create account":"Sign in")+'</button>'+
    '<p style="font-size:14px">'+(up?'Already have an account? <button class="link" type="button" data-a="authMode" data-v="signin">Sign in</button>':'New here? <button class="link" type="button" data-a="authMode" data-v="signup">Create an account</button> · <button class="link" type="button" data-a="resetPw">Forgot password</button>')+'</p>'+
    '</form></main>';
}
function topbar(){
  const d=new Date();const dl=d.toLocaleDateString("en-US",{weekday:"short"})+" · "+MONTHS[d.getMonth()].slice(0,3)+" "+d.getDate();
  return'<header class="topbar"><div class="wrap"><div class="brand"><span class="mark">Watch <i>Diary</i></span><span class="date">'+esc(dl)+(S.offline?" · offline":"")+'</span></div>'+
    '<div class="top-actions"><button class="gear" type="button" data-a="openSettings" aria-label="Settings">'+ICON.gear+'</button><button class="add-btn" type="button" data-a="openAdd">'+ICON.plus+'Add</button></div></div></header>';
}
function chips(shelves,current,counts,action){
  return'<div class="chips" data-scroll="chips-'+action+'">'+shelves.map(([k,l])=>'<button class="chip" type="button" style="--dot:var(--s-'+k+')" aria-pressed="'+(k===current)+'" data-a="'+action+'" data-v="'+k+'"><span class="dot"></span>'+l+(counts&&counts[k]!=null?'<span class="n">'+counts[k]+'</span>':"")+'</button>').join("")+'</div>';
}
function filterBox(placeholder){return'<label class="filter">'+ICON.search+'<input id="libq" type="search" placeholder="'+esc(placeholder)+'" value="'+esc(S.q)+'" autocomplete="off" aria-label="'+esc(placeholder)+'"></label>'}
function firstRun(){return'<div class="empty"><h2>Your diary is empty</h2><p>Add a show to track it episode by episode, or a movie to score and log it.</p><button class="btn primary" type="button" data-a="openAdd">'+ICON.plus+'Add a show or movie</button></div>'}
function loading(){return'<div class="skeleton" aria-label="Loading your diary"><div></div><div></div><div></div><div></div><div></div><div></div></div>'}

function showsBody(){
  const all=list("show");const q=norm(S.q);
  const items=all.filter(([,it])=>q?norm(it.title).includes(q):it.shelf===S.showShelf).sort((a,b)=>(b[1].updatedAt||0)-(a[1].updatedAt||0));
  if(!items.length){
    if(q)return'<div class="empty"><p>No shows match “'+esc(S.q)+'”.</p></div>';
    const msg={watching:"Shows you're in the middle of appear here, with the next episode one tap away.",notstarted:"Shows you've added but haven't started.",paused:"Nothing on pause.",stopped:"Nothing you've given up on.",completed:"Finished shows land here."}[S.showShelf];
    return'<div class="empty"><p>'+msg+'</p><button class="btn ghost" type="button" data-a="openAdd">'+ICON.plus+'Add a show</button></div>';
  }
  if(S.showShelf==="watching"&&!q){
    return'<div class="rows">'+items.map(([id,it])=>{
      const p=progress(it),n=nextUp(it),na=nextAiring(it);
      const nextLine=n?'<span class="next"><b>'+code(n.s,n.e.n)+'</b>'+esc(n.e.t||"Episode "+n.e.n)+'</span>':'<span class="next caught">Caught up'+(na?' · next airs '+esc(fmtDate(na.e.a)):"")+'</span>';
      return'<div class="row"><button class="open" type="button" data-a="open" data-id="'+id+'">'+cover(it,"","w185")+'<span class="info"><span class="title">'+esc(it.title)+'</span>'+nextLine+
        '<span class="bar"><span style="width:'+(p.total?Math.round(p.w/p.total*100):0)+'%"></span></span><span class="pct">'+p.w+' of '+p.total+' watched</span></span></button>'+
        (n?'<button class="check-big" type="button" data-a="watchNext" data-id="'+id+'" aria-label="Mark '+code(n.s,n.e.n)+' watched">'+ICON.check+'</button>':'<span></span>')+'</div>';
    }).join("")+'</div>';
  }
  return'<div class="grid">'+items.map(([id,it])=>{const p=progress(it);
    return'<button class="tile" type="button" data-a="open" data-id="'+id+'">'+cover(it)+'<span class="t">'+esc(it.title)+'</span><span class="m">'+(scoreOf(it)?scorePill(it)+" ":"")+p.w+'/'+p.total+' eps</span></button>'}).join("")+'</div>';
}
function showsView(){
  const all=list("show");const counts={};SHOW_SHELVES.forEach(([k])=>counts[k]=0);all.forEach(([,it])=>counts[it.shelf]=(counts[it.shelf]||0)+1);
  return'<div class="head"><h1>Shows</h1><span class="count">'+all.length+' TRACKED</span></div>'+(all.length>8?filterBox("Search your shows"):"")+
    (S.q?"":chips(SHOW_SHELVES,S.showShelf,counts,"showShelf"))+'<div id="lib">'+showsBody()+'</div>';
}
function moviesBody(){
  const all=list("movie");const q=norm(S.q);
  const items=all.filter(([,it])=>q?norm(it.title).includes(q):it.shelf===S.movieShelf).sort((a,b)=>S.movieShelf==="watched"&&!q?(lastWatch(b[1])||"").localeCompare(lastWatch(a[1])||"")||(b[1].updatedAt||0)-(a[1].updatedAt||0):(b[1].addedAt||0)-(a[1].addedAt||0));
  if(!items.length){
    if(q)return'<div class="empty"><p>No movies match “'+esc(S.q)+'”.</p></div>';
    return'<div class="empty"><p>'+(S.movieShelf==="watched"?"Movies you've seen go here, with your score under each poster.":"Movies you want to see go here.")+'</p><button class="btn ghost" type="button" data-a="openAdd">'+ICON.plus+'Add a movie</button></div>';
  }
  return'<div class="grid">'+items.map(([id,it])=>'<button class="tile" type="button" data-a="open" data-id="'+id+'">'+cover(it)+'<span class="t">'+esc(it.title)+'</span><span class="m">'+(scoreOf(it)?scorePill(it):(it.year||""))+(lovedOf(it)?' <span style="color:var(--heart)">♥</span>':"")+'</span></button>').join("")+'</div>';
}
function moviesView(){
  const all=list("movie");const counts={watched:0,watchlist:0};all.forEach(([,it])=>counts[it.shelf]=(counts[it.shelf]||0)+1);
  return'<div class="head"><h1>Movies</h1><span class="count">'+counts.watched+' WATCHED</span></div>'+(all.length>8?filterBox("Search your movies"):"")+
    (S.q?"":chips(MOVIE_SHELVES,S.movieShelf,counts,"movieShelf"))+'<div id="lib">'+moviesBody()+'</div>';
}

function diaryEntries(){
  const out=[];
  for(const[id,it]of S.items){
    if(it.kind==="show")(it.seasons||[]).forEach(s=>(s.eps||[]).forEach(e=>{if(e.w)out.push({date:e.w,c:e.c||"confirmed",id,kind:"show",s:s.n,e:e.n,t:e.t})}));
    else watchesOf(it).forEach((w,i)=>{if(w.d)out.push({date:w.d,c:w.c||"confirmed",id,kind:"movie",wi:i})});
  }
  return out;
}
function undatedEntries(){
  const out=[];
  for(const[id,it]of S.items)if(it.kind==="movie")watchesOf(it).forEach((w,i)=>{if(!w.d)out.push({id,wi:i,o:w.o||0,c:w.c||"confirmed"})});
  return out.sort((a,b)=>b.o-a.o);
}
function firstWatchMap(){const f={};for(const[id,it]of S.items)if(it.kind==="movie"){const w=watchesOf(it);if(w.some(x=>!x.d))f[id]="";else{const d=w.map(x=>x.d).sort();if(d.length)f[id]=d[0]}}return f}
function diaryRow(it,id,box,boxCls,meta){
  return'<button type="button" class="drow" data-a="open" data-id="'+id+'"><span class="dbox '+boxCls+'">'+box+'</span>'+cover(it,"","w154")+'<span class="dinfo"><span class="dtitle">'+esc(it.title)+(it.year?' <span class="dyear">'+esc(it.year)+'</span>':"")+'</span><span class="dmeta">'+meta+'</span></span></button>';
}
function diaryView(){
  const und=undatedEntries();
  let h='<div class="head"><h1>Diary</h1>'+(S.diaryView==="dated"?yearBar():"")+'</div>';
  h+='<div class="seg" role="group" aria-label="Diary view"><button type="button" data-a="dview" data-v="dated" aria-pressed="'+(S.diaryView==="dated")+'">By date</button><button type="button" data-a="dview" data-v="undated" aria-pressed="'+(S.diaryView==="undated")+'">Undated'+(und.length?" ("+und.length+")":"")+'</button></div>';
  if(S.diaryView==="undated")return h+undatedView(und);
  const all=diaryEntries();const Y=S.diaryYear;
  const inYear=all.filter(x=>+x.date.slice(0,4)===Y&&(S.diaryFilter==="all"||x.kind===S.diaryFilter));
  h+=chips([["all","Everything"],["movie","Movies"],["show","Episodes"]],S.diaryFilter,null,"dfilter");
  const films=inYear.filter(x=>x.kind==="movie").length,eps=inYear.filter(x=>x.kind==="show").length,shows=new Set(inYear.filter(x=>x.kind==="show").map(x=>x.id)).size;
  h+='<div class="yearstats"><div><b>'+films+'</b><span>Films</span></div><div><b>'+eps+'</b><span>Episodes</span></div><div><b>'+shows+'</b><span>Shows</span></div></div>';
  if(!inYear.length)return h+'<div class="empty"><p>'+(all.length?"Nothing logged in "+Y+".":"Every movie and episode you log with a date shows up here, month by month.")+'</p></div>';
  const fw=firstWatchMap();
  for(let m=11;m>=0;m--){
    const key=Y+"-"+pad(m+1);const me=inYear.filter(x=>x.date.startsWith(key));if(!me.length)continue;
    const groups=[];me.forEach(x=>{let g=groups.find(g=>g.date===x.date&&g.id===x.id);if(!g){g={date:x.date,id:x.id,kind:x.kind,c:x.c,eps:[]};groups.push(g)}if(x.c!=="confirmed"&&g.c==="confirmed")g.c=x.c;if(x.kind==="show")g.eps.push(x)});
    groups.sort((a,b)=>b.date.localeCompare(a.date)||((S.items.get(b.id)||{}).updatedAt||0)-((S.items.get(a.id)||{}).updatedAt||0));
    h+='<section class="dmonth"><h2 class="dmonth-head">'+MONTHS[m]+' '+Y+'</h2><ul class="dlist">';
    let prev="";
    groups.forEach(g=>{const it=S.items.get(g.id);if(!it)return;let meta;
      if(g.kind==="movie"){const re=fw[g.id]===""||(fw[g.id]&&g.date>fw[g.id]);
        meta=scorePill(it)+(lovedOf(it)?'<span class="dheart" aria-label="Loved">♥</span>':"")+(re?'<span class="drewatch" title="Rewatch" aria-label="Rewatch">'+ICON.rewatch+'</span>':"")+confBadge(g.c)+(!scoreOf(it)&&!re&&g.c==="confirmed"?'<span class="dsub">Film</span>':"");}
      else{const e=g.eps.sort((a,b)=>a.s-b.s||a.e-b.e);
        meta=(e.length===1?'<span class="dsub"><b class="mono">'+code(e[0].s,e[0].e)+'</b> '+esc(e[0].t||"")+'</span>':'<span class="dsub"><b class="mono">'+code(e[0].s,e[0].e)+'–'+(e[0].s===e[e.length-1].s?"E"+pad(e[e.length-1].e):code(e[e.length-1].s,e[e.length-1].e))+'</b> '+e.length+' episodes</span>')+confBadge(g.c);}
      const show=g.date!==prev;prev=g.date;
      h+='<li>'+diaryRow(it,g.id,show?String(+g.date.slice(8)):"",(show?"":"same")+(g.c!=="confirmed"?" unsure":""),meta)+'</li>';
    });
    h+='</ul></section>';
  }
  return h;
}
function yearBar(){
  const nowY=new Date().getFullYear();const years=diaryEntries().map(x=>+x.date.slice(0,4)).filter(Boolean);const minY=Math.min(nowY,...years);const Y=S.diaryYear;
  return'<div class="yearbar"><button type="button" data-a="year" data-v="-1" aria-label="Previous year" '+(Y<=minY?"disabled":"")+'>'+ICON.back+'</button><span class="mono" style="font-weight:500;min-width:3.2em;text-align:center">'+Y+'</span><button type="button" data-a="year" data-v="1" aria-label="Next year" '+(Y>=nowY?"disabled":"")+'>'+ICON.next+'</button></div>';
}
function undatedView(und){
  if(!und.length)return'<div class="empty"><p>Movies you log without a date collect here. Put them in the order you watched them, most recent at the top.</p></div>';
  let h='<p class="undated-note">Most recent at the top. Use the arrows to put them in the order you watched them.</p><section class="dmonth"><ul class="dlist">';
  und.forEach((x,i)=>{const it=S.items.get(x.id);if(!it)return;
    const meta=scorePill(it)+(lovedOf(it)?'<span class="dheart" aria-label="Loved">♥</span>':"")+confBadge(x.c)+(!scoreOf(it)&&x.c==="confirmed"?'<span class="dsub">Film</span>':"");
    h+='<li class="drow-wrap">'+diaryRow(it,x.id,String(und.length-i),"undated",meta)+'<span class="reorder"><button type="button" data-a="moveUndated" data-i="'+i+'" data-v="-1" aria-label="Move up" '+(i===0?"disabled":"")+'>'+ICON.up+'</button><button type="button" data-a="moveUndated" data-i="'+i+'" data-v="1" aria-label="Move down" '+(i===und.length-1?"disabled":"")+'>'+ICON.down+'</button></span></li>';
  });
  return h+'</ul></section>';
}
function tabbar(){
  const t=(k,l,i)=>'<button class="tab" type="button" data-a="tab" data-v="'+k+'" '+(S.tab===k?'aria-current="page"':"")+'>'+ICON[i]+l+'</button>';
  return'<nav class="tabbar" aria-label="Sections"><div class="wrap">'+t("shows","Shows","tv")+t("movies","Movies","film")+t("diary","Diary","cal")+'</div></nav>';
}

/* ---------- sheets ---------- */
function sheetShell(body,opts){
  opts=opts||{};
  return'<div class="sheet'+(opts.enter?" enter":"")+'" role="dialog" aria-modal="true" aria-label="'+esc(opts.label||"")+'">'+
    (opts.wash?'<div class="wash" style="background:linear-gradient(180deg,'+opts.wash+' 0%,var(--bg) 100%)"></div>':"")+
    '<div class="sheet-bar"><button class="icon-btn" type="button" data-a="close" aria-label="Close">'+(opts.icon||ICON.down)+'</button>'+(opts.right||"")+'</div>'+
    '<div class="sheet-body" data-scroll="sheet"><div class="wrap">'+body+'</div></div></div>';
}
function washFor(it){const h=hashHue(it.title||"x");return"hsl("+h+" 40% 88%)"}
function scaleRow(it){
  const s=scoreOf(it);
  return'<div class="rate-head"><p class="label" style="margin:0">Your score</p>'+(lovedOf(it)?'<span class="loved">'+ICON.heart+'Loved</span>':"")+'</div>'+
  '<div class="scale" role="group" aria-label="Score out of 10">'+[1,2,3,4,5,6,7,8,9,10].map(n=>'<button type="button" class="'+(n===s?"on":n<s?"fill":"")+'" data-a="rate" data-v="'+n+'" aria-pressed="'+(n===s)+'">'+n+'</button>').join("")+'</div>'+
  '<p class="hint">'+(s?"You gave it "+s+" out of 10. Tap "+s+" again to clear.":"Tap a number to score it.")+' A 9 or 10 adds a heart.</p>';
}
function heroBlock(it,meta){
  return'<div class="hero"><button class="poster-btn" type="button" data-a="openPicker" aria-label="Change cover">'+cover(it,"","w342")+'<span class="chg">Change</span></button><div><h2>'+esc(it.title)+'</h2><div class="meta">'+meta+'</div></div></div>'+(it.blurb?'<p class="blurb">'+esc(it.blurb.length>320?it.blurb.slice(0,317)+"…":it.blurb)+'</p>':"");
}
function dangerZone(it){
  if(S.confirm==="delete")return'<div class="danger-zone"><p>Delete <b>'+esc(it.title)+'</b> and everything you\'ve logged for it?</p><button class="btn danger" type="button" data-a="doDelete">Delete</button><button class="btn ghost" type="button" data-a="cancelConfirm">Keep it</button></div>';
  return'<div class="danger-zone"><button class="link" style="color:var(--s-stopped)" type="button" data-a="askDelete">Delete from diary</button></div>';
}
function showDetail(id,it,enter){
  const p=progress(it),n=nextUp(it),na=nextAiring(it);
  const seasons=(it.seasons||[]).slice().sort((a,b)=>a.n-b.n);
  if(S.season==null||!seasons.some(s=>s.n===S.season))S.season=n?n.s:(seasons[0]?seasons[0].n:null);
  const cs=seasons.find(s=>s.n===S.season);
  let b=heroBlock(it,[it.year?'<span class="mono">'+esc(it.year)+'</span>':"",esc(it.by),esc(it.genre),it.status?esc(it.status):""].filter(Boolean).join(" · "));
  b+='<p class="label">Shelf</p>'+chips(SHOW_SHELVES,it.shelf,null,"setShelf")+scaleRow(it);
  b+='<div class="progress"><div class="top"><span><b>'+p.w+'</b> of '+p.total+' aired episodes</span><span class="mono">'+(p.total?Math.round(p.w/p.total*100):0)+'%</span></div><div class="bar"><span style="width:'+(p.total?p.w/p.total*100:0)+'%"></span></div></div>';
  if(n)b+='<div class="card nextup"><div><p class="label" style="margin-bottom:4px">Next up</p><div class="code">'+code(n.s,n.e.n)+'</div><div class="ep">'+esc(n.e.t||"Episode "+n.e.n)+'</div></div><button class="btn primary" type="button" data-a="toggleEp" data-s="'+n.s+'" data-e="'+n.e.n+'">Watched</button></div>';
  else if(p.total)b+='<div class="card nextup"><div><p class="label" style="margin-bottom:4px">All caught up</p><div class="ep">'+(na?"Next episode airs "+esc(fmtDate(na.e.a)):ended(it)?"You've seen every episode.":"No new episodes announced yet.")+'</div></div></div>';
  if(seasons.length)b+='<div class="seasons" data-scroll="seasons">'+seasons.map(s=>{const ae=s.eps.filter(aired);const w=ae.filter(isW).length;return'<button class="spill'+(ae.length&&w===ae.length?" done":"")+'" type="button" data-a="season" data-v="'+s.n+'" aria-pressed="'+(s.n===S.season)+'"><b>Season '+s.n+'</b><span>'+w+'/'+ae.length+(ae.length<s.eps.length?" +"+(s.eps.length-ae.length):"")+'</span></button>'}).join("")+'</div>';
  if(cs){
    const ae=cs.eps.filter(aired);const w=ae.filter(isW).length,all=ae.length>0&&w===ae.length;
    b+='<div class="season-head"><h3>Season '+cs.n+'</h3>'+(all?'<button class="link" type="button" data-a="unmarkSeason">Unmark season</button>':ae.length?'<button class="link" type="button" data-a="markAsk">Mark season watched</button>':"")+'</div>';
    if(S.markAsk===cs.n)b+='<div class="choice"><span>When did you watch it?</span><button class="btn primary" type="button" data-a="markSeason" data-v="today">Today</button><button class="btn ghost" type="button" data-a="markSeason" data-v="nodate">Before, no date</button></div>';
    b+='<ul class="eps">'+cs.eps.slice().sort((a,b)=>a.n-b.n).map(e=>{const wd=isW(e),fut=!aired(e);
      return'<li class="ep'+(wd?" w":"")+(fut?" future":"")+'"><button class="tick" type="button" data-a="toggleEp" data-s="'+cs.n+'" data-e="'+e.n+'" aria-pressed="'+wd+'" aria-label="'+(wd?"Unmark ":"Mark ")+code(cs.n,e.n)+'" '+(fut?"disabled":"")+'>'+ICON.check+'</button>'+
        '<span class="et"><span class="code">E'+pad(e.n)+(e.a&&!fut?" · "+esc(fmtDate(e.a)):"")+'</span><span class="name">'+esc(e.t||"Episode "+e.n)+'</span></span>'+
        (fut?'<span class="airs">Airs '+esc(fmtDate(e.a))+'</span>':wd?'<label class="when"><span>'+(e.w?esc(fmtDate(e.w)):"Seen")+'</span><input type="date" aria-label="Date watched for '+code(cs.n,e.n)+'" data-c="epDate" data-s="'+cs.n+'" data-e="'+e.n+'" value="'+esc(e.w||"")+'" max="'+today()+'"></label>':"<span></span>")+'</li>'}).join("")+'</ul>';
  }else b+='<div class="card"><p style="margin:0;color:var(--muted)">No episodes listed yet.</p></div>';
  b+='<div class="tools"><button class="btn ghost" type="button" data-a="refreshShow" '+(S.refreshing?"disabled":"")+'>'+(S.refreshing?'<span class="spin"></span>Checking…':"Check for new episodes")+'</button><button class="btn ghost" type="button" data-a="openPicker">Change cover</button></div>';
  b+=dangerZone(it);
  return sheetShell(b,{enter,wash:washFor(it),label:it.title});
}
function movieDetail(id,it,enter){
  let b=heroBlock(it,[it.year?'<span class="mono">'+esc(it.year)+'</span>':"",it.by?"Directed by "+esc(it.by):"",it.runtime?'<span class="mono">'+it.runtime+' min</span>':"",esc(it.genre)].filter(Boolean).join(" · "));
  b+='<p class="label">Shelf</p>'+chips(MOVIE_SHELVES,it.shelf,null,"setShelf")+scaleRow(it);
  const ws=watchesOf(it).map((w,i)=>[w,i]).sort((a,b)=>(b[0].d||"").localeCompare(a[0].d||"")||(b[0].o||0)-(a[0].o||0));
  b+='<p class="label">Watches</p>'+(ws.length?'<ul class="watches">'+ws.map(([w,i])=>'<li><span class="wd">'+(w.d?esc(longDate(w.d)):"Undated")+'</span>'+
    '<button type="button" class="conf-btn" data-a="cycleConf" data-v="'+i+'" aria-label="Confidence: '+(w.c||"confirmed")+'. Tap to change">'+(confBadge(w.c)||'<span class="conf conf-confirmed">Confirmed</span>')+'</button>'+
    '<button type="button" class="wx" data-a="removeWatch" data-v="'+i+'" aria-label="Remove this watch">'+ICON.x.replace("<svg",'<svg width="14" height="14"')+'</button></li>').join("")+'</ul><p class="hint">Tap a tag to change how sure you are.</p>':'<p class="hint" style="margin-bottom:10px">No watches logged yet.</p>');
  b+='<div class="logbox"><p class="label" style="margin:0">Log a watch</p>'+
    '<label class="toggle-line"><input id="log-nodate" type="checkbox" data-c="logNoDate" '+(S.logNoDate?"checked":"")+'>I don\'t know the date</label>'+
    (S.logNoDate?'<p class="hint" style="margin:0">It goes to the top of your Undated list, where you can reorder it.</p>':'<input id="watch-date" type="date" value="'+today()+'" max="'+today()+'" aria-label="Date watched">')+
    '<div class="seg sm" role="group" aria-label="How sure are you">'+CONF.map(([k,l])=>'<button type="button" data-a="logConf" data-v="'+k+'" aria-pressed="'+(S.logConf===k)+'">'+l+'</button>').join("")+'</div>'+
    '<button class="btn primary" type="button" data-a="logWatch">Log watch</button></div>';
  b+='<p class="label">Notes</p><textarea id="notes" data-c="notes" placeholder="What stayed with you?">'+esc(it.notes||"")+'</textarea>';
  b+=dangerZone(it);
  return sheetShell(b,{enter,wash:washFor(it),label:it.title});
}
function addSheet(enter){
  const A=S.add;
  let b='<h2 style="font:800 28px/1.05 var(--f-display);letter-spacing:-.03em;margin:4px 0 14px">Add to your diary</h2>';
  b+='<form class="search" data-f="search" role="search"><input id="q" type="search" autocomplete="off" enterkeyhint="search" placeholder="Search movies and shows" value="'+esc(A.q)+'" aria-label="Title"></form>';
  if(A.phase==="searching")b+='<p class="status"><span class="spin"></span>Searching…</p>';
  if(A.phase==="loading")b+='<p class="status"><span class="spin"></span>Adding '+esc(A.loadingTitle)+'…</p>';
  if(A.phase==="error")b+='<p class="status">'+esc(A.err)+'</p>';
  if(A.results&&A.results.length&&A.phase!=="loading"){
    b+='<ul class="results">'+A.results.map((r,i)=>{const kind=r.media_type==="tv"?"show":"movie";const id=kind+"-"+r.id;const have=S.items.has(id);
      const fake={kind,title:r.title||r.name,year:((r.release_date||r.first_air_date||"").slice(0,4)),poster:r.poster_path};
      return'<li><button type="button" data-a="pick" data-v="'+i+'">'+cover(fake,"","w92")+'<span><span class="result-badge">'+(kind==="show"?"Series":"Film")+(have?" · in your diary":"")+'</span><br><span class="rt">'+esc(fake.title)+'</span> <span class="rm">'+esc(fake.year)+'</span></span></button></li>'}).join("")+'</ul>';
  }else if(A.phase==="results")b+='<p class="status">No matches. Check the spelling or try fewer words.</p>';
  return sheetShell(b,{enter,label:"Add",icon:ICON.x});
}
function pickerSheet(enter){
  const P=S.picker;const it=S.items.get(P.id);if(!it)return"";
  let b='<h2 style="font:800 24px/1.1 var(--f-display);letter-spacing:-.02em;margin:4px 0 6px">Choose a cover</h2><p class="hint">'+esc(it.title)+(P.posters?" · "+P.posters.length+" posters":"")+'</p>';
  if(P.loading)b+='<p class="status"><span class="spin"></span>Loading posters…</p>';
  else if(P.err)b+='<p class="status">'+esc(P.err)+'</p>';
  else if(!P.posters.length)b+='<p class="status">TMDB doesn\'t have other posters for this one.</p>';
  else b+='<div class="picker">'+P.posters.map((p,i)=>'<button type="button" data-a="setPoster" data-v="'+i+'" aria-pressed="'+(p.file_path===it.poster)+'" aria-label="Poster '+(i+1)+'"><div class="cover img">'+'<img src="'+img(p.file_path,"w185")+'" alt="" loading="lazy">'+'</div>'+(p.iso_639_1?'<span class="lang">'+esc(p.iso_639_1)+'</span>':"")+'</button>').join("")+'</div>';
  return sheetShell(b,{enter,label:"Choose a cover",icon:ICON.back});
}
function settingsSheet(enter){
  const n=S.items.size;
  let b='<div class="settings"><h2 style="font:800 26px/1.1 var(--f-display);letter-spacing:-.02em;margin:4px 0 14px">Settings</h2>'+
    '<div class="row-s"><span>Signed in as<br><b>'+esc(S.user&&S.user.email)+'</b></span><button class="btn ghost" type="button" data-a="signOut">Sign out</button></div>'+
    '<div class="row-s"><span>Backup<br><span class="hint" style="margin:0">'+n+' titles</span></span><button class="btn ghost" type="button" data-a="exportJson">Download backup</button></div>'+
    '<p class="attribution">Movie and TV data and images from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div>';
  return sheetShell(b,{enter,label:"Settings",icon:ICON.x});
}

/* ---------- render ---------- */
const app=document.getElementById("app"),layer=document.getElementById("layer");
function isTyping(){const a=document.activeElement;return!!a&&layer.contains(a)&&(a.tagName==="TEXTAREA"||(a.tagName==="INPUT"&&/^(text|search|number|email|password)$/.test(a.type)))}
function render(){
  if(isTyping()){S.renderPending=true;return}
  S.renderPending=false;
  const scroll={};document.querySelectorAll("[data-scroll]").forEach(el=>scroll[el.dataset.scroll]=[el.scrollTop,el.scrollLeft]);
  const libFocused=document.activeElement&&document.activeElement.id==="libq";
  if(!S.authReady){app.innerHTML='<main class="login"><span class="spin"></span></main>';layer.innerHTML="";return}
  if(!S.user){
    const keep={e:(document.getElementById("au-email")||{}).value,p:(document.getElementById("au-pw")||{}).value};
    app.innerHTML=loginView();layer.innerHTML="";
    if(keep.e)document.getElementById("au-email").value=keep.e;if(keep.p)document.getElementById("au-pw").value=keep.p;return;
  }
  let main;
  if(!S.loaded)main=loading();
  else if(!S.items.size)main=firstRun();
  else main=S.tab==="shows"?showsView():S.tab==="movies"?moviesView():diaryView();
  app.innerHTML=topbar()+'<main class="wrap">'+main+'</main>'+tabbar();
  if(libFocused){const i=document.getElementById("libq");if(i){i.focus();const v=i.value;i.setSelectionRange(v.length,v.length)}}
  let key="",html="";
  if(S.settings){key="settings";html=settingsSheet(S.lastSheet!==key)}
  else if(S.picker){key="picker";html=pickerSheet(S.lastSheet!==key)}
  else if(S.add){key="add";html=addSheet(S.lastSheet!==key)}
  else if(S.openId&&S.items.get(S.openId)){key="item:"+S.openId;const it=S.items.get(S.openId);html=it.kind==="show"?showDetail(S.openId,it,S.lastSheet!==key):movieDetail(S.openId,it,S.lastSheet!==key)}
  else if(S.openId)S.openId=null;
  if(S.lastSheet!==key&&key){delete scroll.sheet;delete scroll.seasons}
  const reopened=S.lastSheet!==key;S.lastSheet=key;
  layer.innerHTML=html;
  document.documentElement.classList.toggle("locked",!!key);
  document.querySelectorAll("[data-scroll]").forEach(el=>{const v=scroll[el.dataset.scroll];if(v){el.scrollTop=v[0];el.scrollLeft=v[1]}});
  if(key==="add"&&reopened){const q=document.getElementById("q");if(q&&!S.add.q)setTimeout(()=>q.focus(),60)}
  if(key.startsWith("item:")&&!scroll.seasons){const sp=layer.querySelector('.spill[aria-pressed="true"]');const box=layer.querySelector(".seasons");if(sp&&box)box.scrollLeft=Math.max(0,sp.offsetLeft-box.clientWidth/2+sp.clientWidth/2)}
}
function renderLib(){const el=document.getElementById("lib");if(!el)return render();el.innerHTML=S.tab==="shows"?showsBody():moviesBody()}
document.addEventListener("focusout",()=>setTimeout(()=>{if(S.renderPending&&!isTyping())render()},0));

/* ---------- search (add) ---------- */
let searchTimer=null,searchSeq=0;
function queueSearch(q){
  S.add.q=q;clearTimeout(searchTimer);
  if(q.trim().length<2){S.add.results=[];S.add.phase="idle";refreshAddList();return}
  searchTimer=setTimeout(()=>runSearch(q),280);
}
async function runSearch(q){
  const A=S.add;if(!A)return;const seq=++searchSeq;A.phase="searching";refreshAddList();
  try{
    const r=await tmdb("/search/multi",{query:q.trim(),include_adult:"false"});
    if(seq!==searchSeq||S.add!==A)return;
    A.results=(r.results||[]).filter(x=>x.media_type==="movie"||x.media_type==="tv").slice(0,12);A.phase="results";
  }catch(e){if(seq!==searchSeq||S.add!==A)return;A.phase="error";A.err="Search isn't working right now. Check your connection and try again."}
  refreshAddList();
}
function refreshAddList(){
  if(!S.add)return;
  const body=layer.querySelector(".sheet-body .wrap");if(!body){render();return}
  const tmp=document.createElement("div");tmp.innerHTML=addSheet(false);
  const fresh=tmp.querySelector(".sheet-body .wrap");
  [...body.children].forEach(ch=>{if(ch.tagName!=="FORM"&&ch.tagName!=="H2")ch.remove()});
  [...fresh.children].forEach(ch=>{if(ch.tagName!=="FORM"&&ch.tagName!=="H2")body.appendChild(ch)});
}
async function pickResult(i){
  const A=S.add;const r=A.results[i];if(!r)return;
  const kind=r.media_type==="tv"?"show":"movie";const id=kind+"-"+r.id;
  if(S.items.has(id)){S.add=null;openItem(id);return}
  if(document.activeElement)document.activeElement.blur();
  A.phase="loading";A.loadingTitle=r.title||r.name;render();
  try{
    const doc=await buildFromTmdb(kind,r.id);
    if(S.add!==A)return;
    S.add=null;save(id,doc);openItem(id);
  }catch(e){if(S.add!==A)return;A.phase="error";A.err="Couldn't load that title from TMDB. Try again.";render()}
}

/* ---------- poster picker ---------- */
async function openPicker(){
  const id=S.openId;const it=S.items.get(id);if(!it||!it.tmdb)return;
  S.picker={id,loading:true,posters:[]};render();
  try{
    const r=await tmdb("/"+(it.kind==="show"?"tv":"movie")+"/"+it.tmdb+"/images");
    let ps=(r.posters||[]).slice();
    const rank=p=>(p.iso_639_1==="en"?0:p.iso_639_1==null?1:2);
    ps.sort((a,b)=>rank(a)-rank(b)||(b.vote_average||0)-(a.vote_average||0));
    if(it.poster&&!ps.some(p=>p.file_path===it.poster))ps.unshift({file_path:it.poster,iso_639_1:null});
    if(S.picker&&S.picker.id===id){S.picker.posters=ps.slice(0,120);S.picker.loading=false;render()}
  }catch(e){if(S.picker){S.picker.loading=false;S.picker.err="Couldn't load posters from TMDB. Try again.";render()}}
}

/* ---------- actions ---------- */
function openItem(id){S.openId=id;S.season=null;S.confirm=null;S.markAsk=null;S.logNoDate=false;S.logConf="confirmed";render();
  const it=S.items.get(id);if(it&&it.kind==="show"&&!ended(it)&&(!it.refreshedAt||Date.now()-it.refreshedAt>2*864e5))refreshShow(id,true)}
const A={
  authMode:d=>{S.authMode=d.v;S.authErr="";S.authMsg="";render()},
  resetPw:()=>resetPassword(),
  tab:d=>{S.tab=d.v;S.q="";savePrefs();window.scrollTo(0,0);render()},
  showShelf:d=>{S.showShelf=d.v;savePrefs();render()},
  movieShelf:d=>{S.movieShelf=d.v;savePrefs();render()},
  dfilter:d=>{S.diaryFilter=d.v;render()},
  dview:d=>{S.diaryView=d.v;savePrefs();render()},
  year:d=>{S.diaryYear+=+d.v;render()},
  open:d=>openItem(d.id),
  close:()=>{if(S.settings)S.settings=false;else if(S.picker)S.picker=null;else if(S.add)S.add=null;else S.openId=null;render()},
  openAdd:()=>{S.add={q:"",phase:"idle",results:[]};render()},
  openSettings:()=>{S.settings=true;render()},
  signOut:async()=>{S.settings=false;S.openId=null;try{localStorage.removeItem(cacheKey())}catch(e){}await sb.auth.signOut();setUser(null)},
  exportJson:()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),items:Object.fromEntries(S.items)},null,1)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="watch-diary-backup-"+today()+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)},
  pick:d=>pickResult(+d.v),
  openPicker:()=>openPicker(),
  setPoster:d=>{const P=S.picker;const p=P&&P.posters[+d.v];if(!p)return;const it=clone(P.id);it.poster=p.file_path;S.picker=null;save(P.id,it);toast("Cover updated")},
  watchNext:d=>{const it=S.items.get(d.id);const n=it&&nextUp(it);if(n){toggleEp(d.id,n.s,n.e.n);if((S.items.get(d.id)||{}).shelf!=="completed")toast("Marked "+code(n.s,n.e.n)+" watched",{label:"Undo",fn:()=>setEps(d.id,[[n.s,n.e.n]],null)})}},
  toggleEp:d=>toggleEp(S.openId,+d.s,+d.e),
  season:d=>{S.season=+d.v;S.markAsk=null;render()},
  markAsk:()=>{S.markAsk=S.season;render()},
  markSeason:d=>{const it=S.items.get(S.openId);const s=it.seasons.find(x=>x.n===S.season);S.markAsk=null;setEps(S.openId,s.eps.filter(e=>aired(e)&&!isW(e)).map(e=>[s.n,e.n]),d.v==="today"?today():"")},
  unmarkSeason:()=>{const it=S.items.get(S.openId);const s=it.seasons.find(x=>x.n===S.season);const prev=s.eps.map(e=>[e.n,e.w,e.c]);const id=S.openId,sn=s.n;
    setEps(id,s.eps.map(e=>[s.n,e.n]),null);
    toast("Season "+sn+" unmarked",{label:"Undo",fn:()=>{const c=clone(id);const se=c.seasons.find(x=>x.n===sn);prev.forEach(([n,w,cf])=>{const e=se.eps.find(x=>x.n===n);if(e){e.w=w;if(cf)e.c=cf}});autoShelf(c,true);save(id,c)}})},
  setShelf:d=>{const it=clone(S.openId);it.shelf=d.v;save(S.openId,it)},
  rate:d=>{const n=+d.v;const it=clone(S.openId);it.score=scoreOf(it)===n?0:n;save(S.openId,it)},
  logConf:d=>{S.logConf=d.v;render()},
  cycleConf:d=>{const it=clone(S.openId);const w=it.watches[+d.v];if(!w)return;const order=CONF.map(x=>x[0]);w.c=order[(order.indexOf(w.c||"confirmed")+1)%order.length];save(S.openId,it)},
  logWatch:()=>{
    const it=clone(S.openId);it.watches=watchesOf(it);
    if(S.logNoDate){let max=0;for(const[,x]of S.items)if(x.kind==="movie")watchesOf(x).forEach(w=>{if(!w.d&&(w.o||0)>max)max=w.o});it.watches.push({d:"",c:S.logConf,o:max+1})}
    else{const v=(document.getElementById("watch-date")||{}).value||today();if(v>today()){toast("That date is in the future.");return}it.watches.push({d:v,c:S.logConf})}
    it.shelf="watched";save(S.openId,it);toast(S.logNoDate?"Added to Undated":"Watch logged");S.logNoDate=false;S.logConf="confirmed";render()},
  removeWatch:d=>{const id=S.openId;const it=clone(id);const i=+d.v;const was=it.watches[i];if(!was)return;it.watches.splice(i,1);save(id,it);
    toast("Watch removed",{label:"Undo",fn:()=>{const c=clone(id);c.watches=watchesOf(c).concat(was);save(id,c)}})},
  moveUndated:d=>{const und=undatedEntries();const i=+d.i,j=i+(+d.v);const a=und[i],b=und[j];if(!a||!b)return;
    const ao=a.o,bo=b.o;
    if(a.id===b.id){const it=clone(a.id);it.watches[a.wi].o=bo;it.watches[b.wi].o=ao;save(a.id,it)}
    else{const ia=clone(a.id),ib=clone(b.id);ia.watches[a.wi].o=bo;ib.watches[b.wi].o=ao;save(a.id,ia);save(b.id,ib)}},
  refreshShow:()=>refreshShow(S.openId,false),
  askDelete:()=>{S.confirm="delete";render()},
  cancelConfirm:()=>{S.confirm=null;render()},
  doDelete:()=>{const id=S.openId;const t=(S.items.get(id)||{}).title;S.openId=null;S.confirm=null;removeItem(id);toast("Deleted "+t)},
  toastAct:()=>{const a=toastAction;document.getElementById("toast").innerHTML="";toastAction=null;if(a)a.fn()}
};
document.addEventListener("click",e=>{
  const el=e.target.closest("[data-a]");if(!el)return;
  const fn=A[el.dataset.a];if(!fn)return;
  e.preventDefault();
  if(isTyping()&&el.dataset.a!=="pick")document.activeElement.blur();
  fn(el.dataset);
});
document.addEventListener("submit",e=>{
  e.preventDefault();const f=e.target.dataset.f;
  if(f==="auth")doAuth();
  else if(f==="search"){const q=(document.getElementById("q")||{}).value||"";clearTimeout(searchTimer);if(document.activeElement)document.activeElement.blur();runSearch(q)}
});
document.addEventListener("input",e=>{
  const el=e.target;
  if(el.id==="q"&&S.add)queueSearch(el.value);
  else if(el.id==="libq"){S.q=el.value;renderLib()}
});
document.addEventListener("change",e=>{
  const el=e.target;const c=el.dataset&&el.dataset.c;if(!c)return;
  if(c==="epDate"){const id=S.openId;const it=clone(id);const ep=findEp(it,+el.dataset.s,+el.dataset.e);if(ep){ep.w=el.value||"";save(id,it)}}
  else if(c==="notes"){const it=clone(S.openId);if((it.notes||"")!==el.value){it.notes=el.value.slice(0,5000);save(S.openId,it)}}
  else if(c==="logNoDate"){S.logNoDate=el.checked;render()}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&(S.add||S.openId||S.picker||S.settings))A.close()});

render();initAuth();
})();
