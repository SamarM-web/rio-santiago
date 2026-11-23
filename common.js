/* shared helpers: language, header, side navigator, tooltip, data utilities */
(function(){
const A=window.ATLAS||{};
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const U=window.U={$,$$,A};
/* ---------- i18n ---------- */
const T={en:{},es:{}};let LANG='en';
try{const s=localStorage.getItem('rsa_lang');if(s==='es'||s==='en')LANG=s}catch(e){}
U.add=d=>{for(const l of ['en','es'])Object.assign(T[l],d[l]||{})};
U.t=k=>(T[LANG][k]!==undefined?T[LANG][k]:(T.en[k]!==undefined?T.en[k]:k));
U.lang=()=>LANG;
U.add({en:{
 home:'Home',nHome:'Home',nQuality:'Data Quality',nTrends:'Parameter Trends',nSocio:'Socioeconomic Analysis',nAhead:'Looking Ahead',nMap:'3D Map',
 brand:'Río Santiago',brandSub:'Water-quality atlas · 2009–2025',onThisPage:'On this page',
 zB:'Above city',zU:'In city',zA:'After city',trib:'Tributary',allSt:'All stations pooled',mainOnly:'Main river only',
 station:'Station',stations:'Stations',parameter:'Parameter',unit:'Unit',years:'Years',records:'records',
 inc:'increase',dec:'decrease',nochg:'no clear change',nt:'not tested',
 overview:'Overview',ov_note:'This summary describes numbers. It does not say whether the river is better or worse, and it does not explain causes.',
 builtBy:'Built by',credLine:'Water-quality data: Government of Jalisco (credit line to be confirmed). Census indicators: IIEG Jalisco / CONAPO / CONEVAL (to be confirmed). Municipal boundaries: Mora, M. (2026), figshare, doi 10.6084/m9.figshare.31236322.v3. Towns: GeoNames via QuickMapTools.',
 photoCred:'Home-page photo (Río Grande de Santiago):',draftEs:'Spanish text is a draft awaiting proofreading by a person.',web:'Website',
 months:'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
 cat_Physicochemical:'Physicochemical',cat_Metals:'Metals & trace elements',cat_Ions:'Major ions',cat_Micro:'Microbiological',cat_NotCat:'Not categorised in source file',cat_Other:'Other inorganic',cat_Nutr:'Nutrients',cat_Organic:'Organic matter & oxygen',all:'All',
 noData:'No data',rain:'Rainy months: June to October.'
},es:{
 home:'Inicio',nHome:'Inicio',nQuality:'Calidad de los datos',nTrends:'Tendencias por parámetro',nSocio:'Análisis socioeconómico',nAhead:'Mirando adelante',nMap:'Mapa 3D',
 brand:'Río Santiago',brandSub:'Atlas de calidad del agua · 2009–2025',onThisPage:'En esta página',
 zB:'Aguas arriba',zU:'En la ciudad',zA:'Aguas abajo',trib:'Afluente',allSt:'Todas las estaciones juntas',mainOnly:'Solo río principal',
 station:'Estación',stations:'Estaciones',parameter:'Parámetro',unit:'Unidad',years:'Años',records:'registros',
 inc:'aumento',dec:'disminución',nochg:'sin cambio claro',nt:'no probado',
 overview:'Resumen',ov_note:'Este resumen describe números. No dice si el río está mejor o peor, ni explica causas.',
 builtBy:'Elaborado por',credLine:'Datos de calidad del agua: Gobierno de Jalisco (crédito por confirmar). Indicadores censales: IIEG Jalisco / CONAPO / CONEVAL (por confirmar). Límites municipales: Mora, M. (2026), figshare, doi 10.6084/m9.figshare.31236322.v3. Localidades: GeoNames vía QuickMapTools.',
 photoCred:'Foto de la página de inicio (Río Grande de Santiago):',draftEs:'El texto en español es un borrador pendiente de revisión por una persona.',web:'Sitio web',
 months:'Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic',
 cat_Physicochemical:'Fisicoquímicos',cat_Metals:'Metales y trazas',cat_Ions:'Iones principales',cat_Micro:'Microbiológicos',cat_NotCat:'Sin categoría en el archivo fuente',cat_Other:'Otras inorgánicas',cat_Nutr:'Nutrientes',cat_Organic:'Materia orgánica y oxígeno',all:'Todos',
 noData:'Sin datos',rain:'Meses de lluvia: junio a octubre.'
}});
const CATK={'Physicochemical Parameters':'cat_Physicochemical','Heavy Metals & Trace Elements':'cat_Metals','Major Ions & Inorganic Compounds':'cat_Ions','Microbiological Indicators':'cat_Micro','Not categorised in source file':'cat_NotCat','Other Specific Inorganic Substances':'cat_Other','Nutrient Parameters':'cat_Nutr','Organic Matter & Oxygen Demand':'cat_Organic'};
U.cat=c=>U.t(CATK[c]||c);
U.pn=p=>LANG==='es'?p.es:p.en;
U.zn=z=>U.t({Before:'zB',Urban:'zU',After:'zA'}[z]);
U.ZC={Before:'#2b6cb0',Urban:'#e07b1f',After:'#6b4fa3'};
U.MN=()=>U.t('months').split(',');
U.nf=n=>Number(n).toLocaleString(LANG==='es'?'es-MX':'en-US');
U.fmt=v=>v==null||isNaN(v)?'–':(Math.abs(v)>=1000?Math.round(v).toLocaleString('en-US'):(Math.abs(v)>=100?String(Math.round(v)):String(+Number(v).toPrecision(3))));
U.st=id=>A.stations[A.order.indexOf(id)];
U.sid=i=>A.order[i];
U.P=id=>A.params.find(p=>p.id===id);
/* ---------- stats ---------- */
U.median=a=>{if(!a.length)return null;const s=a.slice().sort((x,y)=>x-y),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2};
U.q=(s,q)=>{const p=(s.length-1)*q,i=Math.floor(p);return s[i]+(s[Math.min(i+1,s.length-1)]-s[i])*(p-i)};
/* ---------- data helpers ---------- */
const cache={};
U.rows=pid=>{ if(cache[pid])return cache[pid];const d=A.pts[pid],out=[];if(!d)return out;
 for(let i=0;i<d.d.length;i++){const dt=new Date(Date.UTC(2009,0,1+d.d[i])),y=dt.getUTCFullYear(),m=dt.getUTCMonth();
  out.push({t:y+(dt.getTime()-Date.UTC(y,0,1))/(365.25*864e5),v:d.v[i],s:d.s[i],id:A.order[d.s[i]],z:A.zone[d.s[i]],m,y,ym:y*12+m,dt:dt.toISOString().slice(0,10)})}
 return cache[pid]=out};
U.monthly=(pid,filter)=>{const by={};for(const r of U.rows(pid)){if(filter&&!filter(r))continue;const k=r.s+'|'+r.ym;(by[k]=by[k]||{s:r.s,ym:r.ym,v:[]}).v.push(r.v)}
 return Object.values(by).map(o=>({s:o.s,ym:o.ym,y:Math.floor(o.ym/12),m:o.ym%12,v:U.median(o.v),n:o.v.length}))};
U.annual=(pid,sIdx,season)=>{const mm=U.monthly(pid,r=>r.s===sIdx&&(!season||(season==='wet'?(r.m>=5&&r.m<=9):!(r.m>=5&&r.m<=9))));const by={};for(const o of mm)(by[o.y]=by[o.y]||[]).push(o.v);const out={};for(const y in by)out[y]=U.median(by[y]);return out};
U.isTrib=id=>A.trib.includes(id);
/* ---------- tooltip ---------- */
let tb;function tipEl(){if(!tb){tb=document.createElement('div');tb.className='tipbox';document.body.appendChild(tb)}return tb}
U.tip=(html,e)=>{const b=tipEl();b.innerHTML=html;b.style.display='block';const w=b.offsetWidth,h=b.offsetHeight;let x=e.clientX+14,y=e.clientY+14;if(x+w>innerWidth-6)x=e.clientX-w-12;if(y+h>innerHeight-6)y=e.clientY-h-12;b.style.left=Math.max(4,x)+'px';b.style.top=Math.max(4,y)+'px'};
U.untip=()=>{if(tb)tb.style.display='none'};
document.addEventListener('mousemove',e=>{const t=e.target.closest&&e.target.closest('[data-tip]');if(t)U.tip(t.getAttribute('data-tip').replace(/\n/g,'<br>'),e);else if(!e.target.closest('canvas,[data-keeptip]'))U.untip()});
document.addEventListener('scroll',()=>U.untip(),{passive:true});
/* ---------- canvas ---------- */
U.cvs=(c,h)=>{const dpr=Math.min(2,devicePixelRatio||1),w=c.clientWidth;c.style.height=h+'px';c.width=w*dpr;c.height=h*dpr;const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);return {g,w,h}};
/* ---------- header / footer / side nav ---------- */
const PAGES=[['index.html','nHome','home'],['quality.html','nQuality','quality'],['trends.html','nTrends','trends'],['socio.html','nSocio','socio'],['ahead.html','nAhead','ahead'],['map3d.html','nMap','map3d']];
U.header=(active)=>{const h=$('#top');if(!h)return;
 h.innerHTML=`<div class="in"><a class="brand" href="index.html"><span data-t="brand"></span><small data-t="brandSub"></small></a>
 <nav class="nav">${PAGES.map(p=>`<a href="${p[0]}" data-t="${p[1]}" ${p[2]===active?'aria-current="page"':''}></a>`).join('')}</nav>
 <div class="lang"><button id="bEN">EN</button><button id="bES">ES</button></div></div>`};
U.footer=()=>{const f=$('#credit');if(!f)return;
 f.innerHTML=`<div class="in2"><div><b data-t="builtBy"></b> Samar Moussa Abdou · <a href="https://www.linkedin.com/in/samar-moussa-592b403aa/" target="_blank" rel="noopener">LinkedIn</a> · <a href="https://github.com/SamarM-web" target="_blank" rel="noopener">GitHub</a> · <a href="https://samarm-web.github.io/SamarM/" target="_blank" rel="noopener" data-t="web"></a></div>
 <div class="small" style="margin-top:4px" data-t="credLine"></div><div class="small">${U.t('photoCred')} <a href="https://commons.wikimedia.org/wiki/File:R%C3%ADo_Grande_de_Santiago_01.jpg" target="_blank" rel="noopener">Mtenaespinoza</a>, <a href="https://creativecommons.org/licenses/by/4.0" target="_blank" rel="noopener">CC BY 4.0</a>, via Wikimedia Commons.</div><div class="small" data-t="draftEs"></div></div>`};
U.side=()=>{const s=$('#side');if(!s)return;const secs=$$('main .sec[id]');
 s.innerHTML=`<h4>${U.t('onThisPage')}</h4>`+secs.map(x=>`<a href="#${x.id}" data-sec="${x.id}">${x.querySelector('h2').textContent}</a>`).join('');
 const links=$$('a',s);
 const on=()=>{let cur=secs[0];for(const x of secs){if(x.getBoundingClientRect().top<=140)cur=x}links.forEach(a=>a.classList.toggle('on',a.dataset.sec===cur.id))};
 addEventListener('scroll',on,{passive:true});on()};
U.refreshSide=()=>{const s=$('#side');if(!s)return;const h4=$('h4',s);if(h4)h4.textContent=U.t('onThisPage');$$('main .sec[id]').forEach(x=>{const a=$('a[data-sec="'+x.id+'"]',s);if(a)a.textContent=x.querySelector('h2').textContent})};
/* apply language to [data-t] and call page renderer */
let render=()=>{};
U.apply=()=>{document.documentElement.lang=LANG;$$('[data-t]').forEach(e=>e.textContent=U.t(e.dataset.t));$$('[data-th]').forEach(e=>e.innerHTML=U.t(e.dataset.th));$$('[data-ph]').forEach(e=>e.placeholder=U.t(e.dataset.ph));
 const b1=$('#bEN'),b2=$('#bES');if(b1){b1.setAttribute('aria-pressed',LANG==='en');b2.setAttribute('aria-pressed',LANG==='es')}
 try{render()}catch(e){console.error(e)}U.refreshSide()};
U.init=(active,fn)=>{U.header(active);U.footer();render=fn||(()=>{});
 document.addEventListener('click',e=>{if(e.target.id==='bEN'||e.target.id==='bES'){LANG=e.target.id==='bEN'?'en':'es';try{localStorage.setItem('rsa_lang',LANG)}catch(x){}U.apply()}});
 U.apply();U.side();};
/* small helpers for pages */
U.stationColor=id=>(U.st(id)||{}).color||'#555';
U.chipsHtml=(items,cur,attr)=>items.map(i=>`<button class="chip" ${attr}="${i[0]}" aria-pressed="${i[0]===cur}">${i[2]?`<i style="background:${i[2]}"></i>`:''}${i[1]}</button>`).join('');
U.opts=(items,cur)=>items.map(i=>`<option value="${i[0]}"${i[0]===cur?' selected':''}>${i[1]}</option>`).join('');
U.paramOpts=cur=>U.opts(A.params.map(p=>[p.id,U.pn(p)]),cur);
U.scopeOpts=cur=>U.opts([['all',U.t('allSt')],['Before',U.t('zB')],['Urban',U.t('zU')],['After',U.t('zA')],['trib',U.t('trib')],...A.order.map(s=>[s,s+' · '+U.zlab(s)])],cur);
U.inScope=(sc,id)=>sc==='all'||(sc==='trib'?U.isTrib(id):(['Before','Urban','After'].includes(sc)?A.zone[A.order.indexOf(id)]===sc:id===sc));
U.zlab=id=>U.zn(A.zone[A.order.indexOf(id)]);
U.zt=id=>{const z=A.zone[A.order.indexOf(id)];return `<span class="zt" style="background:${U.ZC[z]}">${U.zn(z)}</span>`};
U.sameBox=(a,b)=>a===b;
})();
