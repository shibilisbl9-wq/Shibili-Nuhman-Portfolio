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
function renderProject(i){
  const x=P[i], nx=P[(i+1)%P.length];
  const gallery = x.ba
    ? `<div class="slot-img s-ba">Old logo</div><div class="slot-img s-ba">New logo</div><div class="slot-img s-12">Identity system</div><div class="slot-img s-6">Application 01</div><div class="slot-img s-6">Application 02</div>`
    : `<div class="slot-img s-12">Hero image</div><div class="slot-img s-6">Image 02</div><div class="slot-img s-6">Image 03</div><div class="slot-img s-12">Image 04</div>`;
  proj.innerHTML=`
    <div class="pbar"><div class="wrap">
      <button type="button" class="back" id="back"><span>←</span>All projects</button>
      <span class="pcount">${pad(i+1)} / ${pad(P.length)}</span>
    </div></div>
    <header class="pcover" style="--cover:${x.cover};--fg:${x.fg}"><div class="wrap">
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
      <section class="gal" aria-label="Project images">${gallery}</section>
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
