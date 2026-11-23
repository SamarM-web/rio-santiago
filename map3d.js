/* 3D extruded municipality map with station pins / pillars (canvas, no libraries) */
(function(){
const A=window.ATLAS,U=window.U;
const ZC=U.ZC;
function create(cv,opt){
 opt=opt||{};const M=A.munis,ST=A.stations,order=A.order,zoneOf=Object.fromEntries(order.map((s,i)=>[s,A.zone[i]]));
 const xs=M.flatMap(m=>m.rings.flat().map(p=>p[0])),ys=M.flatMap(m=>m.rings.flat().map(p=>p[1]));
 const BX=[Math.min(...xs),Math.max(...xs)],BY=[Math.min(...ys),Math.max(...ys)],CX=(BX[0]+BX[1])/2,CY=(BY[0]+BY[1])/2,SPAN=Math.max(BX[1]-BX[0],BY[1]-BY[0]);
 const cx=cv.getContext('2d');let W=0,H=0,DPR=1;
 const cam={yaw:-0.55,pitch:0.82,zoom:opt.zoom||1,spin:opt.spin!==false};
 const S={ind:'m',yr:2,relief:1,pillars:null,pillarColor:'zone',landmarks:false,sel:null,selSt:null,labels:true};
 let hov=null,hovSt=null,busy=true,drawn=[],pins=[];
 const ZS=34;
 const ramp=[[0,[236,238,228]],[.4,[184,196,190]],[.75,[100,131,150]],[1,[24,52,66]]];
 function rampC(p){for(let i=1;i<ramp.length;i++){if(p<=ramp[i][0]){const a=ramp[i-1],b=ramp[i],f=(p-a[0])/(b[0]-a[0]);return a[1].map((c,k)=>Math.round(c+(b[1][k]-c)*f))}}return ramp[3][1]}
 function ranks(){if(S.ind==='none'){M.forEach(m=>m.tg=0);return}
  const key=S.ind,i=S.yr,v=M.map(m=>m[key][i]),idx=v.map((x,j)=>j).sort((a,b)=>v[a]-v[b]),r=new Array(M.length);idx.forEach((j,k)=>r[j]=k/(M.length-1));M.forEach((m,j)=>{m.tg=r[j];if(m.h==null)m.h=r[j]})}
 function proj(x,y,z){x-=CX;y-=CY;const c=Math.cos(cam.yaw),s=Math.sin(cam.yaw),X=x*c-y*s,Y=x*s+y*c,p=cam.pitch,sc=Math.min(W,H)/SPAN*0.92*cam.zoom;
  const d=Y*Math.cos(p)-z*Math.sin(p),f=1/(1+d*0.0011);return [W/2+X*sc*f,H*0.54-(Y*Math.sin(p)+z*Math.cos(p))*sc*f,d,sc*f]}
 const topZ=m=>(0.03+(S.ind==='none'?0:m.h)*0.97)*ZS*S.relief;
 function resize(){DPR=Math.min(2,devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0);busy=true}
 const muniOf=Object.fromEntries(M.map(m=>[m.c,m]));
 const stMuni=s=>s.c?muniOf[String(parseInt(s.c))]:null;
 function prism(ring,z0,z1,col,edge){ // ring in km, draws visible walls then top; returns top polygon
  let area=0;for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];area+=a[0]*b[1]-b[0]*a[1]}const ccw=area>0,cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch);
  for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];let dx=b[0]-a[0],dy=b[1]-a[1];const Ln=Math.hypot(dx,dy)||1;let nx=dy/Ln,ny=-dx/Ln;if(!ccw){nx=-nx;ny=-ny}
   if(cam.pitch>=1.5)continue;if((nx*sy+ny*cy)*cp>=-0.0001)continue;const sh=.58+.16*(nx*cy-ny*sy);
   const p1=proj(a[0],a[1],z0),p2=proj(b[0],b[1],z0),p3=proj(b[0],b[1],z1),p4=proj(a[0],a[1],z1);
   cx.fillStyle=`rgb(${Math.round(col[0]*sh)},${Math.round(col[1]*sh)},${Math.round(col[2]*sh)})`;cx.beginPath();cx.moveTo(p1[0],p1[1]);cx.lineTo(p2[0],p2[1]);cx.lineTo(p3[0],p3[1]);cx.lineTo(p4[0],p4[1]);cx.closePath();cx.fill()}
  return ring.map(p=>proj(p[0],p[1],z1))}
 function draw(){
  cx.clearRect(0,0,W,H);
  const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0d2a2b');g.addColorStop(1,'#0a1e1e');cx.fillStyle=g;cx.fillRect(0,0,W,H);
  const gs=cx.createRadialGradient(W/2,H*0.66,10,W/2,H*0.66,Math.min(W,H)*0.55);gs.addColorStop(0,'rgba(0,0,0,.35)');gs.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gs;cx.fillRect(0,0,W,H);
  const items=M.map(m=>{let d=0,n=0;m.rings.forEach(r=>r.forEach(p=>{d+=proj(p[0],p[1],0)[2];n++}));return {m,d:d/n}});
  const stIn=ST.filter(s=>!stMuni(s)).map(s=>({st:s,d:proj(s.x,s.y,0)[2]}));
  const all=items.concat(stIn).sort((a,b)=>b.d-a.d);drawn=[];pins=[];
  const stList=[];
  for(const it of all){
   if(it.m){const m=it.m,z=topZ(m),col=rampC(m.tg),isSel=S.sel===m,isHov=hov===m,top=[];
    for(const ring of m.rings)top.push(prism(ring,0,z,col));
    cx.beginPath();top.forEach(tp=>{tp.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.closePath()});
    cx.fillStyle=isSel||isHov?`rgb(${Math.min(255,col[0]+30)},${Math.min(255,col[1]+30)},${Math.min(255,col[2]+30)})`:`rgb(${col[0]},${col[1]},${col[2]})`;cx.fill();
    cx.lineWidth=isSel?2.6:isHov?1.8:.7;cx.strokeStyle=isSel?'#ffe9a8':isHov?'#fff':'rgba(10,30,30,.5)';cx.stroke();drawn.push({m,top});
    for(const sid of m.st){const s=ST.find(x=>x.id===sid);if(s)stObj(s,z)}}
   else stObj(it.st,2)}
  function stObj(s,baseZ){const pv=S.pillars&&S.pillars[s.id];const z0=baseZ;let z1=z0+1.5,topp;
   if(pv&&pv.h!=null){const w=opt.pillarW||1.9,hh=Math.max(.6,pv.h*(opt.pillarMax||34));z1=z0+hh;const ring=[[s.x-w,s.y-w],[s.x+w,s.y-w],[s.x+w,s.y+w],[s.x-w,s.y+w]];
    const col=hex(pv.col||ZC[zoneOf[s.id]]);cx.globalAlpha=pv.ghost?.45:1;const tp=prism(ring,z0,z1,col);cx.beginPath();tp.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.closePath();cx.fillStyle=`rgb(${Math.min(255,col[0]+30)},${Math.min(255,col[1]+30)},${Math.min(255,col[2]+30)})`;cx.fill();cx.lineWidth=S.selSt===s.id?2.4:1;cx.strokeStyle=S.selSt===s.id?'#ffe9a8':'rgba(0,0,0,.6)';if(pv.ghost)cx.setLineDash([3,3]);cx.stroke();cx.setLineDash([]);cx.globalAlpha=1;
    const pt=proj(s.x,s.y,z1);stList.push({s,x:pt[0],y:pt[1],r:12,pv,z1});return}
   const b=proj(s.x,s.y,z0),p=proj(s.x,s.y,z0+9),tr=U.isTrib(s.id),c=ZC[zoneOf[s.id]];
   cx.strokeStyle='rgba(255,255,255,.75)';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(b[0],b[1]);cx.lineTo(p[0],p[1]);cx.stroke();
   cx.beginPath();cx.arc(p[0],p[1],hovSt===s.id||S.selSt===s.id?8:6.5,0,7);cx.fillStyle=tr?'#0a1e1e':c;cx.fill();cx.lineWidth=tr?3:2;cx.strokeStyle=tr?c:'#fff';cx.stroke();
   stList.push({s,x:p[0],y:p[1],r:11,z1:z0+9})}
  // river line through main-river stations (station order, not the real river course)
  if(opt.line!==false){const rp=['RS-01','RS-02','RS-03','RS-04','RS-05','RS-06','RS-07','RS-08','RS-09','RS-10'].map(id=>{const s=ST.find(x=>x.id===id),m=stMuni(s);const p=proj(s.x,s.y,(m?topZ(m):2)+1.2);return p});
   cx.lineJoin='round';cx.strokeStyle='rgba(6,20,20,.65)';cx.lineWidth=5;cx.beginPath();rp.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke();cx.strokeStyle='#9fd6e6';cx.lineWidth=2.2;cx.beginPath();rp.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke()}
  // labels
  cx.textAlign='center';cx.font='bold 13px Palatino Linotype,Palatino,serif';
  stList.sort((a,b)=>a.y-b.y);
  for(const q of stList){if(S.labels){const txt=q.pv&&q.pv.label?q.s.id+' · '+q.pv.label:q.s.id;cx.lineWidth=3;cx.strokeStyle='rgba(6,20,20,.9)';cx.strokeText(txt,q.x,q.y-12);cx.fillStyle='#fff';cx.fillText(txt,q.x,q.y-12)}pins.push(q)}
  if(S.landmarks){cx.font='italic 13px Palatino Linotype,Palatino,serif';for(const l of A.landmarks){const m=M.find(mm=>mm.n===l.n),p=proj(l.x,l.y,(m?topZ(m):1)+.5);cx.fillStyle='#ffe9a8';cx.beginPath();cx.arc(p[0],p[1],2.4,0,7);cx.fill();cx.lineWidth=3;cx.strokeStyle='rgba(6,20,20,.85)';cx.strokeText(l.n,p[0],p[1]+13);cx.fillStyle='#ffe9a8';cx.fillText(l.n,p[0],p[1]+13)}}
 }
 function hex(h){const n=parseInt(h.slice(1),16);return [(n>>16)&255,(n>>8)&255,n&255]}
 function inPoly(px,py,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a[1]>py)!==(b[1]>py))&&(px<(b[0]-a[0])*(py-a[1])/(b[1]-a[1])+a[0]))c=!c}return c}
 function pick(px,py){for(let i=pins.length-1;i>=0;i--){const q=pins[i];if(Math.hypot(px-q.x,py-q.y)<q.r)return {st:q.s}}for(let i=drawn.length-1;i>=0;i--)for(const tp of drawn[i].top)if(inPoly(px,py,tp))return {m:drawn[i].m};return {}}
 function frame(){let moving=false;for(const m of M){const d=m.tg-m.h;if(Math.abs(d)>.002){m.h+=d*.14;moving=true}else m.h=m.tg}
  if(cam.spin){cam.yaw+=.0025;moving=true}if(moving||busy){draw();busy=false}requestAnimationFrame(frame)}
 let drag=null;
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,moved:0};if(cam.spin){cam.spin=false;opt.onSpin&&opt.onSpin(false)}});
 cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
  if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved+=Math.abs(dx)+Math.abs(dy);drag.x=e.clientX;drag.y=e.clientY;cam.yaw+=dx*.0065;cam.pitch=Math.max(.25,Math.min(1.5,cam.pitch+dy*.005));busy=true;return}
  const k=pick(px,py),nm=k.m||null,ns=k.st?k.st.id:null;if(nm!==hov||ns!==hovSt){hov=nm;hovSt=ns;busy=true}
  if(k.st){const s=k.st,pv=S.pillars&&S.pillars[s.id];U.tip(`<b>${s.id}</b> · ${s.site}<br>${U.zn(zoneOf[s.id])}${U.isTrib(s.id)?' · '+U.t('trib'):''}<br>${s.muni}${pv&&pv.tip?'<br>'+pv.tip:''}`,e)}else if(k.m)U.tip(`<b>${k.m.n}</b>`,e);else U.untip()});
 cv.addEventListener('pointerleave',()=>{hov=null;hovSt=null;U.untip();busy=true});
 cv.addEventListener('pointerup',e=>{if(drag&&drag.moved<6){const r=cv.getBoundingClientRect(),k=pick(e.clientX-r.left,e.clientY-r.top);
   if(k.st){S.selSt=k.st.id;const m=stMuni(k.st);if(m)S.sel=m;opt.onSelect&&opt.onSelect({st:k.st,m})}else if(k.m){S.sel=k.m;S.selSt=null;opt.onSelect&&opt.onSelect({m:k.m})}busy=true}drag=null});
 cv.addEventListener('wheel',e=>{e.preventDefault();cam.zoom=Math.max(.7,Math.min(3.4,cam.zoom*(e.deltaY<0?1.1:.91)));busy=true},{passive:false});
 let pd=null;cv.addEventListener('touchmove',e=>{if(e.touches.length===2){e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pd)cam.zoom=Math.max(.7,Math.min(3.4,cam.zoom*d/pd));pd=d;busy=true}},{passive:false});cv.addEventListener('touchend',()=>{pd=null});
 addEventListener('resize',resize);resize();ranks();frame();
 return {
  set(o){const needRank=('ind' in o&&o.ind!==S.ind)||('yr' in o&&o.yr!==S.yr);Object.assign(S,o);if(needRank){ranks()}busy=true},
  state:S,
  view(v){if(v==='top'){cam.yaw=0;cam.pitch=1.5;cam.spin=false}else if(v==='reset'){cam.yaw=-.55;cam.pitch=.82;cam.zoom=opt.zoom||1;cam.spin=true}else if(v==='spin'){cam.spin=!cam.spin}busy=true;return cam.spin},
  spin(on){cam.spin=on;busy=true},
  select(m,st){S.sel=m||null;S.selSt=st||null;busy=true},
  redraw(){busy=true},rank(m){return {pct:m.tg,rank:M.filter(x=>x[S.ind==='none'?'m':S.ind][S.yr]>m[S.ind==='none'?'m':S.ind][S.yr]).length+1}},
  resize
 }}
window.Map3D={create};
})();
