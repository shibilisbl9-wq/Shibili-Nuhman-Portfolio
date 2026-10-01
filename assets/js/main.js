(() => {
/* ---------------- data ---------------- */
const P = [
  {id:"dulight", name:"DuLight", line:"Lead rebrand", client:"DuLight FZE", sector:"LED lighting manufacturer, Dubai",
   role:["Brand identity","Rebrand","Brand voice"], ba:true,
   sum:"A full rebrand for a Dubai LED lighting manufacturer: a new identity and brand voice, with the old and new marks shown side by side.",
   cover:"radial-gradient(70% 60% at 72% 26%, rgba(255,205,110,.55), transparent 62%), linear-gradient(160deg,#1f2127,#0c0d10)", fg:"#F6EBD3"},
  {id:"zee", name:"Zee Real Estate", line:"Brand foundation & social", client:"Zee Real Estate", sector:"Real estate, Dubai",
   role:["Brand foundation","Visual system","Carousels, Stories, Reels"],
   sum:"Built the brand foundation and visual system for a Dubai real estate brand, then carried it through carousels, Stories, Reels and event assets.",
   cover:"radial-gradient(80% 70% at 20% 90%, rgba(120,220,190,.25), transparent 60%), linear-gradient(150deg,#115049,#0A2B28)", fg:"#E6F3EE"},
  {id:"ethra", name:"ETHRA", line:"Celestial Collection", client:"ETHRA", sector:"Niche fragrance",
   role:["Campaign production","Art direction","AI stills & reels"],
   sum:"Campaign production across five scents (Elysia, Selene, Nox, Sola and Helios), each tied to its own Dubai location, from lifestyle stills to cinematic reels.",
   cover:"radial-gradient(1.5px 1.5px at 18% 22%,#fff 60%,transparent 61%),radial-gradient(1px 1px at 64% 14%,#fff 60%,transparent 61%),radial-gradient(1.5px 1.5px at 82% 48%,#fff 60%,transparent 61%),radial-gradient(1px 1px at 38% 58%,#fff 60%,transparent 61%),radial-gradient(60% 50% at 70% 20%,rgba(190,160,255,.35),transparent 70%),linear-gradient(180deg,#1A1532,#3A2A5E)", fg:"#F2EAFF"},
  {id:"mirage", name:"Mirage", line:"Nadan Serenity", client:"Mirage", sector:"Architectural visualization",
   role:["Architectural visualization","3D","Case study layout"],
   sum:"Architectural visualization for the Mirage / Nadan Serenity project.",
   cover:"radial-gradient(40% 55% at 50% 100%, rgba(255,255,255,.45), transparent 70%), linear-gradient(180deg,#EADFCB,#C4A97F)", fg:"#2A2118"},
  {id:"connectin", name:"ConnectIn", line:"Business setup, on social", client:"ConnectIn Business Services", sector:"Business setup consultancy, Dubai",
   role:["Social content","Carousels","Captions"],
   sum:"Instagram carousels and captions that make setting up a company in Dubai easy to follow.",
   cover:"radial-gradient(70% 60% at 85% 10%, rgba(255,255,255,.22), transparent 60%), linear-gradient(140deg,#2F5BFF,#16318F)", fg:"#FFFFFF"},
  {id:"maash", name:"Maash Henna", line:"Identity & packaging", client:"Maash Henna", sector:"Henna brand",
   role:["Brand identity","Guidelines","Packaging"],
   sum:"Contributed to the brand identity, the guidelines PDF and the packaging, including the paper shopping bag.",
   cover:"radial-gradient(circle at 28% 72%, #A5532A, #5B220F 70%)", fg:"#F8E7D7"}
];
const pad = n => String(n).padStart(2,"0");

/* ---------------- case studies ----------------
   Each project page is a cover image plus a list of blocks:
   text    {h, p}                     section label + one paragraph
   full    {k, c, r}                  one wide image
   grid    {r, items, scroll}         images in a row (scroll = swipe strip on phones)
   ba      {a, b}                     before / after pair
   phones  {h, items}                 vertical Stories / Reels in phone frames
   palette {sw:[{n, hex}]}            brand colours
   split   {k, c, r, h, p, flip}      image beside text
   post    {who, text, h, p}          Instagram caption beside text
   k is a media key (assets/js/media.js). demo:true shows the "Demo media" tag.
   All copy and media below are demo placeholders: replace them with the real work. */
const CASE = {
  dulight:{demo:true, cover:"dulight-cover", blocks:[
    {t:"text", h:"The brief", p:"DuLight makes LED lighting in Dubai. The rebrand covered the whole identity: a new mark, a brand voice, and a system that holds up on signage, packaging and print."},
    {t:"ba", a:{k:"dulight-old", c:"Previous mark"}, b:{k:"dulight-new", c:"New mark"}},
    {t:"text", h:"The mark", p:"The new mark is a single arc of light. It reads at sign scale and still works as a small icon on a product label."},
    {t:"palette", sw:[{n:"Night", hex:"#0C0D10"},{n:"Graphite", hex:"#1F2127"},{n:"Amber", hex:"#FFCD6E"},{n:"Warm white", hex:"#F6EBD3"}]},
    {t:"full", k:"dulight-system", c:"Stationery system", r:"21/9"},
    {t:"grid", r:"3/4", items:[{k:"dulight-signage", c:"Showroom signage"},{k:"dulight-pack", c:"Product packaging"}]}
  ]},
  zee:{demo:true, cover:"zee-cover", blocks:[
    {t:"text", h:"The brief", p:"Zee Real Estate needed a brand foundation before it could post anything. The visual system came first, then carousels, Stories, Reels and event material built on it."},
    {t:"full", k:"zee-board", c:"Brand foundation: colour, type and monogram"},
    {t:"text", h:"Social system", p:"One grid, one type scale and two colours, so every carousel and Story looks like it came from the same brand."},
    {t:"grid", r:"4/5", scroll:true, items:[{k:"zee-slide-1", c:"Carousel, slide 1"},{k:"zee-slide-2", c:"Carousel, slide 2"},{k:"zee-slide-3", c:"Carousel, slide 3"}]},
    {t:"phones", h:"Stories and Reels", items:[{k:"zee-story-1", c:"Story"},{k:"zee-story-2", c:"Story"},{k:"zee-story-3", c:"Reel cover"}]},
    {t:"full", k:"zee-event", c:"Launch event backdrop and banners"}
  ]},
  ethra:{demo:true, cover:"ethra-cover", blocks:[
    {t:"text", h:"The brief", p:"Celestial Collection is five scents, each tied to its own place in Dubai. Every scent needed its own look while still reading as one collection."},
    {t:"grid", r:"3/4", scroll:true, items:[{k:"ethra-elysia", c:"Elysia"},{k:"ethra-selene", c:"Selene"},{k:"ethra-nox", c:"Nox"},{k:"ethra-sola", c:"Sola"},{k:"ethra-helios", c:"Helios"}]},
    {t:"text", h:"Reels", p:"Vertical cuts for Instagram, shot in the same locations and colour grades as the stills."},
    {t:"phones", h:"Campaign reels", items:[{k:"ethra-reel-1", c:"Nox reel"},{k:"ethra-reel-2", c:"Helios reel"}]}
  ]},
  mirage:{demo:true, cover:"mirage-cover", blocks:[
    {t:"text", h:"The project", p:"Exterior and interior renders for Nadan Serenity, from the aerial view of the community down to single rooms."},
    {t:"full", k:"mirage-aerial", c:"Aerial view", r:"21/9"},
    {t:"text", h:"Interiors", p:"Warm, natural materials and soft daylight, kept consistent from room to room."},
    {t:"grid", r:"3/4", items:[{k:"mirage-living", c:"Living room"},{k:"mirage-bedroom", c:"Master bedroom"}]},
    {t:"full", k:"mirage-night", c:"Exterior at dusk"}
  ]},
  connectin:{demo:true, cover:"connectin-cover", blocks:[
    {t:"text", h:"The brief", p:"Setting up a company in Dubai takes a lot of steps. The goal was Instagram content that explains them simply, one carousel at a time."},
    {t:"grid", r:"4/5", scroll:true, items:[
      {k:"connectin-slide-1", c:"Slide 1", n:"01", o:"Mainland or free zone?"},
      {k:"connectin-slide-2", c:"Slide 2", n:"02", o:"Pick your business activity"},
      {k:"connectin-slide-3", c:"Slide 3", n:"03", o:"Get your trade licence"},
      {k:"connectin-slide-4", c:"Slide 4", n:"04", o:"Visas and a bank account"}]},
    {t:"post", who:"ConnectIn Business Services", h:"Captions", p:"Each carousel ships with a caption that repeats the steps in plain words and ends with one clear next step.",
     text:"Thinking about starting a business in Dubai? Here is the short version:\n\n1. Choose mainland or free zone\n2. Pick your business activity\n3. Get your trade licence\n4. Sort out visas and your bank account\n\nSave this for later, and send us a DM if you want help with any step."}
  ]},
  maash:{demo:true, cover:"maash-cover", blocks:[
    {t:"text", h:"The work", p:"Brand identity, a guidelines PDF and packaging for a henna brand, all built around one fine line pattern."},
    {t:"full", k:"maash-pack", c:"Packaging range"},
    {t:"palette", sw:[{n:"Henna", hex:"#5B220F"},{n:"Terracotta", hex:"#A5532A"},{n:"Kraft", hex:"#C9A27A"},{n:"Cream", hex:"#F8E7D7"}]},
    {t:"split", k:"maash-bag", c:"Paper shopping bag", r:"3/4", h:"Shopping bag", p:"The bag carries the henna line pattern in a single colour, so it prints cleanly and is still recognisable from across a room."},
    {t:"full", k:"maash-guide", c:"Brand guidelines PDF"}
  ]}
};
const MEDIA = window.MEDIA || {};
const src = k => MEDIA[k] || `assets/img/projects/${k}.webp`;

/* ---------------- helpers ---------------- */
const $ = s => document.querySelector(s);
const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
const lerp = (a,b,t) => a+(b-a)*t;
const seg = (p,a,b) => clamp((p-a)/(b-a));
const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const home=$("#home"), proj=$("#project"), intro=$("#intro"), big=$(".big"), meet=$(".meet"), cut=$(".cut"),
      profile=$("#about"), fig=$("#portrait"), flier=$("#flier"), fSide=flier.querySelector(".f-side"), fPort=flier.querySelector(".f-port");

/* ---------------- headline sequence ---------------- */
const head=$("#head"), pill=$("#pill"), word=$("#word");
const words=["screen","paper","the road"];
let wi=0, timers=[], loop=null, played=false;
const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
function swap(){
  wi=(wi+1)%words.length;
  if(reduce){ word.textContent=words[wi]; return; }
  word.classList.add("out");
  later(()=>{ word.textContent=words[wi]; word.classList.remove("out"); word.classList.add("in"); void word.offsetWidth; word.classList.remove("in"); },500);
}
function resetHead(){
  timers.forEach(clearTimeout); timers=[]; clearInterval(loop);
  head.classList.remove("play","late-in"); pill.classList.remove("blue","go");
  wi=0; word.textContent=words[0]; word.className="word"; played=false;
}
function playHead(){
  if(played) return; played=true;
  if(reduce){ head.classList.add("play","late-in"); pill.classList.add("blue","go"); loop=setInterval(swap,2800); return; }
  head.classList.add("play");                       // words slide up; "move" arrives fully black
  later(()=>pill.classList.add("blue"),1500);       // the o turns blue…
  later(()=>pill.classList.add("go"),1750);         // …and stretches, then stays
  later(()=>head.classList.add("late-in"),2850);    // "on screen" rolls in
  later(()=>{ loop=setInterval(swap,2600); },4200); // screen → paper → the road
}

/* ---------------- slides: one gesture = one slide ---------------- */
const layers=[null,null,profile,$("#worklayer")];
const dots=[...document.querySelectorAll("#dots button")];
let s=-1, busy=false;
const DUR=reduce?0:1150;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function setS(n){
  s=n; home.dataset.s=String(n);
  dots.forEach((d,k)=>{ d.classList.toggle("on",k===n); if(k===n) d.setAttribute("aria-current","step"); else d.removeAttribute("aria-current"); });
}
function applyStatic(n){
  cut.style.visibility = n>=2 ? "hidden" : "visible";
  fig.classList.toggle("hold", n<2);
  if(n>=2) playHead(); else resetHead();
}
// the side profile travels into the portrait card (forward) or back out of it
function fly(forward){
  const A=cut.getBoundingClientRect(), B=fig.getBoundingClientRect();
  const r=x=>({left:x.left+"px",top:x.top+"px",width:x.width+"px",height:x.height+"px"});
  const opt={duration:DUR,easing:"cubic-bezier(.7,0,.2,1)",fill:"both",direction:forward?"normal":"reverse"};
  flier.style.display="block"; fPort.style.opacity="1";
  const k=[
    flier.animate([{...r(A),backgroundColor:"rgba(255,255,255,0)"},{backgroundColor:"rgba(255,255,255,0)",offset:.15},{backgroundColor:"rgba(255,255,255,1)",offset:.4},{...r(B),backgroundColor:"rgba(255,255,255,1)"}],opt),
    fPort.animate([{clipPath:"inset(100% 0 0 0)"},{clipPath:"inset(100% 0 0 0)",offset:.3},{clipPath:"inset(0% 0 0 0)",offset:.8},{clipPath:"inset(0% 0 0 0)"}],opt),
    fSide.animate([{opacity:1},{opacity:1,offset:.55},{opacity:0,offset:.8},{opacity:0}],opt)
  ];
  return k[0].finished.then(()=>{ flier.style.display="none"; k.forEach(x=>x.cancel()); });
}
async function go(n){
  n=clamp(n,0,3);
  if(n===s || busy) return;
  busy=true;
  const from=s; setS(n);
  if(reduce || Math.abs(n-from)>1){ applyStatic(n); await wait(DUR); }
  else if(from===1 && n===2){ cut.style.visibility="hidden"; fig.classList.add("hold"); await fly(true); fig.classList.remove("hold"); setTimeout(playHead,120); }
  else if(from===2 && n===1){ resetHead(); fig.classList.add("hold"); await fly(false); cut.style.visibility="visible"; }
  else await wait(DUR);
  busy=false;
}
const canScroll=dir=>{ const el=layers[s]; if(!el) return false; return dir>0 ? el.scrollTop+el.clientHeight < el.scrollHeight-2 : el.scrollTop>1; };

let lastWheel=0, used=false;
addEventListener("wheel",e=>{
  if(home.hidden) return;
  const now=performance.now();
  if(now-lastWheel>220) used=false;           // a new gesture starts after a short pause
  lastWheel=now;
  const dir=Math.sign(e.deltaY); if(!dir) return;
  if(e.target.closest && e.target.closest(".shelf") && Math.abs(e.deltaX)>Math.abs(e.deltaY)) return;
  if(canScroll(dir)){ used=true; return; }    // let a tall slide scroll inside first
  e.preventDefault();
  if(used || busy || Math.abs(e.deltaY)<4) return;
  used=true; go(s+dir);
},{passive:false});

let ty=null, edge={};
addEventListener("touchstart",e=>{ if(home.hidden) return; ty=e.touches[0].clientY; edge={d:canScroll(1),u:canScroll(-1)}; },{passive:true});
addEventListener("touchend",e=>{
  if(home.hidden || ty==null) return;
  const dy=ty-e.changedTouches[0].clientY; ty=null;
  if(Math.abs(dy)<50) return;
  const dir=Math.sign(dy);
  if(dir>0 ? edge.d : edge.u) return;
  go(s+dir);
},{passive:true});

addEventListener("keydown",e=>{
  if(home.hidden) return;
  const onBtn=e.target.closest && e.target.closest("button,a,input,textarea");
  if(["ArrowDown","PageDown"].includes(e.key) || (e.key===" " && !onBtn)){ if(!canScroll(1)){ e.preventDefault(); go(s+1); } }
  else if(["ArrowUp","PageUp"].includes(e.key)){ if(!canScroll(-1)){ e.preventDefault(); go(s-1); } }
});
dots.forEach((d,k)=>d.addEventListener("click",()=>go(k)));
document.querySelectorAll("[data-go]").forEach(a=>a.addEventListener("click",e=>{ e.preventDefault(); go(+a.dataset.go); }));

/* ---------------- project shelf ---------------- */
const shelf=$("#shelf"), nums=$("#nums"), fill=$("#fill");
$("#total").textContent=pad(P.length);
let active=0;
shelf.innerHTML=P.map((x,i)=>`
  <button type="button" class="card" role="listitem" data-i="${i}" id="card-${x.id}" style="--cover:${x.cover};--fg:${x.fg}" aria-label="Open ${x.name}: ${x.line}">
    <span class="no">${pad(i+1)}</span>
    <span class="go">View project →</span>
    <span><span class="nm">${x.name}</span><span class="ln2">${x.line}</span></span>
  </button>`).join("");
const cards=[...shelf.children];
function setActive(i){
  active=(i+P.length)%P.length;
  cards.forEach((c,k)=>c.classList.toggle("on",k===active));
  fill.style.width=((active+1)/P.length*100)+"%";
  nums.innerHTML=P.map((_,k)=>k===active?`<b>${k+1}</b>`:`<span>${k+1}</span>`).join("");
}
cards.forEach((c,i)=>{
  c.addEventListener("pointerenter",e=>{ if(e.pointerType==="mouse") setActive(i); });
  c.addEventListener("focus",()=>setActive(i));
  c.addEventListener("click",()=>{ location.hash="p-"+P[i].id; });
});
$("#prev").addEventListener("click",()=>{ setActive(active-1); cards[active].scrollIntoView({block:"nearest",inline:"start",behavior:"smooth"}); });
$("#next").addEventListener("click",()=>{ setActive(active+1); cards[active].scrollIntoView({block:"nearest",inline:"start",behavior:"smooth"}); });
setActive(0);

/* ---------------- project page ---------------- */
// a single image with its caption; ratio comes from the item or its block
function mediaFig(it,r,extra=""){
  return `<figure class="m">
    <div class="ph" style="--r:${it.r||r||"16/9"}"><img src="${src(it.k)}" alt="${it.c||""}" loading="lazy" decoding="async">${extra}${it.o?`<div class="ov"><span>${it.n||""}</span><strong>${it.o}</strong></div>`:""}</div>
    ${it.c?`<figcaption>${it.c}</figcaption>`:""}
  </figure>`;
}
// dark or light text for a colour swatch
const onColor = hex => { const n=parseInt(hex.slice(1),16), l=(0.299*(n>>16)+0.587*(n>>8&255)+0.114*(n&255))/255; return l>.6?"#14161A":"#FFFFFF"; };
const BLOCK = {
  text:b=>`<section class="b b-text"><h2 class="label">${b.h}</h2><p>${b.p}</p></section>`,
  full:b=>`<div class="b b-full">${mediaFig(b,b.r)}</div>`,
  grid:b=>`<div class="b b-grid${b.scroll?" scroll":""}" style="--n:${b.items.length}">${b.items.map(it=>mediaFig(it,b.r)).join("")}</div>`,
  ba:b=>`<div class="b b-ba">${mediaFig(b.a,"1/1",`<span class="tag">Before</span>`)}${mediaFig(b.b,"1/1",`<span class="tag">After</span>`)}</div>`,
  phones:b=>`<div class="b b-phones"><p class="label">${b.h}</p><div class="row" style="--n:${b.items.length}">${b.items.map(it=>mediaFig(it,"9/16")).join("")}</div></div>`,
  palette:b=>`<div class="b b-pal" role="list" aria-label="Brand colours">${b.sw.map(s=>`<div class="sw" role="listitem" style="--c:${s.hex};--t:${onColor(s.hex)}"><span>${s.n}</span><code>${s.hex}</code></div>`).join("")}</div>`,
  split:b=>`<div class="b b-split${b.flip?" flip":""}">${mediaFig(b,b.r)}<div class="st"><h2 class="label">${b.h}</h2><p>${b.p}</p></div></div>`,
  post:b=>`<div class="b b-split"><div class="post"><div class="who"><i aria-hidden="true"></i><b>${b.who}</b></div><p>${b.text}</p></div><div class="st"><h2 class="label">${b.h}</h2><p>${b.p}</p></div></div>`
};

function renderProject(i){
  const x=P[i], nx=P[(i+1)%P.length], cs=CASE[x.id];
  const gallery = cs
    ? cs.blocks.map(b=>BLOCK[b.t](b)).join("")
    : `<div class="slot-img s-12">Hero image</div><div class="slot-img s-6">Image 02</div><div class="slot-img s-6">Image 03</div><div class="slot-img s-12">Image 04</div>`;
  proj.innerHTML=`
    <div class="pbar"><div class="wrap">
      <button type="button" class="back" id="back"><span>←</span>All projects</button>
      <span class="pright">${cs&&cs.demo?`<span class="demo" title="AI-generated placeholder images and copy">Demo media</span>`:""}<span class="pcount">${pad(i+1)} / ${pad(P.length)}</span></span>
    </div></div>
    <header class="pcover${cs?" has-img":""}" style="--cover:${x.cover};--fg:${x.fg}">
      ${cs?`<img src="${src(cs.cover)}" alt="" fetchpriority="high">`:""}
      <div class="wrap">
      <p class="label">${x.sector}</p><h1>${x.name}</h1><p>${x.line}</p>
    </div></header>
    <div class="wrap">
      <section class="pmeta">
        <dl>
          <div><dt>Client</dt><dd>${x.client}</dd></div>
          <div><dt>Sector</dt><dd>${x.sector}</dd></div>
          <div><dt>What I did</dt><dd>${x.role.join(" · ")}</dd></div>
        </dl>
        <p class="sum">${x.sum}</p>
      </section>
      <section class="${cs?"blocks":"gal"}" aria-label="Project images">${gallery}</section>
      <div class="next">
        <button type="button" class="back" id="back2"><span>←</span>Back to all projects</button>
        <button type="button" class="next-link" id="nextp"><p class="label">Next project</p><strong>${nx.name} →</strong></button>
      </div>
    </div>`;
  const goBack=()=>{ location.hash="work"; };
  $("#back").addEventListener("click",goBack);
  $("#back2").addEventListener("click",goBack);
  $("#nextp").addEventListener("click",()=>{ location.hash="p-"+nx.id; });
}

/* ---------------- routing (#work, #p-<id>) ---------------- */
function route(){
  const h=location.hash.slice(1);
  const i=P.findIndex(x=>"p-"+x.id===h);
  if(i>=0){
    home.hidden=true; proj.hidden=false; flier.style.display="none";
    document.documentElement.classList.remove("lock");
    renderProject(i); setActive(i); scrollTo(0,0);
  } else {
    proj.hidden=true; home.hidden=false;
    document.documentElement.classList.add("lock"); scrollTo(0,0);
    const n = (h==="work"||h==="contact") ? 3 : h==="about" ? 2 : (s<0 ? 0 : s);
    if(n!==s){ busy=false; setS(n); applyStatic(n); }
  }
}
addEventListener("hashchange",route);
route();
})();
