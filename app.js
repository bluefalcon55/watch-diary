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
  ticket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M9 7v10" stroke-dasharray="1.6 2"/></svg>',
  rewatch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/></svg>'
};

/* ---------- state ---------- */
const S={user:null,authReady:false,authMode:"signin",authMsg:"",authErr:"",items:new Map(),loaded:false,
  tab:"shows",showShelf:"watching",movieShelf:"watched",q:"",openId:null,season:null,diaryYear:new Date().getFullYear(),
  diaryFilter:"all",diaryView:"dated",add:null,picker:null,settings:false,confirm:null,markAsk:null,refreshing:false,
  logNoDate:false,logConf:"confirmed",renderPending:false,lastSheet:"",offline:false};
try{const p=JSON.parse(localStorage.getItem("wd-prefs")||"{}");["tab","showShelf","movieShelf","diaryView","sortBy"].forEach(k=>{if(p[k])S[k]=p[k]})}catch(e){}
function savePrefs(){try{localStorage.setItem("wd-prefs",JSON.stringify({tab:S.tab,showShelf:S.showShelf,movieShelf:S.movieShelf,diaryView:S.diaryView,sortBy:S.sortBy}))}catch(e){}}

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
function snum(n){return n===0?9999:n}
function sname(n){return n===0?"Specials":"Season "+n}
function allEps(it){const out=[];(it.seasons||[]).slice().sort((a,b)=>snum(a.n)-snum(b.n)).forEach(s=>(s.eps||[]).slice().sort((a,b)=>a.n-b.n).forEach(e=>out.push({s:s.n,e})));return out}
function airedEps(it){return allEps(it).filter(x=>aired(x.e))}
function progress(it){const a=airedEps(it);return{w:a.filter(x=>isW(x.e)).length,total:a.length}}
/* Next episode = the first aired, unwatched one after the last episode you watched.
   Skipped older episodes (e.g. early seasons of Alone) don't count against being caught up. */
function rewatched(e,from){return!!((e.w&&e.w>=from)||(e.rw||[]).some(r=>r.d&&r.d>=from))}
function nextRewatch(it){const f=it.rewatch&&it.rewatch.from;if(!f)return null;return airedEps(it).find(x=>!rewatched(x.e,f))||null}
function rewatchProgress(it){const f=it.rewatch&&it.rewatch.from;const a=airedEps(it);return{w:f?a.filter(x=>rewatched(x.e,f)).length:0,total:a.length}}
function nextUp(it){if(it.rewatch&&it.rewatch.from)return nextRewatch(it);const a=airedEps(it);let last=-1;a.forEach((x,i)=>{if(isW(x.e))last=i});for(let i=last+1;i<a.length;i++)if(!isW(a[i].e))return a[i];return null}
function nextAiring(it){const f=allEps(it).filter(x=>!aired(x.e)&&x.e.a).sort((a,b)=>a.e.a.localeCompare(b.e.a));return f[0]||null}
function ended(it){return it.status==="Ended"||it.status==="Canceled"}
function findEp(it,s,e){const se=(it.seasons||[]).find(x=>x.n===s);return se&&se.eps.find(x=>x.n===e)}
function clone(id){return JSON.parse(JSON.stringify(S.items.get(id)))}
function list(kind){return[...S.items].filter(([,it])=>it&&it.kind===kind)}
function lastWatch(it){if(it.kind==="movie")return watchesOf(it).map(w=>w.d).filter(Boolean).sort().pop()||"";let m="";(it.seasons||[]).forEach(s=>s.eps.forEach(e=>{if(e.w&&e.w>m)m=e.w}));return m}
function norm(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/&/g," and ").replace(/[^a-z0-9]+/g," ").trim()}
function sqz(s){return norm(s).replace(/\s+/g,"")}
function monYear(s){const[y,m]=s.split("-").map(Number);return MONTHS[m-1].slice(0,3)+" "+y}
function windowText(lo,hi){
  if(!lo&&!hi)return"Date unknown";
  if(!lo||!hi||lo===hi)return longDate(lo||hi);
  const[ly,lm]=lo.split("-"),[hy,hm]=hi.split("-");
  if(ly===hy&&lm===hm)return MONTHS[+lm-1]+" "+ly;
  if(ly===hy)return MONTHS[+lm-1].slice(0,3)+" – "+MONTHS[+hm-1].slice(0,3)+" "+ly;
  return monYear(lo)+" – "+monYear(hi);
}
/* Theater tag, per viewing. Imported titles marked "seen in a theater" carry it on their
   first viewing until changed by hand (w.th set to true/false). */
function isFirstViewing(it,w){const ws=watchesOf(it);const u=ws.find(x=>!x.d);if(u)return u===w;const f=ws.filter(x=>x.d&&!x.r).sort((a,b)=>a.d.localeCompare(b.d))[0]||ws.filter(x=>x.d).sort((a,b)=>a.d.localeCompare(b.d))[0];return f===w}
function inTheater(it,w){return w.th!==undefined?!!w.th:(!!it.theater&&isFirstViewing(it,w))}
function anyTheater(it){return it.kind==="movie"&&watchesOf(it).some(w=>inTheater(it,w))}
function thTag(small){return'<span class="th-tag'+(small?" sm":"")+'">'+ICON.ticket+(small?"":"Theater")+'</span>'}
function isRewatch(it,w){if(w.r!==undefined)return!!w.r;const ws=watchesOf(it);if(ws.some(x=>!x.d))return!!w.d;const d=ws.map(x=>x.d).sort();return w.d>d[0]}
function countLine(it){
  const ws=watchesOf(it);const n=ws.length;if(!n)return"";
  const complete=it.vc?!!it.vc.complete:!it.imp;
  if(complete)return n===1?"Watched once":"Watched "+n+" times";
  return n===1?"1 recorded viewing · may be more":"At least "+n+" viewings";
}
function sortKey(it){return lastWatch(it)||(it.first&&it.first.hi)||""}

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
/* TMDB refuses bursts (429 + dropped connections), so every request is spaced out
   and retried with backoff. A request that still fails throws: callers must treat
   that as "try again later", never as "no match". */
let tmdbGate=Promise.resolve();
function tmdbSlot(){const p=tmdbGate.then(()=>new Promise(r=>setTimeout(r,55)));tmdbGate=p;return p}
class NotFound extends Error{}
async function tmdb(path,params){
  const u=new URL("https://api.themoviedb.org/3"+path);
  Object.entries(params||{}).forEach(([k,v])=>u.searchParams.set(k,v));
  const key=u.toString();if(tmdbCache.has(key))return tmdbCache.get(key);
  let last="";
  for(let a=0;a<7;a++){
    await tmdbSlot();
    let r;
    try{r=await fetch(key,{headers:{Authorization:"Bearer "+CFG.tmdb,accept:"application/json"}})}catch(e){r=null;last="connection"}
    if(r&&r.ok){const j=await r.json();tmdbCache.set(key,j);return j}
    if(r&&r.status===404)throw new NotFound("TMDB 404");
    if(r&&r.status!==429&&r.status<500)throw new Error("TMDB "+r.status);
    if(r)last=String(r.status);
    await new Promise(res=>setTimeout(res,Math.min(16000,800*Math.pow(2,a))+Math.random()*400));
  }
  throw new Error("TMDB unavailable ("+last+")");
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
/* Once a day at most, on app start: ask TMDB about shows you're caught up on that are
   still airing, so they move back to "Up next" by themselves when a new episode airs. */
let caughtChecked=false;
async function checkCaughtUp(){
  if(caughtChecked)return;caughtChecked=true;
  const due=[...S.items].filter(([,it])=>it.kind==="show"&&it.tmdb&&it.shelf==="watching"&&!ended(it)&&!nextUp(it)&&(!it.refreshedAt||Date.now()-it.refreshedAt>20*36e5)).map(([id])=>id);
  for(const id of due){try{await refreshShow(id,true)}catch(e){}}
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
      const eps=ns.eps.map(ne=>{const oe=os&&os.eps.find(e=>e.n===ne.n);return Object.assign({},ne,{w:oe&&oe.w!==undefined?oe.w:null},oe&&oe.c?{c:oe.c}:{},oe&&oe.s!=null?{s:oe.s}:{},oe&&oe.rw?{rw:oe.rw}:{})});
      (os?os.eps:[]).forEach(oe=>{if(!eps.some(e=>e.n===oe.n))eps.push(oe)});
      return{n:ns.n,eps:eps.sort((a,b)=>a.n-b.n)}});
    old.forEach(os=>{if(!merged.some(s=>s.n===os.n))merged.push(os)});
    cur.seasons=merged.sort((a,b)=>a.n-b.n);cur.status=d.status||cur.status;cur.refreshedAt=Date.now();
    if(!cur.poster&&d.poster_path)cur.poster=d.poster_path;
    const added=allEps(cur).length-before;
    autoShelf(cur,true);
    // only write when TMDB actually changed something (new episodes, air dates, titles, status, shelf)
    const sig=x=>JSON.stringify([x.seasons,x.status,x.shelf,x.poster]);
    if(sig(cur)!==sig(it))save(id,cur);
    else{const live=S.items.get(id);if(live)live.refreshedAt=cur.refreshedAt}
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
    migrateConfidence();
    checkCaughtUp();
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
  if(it.rewatch){it.shelf="watching";return}
  const p=progress(it);
  if(p.total&&p.w===p.total){
    if(ended(it)&&!nextAiring(it)){if(it.shelf!=="completed"){it.shelf="completed";if(!silent)toast("Finished. Moved to Completed.")}}
    else if(it.shelf==="notstarted"||it.shelf==="completed"){it.shelf="watching"}
  }else if(p.w>0&&(it.shelf==="notstarted"||it.shelf==="completed"))it.shelf="watching";
}
function setEps(id,pairs,val){const it=clone(id);pairs.forEach(([s,e])=>{const ep=findEp(it,s,e);if(ep){ep.w=val;if(val===null)delete ep.c}});autoShelf(it);save(id,it)}
/* Log a viewing of one episode: its first watch if never watched, otherwise a rewatch. */
function watchEpisode(id,s,e,date,conf){
  const it=clone(id);const ep=findEp(it,s,e);if(!ep)return null;
  let kind;
  if(!isW(ep)){ep.w=date;ep.c=conf||"confirmed";kind="first"}
  else{ep.rw=(ep.rw||[]).concat({d:date,c:conf||"confirmed"});kind="re"}
  if(it.rewatch&&!nextRewatch(it)){delete it.rewatch;it.rewatchesDone=(it.rewatchesDone||0)+1;setTimeout(()=>toast("Rewatch finished"),0)}
  autoShelf(it,true);save(id,it);return kind;
}
function undoEpisode(id,s,e,kind,date){
  const it=clone(id);const ep=findEp(it,s,e);if(!ep)return;
  if(kind==="first"){ep.w=null;delete ep.c}
  else if(ep.rw){const i=ep.rw.map(r=>r.d).lastIndexOf(date);if(i>=0)ep.rw.splice(i,1);if(!ep.rw.length)delete ep.rw}
  save(id,it);
}
function epFromMenu(){const[s,e]=(S.epMenu||"").split("x").map(Number);return{s,e}}
function toggleEp(id,s,e){
  const it=S.items.get(id);const ep=findEp(it,s,e);if(!ep)return;
  if(isW(ep)){S.epMenu=S.epMenu===s+"x"+e?null:s+"x"+e;render();return}
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


/* ---------- sort & filter (Movies / Shows) ---------- */
const SORTS={
  recent:"Recently watched",firstNew:"First watched: newest",firstOld:"First watched: oldest",
  relNew:"Release: newest",relOld:"Release: oldest",score:"Your score",title:"Title A–Z",added:"Recently added"
};
const SCORE_F={any:"Any score",loved:"9–10 (loved)",good:"7–8",low:"1–6",unrated:"Not scored"};
function midDate(lo,hi){if(!lo||!hi)return lo||hi||"";const t=(Date.parse(lo)+Date.parse(hi))/2;return new Date(t).toISOString().slice(0,10)}
function firstWatchInfo(it){
  if(it.kind==="movie"){
    const ws=watchesOf(it);
    const u=ws.find(w=>!w.d);
    if(u)return u.lo||u.hi?{d:midDate(u.lo,u.hi),approx:true}:null;
    if(it.first&&it.first.known&&it.first.date)return{d:it.first.date,approx:false};
    const firsts=ws.filter(w=>w.d).sort((a,b)=>a.d.localeCompare(b.d));
    return firsts[0]?{d:firsts[0].d,approx:(firsts[0].c||"confirmed")!=="confirmed"}:null;
  }
  let min="",undated=false;
  (it.seasons||[]).forEach(se=>se.eps.forEach(e=>{if(e.w===""){undated=true}else if(e.w&&(!min||e.w<min))min=e.w}));
  return min?{d:min,approx:undated}:null;
}
function relYear(it){return parseInt(it.year,10)||0}
function getSort(kind){return(S.sortBy&&S.sortBy[kind])||"recent"}
function getF(kind){return Object.assign({score:"any",decade:"any",fy:"any",th:"any"},(S.filt&&S.filt[kind])||{})}
function applyFilters(kind,items){
  const f=getF(kind);
  return items.filter(([,it])=>{
    const sc=scoreOf(it);
    if(f.score==="loved"&&sc<9)return false;
    if(f.score==="good"&&(sc<7||sc>8))return false;
    if(f.score==="low"&&(!sc||sc>6))return false;
    if(f.score==="unrated"&&sc)return false;
    if(f.decade!=="any"){const y=relYear(it);if(!y||Math.floor(y/10)*10!==+f.decade)return false}
    if(f.fy!=="any"){const fw=firstWatchInfo(it);if(!fw||fw.d.slice(0,4)!==f.fy)return false}
    if(f.th==="yes"&&!anyTheater(it))return false;
    return true;
  });
}
function sortItems(kind,items){
  const k=getSort(kind);
  const fw=new Map(items.map(([id,it])=>[id,(firstWatchInfo(it)||{}).d||""]));
  const lastOf=it=>kind==="movie"?sortKey(it):(lastWatch(it)||"");
  const cmp={
    recent:(a,b)=>lastOf(b[1]).localeCompare(lastOf(a[1]))||(b[1].pos||0)-(a[1].pos||0)||(b[1].updatedAt||0)-(a[1].updatedAt||0),
    firstNew:(a,b)=>(fw.get(b[0])||"").localeCompare(fw.get(a[0])||"")||(b[1].pos||0)-(a[1].pos||0),
    firstOld:(a,b)=>(fw.get(a[0])||"9999").localeCompare(fw.get(b[0])||"9999")||(a[1].pos||0)-(b[1].pos||0),
    relNew:(a,b)=>relYear(b[1])-relYear(a[1])||String(a[1].title).localeCompare(String(b[1].title)),
    relOld:(a,b)=>(relYear(a[1])||9999)-(relYear(b[1])||9999)||String(a[1].title).localeCompare(String(b[1].title)),
    score:(a,b)=>scoreOf(b[1])-scoreOf(a[1])||lastOf(b[1]).localeCompare(lastOf(a[1])),
    title:(a,b)=>String(a[1].title).replace(/^(the|a|an)\s+/i,"").localeCompare(String(b[1].title).replace(/^(the|a|an)\s+/i,""),undefined,{sensitivity:"base"}),
    added:(a,b)=>(b[1].addedAt||0)-(a[1].addedAt||0)
  }[k]||(()=>0);
  return items.slice().sort(cmp);
}
function tileNote(kind,it){
  const k=getSort(kind);
  if(k==="firstNew"||k==="firstOld"){const f=firstWatchInfo(it);return f?(f.approx?"~":"")+(f.approx?f.d.slice(0,4):fmtDate(f.d)):"First watch unknown"}
  if(k==="relNew"||k==="relOld")return it.year?String(it.year):"";
  if(k==="recent"){const l=lastWatch(it);return l?fmtDate(l):""}
  return "";
}
function controls(kind,all){
  const f=getF(kind),k=getSort(kind);
  const decades=[...new Set(all.map(([,it])=>relYear(it)).filter(Boolean).map(y=>Math.floor(y/10)*10))].sort((a,b)=>b-a);
  const years=[...new Set(all.map(([,it])=>(firstWatchInfo(it)||{}).d).filter(Boolean).map(d=>d.slice(0,4)))].sort().reverse();
  const sel=(id,c,opts,cur,label)=>'<label class="ctl"><span>'+label+'</span><select id="'+id+'" data-c="'+c+'" data-k="'+kind+'">'+opts.map(([v,l])=>'<option value="'+v+'"'+(v===cur?" selected":"")+'>'+esc(l)+'</option>').join("")+'</select></label>';
  const active=(f.score!=="any")+(f.decade!=="any")+(f.fy!=="any")+(f.th!=="any");
  return'<div class="controls">'+
    sel("sort-"+kind,"sortBy",Object.entries(SORTS),k,"Sort")+
    sel("fs-"+kind,"fScore",Object.entries(SCORE_F),f.score,"Score")+
    sel("fd-"+kind,"fDecade",[["any","Any decade"]].concat(decades.map(d=>[String(d),d+"s"])),f.decade,"Released")+
    sel("fy-"+kind,"fYear",[["any","Any year"]].concat(years.map(y=>[y,y])),f.fy,"First watched")+
    (kind==="movie"?sel("ft-"+kind,"fTh",[["any","Anywhere"],["yes","In a theater"]],f.th,"Seen"):"")+
    (active?'<button class="link" type="button" data-a="clearFilters" data-k="'+kind+'">Clear filters</button>':"")+
  '</div>';
}
function showsBody(){
  const all=list("show");const q=norm(S.q);
  const items=sortItems("show",applyFilters("show",all.filter(([,it])=>q?norm(it.title).includes(q):it.shelf===S.showShelf)));
  const fa=getF("show");const filtered=fa.score!=="any"||fa.decade!=="any"||fa.fy!=="any";
  if(!items.length){
    if(q)return'<div class="empty"><p>No shows match “'+esc(S.q)+'”.</p></div>';
    if(filtered)return'<div class="empty"><p>No shows on this shelf match these filters.</p></div>';
    const msg={watching:"Shows you're in the middle of appear here, with the next episode one tap away.",notstarted:"Shows you've added but haven't started.",paused:"Nothing on pause.",stopped:"Nothing you've given up on.",completed:"Finished shows land here."}[S.showShelf];
    return'<div class="empty"><p>'+msg+'</p><button class="btn ghost" type="button" data-a="openAdd">'+ICON.plus+'Add a show</button></div>';
  }
  if(S.showShelf==="watching"&&!q){
    // Two automatic sections: shows with an aired episode waiting, and shows you're caught up on.
    // A show moves between them by itself as you watch and as new episodes air.
    const row=([id,it])=>{
      const p=it.rewatch?rewatchProgress(it):progress(it),n=nextUp(it),na=nextAiring(it);
      const nextLine=n?'<span class="next">'+(it.rewatch?'<span class="rw" style="margin:0 6px 0 0">Rewatch</span>':"")+'<b>'+code(n.s,n.e.n)+'</b>'+esc(n.e.t||"Episode "+n.e.n)+'</span>':'<span class="next caught">'+(na?"Next episode airs "+esc(fmtDate(na.e.a)):"No new episodes announced yet")+'</span>';
      return'<div class="row'+(n?"":" row-caught")+'"><button class="open" type="button" data-a="open" data-id="'+id+'">'+cover(it,"","w185")+'<span class="info"><span class="title">'+esc(it.title)+'</span>'+nextLine+
        '<span class="bar"><span style="width:'+(p.total?Math.round(p.w/p.total*100):0)+'%"></span></span><span class="pct">'+p.w+' of '+p.total+(it.rewatch?' rewatched':' watched')+'</span></span></button>'+
        (n?'<button class="check-big" type="button" data-a="watchNext" data-id="'+id+'" aria-label="Mark '+code(n.s,n.e.n)+' watched">'+ICON.check+'</button>':'<span></span>')+'</div>';
    };
    const upNext=items.filter(([,it])=>nextUp(it));
    const caught=items.filter(([,it])=>!nextUp(it)).sort((a,b)=>{const x=nextAiring(a[1]),y=nextAiring(b[1]);return(x?x.e.a:"9999").localeCompare(y?y.e.a:"9999")});
    const sec=(t,list,empty)=>'<section class="watch-sec"><h2 class="sec-head">'+t+' <span>'+list.length+'</span></h2>'+(list.length?'<div class="rows">'+list.map(row).join("")+'</div>':'<p class="hint">'+empty+'</p>')+'</section>';
    return sec("Up next",upNext,"You're caught up on everything you're watching.")+(caught.length?sec("Caught up",caught,""):"");
  }
  return'<p class="result-count">'+items.length+' show'+(items.length===1?"":"s")+'</p><div class="grid">'+items.map(([id,it])=>{const p=progress(it);const note=tileNote("show",it);
    return'<button class="tile" type="button" data-a="open" data-id="'+id+'">'+cover(it)+'<span class="t">'+esc(it.title)+'</span><span class="m">'+(scoreOf(it)?scorePill(it)+" ":"")+(note?esc(note):p.w+'/'+p.total+' eps')+'</span></button>'}).join("")+'</div>';
}
function showsView(){
  const all=list("show");const counts={};SHOW_SHELVES.forEach(([k])=>counts[k]=0);all.forEach(([,it])=>counts[it.shelf]=(counts[it.shelf]||0)+1);
  return'<div class="head"><h1>Shows</h1><span class="count">'+all.length+' TRACKED</span></div>'+(all.length>8?filterBox("Search your shows"):"")+
    (S.q?"":chips(SHOW_SHELVES,S.showShelf,counts,"showShelf"))+controls("show",all)+'<div id="lib">'+showsBody()+'</div>';
}
function moviesBody(){
  const all=list("movie");const q=norm(S.q);
  const items=sortItems("movie",applyFilters("movie",all.filter(([,it])=>q?norm(it.title).includes(q):it.shelf===S.movieShelf)));
  const fa=getF("movie");const filtered=fa.score!=="any"||fa.decade!=="any"||fa.fy!=="any"||fa.th!=="any";
  if(!items.length){
    if(q)return'<div class="empty"><p>No movies match “'+esc(S.q)+'”.</p></div>';
    if(filtered)return'<div class="empty"><p>No movies on this shelf match these filters.</p></div>';
    return'<div class="empty"><p>'+(S.movieShelf==="watched"?"Movies you've seen go here, with your score under each poster.":"Movies you want to see go here.")+'</p><button class="btn ghost" type="button" data-a="openAdd">'+ICON.plus+'Add a movie</button></div>';
  }
  return'<p class="result-count">'+items.length+' film'+(items.length===1?"":"s")+'</p><div class="grid">'+items.map(([id,it])=>{const note=tileNote("movie",it);
    return'<button class="tile" type="button" data-a="open" data-id="'+id+'">'+cover(it)+'<span class="t">'+esc(it.title)+'</span><span class="m">'+scorePill(it)+(lovedOf(it)?' <span style="color:var(--heart)">♥</span> ':"")+(anyTheater(it)?thTag(true)+" ":"")+(note?' '+esc(note):(scoreOf(it)?"":esc(it.year||"")))+'</span></button>'}).join("")+'</div>';
}
function moviesView(){
  const all=list("movie");const counts={watched:0,watchlist:0};all.forEach(([,it])=>counts[it.shelf]=(counts[it.shelf]||0)+1);
  return'<div class="head"><h1>Movies</h1><span class="count">'+counts.watched+' WATCHED</span></div>'+(all.length>8?filterBox("Search your movies"):"")+
    (S.q?"":chips(MOVIE_SHELVES,S.movieShelf,counts,"movieShelf"))+controls("movie",all)+'<div id="lib">'+moviesBody()+'</div>';
}

function diaryEntries(){
  const out=[];
  for(const[id,it]of S.items){
    if(it.kind==="show")(it.seasons||[]).forEach(s=>(s.eps||[]).forEach(e=>{if(e.w)out.push({date:e.w,c:e.c||"confirmed",id,kind:"show",s:s.n,e:e.n,t:e.t});
      (e.rw||[]).forEach(r=>{if(r&&r.d)out.push({date:r.d,c:r.c||"confirmed",id,kind:"show",s:s.n,e:e.n,t:e.t,re:true})})}));
    else watchesOf(it).forEach((w,i)=>{if(w.d)out.push({date:w.d,c:w.c||"confirmed",id,kind:"movie",wi:i,re:isRewatch(it,w),th:inTheater(it,w)})});
  }
  return out;
}
function undatedEntries(){
  const out=[];
  for(const[id,it]of S.items)if(it.kind==="movie")watchesOf(it).forEach((w,i)=>{if(!w.d)out.push({id,wi:i,o:w.o||0,c:w.c||"confirmed",lo:w.lo||"",hi:w.hi||"",od:w.od||""})});
  return out.sort((a,b)=>(b.hi||"9999").localeCompare(a.hi||"9999")||b.o-a.o);
}
function diaryRow(it,id,box,boxCls,meta){
  const tv=it.kind==="show";
  const tag=tv?'<span class="kind-tag tv">'+ICON.tv+'TV</span>':'<span class="kind-tag film">'+ICON.film+'Film</span>';
  return'<li class="'+(tv?"row-tv":"row-film")+'"><button type="button" class="drow" data-a="open" data-id="'+id+'"><span class="dbox '+boxCls+'">'+box+'</span>'+
    '<span class="dcover">'+cover(it,"","w154")+'</span><span class="dinfo"><span class="dtitle">'+esc(it.title)+(it.year&&!tv?' <span class="dyear">'+esc(it.year)+'</span>':"")+'</span><span class="dmeta">'+tag+meta+'</span></span></button></li>';
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
  for(let m=11;m>=0;m--){
    const key=Y+"-"+pad(m+1);const me=inYear.filter(x=>x.date.startsWith(key));if(!me.length)continue;
    const groups=[];me.forEach(x=>{let g=groups.find(g=>g.date===x.date&&g.id===x.id);if(!g){g={date:x.date,id:x.id,kind:x.kind,c:x.c,eps:[],re:false};groups.push(g)}if(x.re)g.re=true;if(x.th)g.th=true;if(x.c!=="confirmed"&&g.c==="confirmed")g.c=x.c;if(x.kind==="show")g.eps.push(x)});
    groups.sort((a,b)=>b.date.localeCompare(a.date)||((S.items.get(b.id)||{}).updatedAt||0)-((S.items.get(a.id)||{}).updatedAt||0));
    h+='<section class="dmonth"><h2 class="dmonth-head">'+MONTHS[m]+' '+Y+'</h2><ul class="dlist">';
    let prev="";
    groups.forEach(g=>{const it=S.items.get(g.id);if(!it)return;let meta;
      if(g.kind==="movie"){const re=g.re;
        meta=scorePill(it)+(lovedOf(it)?'<span class="dheart" aria-label="Loved">♥</span>':"")+(g.th?thTag():"")+(re?'<span class="drewatch" title="Rewatch" aria-label="Rewatch">'+ICON.rewatch+'</span>':"")+confBadge(g.c);}
      else{const e=g.eps.sort((a,b)=>a.s-b.s||a.e-b.e);
        meta=(e.length===1?'<span class="dsub"><b class="mono">'+code(e[0].s,e[0].e)+'</b> '+esc(e[0].t||"")+'</span>':'<span class="dsub"><b class="mono">'+code(e[0].s,e[0].e)+'–'+(e[0].s===e[e.length-1].s?"E"+pad(e[e.length-1].e):code(e[e.length-1].s,e[e.length-1].e))+'</b> '+e.length+' episodes</span>')+(g.re?'<span class="drewatch" title="Rewatch" aria-label="Rewatch">'+ICON.rewatch+'</span>':"")+confBadge(g.c);}
      const show=g.date!==prev;prev=g.date;
      h+=diaryRow(it,g.id,show?String(+g.date.slice(8)):"",(show?"":"same")+(g.c!=="confirmed"?" unsure":""),meta);
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
  if(!und.length)return'<div class="empty"><p>Movies you\'ve seen without a known date collect here, in the order you watched them.</p></div>';
  let h='<p class="undated-note">'+und.length+' first watches without a date, most recent first. Each shows the window it falls in.</p>';
  let curYear=null;
  und.forEach(x=>{const it=S.items.get(x.id);if(!it)return;
    const yr=x.hi?x.hi.slice(0,4):"Newly added";
    if(yr!==curYear){if(curYear!==null)h+='</ul></section>';curYear=yr;h+='<section class="dmonth"><h2 class="dmonth-head">'+(x.hi?"Seen by "+yr:yr)+'</h2><ul class="dlist">'}
    const meta=scorePill(it)+(lovedOf(it)?'<span class="dheart" aria-label="Loved">♥</span>':"")+(inTheater(it,watchesOf(it)[x.wi]||{})?thTag():"")+'<span class="dsub">'+esc(x.lo||x.hi?windowText(x.lo,x.hi):"Date unknown")+'</span>'+confBadge(x.c);
    h+=diaryRow(it,x.id,"",(x.c!=="confirmed"?"unsure ":"")+"undated",meta);
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
  return'<div class="danger-zone">'+(it.needsMatch?"":'<button class="link" type="button" data-a="openRelink">Wrong title? Fix the match</button>')+'<button class="link" style="color:var(--s-stopped)" type="button" data-a="askDelete">Delete from diary</button></div>';
}
/* Episode menu. Date fields never act on their own: the iPhone date picker sets a value
   the moment it opens, so a date is only used when a Save / Add button is pressed. */
function epMenuHtml(sn,e){
  const x=ICON.x.replace("<svg",'<svg width="14" height="14"');
  let h='<li class="ep-menu">';
  if(isW(e)){
    h+='<div class="em-row"><span class="em-k">First watch</span>'+
      '<input id="em-first" class="em-date" type="date" value="'+esc(e.w||"")+'" max="'+today()+'" aria-label="First watch date">'+
      '<button class="btn ghost sm" type="button" data-a="epSaveFirst">Save date</button>'+
      (e.w?'<button class="link" type="button" data-a="epUnknown">Make date unknown</button>':'<span class="hint" style="margin:0">Date unknown</span>')+'</div>';
    (e.rw||[]).forEach((r,i)=>{h+='<div class="em-row"><span class="em-k">Rewatch</span><span class="mono">'+(r.d?esc(fmtDate(r.d)):"date unknown")+'</span><button class="wx" type="button" data-a="epRwDel" data-i="'+i+'" aria-label="Remove this rewatch">'+x+'</button></div>'});
    h+='<div class="em-row"><span class="em-k">Add rewatch</span>'+
      '<button class="btn primary sm" type="button" data-a="epRwToday">Today</button>'+
      '<span class="em-or">or</span><input id="em-rw" class="em-date" type="date" max="'+today()+'" aria-label="Rewatch date">'+
      '<button class="btn ghost sm" type="button" data-a="epRwOn">Add</button>'+
      '<button class="btn ghost sm" type="button" data-a="epRwUnknown">Date unknown</button></div>'+
      '<div class="em-actions"><button class="link" style="color:var(--s-stopped)" type="button" data-a="epUnwatch">Mark not watched</button><button class="link" type="button" data-a="epMenuClose">Done</button></div>';
  }else{
    h+='<div class="em-row"><span class="em-k">Watched</span>'+
      '<button class="btn primary sm" type="button" data-a="epWatchToday">Today</button>'+
      '<span class="em-or">or</span><input id="em-watch" class="em-date" type="date" max="'+today()+'" aria-label="Watch date">'+
      '<button class="btn ghost sm" type="button" data-a="epWatchOn">Add</button>'+
      '<button class="btn ghost sm" type="button" data-a="epSeenUnknown">Date unknown</button></div>'+
      '<div class="em-actions"><button class="link" type="button" data-a="epMenuClose">Close</button></div>';
  }
  return h+'</li>';
}
function showDetail(id,it,enter){
  const p=progress(it),n=nextUp(it),na=nextAiring(it);
  const seasons=(it.seasons||[]).slice().sort((a,b)=>snum(a.n)-snum(b.n));
  if(S.season==null||!seasons.some(s=>s.n===S.season))S.season=n?n.s:(seasons[0]?seasons[0].n:null);
  const cs=seasons.find(s=>s.n===S.season);
  let b=matchBanner(it)+heroBlock(it,[it.year?'<span class="mono">'+esc(it.year)+'</span>':"",esc(it.by),esc(it.genre),it.status?esc(it.status):""].filter(Boolean).join(" · "))+extraFacts(it);
  b+='<p class="label">Shelf</p>'+chips(SHOW_SHELVES,it.shelf,null,"setShelf")+scaleRow(it);
  b+='<div class="progress"><div class="top"><span><b>'+p.w+'</b> of '+p.total+' aired episodes</span><span class="mono">'+(p.total?Math.round(p.w/p.total*100):0)+'%</span></div><div class="bar"><span style="width:'+(p.total?p.w/p.total*100:0)+'%"></span></div></div>';
  if(it.rewatch){const rp=rewatchProgress(it);
    b+='<div class="card rewatch-card"><div class="rc-top"><span class="rw">Rewatching</span><span class="mono">'+rp.w+' of '+rp.total+' · since '+esc(fmtDate(it.rewatch.from))+'</span><button class="link" type="button" data-a="stopRewatch">Stop rewatch</button></div><div class="bar"><span style="width:'+(rp.total?rp.w/rp.total*100:0)+'%"></span></div></div>'}
  if(n)b+='<div class="card nextup"><div><p class="label" style="margin-bottom:4px">'+(it.rewatch?"Next to rewatch":"Next up")+'</p><div class="code">'+code(n.s,n.e.n)+'</div><div class="ep">'+esc(n.e.t||"Episode "+n.e.n)+'</div></div><button class="btn primary" type="button" data-a="watchNext" data-id="'+esc(id)+'">Watched</button></div>';
  else if(p.total)b+='<div class="card nextup"><div><p class="label" style="margin-bottom:4px">All caught up</p><div class="ep">'+(na?"Next episode airs "+esc(fmtDate(na.e.a)):ended(it)?"You've seen every episode.":"No new episodes announced yet.")+'</div></div></div>';
  if(seasons.length)b+='<div class="seasons" data-scroll="seasons">'+seasons.map(s=>{const ae=s.eps.filter(aired);const w=ae.filter(isW).length;return'<button class="spill'+(ae.length&&w===ae.length?" done":"")+'" type="button" data-a="season" data-v="'+s.n+'" aria-pressed="'+(s.n===S.season)+'"><b>'+sname(s.n)+'</b><span>'+w+'/'+ae.length+(ae.length<s.eps.length?" +"+(s.eps.length-ae.length):"")+'</span></button>'}).join("")+'</div>';
  if(cs){
    const ae=cs.eps.filter(aired);const w=ae.filter(isW).length,all=ae.length>0&&w===ae.length;
    b+='<div class="season-head"><h3>'+sname(cs.n)+'</h3>'+(all?'<span class="sh-links"><button class="link" type="button" data-a="rwSeasonAsk">Rewatched season</button><button class="link" type="button" data-a="unmarkSeason">Unmark season</button></span>':ae.length?'<button class="link" type="button" data-a="markAsk">Mark season watched</button>':"")+'</div>';
    if(S.rwSeasonAsk===cs.n)b+='<div class="choice"><span>When did you rewatch it?</span><button class="btn primary" type="button" data-a="rwSeason" data-v="today">Today</button><button class="btn ghost" type="button" data-a="rwSeason" data-v="nodate">Date unknown</button></div>';
    if(S.markAsk===cs.n)b+='<div class="choice"><span>When did you watch it?</span><button class="btn primary" type="button" data-a="markSeason" data-v="today">Today</button><button class="btn ghost" type="button" data-a="markSeason" data-v="nodate">Before, no date</button></div>';
    b+='<ul class="eps">'+cs.eps.slice().sort((a,b)=>a.n-b.n).map(e=>{const wd=isW(e),fut=!aired(e);
      return'<li class="ep'+(wd?" w":"")+(fut?" future":"")+'"><button class="tick" type="button" data-a="toggleEp" data-s="'+cs.n+'" data-e="'+e.n+'" aria-pressed="'+wd+'" aria-label="'+(wd?"Unmark ":"Mark ")+code(cs.n,e.n)+'" '+(fut?"disabled":"")+'>'+ICON.check+'</button>'+
        '<button type="button" class="et" data-a="epMenu" data-s="'+cs.n+'" data-e="'+e.n+'" '+(fut?"disabled":"")+'><span class="code">E'+pad(e.n)+(e.a&&!fut?" · "+esc(fmtDate(e.a)):"")+'</span><span class="name">'+esc(e.t||"Episode "+e.n)+'</span>'+((e.s||(e.rw&&e.rw.length))?'<span class="epx">'+(e.s?e.s+'/10':"")+(e.s&&e.rw&&e.rw.length?" · ":"")+(e.rw&&e.rw.length?"rewatched "+e.rw.map(r=>r.d?fmtDate(r.d):"date unknown").join(", "):"")+'</span>':"")+'</button>'+
        (fut?'<span class="airs">Airs '+esc(fmtDate(e.a))+'</span>':wd?'<button type="button" class="when" data-a="epMenu" data-s="'+cs.n+'" data-e="'+e.n+'" aria-label="Edit viewings of '+code(cs.n,e.n)+'">'+(e.w?esc(fmtDate(e.w)):"Seen")+((e.rw&&e.rw.length)?" +"+e.rw.length:"")+'</button>':"<span></span>")+'</li>'+(S.epMenu===cs.n+"x"+e.n?epMenuHtml(cs.n,e):"")}).join("")+'</ul>';
  }else b+='<div class="card"><p style="margin:0;color:var(--muted)">No episodes listed yet.</p></div>';
  b+='<div class="tools">'+(!it.rewatch&&p.w>0?'<button class="btn ghost" type="button" data-a="startRewatch">Start a rewatch</button>':"")+'<button class="btn ghost" type="button" data-a="refreshShow" '+(S.refreshing?"disabled":"")+'>'+(S.refreshing?'<span class="spin"></span>Checking…':"Check for new episodes")+'</button><button class="btn ghost" type="button" data-a="openPicker">Change cover</button></div>';
  b+=dangerZone(it);
  return sheetShell(b,{enter,wash:washFor(it),label:it.title});
}
function matchBanner(it){
  return it.needsMatch?'<div class="card match-card"><p><b>Not matched to TMDB yet.</b> Find the right title to get its poster and details. Your viewings stay as they are.</p><button class="btn primary" type="button" data-a="openRelink">Find the right title</button></div>':"";
}
function extraFacts(it){
  const f=[];
  if(it.theater&&typeof it.theater==="string"){const m=it.theater.match(/(\d{4}-\d{2}-\d{2})\s*to\s*(\d{4}-\d{2}-\d{2})/);f.push("First seen in a theater"+(m?", during its "+esc(windowText(m[1],m[2]))+" run":""))}
  if(it.listNote)f.push("Your list note: “"+esc(it.listNote)+"”");
  if(it.avgEpRating)f.push("Average episode rating "+esc(it.avgEpRating)+"/10");
  return f.length?'<ul class="facts">'+f.map(x=>"<li>"+x+"</li>").join("")+'</ul>':"";
}
function movieDetail(id,it,enter){
  let b=matchBanner(it)+heroBlock(it,[it.year?'<span class="mono">'+esc(it.year)+'</span>':"",it.by?"Directed by "+esc(it.by):"",it.runtime?'<span class="mono">'+it.runtime+' min</span>':"",esc(it.genre)].filter(Boolean).join(" · "))+extraFacts(it);
  const has=watchesOf(it).length>0;
  b+='<div class="quick">'+(has?'<button class="btn primary" type="button" data-a="movieQuick" data-v="again">'+ICON.rewatch.replace("<svg",'<svg width="16" height="16"')+'Watched again today</button>'
    :'<button class="btn primary" type="button" data-a="movieQuick" data-v="today">'+ICON.check.replace("<svg",'<svg width="16" height="16"')+'Watched today</button><button class="btn ghost" type="button" data-a="movieQuick" data-v="unknown">Seen it, date unknown</button>')+'</div>';
  b+='<p class="label">Shelf</p>'+chips(MOVIE_SHELVES,it.shelf,null,"setShelf")+scaleRow(it);
  const ws=watchesOf(it).map((w,i)=>[w,i]).sort((a,b)=>(b[0].d||"0").localeCompare(a[0].d||"0")||(b[0].o||0)-(a[0].o||0));
  const cl=countLine(it);
  b+='<p class="label">Viewings'+(cl?' · <span style="text-transform:none;letter-spacing:0">'+esc(cl)+'</span>':"")+'</p>'+(ws.length?'<ul class="watches">'+ws.map(([w,i])=>'<li><span class="wd">'+
    (w.d?esc(longDate(w.d))+(isRewatch(it,w)?' <span class="rw">Rewatch</span>':""):'<span class="rw">First watch</span> '+esc(w.lo||w.hi?windowText(w.lo,w.hi):"date unknown")+(w.od==="yes"?' <span class="from-order">from your ordering</span>':""))+
    (w.s?' <span class="score">'+w.s+'<small>/10</small></span>':"")+'</span>'+
    '<button type="button" class="th-btn" data-a="toggleTheater" data-v="'+i+'" aria-pressed="'+inTheater(it,w)+'" aria-label="Seen in a theater">'+ICON.ticket+'</button>'+
    '<button type="button" class="conf-btn" data-a="cycleConf" data-v="'+i+'" aria-label="Confidence: '+(w.c||"confirmed")+'. Tap to change">'+(confBadge(w.c)||'<span class="conf conf-confirmed">Confirmed</span>')+'</button>'+
    '<button type="button" class="wx" data-a="removeWatch" data-v="'+i+'" aria-label="Remove this watch">'+ICON.x.replace("<svg",'<svg width="14" height="14"')+'</button></li>').join("")+'</ul><p class="hint">Tap the ticket to mark a viewing as seen in a theater. Tap a tag to change how sure you are.</p>':'<p class="hint" style="margin-bottom:10px">No watches logged yet.</p>');
  b+='<div class="logbox"><p class="label" style="margin:0">'+(has?"Add another viewing":"Log a watch")+'</p>'+
    '<label class="toggle-line"><input id="log-th" type="checkbox" data-c="logTh" '+(S.logTh?"checked":"")+'>Saw it in a theater</label>'+
    '<label class="toggle-line"><input id="log-nodate" type="checkbox" data-c="logNoDate" '+(S.logNoDate?"checked":"")+'>I don\'t know the date</label>'+
    (S.logNoDate?'<p class="hint" style="margin:0">It goes to the top of your Undated list, where you can reorder it.</p>':'<input id="watch-date" type="date" value="'+today()+'" max="'+today()+'" aria-label="Date watched">')+
    '<div class="seg sm" role="group" aria-label="How sure are you">'+CONF.map(([k,l])=>'<button type="button" data-a="logConf" data-v="'+k+'" aria-pressed="'+(S.logConf===k)+'">'+l+'</button>').join("")+'</div>'+
    '<button class="btn primary" type="button" data-a="logWatch">'+(has?"Add viewing":"Log watch")+'</button></div>';
  b+='<p class="label">Notes</p><textarea id="notes" data-c="notes" placeholder="What stayed with you?">'+esc(it.notes||"")+'</textarea>';
  b+=dangerZone(it);
  return sheetShell(b,{enter,wash:washFor(it),label:it.title});
}
function addSheet(enter){
  const A=S.add;
  let b=A.relink?'<h2 style="font:800 26px/1.05 var(--f-display);letter-spacing:-.03em;margin:4px 0 6px">Find the right title</h2><p class="hint">Pick the correct '+(A.kind==="show"?"series":"film")+'. Your viewings, score and notes move over with it.</p>'
    :'<h2 style="font:800 28px/1.05 var(--f-display);letter-spacing:-.03em;margin:4px 0 14px">Add to your diary</h2>';
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
function importPanel(){
  const I=S.imp;
  let h='<div class="import-box"><p class="label" style="margin:0">Import history</p>';
  if(!I||I.phase==="pick"){
    h+='<p class="hint" style="margin:0">Load the import file Claude prepared. Each title is matched to TMDB for its poster, then merged with anything already in your diary. Nothing you\'ve entered by hand gets overwritten.</p>'+
      '<label class="btn ghost" style="cursor:pointer;align-self:flex-start">Choose import file<input id="imp-file" type="file" accept=".json,application/json" data-c="impFile" hidden></label>'+
      (I&&I.err?'<p class="err-line">'+esc(I.err)+'</p>':"");
  }else if(I.phase==="ready"){
    const R=I.data.records;const f=R.filter(r=>r.kind==="movie").length,s=R.length-f;
    const have=new Set();for(const[,it]of S.items)if(it.imp&&it.imp.key)have.add(it.imp.key);
    const done=R.filter(r=>have.has(r.key)).length;
    h+='<p style="margin:0"><b>'+f+'</b> films and <b>'+s+'</b> shows in this file'+(done?' · '+done+' already imported, they\'ll be skipped':"")+'.</p>'+
      (I.data.episodesIncluded?"":'<p class="hint" style="margin:0">This file doesn\'t have your full episode list, so shows are left out for now.</p>')+
      '<p class="hint" style="margin:0">Takes a few minutes. Keep this page open until it finishes. If it stops, run it again and it picks up where it left off.</p>'+
      '<div style="display:flex;gap:8px"><button class="btn primary" type="button" data-a="startImport">Start import</button><button class="btn ghost" type="button" data-a="resetImport">Cancel</button></div>';
  }else{
    const pct=I.total?Math.round(I.done/I.total*100):0;
    h+='<div class="bar" style="height:8px"><span style="width:'+pct+'%"></span></div>'+
      '<p style="margin:0" class="mono">'+I.done+' of '+I.total+' · '+pct+'%</p>';
    if(I.phase==="running")h+='<p class="hint" style="margin:0">Matching and saving… Keep this page open.</p><button class="btn ghost" type="button" data-a="cancelImport" style="align-self:flex-start">Stop</button>';
    else{
      h+='<p style="margin:0">'+(I.phase==="done"?"Import finished.":I.phase==="stopped"?"Import stopped. Run it again to continue.":esc(I.err))+'</p>'+
        '<p class="hint" style="margin:0">'+I.matched+' matched to TMDB'+(I.already?" · "+I.already+" were already in":"")+(I.failed?" · "+I.failed+" couldn't be loaded, run again to retry":"")+'</p>';
      if(I.phase!=="done")h+='<button class="btn primary" type="button" data-a="startImport" style="align-self:flex-start">Run again</button>';
    }
  }
  const um=[...S.items].filter(([,it])=>it.needsMatch).sort((a,b)=>String(a[1].title).localeCompare(String(b[1].title)));
  if(um.length&&(!I||I.phase!=="running"))h+='<p style="margin:0"><b>'+um.length+' title'+(um.length>1?"s":"")+' need a match.</b> They\'re saved with your viewings. Open each one and tap “Find the right title”.</p><ul class="needs">'+um.map(([id,it])=>'<li><button class="link" type="button" data-a="open" data-id="'+esc(id)+'">'+esc(it.title)+(it.year?" ("+esc(it.year)+")":"")+'</button></li>').join("")+'</ul>';
  return h+'</div>';
}
function settingsSheet(enter){
  const n=S.items.size;
  let b='<div class="settings"><h2 style="font:800 26px/1.1 var(--f-display);letter-spacing:-.02em;margin:4px 0 14px">Settings</h2>'+
    '<div class="row-s"><span>Signed in as<br><b>'+esc(S.user&&S.user.email)+'</b></span><button class="btn ghost" type="button" data-a="signOut">Sign out</button></div>'+
    '<div class="row-s"><span>Backup<br><span class="hint" style="margin:0">'+n+' titles</span></span><button class="btn ghost" type="button" data-a="exportJson">Download backup</button></div>'+
    importPanel()+
    '<p class="attribution">Movie and TV data and images from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div>';
  return sheetShell(b,{enter,label:"Settings",icon:ICON.x});
}

/* ---------- render ---------- */
const app=document.getElementById("app"),layer=document.getElementById("layer");
function isTyping(){const a=document.activeElement;return!!a&&layer.contains(a)&&(a.tagName==="TEXTAREA"||(a.tagName==="INPUT"&&/^(text|search|number|email|password|date|month)$/.test(a.type)))}
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
  else main=fixBanner()+(S.tab==="shows"?showsView():S.tab==="movies"?moviesView():diaryView());
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
  if(A.relink){
    if(kind!==A.kind){A.phase="error";A.err="Pick a "+(A.kind==="show"?"series":"film")+" for this one.";refreshAddList();return}
    A.phase="loading";A.loadingTitle=r.title||r.name;render();
    try{const old=A.relink;S.add=null;await relinkTo(old,kind,r.id)}catch(e){S.add=A;A.phase="error";A.err="Couldn't load that title from TMDB. Try again.";render()}
    return;
  }
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

/* ---------- merging ---------- */
const MOVIE_USER_FIELDS=["shelf","score","watches","notes","first","vc","pos","imp","ev","theater","listNote","ratingImported"];
const SHOW_USER_FIELDS=["shelf","score","notes","first","imp","avgEpRating","epsTotal"];
function days(a,b){return Math.abs((Date.parse(a)-Date.parse(b))/864e5)}
function mergeWatches(primary,secondary){
  const out=primary.map(w=>Object.assign({},w));
  secondary.forEach(w=>{
    if(w.d){if(out.some(x=>x.d&&days(x.d,w.d)<=14))return}
    else if(out.some(x=>!x.d))return;
    out.push(Object.assign({},w));
  });
  return out;
}
function applyEpisodes(doc,eps){
  doc.seasons=doc.seasons||[];
  eps.forEach(x=>{
    let se=doc.seasons.find(s=>s.n===x.s);
    if(!se){se={n:x.s,eps:[]};doc.seasons.push(se)}
    let ep=se.eps.find(e=>e.n===x.e);
    if(!ep){ep={n:x.e,t:"",a:"",w:null};se.eps.push(ep)}
    if(x.w!=null&&(ep.w==null||(ep.w===""&&x.w)))ep.w=x.w;
    if(x.c&&!ep.c)ep.c=x.c;
    const sc=x.s_!=null?x.s_:x.r;if(sc!=null&&ep.s==null)ep.s=sc;
    if(x.rw&&x.rw.length){ep.rw=(ep.rw||[]).slice();x.rw.forEach(r=>{if(!ep.rw.some(y=>y.d===r.d))ep.rw.push(r)})}
  });
  doc.seasons.sort((a,b)=>a.n-b.n);doc.seasons.forEach(s=>s.eps.sort((a,b)=>a.n-b.n));
}
function watchedEps(doc){const out=[];(doc.seasons||[]).forEach(s=>s.eps.forEach(e=>{if(e.w!=null)out.push({s:s.n,e:e.n,w:e.w,c:e.c,s_:e.s,rw:e.rw})}));return out}
/* existing = what's already in the diary (wins on anything Jonah set by hand) */
function mergeDocs(existing,incoming){
  const m=Object.assign({},incoming);
  ["poster"].forEach(k=>{if(existing[k])m[k]=existing[k]});
  if(existing.score)m.score=existing.score;
  if(existing.notes)m.notes=existing.notes;
  if(existing.addedAt)m.addedAt=existing.addedAt;
  if(incoming.kind==="movie"){
    m.watches=mergeWatches(incoming.watches||[],watchesOf(existing));
    if(existing.shelf==="watched"||incoming.shelf==="watched")m.shelf="watched";
  }else{
    applyEpisodes(m,watchedEps(existing));
    if(existing.shelf&&existing.shelf!=="notstarted")m.shelf=existing.shelf;
  }
  return m;
}
function settleShowShelf(doc){
  if(doc.rewatch){doc.shelf="watching";return}
  const p=progress(doc);
  if(p.total&&p.w>=p.total)doc.shelf=ended(doc)?"completed":(doc.shelf==="stopped"?"stopped":"watching");
  else if(doc.shelf==="completed")doc.shelf="watching";
}

/* ---------- import ---------- */
async function resolveTmdb(rec){
  if(rec.kind==="movie"&&rec.imdb){
    const f=await tmdb("/find/"+rec.imdb,{external_source:"imdb_id"});
    if(f.movie_results&&f.movie_results[0])return{kind:"movie",id:f.movie_results[0].id};
  }
  const title=rec.title,year=rec.year;
  const path=rec.kind==="movie"?"/search/movie":"/search/tv";
  const tryQ=async params=>(await tmdb(path,Object.assign({query:title,include_adult:"false"},params))).results||[];
  // titles in non-Latin scripts (となりのトトロ) have nothing left after norm(), so compare them raw
  const tkey=s=>sqz(s)||String(s||"").toLowerCase().replace(/\s+/g,"");
  const want=tkey(title);
  const yr=r=>parseInt(((rec.kind==="movie"?r.release_date:r.first_air_date)||"").slice(0,4),10);
  const exact=list=>list.filter(r=>[r.title,r.name,r.original_title,r.original_name].some(n=>n&&tkey(n)===want));
  let named=year?exact(await tryQ(rec.kind==="movie"?{year:String(year)}:{first_air_date_year:String(year)})):[];
  // the year on file can be a re-release or US-release year (Donnie Darko 2004, Eraserhead 1982):
  // if nothing matches by name in that year, search every year
  if(!named.length)named=exact(await tryQ({}));
  if(!named.length)return null;
  let pick=named.slice();
  if(year)pick.sort((a,b)=>Math.abs((yr(a)||0)-year)-Math.abs((yr(b)||0)-year));
  if(rec.country){const inC=pick.filter(r=>(r.origin_country||[]).includes(rec.country));if(inC.length)pick=inC}
  // several same-named titles far from the year on file: too risky to guess
  if(year&&pick.length>1&&Math.abs((yr(pick[0])||0)-year)>3)return null;
  return{kind:rec.kind,id:pick[0].id};
}
function importedDoc(rec){
  const d=JSON.parse(JSON.stringify(rec.doc));
  if(d.kind==="show")d.seasons=d.seasons||[];
  return d;
}
async function buildImported(rec){
  const hit=await resolveTmdb(rec);  // throws if TMDB can't be reached: the record is retried on the next run
  let doc,id;
  if(hit){
    const base=await buildFromTmdb(hit.kind,hit.id);
    id=hit.kind+"-"+hit.id;
    doc=Object.assign(base,pickFields(importedDoc(rec),hit.kind==="movie"?MOVIE_USER_FIELDS:SHOW_USER_FIELDS));
    if(!doc.score)doc.score=0;
  }
  if(!doc){
    id=(rec.kind==="movie"?"movie":"show")+"-x-"+rec.key.replace(/[^A-Za-z0-9_-]+/g,"-").slice(0,80);
    doc=Object.assign(importedDoc(rec),{needsMatch:true,poster:null,addedAt:Date.now()});
  }
  if(rec.kind==="show"){applyEpisodes(doc,rec.episodes||[]);settleShowShelf(doc)}
  return{id,doc};
}
function pickFields(src,fields){const o={};fields.forEach(k=>{if(src[k]!==undefined)o[k]=src[k]});return o}
async function upsertRows(rows){
  for(let i=0;i<rows.length;i+=40){
    const chunk=rows.slice(i,i+40);let err=null;
    for(let a=0;a<3;a++){const r=await sb.from("items").upsert(chunk);err=r.error;if(!err)break;await new Promise(r=>setTimeout(r,1000*(a+1)))}
    if(err)throw err;
  }
}
async function readImportFile(file){
  let j;try{j=JSON.parse(await file.text())}catch(e){throw new Error("That file isn't valid JSON.")}
  if(!j||j.format!=="watch-diary-import"||!Array.isArray(j.records))throw new Error("That isn't a Watch Diary import file. Use the file Claude prepared.");
  return j;
}
async function runImport(){
  const I=S.imp;if(!I||!I.data)return;
  const recs=I.data.records.filter(r=>!I.skipShows||r.kind!=="show");
  const have=new Map();for(const[id,it]of S.items)if(it.imp&&it.imp.key&&!it.needsMatch)have.set(it.imp.key,id);
  const todo=recs.filter(r=>!have.has(r.key));
  const flagged=new Map();for(const[id,it]of S.items)if(it.needsMatch&&it.imp&&it.imp.key)flagged.set(it.imp.key,id);
  const dels=[];
  Object.assign(I,{phase:"running",total:recs.length,done:recs.length-todo.length,already:recs.length-todo.length,matched:0,unmatched:[],failed:0});
  renderSoon();
  const built=new Map();let buffer=[];
  const flushBuf=async()=>{if(!buffer.length)return;const rows=buffer;buffer=[];
    await upsertRows(rows.map(r=>({id:r.id,data:r.doc,updated_at:new Date().toISOString()})));
    rows.forEach(r=>S.items.set(r.id,r.doc));scheduleCache();};
  try{
    await pool(todo,6,async rec=>{
      if(I.cancel)return;
      let r;try{r=await buildImported(rec)}catch(e){I.failed++;I.done++;renderSoon();return}
      let doc=r.doc;
      const oldId=flagged.get(rec.key);
      if(oldId&&oldId!==r.id&&!doc.needsMatch){const old=S.items.get(oldId);if(old)doc=mergeDocs(old,doc);dels.push(oldId)}
      const prior=built.get(r.id)||S.items.get(r.id);
      if(prior)doc=mergeDocs(prior,doc);
      correctConfidence(doc);fixTvTimeRatings(doc);
      doc.updatedAt=Date.now();built.set(r.id,doc);
      buffer=buffer.filter(x=>x.id!==r.id);buffer.push({id:r.id,doc});
      if(doc.needsMatch)I.unmatched.push(r.id);else I.matched++;
      I.done++;renderSoon();
      if(buffer.length>=40)await flushBuf();
    });
    await flushBuf();
    if(dels.length){await deleteRows(dels);dels.forEach(id=>{if(!built.has(id))S.items.delete(id)});scheduleCache()}
    I.phase=I.cancel?"stopped":"done";
  }catch(e){I.phase="error";I.err="Saving stopped partway: "+((e&&e.message)||"connection problem")+". Run the import again and it will pick up where it left off."}
  render();
}
let renderTimer=null;function renderSoon(){if(renderTimer)return;renderTimer=setTimeout(()=>{renderTimer=null;render()},250)}

/* ---------- confidence correction (v1) ----------
   Viewings logged live in TV Time or Letterboxd, and anything from 2021 on, are accurate.
   Episode dates that survived the bulk-marking filter are per-episode logs: accurate too. */
const CONF_V=1;
function correctConfidence(doc){
  if((doc.confV||0)>=CONF_V)return false;
  let ch=false;
  if(doc.kind==="movie")(doc.watches||[]).forEach(w=>{if(w.d&&w.c!=="confirmed"&&(/TV Time|Letterboxd/.test(w.via||"")||w.d>="2021")){w.c="confirmed";ch=true}});
  else(doc.seasons||[]).forEach(s=>s.eps.forEach(e=>{
    if(e.w&&e.c&&e.c!=="confirmed"){e.c="confirmed";ch=true}
    (e.rw||[]).forEach(r=>{if(r.d&&r.c!=="confirmed"){r.c="confirmed";ch=true}});
  }));
  doc.confV=CONF_V;
  return true;
}
function cleanTitle(t){return String(t||"").replace(/\s*\((\d{4}|[A-Z]{2})\)\s*$/,"")}
function recFromDoc(d){
  const key=(d.imp&&d.imp.key)||"";const m=String(d.title||"").match(/\((\d{4}|[A-Z]{2})\)\s*$/);
  return{kind:d.kind,key,imdb:/^m:tt\d+$/.test(key)?key.slice(2):null,title:cleanTitle(d.title),
    year:d.year||(m&&/\d{4}/.test(m[1])?+m[1]:null),country:m&&!/\d/.test(m[1])?m[1]:null};
}
async function deleteRows(ids){
  for(let i=0;i<ids.length;i+=100){const{error}=await sb.from("items").delete().in("id",ids.slice(i,i+100));if(error)throw error}
}
/* Re-match everything flagged "needs a match", from what's already saved. No file needed. */
async function repairLibrary(){
  if(S.fix&&S.fix.phase==="running")return;
  const F=S.fix={phase:"running",total:0,done:0,matched:0,still:0,failed:0};
  renderSoon();
  try{
    // 1) confidence correction on every title
    const fixed=[];
    for(const[id,d]of S.items){const c=JSON.parse(JSON.stringify(d));if(correctConfidence(c)){c.updatedAt=Date.now();fixed.push({id,doc:c})}}
    if(fixed.length){await upsertRows(fixed.map(r=>({id:r.id,data:r.doc,updated_at:new Date().toISOString()})));fixed.forEach(r=>S.items.set(r.id,r.doc));scheduleCache()}
    // 2) matching
    const todo=[...S.items].filter(([,d])=>d.needsMatch);
    F.total=todo.length;renderSoon();
    let buf=[],dels=[];
    const flush=async()=>{if(!buf.length&&!dels.length)return;const b=buf,dl=dels;buf=[];dels=[];
      if(b.length)await upsertRows(b.map(r=>({id:r.id,data:r.doc,updated_at:new Date().toISOString()})));
      if(dl.length)await deleteRows(dl);
      b.forEach(r=>S.items.set(r.id,r.doc));dl.forEach(id=>{if(!b.some(r=>r.id===id))S.items.delete(id)});scheduleCache();renderSoon()};
    await pool(todo,3,async([oldId,old])=>{
      try{
        const hit=await resolveTmdb(recFromDoc(old));
        if(!hit){F.still++;F.done++;renderSoon();return}
        const base=await buildFromTmdb(hit.kind,hit.id);
        const newId=hit.kind+"-"+hit.id;
        let doc=Object.assign(base,pickFields(old,old.kind==="movie"?MOVIE_USER_FIELDS:SHOW_USER_FIELDS));
        if(old.kind==="show"){applyEpisodes(doc,watchedEps(old));settleShowShelf(doc)}
        if(old.addedAt)doc.addedAt=old.addedAt;
        const pendingNew=buf.find(r=>r.id===newId);
        const target=pendingNew?pendingNew.doc:(newId!==oldId&&S.items.has(newId)?S.items.get(newId):null);
        if(target)doc=mergeDocs(target,doc);
        delete doc.needsMatch;correctConfidence(doc);doc.confV=CONF_V;fixTvTimeRatings(doc);doc.updatedAt=Date.now();
        buf=buf.filter(r=>r.id!==newId);buf.push({id:newId,doc});if(newId!==oldId)dels.push(oldId);
        F.matched++;
      }catch(e){F.failed++}
      F.done++;renderSoon();
      if(buf.length>=30)await flush();
    });
    await flush();
    F.phase="done";
  }catch(e){F.phase="error";F.err=(e&&e.message)||"connection problem"}
  render();
}
/* TV Time stored ratings as internal codes; the import's conversion read one code wrong.
   Jonah confirmed: the code imported as 4/10 is a top rating (9), the codes imported as
   6, 8 and 10 were right. v1 removed them all; v2 restores every TV Time rating with the
   corrected value. Each entry is [value as first imported, corrected value]. A value is
   written only where nothing is set or the wrong imported value is still there, so a
   score changed by hand is never touched. The 3 episode ratings that used TV Time's
   lowest code stay unrated: no film used it, so its value can't be confirmed. */
const RATING_V=2;
const RATING_FIX={films:{"m:tt0133093":[4,9],"m:tt0075314":[4,9],"m:tt0234215":[10,10],"m:tt0116282":[4,9],"m:tt0242653":[10,10],"m:tt0421715":[8,8],"m:tt0910970":[4,9],"m:tt1817273":[4,9],"m:tt0046521":[4,9],"m:tt0470752":[4,9],"m:tt3783958":[10,10],"m:tt5776858":[10,10],"m:tt11271038":[10,10],"m:tt28607951":[10,10],"m:tt22022452":[10,10],"m:tt2953050":[6,6],"m:tt1219289":[8,8],"m:tt2980516":[6,6],"m:tt30144839":[10,10],"m:tt1312221":[8,8],"m:tt34966650":[8,8],"m:tt0059742":[10,10],"m:tt31193180":[6,6],"m:tt32916440":[4,9],"m:tt29768334":[4,9],"m:-2023":[4,9],"m:donnie-darko-2004":[4,9],"m:the-wonderful-story-of-henry-sugar-2023":[10,10],"m:skyscraper-live-2026":[4,9],"m:the-thinking-game-2024":[8,8],"m:eraserhead-1982":[10,10],"m:the-rise-of-the-red-hot-chili-peppers-our-brother-hillel-2026":[10,10],"m:-2002":[4,9]},views:{"m:tt0133093":{"2025-05-29":[4,9]},"m:tt0075314":{"2026-02-01":[4,9]},"m:tt0234215":{"2025-06-11":[10,10]},"m:tt0116282":{"2026-02-23":[4,9]},"m:tt0242653":{"2025-08-27":[10,10]},"m:tt0421715":{"2025-12-19":[8,8]},"m:tt0910970":{"2026-03-30":[4,9]},"m:tt1817273":{"2015-08-31":[4,9],"2025-07-15":[4,9]},"m:tt0046521":{"2025-10-22":[4,9]},"m:tt0470752":{"2026-02-22":[4,9]},"m:tt3783958":{"2017-09-24":[10,10],"2025-10-27":[10,10]},"m:tt5776858":{"2018-01-29":[10,10],"2025-11-27":[10,10]},"m:tt11271038":{"2022-02-20":[10,10]},"m:tt28607951":{"2025-04-06":[10,10]},"m:tt22022452":{"2025-07-08":[10,10]},"m:tt2953050":{"2025-08-31":[6,6]},"m:tt1219289":{"2025-09-30":[8,8]},"m:tt2980516":{"2025-10-27":[6,6]},"m:tt30144839":{"2025-11-28":[10,10]},"m:tt1312221":{"2025-12-02":[8,8]},"m:tt34966650":{"2025-12-29":[8,8]},"m:tt0059742":{"2026-01-02":[10,10]},"m:tt31193180":{"2026-01-12":[6,6]},"m:tt32916440":{"2026-01-25":[4,9]},"m:tt29768334":{"2026-02-22":[4,9]},"m:-2023":{"2023-12-19":[4,9]},"m:donnie-darko-2004":{"2025-09-12":[4,9]},"m:the-wonderful-story-of-henry-sugar-2023":{"2025-09-26":[10,10]},"m:skyscraper-live-2026":{"2026-01-29":[4,9]},"m:the-thinking-game-2024":{"2026-02-11":[8,8]},"m:eraserhead-1982":{"2026-03-02":[10,10]},"m:the-rise-of-the-red-hot-chili-peppers-our-brother-hillel-2026":{"2026-04-05":[10,10]},"m:-2002":{"2026-06-21":[4,9]}},eps:{"s:how-i-met-your-mother":{"9x24":[8,8],"9x23":[4,9],"9x21":[10,10],"9x22":[4,9],"9x20":[10,10],"9x19":[8,8],"9x18":[10,10],"9x17":[4,9],"9x16":[4,9],"9x15":[10,10],"9x13":[10,10],"9x14":[10,10],"9x12":[10,10],"9x11":[10,10],"9x10":[8,8],"9x8":[10,10],"9x9":[10,10],"9x6":[10,10],"9x7":[10,10],"9x5":[10,10],"9x2":[10,10],"9x3":[10,10],"9x4":[10,10],"9x1":[10,10],"8x22":[10,10],"8x23":[10,10],"8x24":[4,9],"8x21":[10,10],"8x20":[10,10],"8x19":[10,10],"8x17":[10,10],"8x18":[10,10],"8x16":[10,10],"8x15":[10,10],"8x12":[10,10],"8x13":[10,10],"8x14":[10,10],"8x10":[10,10],"8x11":[8,8],"8x7":[6,6],"8x8":[10,10],"8x9":[8,8],"8x6":[10,10],"8x3":[10,10],"8x4":[10,10],"8x5":[10,10],"8x2":[10,10],"8x1":[10,10],"7x23":[4,9],"7x24":[4,9],"7x20":[10,10],"7x21":[10,10],"7x18":[10,10],"7x19":[10,10],"7x17":[10,10],"7x16":[4,9],"7x13":[8,8],"7x14":[10,10],"7x15":[4,9],"7x11":[10,10],"7x12":[4,9],"7x8":[8,8],"7x9":[4,9],"7x10":[4,9],"7x4":[10,10],"7x5":[8,8],"7x6":[10,10],"7x7":[10,10],"7x2":[10,10],"7x3":[10,10],"7x1":[10,10],"6x24":[4,9],"6x22":[4,9],"6x23":[10,10],"6x20":[10,10],"6x21":[10,10],"6x19":[4,9],"6x17":[10,10],"6x18":[4,9],"6x14":[10,10],"6x15":[10,10],"6x16":[4,9],"6x13":[10,10],"6x9":[10,10],"6x10":[10,10],"6x11":[10,10],"6x12":[10,10],"6x4":[4,9],"6x5":[10,10],"6x6":[10,10],"6x7":[8,8],"6x8":[10,10],"6x1":[10,10],"6x2":[10,10],"6x3":[10,10],"5x24":[4,9],"5x19":[10,10],"5x20":[10,10],"5x21":[4,9],"5x22":[10,10],"5x23":[6,6],"5x18":[10,10],"5x16":[10,10],"5x17":[10,10],"5x15":[10,10],"5x13":[10,10],"5x14":[10,10],"5x11":[10,10],"5x12":[10,10],"5x8":[10,10],"5x9":[10,10],"5x10":[10,10],"5x7":[8,8],"5x5":[10,10],"5x6":[10,10],"5x4":[8,8],"5x3":[8,8],"5x2":[4,9],"4x24":[10,10],"5x1":[10,10],"4x23":[8,8],"4x21":[10,10],"4x22":[4,9],"4x20":[10,10],"4x19":[10,10],"4x17":[10,10],"4x18":[8,8],"4x16":[8,8],"4x14":[10,10],"4x15":[10,10],"4x12":[10,10],"4x13":[8,8],"4x11":[8,8],"4x10":[8,8],"4x8":[10,10],"4x9":[10,10],"4x7":[10,10],"4x6":[10,10],"4x5":[4,9],"4x3":[10,10],"4x4":[10,10],"3x20":[10,10],"4x1":[4,9],"4x2":[10,10],"3x19":[8,8],"3x18":[10,10],"3x17":[10,10],"3x15":[10,10],"3x16":[10,10],"3x14":[8,8],"3x11":[4,9],"3x12":[8,8],"3x13":[8,8]},"s:rick-and-morty":{"9x1":[10,10],"8x8":[8,8],"8x9":[8,8],"8x10":[6,6],"8x5":[10,10],"8x6":[8,8],"8x7":[8,8],"8x4":[8,8],"8x2":[8,8],"8x3":[8,8],"8x1":[8,8]},"s:the-dark-wizard":{"1x3":[4,9],"1x4":[4,9],"1x2":[10,10],"1x1":[10,10]},"s:boy-band-confidential":{"1x1":[8,8]},"s:a-knight-of-the-seven-kingdoms":{"1x6":[8,8],"1x5":[8,8],"1x3":[10,10],"1x4":[8,8],"1x2":[8,8],"1x1":[8,8]},"s:alone":{"11x2":[8,8],"11x3":[10,10],"0x12":[6,6],"11x1":[8,8]},"s:the-last-of-us":{"2x7":[10,10],"2x6":[10,10],"2x5":[10,10],"2x4":[8,8],"2x3":[8,8],"2x2":[4,9],"2x1":[8,8]},"s:stranger-things":{"5x8":[8,8],"5x7":[6,6],"5x5":[8,8],"5x6":[8,8],"5x4":[10,10],"5x2":[8,8],"5x3":[10,10],"5x1":[10,10]},"s:america-s-team-the-gambler-and-his-cowboys":{"1x8":[8,8],"1x4":[10,10],"1x5":[10,10],"1x6":[4,9],"1x7":[10,10],"1x2":[10,10],"1x3":[10,10],"1x1":[8,8]},"s:loudermilk":{"1x1":[6,6]},"s:100-foot-wave":{"3x5":[4,9],"3x4":[10,10],"3x3":[10,10],"3x2":[10,10],"3x1":[10,10]},"s:south-park":{"27x3":[8,8],"27x1":[8,8],"27x2":[6,6]},"s:black-mirror":{"7x6":[4,9],"7x4":[8,8],"7x5":[10,10],"7x3":[10,10],"7x2":[8,8],"7x1":[10,10]},"s:portlandia":{"4x1":[8,8]},"s:the-rehearsal":{"2x6":[4,9],"2x5":[10,10],"2x4":[4,9],"2x2":[4,9],"2x3":[4,9],"2x1":[8,8]},"s:the-bear":{"3x10":[8,8],"3x9":[10,10],"3x8":[4,9],"3x7":[4,9],"3x6":[4,9],"3x4":[10,10],"3x5":[10,10],"3x3":[10,10],"3x2":[10,10],"3x1":[4,9]},"s:adolescence":{"1x4":[4,9],"1x3":[4,9],"1x2":[8,8],"1x1":[10,10]},"s:shtisel":{"2x6":[4,9],"2x5":[4,9],"2x4":[4,9],"2x3":[4,9],"2x2":[4,9],"2x1":[4,9]},"s:nathan-for-you":{"3x3":[4,9],"3x4":[10,10],"3x5":[4,9],"3x2":[10,10],"3x1":[4,9]},"s:girls":{"4x8":[6,6],"4x9":[6,6]}}};
function fixTvTimeRatings(doc){
  if((doc.ratV||0)>=RATING_V)return false;
  const key=doc.imp&&doc.imp.key;
  const put=(cur,pair)=>(cur==null||cur===0||cur===pair[0])?pair[1]:cur;
  if(doc.kind==="movie"){
    const f=key&&RATING_FIX.films[key];if(f)doc.score=put(doc.score,f);
    const v=key&&RATING_FIX.views[key];
    (doc.watches||[]).forEach(w=>{if(v&&w.d&&v[w.d])w.s=put(w.s,v[w.d]);else if(w.via&&w.s!=null&&(doc.ratV||0)<1)delete w.s});
  }else{
    const t=key&&RATING_FIX.eps[key];
    (doc.seasons||[]).forEach(se=>se.eps.forEach(e=>{const x=t&&t[se.n+"x"+e.n];if(x)e.s=put(e.s,x);else if(e.s!=null&&(doc.ratV||0)<1)delete e.s}));
    delete doc.avgEpRating;
  }
  delete doc.ratingImported;
  doc.ratV=RATING_V;
  return true;
}
async function migrateConfidence(){
  const fixed=[];
  for(const[id,d]of S.items){if((d.confV||0)>=CONF_V&&(d.ratV||0)>=RATING_V)continue;const c=JSON.parse(JSON.stringify(d));const a=correctConfidence(c),b=fixTvTimeRatings(c);if(a||b){c.updatedAt=Date.now();fixed.push({id,doc:c})}}
  if(!fixed.length)return;
  try{await upsertRows(fixed.map(r=>({id:r.id,data:r.doc,updated_at:new Date().toISOString()})));fixed.forEach(r=>S.items.set(r.id,r.doc));scheduleCache();render()}catch(e){}
}
function needsCount(){let n=0;for(const[,d]of S.items)if(d.needsMatch)n++;return n}
function fixBanner(){
  const F=S.fix;const n=needsCount();
  if(F&&F.phase==="running")return'<div class="fix-banner"><div><b>Matching your titles…</b> '+F.done+' of '+F.total+'. Keep this page open.</div><div class="bar"><span style="width:'+(F.total?Math.round(F.done/F.total*100):0)+'%"></span></div></div>';
  const tried=F&&F.phase!=="running";
  const head=tried?(F.err?"Matching stopped: "+esc(F.err)+". ":(F.matched?F.matched+" matched. ":"")+(F.failed?F.failed+" couldn't reach TMDB. ":"")):"";
  if(!n)return tried&&(F.matched||F.err)?'<div class="fix-banner"><div><b>'+head+'</b>Every title is matched.</div><button class="btn ghost" type="button" data-a="dismissFix">OK</button></div>':"";
  const pending=[...S.items].filter(([,d])=>d.needsMatch).sort((a,b)=>String(a[1].title).localeCompare(String(b[1].title)));
  const canRetry=!tried||F.failed||F.err;
  return'<div class="fix-banner warn"><div>'+(head?"<b>"+head+"</b>":"")+'<b>'+n+' title'+(n>1?"s":"")+' still need'+(n>1?"":"s")+' a match.</b> '+
    (canRetry?"Your viewings are all there.":"TMDB didn't have a clear match for "+(n>1?"these":"this one")+". Tap a title, then “Find the right title”.")+'</div>'+
    (canRetry?'<button class="btn primary" type="button" data-a="repair">'+(tried?"Try again":"Match them now")+'</button>':"")+
    '<ul class="fix-list">'+pending.map(([id,d])=>'<li><button class="chip" type="button" data-a="open" data-id="'+esc(id)+'">'+(d.kind==="show"?"TV · ":"")+esc(d.title)+(d.year?" ("+esc(d.year)+")":"")+'</button></li>').join("")+'</ul></div>';
}

/* ---------- fix match ---------- */
async function relinkTo(oldId,kind,tmdbId){
  const old=S.items.get(oldId);if(!old)return;
  const base=await buildFromTmdb(kind,tmdbId);
  const newId=kind+"-"+tmdbId;
  let doc=Object.assign(base,pickFields(old,old.kind==="movie"?MOVIE_USER_FIELDS:SHOW_USER_FIELDS));
  if(kind==="show"){applyEpisodes(doc,watchedEps(old));settleShowShelf(doc)}
  if(old.addedAt)doc.addedAt=old.addedAt;
  if(newId!==oldId&&S.items.has(newId))doc=mergeDocs(S.items.get(newId),doc);
  delete doc.needsMatch;
  save(newId,doc);
  if(newId!==oldId)await removeItem(oldId);
  S.openId=newId;S.season=null;render();
  toast("Matched to "+doc.title+(doc.year?" ("+doc.year+")":""));
}

/* ---------- actions ---------- */
function openItem(id){S.logTh=false;S.epMenu=null;S.rwSeasonAsk=null;S.openId=id;S.season=null;S.confirm=null;S.markAsk=null;S.logNoDate=false;S.logConf="confirmed";render();
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
  open:d=>{S.settings=false;openItem(d.id)},
  close:()=>{if(S.settings){S.settings=false;if(S.imp&&S.imp.phase!=="running"&&S.imp.phase!=="ready")S.imp=null}else if(S.picker)S.picker=null;else if(S.add)S.add=null;else S.openId=null;render()},
  openAdd:()=>{S.add={q:"",phase:"idle",results:[]};render()},
  openSettings:()=>{S.settings=true;render()},
  signOut:async()=>{S.settings=false;S.openId=null;try{localStorage.removeItem(cacheKey())}catch(e){}await sb.auth.signOut();setUser(null)},
  exportJson:()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),items:Object.fromEntries(S.items)},null,1)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="watch-diary-backup-"+today()+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)},
  pick:d=>pickResult(+d.v),
  openPicker:()=>{const it=S.items.get(S.openId);if(it&&!it.tmdb)A.openRelink();else openPicker()},
  setPoster:d=>{const P=S.picker;const p=P&&P.posters[+d.v];if(!p)return;const it=clone(P.id);it.poster=p.file_path;S.picker=null;save(P.id,it);toast("Cover updated")},
  watchNext:d=>{const id=d.id;const it=S.items.get(id);const n=it&&nextUp(it);if(!n)return;
    const dt=today();const kind=watchEpisode(id,n.s,n.e.n,dt);
    toast((kind==="re"?"Rewatched ":"Watched ")+code(n.s,n.e.n),{label:"Undo",fn:()=>undoEpisode(id,n.s,n.e.n,kind,dt)})},
  epMenu:d=>{const k=d.s+"x"+d.e;S.epMenu=S.epMenu===k?null:k;render()},
  epMenuClose:()=>{S.epMenu=null;render()},
  epUnknown:()=>{const{s,e}=epFromMenu();setEps(S.openId,[[s,e]],"")},
  epUnwatch:()=>{const id=S.openId;const{s,e}=epFromMenu();const it=clone(id);const ep=findEp(it,s,e);if(!ep)return;const prev=JSON.parse(JSON.stringify(ep));
    ep.w=null;delete ep.c;delete ep.rw;autoShelf(it,true);S.epMenu=null;save(id,it);
    toast(code(s,e)+" marked not watched",{label:"Undo",fn:()=>{const c=clone(id);const x=findEp(c,s,e);if(x){Object.assign(x,prev);save(id,c)}}})},
  epSaveFirst:()=>{const v=(document.getElementById("em-first")||{}).value||"";if(v>today()){toast("That date is in the future.");return}
    const{s,e}=epFromMenu();setEps(S.openId,[[s,e]],v);toast(v?"Date saved":"Date set to unknown")},
  epRwOn:()=>{const v=(document.getElementById("em-rw")||{}).value||"";if(!v){toast("Pick a date first.");return}if(v>today()){toast("That date is in the future.");return}
    const{s,e}=epFromMenu();watchEpisode(S.openId,s,e,v);toast("Rewatch added for "+fmtDate(v))},
  epWatchOn:()=>{const v=(document.getElementById("em-watch")||{}).value||"";if(!v){toast("Pick a date first.");return}if(v>today()){toast("That date is in the future.");return}
    const{s,e}=epFromMenu();S.epMenu=null;watchEpisode(S.openId,s,e,v);toast("Watched "+fmtDate(v))},
  epRwToday:()=>{const{s,e}=epFromMenu();watchEpisode(S.openId,s,e,today())},
  epRwUnknown:()=>{const id=S.openId;const{s,e}=epFromMenu();const it=clone(id);const ep=findEp(it,s,e);if(!ep)return;ep.rw=(ep.rw||[]).concat({d:"",c:"guess"});save(id,it)},
  epRwDel:d=>{const id=S.openId;const{s,e}=epFromMenu();const it=clone(id);const ep=findEp(it,s,e);if(!ep||!ep.rw)return;ep.rw.splice(+d.i,1);if(!ep.rw.length)delete ep.rw;save(id,it)},
  epWatchToday:()=>{const{s,e}=epFromMenu();S.epMenu=null;watchEpisode(S.openId,s,e,today())},
  epSeenUnknown:()=>{const{s,e}=epFromMenu();S.epMenu=null;setEps(S.openId,[[s,e]],"")},
  rwSeasonAsk:()=>{S.rwSeasonAsk=S.rwSeasonAsk===S.season?null:S.season;render()},
  rwSeason:d=>{const id=S.openId;const it=clone(id);const se=it.seasons.find(x=>x.n===S.season);S.rwSeasonAsk=null;if(!se)return;
    const entry=d.v==="today"?{d:today(),c:"confirmed"}:{d:"",c:"guess"};
    se.eps.filter(aired).forEach(e=>{if(isW(e))e.rw=(e.rw||[]).concat(Object.assign({},entry));else{e.w=entry.d;e.c=entry.c}});
    save(id,it);toast(sname(se.n)+" logged as rewatched")},
  startRewatch:()=>{const id=S.openId;const it=clone(id);it.rewatch={from:today()};it.shelf="watching";S.season=null;save(id,it);toast("Rewatch started. It's in Up next.")},
  stopRewatch:()=>{const id=S.openId;const it=clone(id);const was=it.rewatch;delete it.rewatch;settleShowShelf(it);autoShelf(it,true);save(id,it);
    toast("Rewatch stopped. Episodes you rewatched stay logged.",{label:"Undo",fn:()=>{const c=clone(id);c.rewatch=was;c.shelf="watching";save(id,c)}})},
  movieQuick:d=>{const id=S.openId;const before=clone(id);const it=clone(id);it.watches=watchesOf(it);
    if(d.v==="unknown"){let max=0;for(const[,x]of S.items)if(x.kind==="movie")watchesOf(x).forEach(w=>{if(!w.d&&(w.o||0)>max)max=w.o});it.watches.push({d:"",c:"confirmed",o:max+1})}
    else it.watches.push(Object.assign({d:today(),c:"confirmed"},d.v==="again"?{r:true}:{}));
    it.shelf="watched";save(id,it);
    toast(d.v==="again"?"Rewatch logged for today":d.v==="today"?"Watched today":"Marked as seen",{label:"Undo",fn:()=>save(id,before)})},
  toggleEp:d=>toggleEp(S.openId,+d.s,+d.e),
  season:d=>{S.season=+d.v;S.markAsk=null;S.rwSeasonAsk=null;S.epMenu=null;render()},
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
    if(S.logNoDate){let max=0;for(const[,x]of S.items)if(x.kind==="movie")watchesOf(x).forEach(w=>{if(!w.d&&(w.o||0)>max)max=w.o});it.watches.push(Object.assign({d:"",c:S.logConf,o:max+1},S.logTh?{th:true}:{}))}
    else{const v=(document.getElementById("watch-date")||{}).value||today();if(v>today()){toast("That date is in the future.");return}it.watches.push(Object.assign({d:v,c:S.logConf},S.logTh?{th:true}:{}))}
    it.shelf="watched";save(S.openId,it);toast(S.logNoDate?"Added to Undated":"Watch logged");S.logNoDate=false;S.logTh=false;S.logConf="confirmed";render()},
  toggleTheater:d=>{const id=S.openId;const it=clone(id);it.watches=watchesOf(it);const w=it.watches[+d.v];if(!w)return;w.th=!inTheater(S.items.get(id),watchesOf(S.items.get(id))[+d.v]);save(id,it)},
  removeWatch:d=>{const id=S.openId;const it=clone(id);const i=+d.v;const was=it.watches[i];if(!was)return;it.watches.splice(i,1);save(id,it);
    toast("Watch removed",{label:"Undo",fn:()=>{const c=clone(id);c.watches=watchesOf(c).concat(was);save(id,c)}})},
  repair:()=>repairLibrary(),
  clearFilters:d=>{S.filt=Object.assign({},S.filt,{[d.k]:{score:"any",decade:"any",fy:"any",th:"any"}});render()},
  dismissFix:()=>{S.fix=null;render()},
  openImport:()=>{S.imp=S.imp&&S.imp.phase==="running"?S.imp:{phase:"pick"};S.settings=true;render()},
  startImport:()=>{if(S.imp&&S.imp.data)runImport()},
  cancelImport:()=>{if(S.imp)S.imp.cancel=true},
  resetImport:()=>{S.imp={phase:"pick"};render()},
  openRelink:()=>{const it=S.items.get(S.openId);if(!it)return;S.add={q:String(it.title||"").replace(/\s*\((\d{4}|[A-Z]{2})\)\s*$/,""),phase:"idle",results:[],relink:S.openId,kind:it.kind};render();runSearch(S.add.q)},
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

  else if(c==="notes"){const it=clone(S.openId);if((it.notes||"")!==el.value){it.notes=el.value.slice(0,5000);save(S.openId,it)}}
  else if(c==="logNoDate"){S.logNoDate=el.checked;render()}
  else if(c==="logTh"){S.logTh=el.checked}
  else if(c==="sortBy"){S.sortBy=Object.assign({},S.sortBy,{[el.dataset.k]:el.value});savePrefs();render()}
  else if(c==="fScore"||c==="fDecade"||c==="fYear"||c==="fTh"){const k=el.dataset.k;const f=Object.assign({},getF(k));f[{fScore:"score",fDecade:"decade",fYear:"fy",fTh:"th"}[c]]=el.value;S.filt=Object.assign({},S.filt,{[k]:f});render()}
  else if(c==="impFile"){const f=el.files&&el.files[0];if(!f)return;
    readImportFile(f).then(data=>{S.imp={phase:"ready",data,skipShows:!data.episodesIncluded};render()}).catch(err=>{S.imp={phase:"pick",err:err.message};render()})}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&(S.add||S.openId||S.picker||S.settings))A.close()});

render();initAuth();
})();
