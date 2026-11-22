/* Spider-web video opener, two modes: window.VFX_MODE = "web" (A) or "comic" (B). Cards with data-src open in the in-page player. */
(function(){
const NS="http://www.w3.org/2000/svg",MODE=window.VFX_MODE||"web";
const css=`.vfx{position:fixed;inset:0;z-index:999;display:none;overflow:hidden}.vfx.on{display:block}
.vfx .bd{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(90,10,16,.92),rgba(8,2,4,.97));opacity:0}
.vfx svg.web{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.vfx .pl{position:absolute;left:50%;top:50%;width:min(92vw,calc(78vh*.5625));transform:translate(-50%,-50%);border-radius:22px;border:3px solid #fff;background:#000;box-shadow:10px 10px 0 #c8141d,0 30px 80px rgba(0,0,0,.7);overflow:hidden;opacity:0;z-index:3}
.vfx video{display:block;width:100%;aspect-ratio:9/16;max-height:78vh;background:#000;object-fit:contain}
.vfx .bar{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:#14050a;color:#fff;font-family:Cairo,sans-serif;font-weight:800}
.vfx .x{all:unset;cursor:pointer;width:38px;height:38px;border-radius:50%;background:#fff;color:#c8141d;font-weight:900;text-align:center;line-height:38px;font-size:18px}
.vfx .pn{position:absolute;inset:-5%;z-index:4;pointer-events:none;opacity:0}
.vfx .pr{background:#d9202a;clip-path:polygon(0 0,100% 0,0 100%)}.vfx .pb{background:#1b2a8c;clip-path:polygon(100% 0,100% 100%,0 100%)}
.vfx .pn:after{content:"";position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.35) 1.5px,transparent 1.6px) 0 0/10px 10px}
.vfx .tw{direction:ltr;position:absolute;left:50%;top:50%;z-index:5;font-family:Anton,Impact,sans-serif;font-size:min(26vw,220px);line-height:1;color:#ffd400;-webkit-text-stroke:6px #0a0b1e;paint-order:stroke fill;text-shadow:10px 10px 0 #0a0b1e;opacity:0;white-space:nowrap;pointer-events:none}
.vfx .sh{position:absolute;inset:0;z-index:2;pointer-events:none}`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
const root=document.createElement("div");root.className="vfx";
root.innerHTML='<div class="bd"></div><svg class="web sh"></svg><div class="pl"><div class="bar"><span class="tt"></span><button class="x" aria-label="close">✕</button></div><video controls playsinline preload="metadata"></video></div>'+(MODE==="comic"?'<div class="pn pr"></div><div class="pn pb"></div><div class="tw">THWIP!</div>':'');
document.body.appendChild(root);
const q=s=>root.querySelector(s),bd=q(".bd"),svg=q("svg"),pl=q(".pl"),vid=q("video"),tt=q(".tt");
function mk(tag,at){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);return e}
function buildWeb(cx,cy){svg.innerHTML="";const W=innerWidth,H=innerHeight;svg.setAttribute("viewBox","0 0 "+W+" "+H);
 const R=Math.hypot(W,H),N=18,rings=[.07,.15,.26,.4,.58,.82].map(f=>f*R*.7),pts=[];
 for(let i=0;i<N;i++){const a=i/N*Math.PI*2+.12;pts.push([Math.cos(a),Math.sin(a)])}
 const g=mk("g",{fill:"none",stroke:"#fff","stroke-linecap":"round"});svg.appendChild(g);
 g.appendChild(mk("line",{x1:cx,y1:-20,x2:cx,y2:cy,"stroke-width":4,pathLength:1,class:"th"}));
 pts.forEach(([dx,dy])=>g.appendChild(mk("line",{x1:cx,y1:cy,x2:cx+dx*R,y2:cy+dy*R,"stroke-width":2.2,pathLength:1,class:"sp"})));
 rings.forEach((r,k)=>{let d="";for(let i=0;i<=N;i++){const[dx,dy]=pts[i%N],x=cx+dx*r,y=cy+dy*r;if(i==0)d+="M"+x+" "+y;else{const[px,py]=pts[i-1],ang=Math.atan2(py+dy,px+dx);d+="Q"+(cx+Math.cos(ang)*r*.86)+" "+(cy+Math.sin(ang)*r*.86)+" "+x+" "+y}}
  g.appendChild(mk("path",{d,"stroke-width":1.8,pathLength:1,class:"rg","data-k":k}))});
 return g}
function buildShot(W,H){svg.innerHTML="";const cx=W/2,cy=H/2,sx=W+20,sy=-20;const g=mk("g",{fill:"none",stroke:"#fff","stroke-linecap":"round"});svg.appendChild(g);
 g.appendChild(mk("line",{x1:sx,y1:sy,x2:cx,y2:cy,"stroke-width":7,pathLength:1,class:"shot"}));
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2;g.appendChild(mk("line",{x1:cx+Math.cos(a)*30,y1:cy+Math.sin(a)*30,x2:cx+Math.cos(a)*(120+(i%2)*60),y2:cy+Math.sin(a)*(120+(i%2)*60),"stroke-width":4,pathLength:1,class:"sl"}))}
 g.appendChild(mk("circle",{cx,cy,r:40,"stroke-width":5,class:"sc"}));return g}
let anims=[];
function play(w,seek){const W=innerWidth,H=innerHeight,cx=W/2,cy=H/2;
 root.classList.add("on");tt.textContent=w.title;vid.poster=w.img;vid.src=w.src;anims=[];
 const E="cubic-bezier(.2,.8,.2,1)",A=(el,kf,o)=>{const a=el.animate(kf,Object.assign({fill:"both",easing:E},o));anims.push(a);return a},D=[{strokeDasharray:"1 1",strokeDashoffset:1},{strokeDasharray:"1 1",strokeDashoffset:0}];
 if(MODE==="web"){const g=buildWeb(cx,cy);
  A(bd,[{opacity:0},{opacity:1}],{duration:450});
  A(g.querySelector(".th"),D,{duration:200,easing:"ease-in"});
  g.querySelectorAll(".sp").forEach((l,i)=>A(l,D,{duration:420,delay:180+i*8}));
  g.querySelectorAll(".rg").forEach(p=>A(p,D,{duration:380,delay:420+(+p.dataset.k)*70}));
  A(g,[{opacity:1},{opacity:1,offset:.7},{opacity:.14}],{duration:1500,easing:"ease-out"});
  A(pl,[{opacity:0,transform:"translate(-50%,-50%) scale(.2) rotate(-6deg)"},{opacity:1,transform:"translate(-50%,-50%) scale(1.06) rotate(1deg)",offset:.7},{opacity:1,transform:"translate(-50%,-50%) scale(1) rotate(0)"}],{duration:700,delay:650,easing:"cubic-bezier(.3,1.3,.5,1)"});
 }else{const g=buildShot(W,H),pr=q(".pr"),pb=q(".pb"),tw=q(".tw");
  A(bd,[{opacity:0},{opacity:1}],{duration:200});
  A(g.querySelector(".shot"),D,{duration:180,easing:"ease-in"});
  g.querySelectorAll(".sl").forEach(l=>A(l,D,{duration:200,delay:170}));
  A(g.querySelector(".sc"),[{opacity:0,transform:"scale(.3)",transformOrigin:cx+"px "+cy+"px"},{opacity:1,transform:"scale(1)",transformOrigin:cx+"px "+cy+"px"}],{duration:200,delay:170});
  A(g,[{opacity:1},{opacity:1,offset:.28},{opacity:0,offset:.34},{opacity:0}],{duration:1500,easing:"linear"});
  A(pr,[{opacity:1,transform:"translate(-110%,-110%)"},{opacity:1,transform:"translate(0,0)",offset:.3},{opacity:1,transform:"translate(0,0)",offset:.55},{opacity:1,transform:"translate(-110%,-110%)"}],{duration:1300,delay:300,easing:"cubic-bezier(.7,0,.3,1)"});
  A(pb,[{opacity:1,transform:"translate(110%,110%)"},{opacity:1,transform:"translate(0,0)",offset:.3},{opacity:1,transform:"translate(0,0)",offset:.55},{opacity:1,transform:"translate(110%,110%)"}],{duration:1300,delay:300,easing:"cubic-bezier(.7,0,.3,1)"});
  A(tw,[{opacity:0,transform:"translate(-50%,-50%) scale(.2) rotate(-14deg)"},{opacity:1,transform:"translate(-50%,-50%) scale(1.15) rotate(-6deg)",offset:.25},{opacity:1,transform:"translate(-50%,-50%) scale(1) rotate(-6deg)",offset:.7},{opacity:0,transform:"translate(-50%,-50%) scale(1.8) rotate(-6deg)"}],{duration:1000,delay:500,easing:"cubic-bezier(.3,1.4,.5,1)"});
  A(pl,[{opacity:0,transform:"translate(-50%,-50%) scale(.6)"},{opacity:0,offset:.001},{opacity:1,transform:"translate(-50%,-50%) scale(1.04)",offset:.6},{opacity:1,transform:"translate(-50%,-50%) scale(1)"}],{duration:700,delay:1150,easing:"cubic-bezier(.2,1.2,.4,1)"});
 }
 if(seek!=null)anims.forEach(a=>{a.pause();a.currentTime=seek});else setTimeout(()=>vid.play().catch(()=>{}),MODE==="web"?1300:1700)}
function close(){vid.pause();anims.forEach(a=>a.cancel());root.classList.remove("on");vid.removeAttribute("src");vid.load()}
q(".x").onclick=close;bd.onclick=close;addEventListener("keydown",e=>{if(e.key==="Escape")close()});
window.openWebVideo=play;
document.addEventListener("click",e=>{const c=e.target.closest("a.card[data-src]");if(!c)return;e.preventDefault();play({title:c.querySelector("b").textContent,img:c.querySelector("img").src,src:c.dataset.src})});
})();
