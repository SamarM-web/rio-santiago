(function(){const A=U.A,$=U.$,$$=U.$$;
const L=(en,es)=>U.lang()==='es'?es:en;
U.add({en:{h_cards:'Explore the 44 parameters',cards_lead:'Search, filter by group, and open a parameter for its chart and plain-language summary. The coloured lines are yearly medians for each zone; the bar is how often the parameter was recorded.',
 search:'Search',phSearch:'Search a parameter…',h_detail:'Parameter detail',logAxis:'log axis',h_series:'Time series',series_note:'Dots are monthly medians, thick lines are annual medians and dashed lines are the Sen trend.',
 plot:'Plot',scope:'Stations',h_season:'Seasonality',h_zones:'Above, in and after city',h_tmap:'Station trend map',
 tmap_lead:'Change per year as a percentage of the station’s median (Sen slope). Stations run from upstream to downstream, then the tributaries. Click a cell to open its time series.',
 sInc:'increased',sDec:'decreased',sNone:'no clear change',sNt:'not tested'},
es:{h_cards:'Explora los 44 parámetros',cards_lead:'Busca, filtra por grupo y abre un parámetro para ver su gráfica y un resumen en palabras sencillas. Las líneas de color son medianas anuales por zona; la barra indica con qué frecuencia se registró el parámetro.',
 search:'Buscar',phSearch:'Buscar un parámetro…',h_detail:'Detalle del parámetro',logAxis:'eje logarítmico',h_series:'Series de tiempo',series_note:'Los puntos son medianas mensuales, las líneas gruesas son medianas anuales y las discontinuas son la tendencia de Sen.',
 plot:'Gráfica',scope:'Estaciones',h_season:'Estacionalidad',h_zones:'Antes, en y después de la ciudad',h_tmap:'Mapa de tendencias por estación',
 tmap_lead:'Cambio por año como porcentaje de la mediana de la estación (pendiente de Sen). Las estaciones van de aguas arriba a aguas abajo y luego los afluentes. Haz clic en una celda para abrir su serie de tiempo.',
 sInc:'aumentó',sDec:'disminuyó',sNone:'sin cambio claro',sNt:'no probado'}});
const order=A.order,ZK=['Before','Urban','After'];
let CUR=U.P('P31'),CAT='all',QS='',ZF='all',LOG=false;
let SP='P14',SSEL=['RS-01','RS-05','RS-10'],SLOG=false;
let EP='P14',ET='box',ES_='all',ZP='P09';
const MC=m=>(m>=5&&m<=9)?'#3b8f8a':'#536b7a';
const word=r=>({'increased':U.t('sInc'),'decreased':U.t('sDec'),'no clear change':U.t('sNone'),'not tested':U.t('sNt')}[r]||r);
const cls=r=>({'increased':'u','decreased':'d','no clear change':'n'}[r]||'x');
/* ---------- cards ---------- */
function spark(p){const S=p.series,vals=ZK.flatMap(z=>S[z]).filter(v=>v!=null);let lo=Math.min(...vals),hi=Math.max(...vals);if(hi===lo){hi+=1;lo-=1}
 return `<svg viewBox="0 0 100 42" preserveAspectRatio="none">`+ZK.map(z=>{let d='',pv=false;S[z].forEach((v,i)=>{if(v==null){pv=false;return}d+=(pv?'L':'M')+(i/15*98+1).toFixed(1)+' '+(38-(v-lo)/(hi-lo)*34).toFixed(1);pv=true});return `<path d="${d}" fill="none" stroke="${U.ZC[z]}" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`}).join('')+`</svg>`}
function badgeHtml(p){const b=[];const z=p.zone;
 b.push(z.result==='zones differ'?`<span class="tag blue">${L('Highest','Mayor')}: ${U.zn(z.high)}</span>`:`<span class="tag gray">${L('Zones alike','Zonas parecidas')}</span>`);
 if(p.flags.reporting)b.push(`<span class="tag red">${L('Reporting changed','Cambió el reporte')}</span>`);
 if(p.flags.limited)b.push(`<span class="tag red">${L('Limited years','Años limitados')}</span>`);
 if(p.flags.one||p.x.top>=.9)b.push(`<span class="tag gold">${L('Mostly one value','Casi un solo valor')}</span>`);
 return b.join('')}
function renderCards(){
 const cats=[...new Set(A.params.map(p=>p.cat))];
 $('#cats').innerHTML=U.chipsHtml([['all',U.t('all')],...cats.map(c=>[c,U.cat(c)])],CAT,'data-c');
 const q=QS.toLowerCase();
 $('#grid').innerHTML=A.params.filter(p=>(CAT==='all'||p.cat===CAT)&&(!q||(p.en+' '+p.es+' '+p.id).toLowerCase().includes(q))).map(p=>`<div class="pc" role="button" tabindex="0" data-id="${p.id}" aria-current="${p===CUR}"><b>${U.pn(p)}</b><div class="u">${p.unit} · ${p.id}</div>${spark(p)}<div class="cb" title="${p.tab.cov}%"><i style="width:${p.tab.cov}%"></i></div>${badgeHtml(p)}</div>`).join('');
}
$('#cats').addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(b){CAT=b.dataset.c;renderCards()}});
$('#q').addEventListener('input',e=>{QS=e.target.value;renderCards()});
function pick(e){const c=e.target.closest('.pc');if(!c)return;CUR=U.P(c.dataset.id);SP=EP=ZP=CUR.id;renderCards();renderDetail();syncSelects();$('#detail').scrollIntoView({behavior:'smooth'})}
$('#grid').addEventListener('click',pick);$('#grid').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(e)}});
/* ---------- detail ---------- */
let tsPts=[];
function filtZ(r){return ZF==='all'||(ZF==='main'?!U.isTrib(r.id):r.z===ZF)}
function renderDetail(){
 const p=CUR,es=U.lang()==='es',z=p.zone;
 const pts=U.rows(p.id).filter(filtZ);
 const sig=[];
 if(p.flags.reporting)sig.push(`<span class="tag red">${L('Reporting changed','Cambió el reporte')}</span>`);
 if(p.flags.limited)sig.push(`<span class="tag red">${L('Limited years','Años limitados')}</span>`);
 if(p.flags.one||p.x.top>=.9)sig.push(`<span class="tag gold">${L(Math.round(p.x.top*100)+'% of values are identical: a trend result is not reliable',Math.round(p.x.top*100)+'% de los valores son idénticos: el resultado de tendencia no es fiable')}</span>`);
 if(p.id==='P15')sig.push(`<span class="tag red">−1 ${L('is a missing-data code (28 rows)','es un código de dato faltante (28 filas)')}</span>`);
 const hi=z.high?U.zn(z.high):'';
 const zr=z.result==='zones differ'?L(`zones differ · highest: ${hi}`,`las zonas difieren · mayor: ${hi}`):L('no clear difference between zones','sin diferencia clara entre zonas');
 const zm=z.main==='zones differ'?L('differ','difieren'):L('no clear difference','sin diferencia clara');
 const seas={dry_higher:L('higher in the dry months','más alto en los meses secos'),wet_higher:L('higher in the rainy months','más alto en los meses de lluvia'),none:L('no clear rainy–dry difference','sin diferencia clara lluvia–seca'),pooled_only:L('a difference only when stations are pooled','diferencia solo al juntar estaciones')}[p.season]||'';
 const tr=p.trend;
 const rob=[];if(z.result==='zones differ'){rob.push([L('Holds if any one station is left out','Se sostiene al quitar cualquier estación'),p.robust.loo==='holds when any one station is left out']);
  rob.push([L('Trend direction does not flip when stations are separated','La dirección de la tendencia no se invierte al separar estaciones'),p.robust.simpson==='same direction']);rob.push([L('Same result with yearly and seasonal averages','Mismo resultado con promedios anuales y estacionales'),!!p.robust.agg_same])}
 $('#dt').innerHTML=`<div class="small">${p.id} · ${U.cat(p.cat)}</div><h3 style="font-size:1.5rem;border:0;margin:2px 0 4px">${U.pn(p)} <span class="small">${p.unit}</span></h3>
 <div>${sig.join('')}<span class="tag gray">${U.nf(p.x.n)} ${U.t('records')}</span></div>
 <div class="ctl"><span class="chips">${U.chipsHtml([['all',U.t('allSt')],['main',U.t('mainOnly')],['Before',U.t('zB')],['Urban',U.t('zU')],['After',U.t('zA')]],ZF,'data-z')}</span>
  <span class="chips">${U.chipsHtml([['lin',L('Linear','Lineal')],['log','Log']],LOG?'log':'lin','data-l')}</span></div>
 <canvas class="cv" id="ts"></canvas>
 <div class="legend"><span><i style="background:${U.ZC.Before};border-radius:50%"></i>${U.zn('Before')}</span><span><i style="background:${U.ZC.Urban};border-radius:50%"></i>${U.zn('Urban')}</span><span><i style="background:${U.ZC.After};border-radius:50%"></i>${U.zn('After')}</span><span><i style="border-radius:50%;background:#fff"></i>${U.t('trib')}</span><span>━ ${L('monthly median','mediana mensual')}</span><span><i style="border-radius:50%;background:#fff;border-color:#b4443a"></i>${L('possible anomaly: needs expert confirmation','posible anomalía: requiere confirmación experta')}</span></div>
 <div class="grid g2" style="margin-top:12px"><div><h3>${L('By month','Por mes')}</h3><svg class="ch" id="bx" viewBox="0 0 440 220"></svg><p class="small" style="margin:4px 0 0">${seas}. ${U.t('rain')}</p></div>
  <div><h3>${L('By zone','Por zona')}</h3><div class="bars" id="zb"></div><p style="margin:8px 0 3px"><span class="tag ${z.result==='zones differ'?'blue':'gray'}">${zr}</span><span class="tag gray">${L('main river','río principal')}: ${zm}</span></p><p class="small" style="margin:0">${L('Adjusted p-value','Valor p ajustado')}: ${z.p<0.001?'< 0.001':z.p}. ${L('With 3–5 stations per zone, power is low.','Con 3 a 5 estaciones por zona, la potencia es baja.')}</p></div></div>
 <h3>${L('Change at each station','Cambio en cada estación')} <span class="small">(${tr.inc} ${U.t('sInc')} · ${tr.dec} ${U.t('sDec')} · ${tr.none} ${U.t('sNone')})</span></h3>
 <div class="stc">${order.map(s=>{const t=p.tr[s]||[];const r=t[3]||'not tested';return `<div class="${cls(r)}" style="border-left-width:6px;border-left-color:${U.stationColor(s)}"><b>${U.isTrib(s)?'◦ ':''}${s}</b>${U.zt(s)}<br>${word(r)}${t[1]!=null?` · ${t[1]>0?'+':''}${t[1]} %/yr`:''}</div>`}).join('')}</div>
 ${rob.length?`<h3>${L('How solid is the zone result?','¿Qué tan sólido es el resultado por zonas?')}</h3><div>${rob.map(r=>`<span class="tag ${r[1]?'blue':'gold'}">${r[1]?'✓':'!'} ${r[0]}</span>`).join('')}</div>`:''}
 <details style="margin-top:10px"><summary class="small" style="cursor:pointer">${L('How to read this chart','Cómo leer esta gráfica')}</summary><p class="small">${L('Every dot is one measurement; nothing is smoothed or removed. Gaps mean no data. The line is the monthly median. Rings mark values far from the rest; they are not called errors.','Cada punto es una medición; no se suaviza ni se elimina nada. Los vacíos significan que no hay datos. La línea es la mediana mensual. Los círculos marcan valores muy alejados; no se llaman errores.')}</p></details>`;
 $$('#dt [data-z]').forEach(b=>b.onclick=()=>{ZF=b.dataset.z;renderDetail()});$$('#dt [data-l]').forEach(b=>b.onclick=()=>{LOG=b.dataset.l==='log';renderDetail()});
 drawTS(pts,p);drawBox(pts);
 const meds=z.med,mx=Math.max(...meds,1e-9);
 $('#zb').innerHTML=ZK.map((k,i)=>`<div><span>${U.zn(k)}</span><div><i style="width:${Math.max(3,meds[i]/mx*100)}%;background:${U.ZC[k]}"></i></div><b>${U.fmt(meds[i])}</b></div>`).join('');
}
function drawTS(pts,p){
 const c=$('#ts');if(!c)return;const {g,w,h}=U.cvs(c,340);const L0=56,R=12,T=12,B=28;
 const useLog=LOG&&pts.length&&pts.every(q=>q.v>0),f=v=>useLog?Math.log10(v):v;
 g.font='13px Palatino Linotype,Palatino,serif';
 if(!pts.length){g.fillStyle='#3b4c55';g.fillText(U.t('noData'),20,30);return}
 const vs=pts.map(q=>f(q.v)).sort((a,b)=>a-b);let lo=vs[0],hi=vs[vs.length-1];if(lo===hi){lo-=1;hi+=1}const pad=(hi-lo)*.05;lo-=pad;hi+=pad;if(!useLog&&lo<0&&vs[0]>=0)lo=0;
 const X=t=>L0+(t-2009)/(2025.5-2009)*(w-L0-R),Y=v=>T+(1-(f(v)-lo)/(hi-lo))*(h-T-B);
 g.strokeStyle='#d3dcdc';g.fillStyle='#3b4c55';g.lineWidth=1;g.textAlign='right';
 for(let i=0;i<=4;i++){const vv=lo+(hi-lo)*i/4,y=T+(1-i/4)*(h-T-B);g.beginPath();g.moveTo(L0,y);g.lineTo(w-R,y);g.stroke();g.fillText(U.fmt(useLog?Math.pow(10,vv):vv),L0-6,y+4)}
 g.textAlign='center';for(let y=2009;y<=2025;y+=2)g.fillText(y,X(y),h-10);
 const q1=U.q(vs,.25),q3=U.q(vs,.75),iqr=q3-q1,a1=q1-3*iqr,a2=q3+3*iqr;tsPts=[];
 for(const q of pts){const x=X(q.t),y=Y(q.v),fv=f(q.v),an=iqr>0&&(fv<a1||fv>a2);tsPts.push({x,y,q,an});
  g.globalAlpha=.6;g.beginPath();g.arc(x,y,3,0,7);const col=U.ZC[q.z];if(U.isTrib(q.id)){g.strokeStyle=col;g.lineWidth=1.4;g.stroke()}else{g.fillStyle=col;g.fill()}g.globalAlpha=1;
  if(an){g.beginPath();g.arc(x,y,7,0,7);g.strokeStyle='#b4443a';g.lineWidth=1.6;g.stroke()}}
 const by={};pts.forEach(q=>(by[q.ym]=by[q.ym]||[]).push(q.v));const yms=Object.keys(by).map(Number).sort((a,b)=>a-b);
 g.strokeStyle='#14232b';g.lineWidth=1.8;g.beginPath();let pv=null;yms.forEach(ym=>{const m=U.median(by[ym]),x=X(Math.floor(ym/12)+(ym%12+.5)/12),y=Y(m);if(pv!==null&&ym-pv<=2)g.lineTo(x,y);else g.moveTo(x,y);pv=ym});g.stroke();
}
document.addEventListener('mousemove',e=>{const c=$('#ts');if(!c||e.target!==c)return;const r=c.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;let best=null,bd=14;
 for(const q of tsPts){const d=Math.hypot(q.x-mx,q.y-my);if(d<bd){bd=d;best=q}}
 if(best)U.tip(`<b>${best.q.id}</b> · ${best.q.dt}<br>${U.fmt(best.q.v)} ${CUR.unit}${best.an?'<br>'+L('possible anomaly: needs expert confirmation','posible anomalía: requiere confirmación experta'):''}`,e);else U.untip()});
function boxStats(a){const s=a.slice().sort((x,y)=>x-y);if(s.length<5)return null;const q1=U.q(s,.25),q2=U.q(s,.5),q3=U.q(s,.75),i=q3-q1;const lo=s.find(v=>v>=q1-1.5*i),hi=[...s].reverse().find(v=>v<=q3+1.5*i);return{n:s.length,q1,q2,q3,lo,hi,out:s.filter(v=>v<lo||v>hi)}}
function drawBox(pts){
 const byM=[...Array(12)].map(()=>[]);pts.forEach(q=>byM[q.m].push(q.v));const bx=byM.map(boxStats);const vals=bx.filter(Boolean).flatMap(b=>[b.lo,b.hi]);if(!vals.length){$('#bx').innerHTML='';return}
 const useLog=LOG&&vals.every(v=>v>0)&&pts.every(q=>q.v>0),f=v=>useLog?Math.log10(v):v;let lo=Math.min(...vals.map(f)),hi=Math.max(...vals.map(f));if(lo===hi){lo-=1;hi+=1}const pd=(hi-lo)*.08;lo-=pd;hi+=pd;
 const Y=v=>12+(1-(f(v)-lo)/(hi-lo))*166,L0=50;let s='';
 for(let i=0;i<=3;i++){const vv=lo+(hi-lo)*i/3,y=12+(1-i/3)*166;s+=`<line x1="${L0}" x2="432" y1="${y}" y2="${y}" stroke="#d3dcdc"/><text x="${L0-5}" y="${y+4}" text-anchor="end" font-size="12" fill="#3b4c55">${U.fmt(useLog?Math.pow(10,vv):vv)}</text>`}
 bx.forEach((b,i)=>{const x=L0+8+i*31.5,col=MC(i);s+=`<text x="${x+10}" y="200" text-anchor="middle" font-size="12" fill="#3b4c55">${U.MN()[i]}</text>`;if(!b)return;
  s+=`<g data-tip="${U.MN()[i]}\nn = ${b.n}\nmax (whisker) ${U.fmt(b.hi)}\nQ3 ${U.fmt(b.q3)}\nmedian ${U.fmt(b.q2)}\nQ1 ${U.fmt(b.q1)}\nmin (whisker) ${U.fmt(b.lo)}"><rect x="${x-3}" y="8" width="26" height="176" fill="transparent"/><line x1="${x+10}" x2="${x+10}" y1="${Y(b.hi)}" y2="${Y(b.lo)}" stroke="${col}" stroke-width="1.5"/><rect x="${x}" y="${Y(b.q3)}" width="20" height="${Math.max(2,Y(b.q1)-Y(b.q3))}" fill="${col}" opacity=".85"/><line x1="${x}" x2="${x+20}" y1="${Y(b.q2)}" y2="${Y(b.q2)}" stroke="#fff" stroke-width="2"/></g>`});
 $('#bx').innerHTML=s;
}
/* ---------- time series (stations) ---------- */
function syncSelects(){$('#sp').value=SP;$('#ep').value=EP;$('#zp').value=ZP}
function renderSeries(){
 if(!$('#sp').options.length||$('#sp').dataset.l!==U.lang()){$('#sp').innerHTML=U.paramOpts(SP);$('#sp').dataset.l=U.lang()}$('#sp').value=SP;
 $('#sch').innerHTML=order.map((s,i)=>`<button class="chip" data-s="${s}" aria-pressed="${SSEL.includes(s)}"><i style="background:${A.stations[i].color}"></i>${s}${A.stations[i].trib?' ◦':''}${U.zt(s)}</button>`).join('');
 const p=U.P(SP),rows=U.rows(SP),canLog=rows.every(r=>r.v>0);$('#slog').disabled=!canLog;const useLog=SLOG&&canLog;$('#slog').checked=useLog;
 const sel=SSEL.map(s=>order.indexOf(s)),W=900,H=360,L0=62,R=14,T=14,B=30;const f=v=>useLog?Math.log10(v):v;
 const data=sel.map(si=>({si,id:order[si],mm:U.monthly(SP,r=>r.s===si).sort((a,b)=>a.ym-b.ym),ann:U.annual(SP,si)}));
 const all=data.flatMap(d=>d.mm.map(o=>o.v));if(!all.length){$('#schart').innerHTML=`<p class="small">${U.t('noData')}</p>`;$('#sbox').innerHTML='';return}
 let lo=Math.min(...all.map(f)),hi=Math.max(...all.map(f));if(lo===hi){lo-=1;hi+=1}const pad=(hi-lo)*.06;lo-=pad;hi+=pad;if(!useLog&&lo<0&&Math.min(...all)>=0)lo=0;
 const X=t=>L0+(t-2009)/(2025.5-2009)*(W-L0-R),Y=v=>T+(1-(f(v)-lo)/(hi-lo))*(H-T-B);let s='';
 for(let i=0;i<=4;i++){const vv=lo+(hi-lo)*i/4,y=T+(1-i/4)*(H-T-B);s+=`<line x1="${L0}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#d3dcdc"/><text x="${L0-6}" y="${y+4}" text-anchor="end" font-size="13" fill="#3b4c55">${U.fmt(useLog?Math.pow(10,vv):vv)}</text>`}
 for(let y=2009;y<=2025;y+=2)s+=`<text x="${X(y)}" y="${H-10}" text-anchor="middle" font-size="13" fill="#3b4c55">${y}</text>`;
 s+=`<text x="14" y="${(H-B)/2}" font-size="13" fill="#3b4c55" transform="rotate(-90 14 ${(H-B)/2})" text-anchor="middle">${p.unit}</text>`;
 data.forEach(d=>{const col=A.stations[d.si].color,tt=A.stations[d.si].trib;
  d.mm.forEach(o=>{s+=`<circle cx="${X(o.y+(o.m+.5)/12)}" cy="${Y(o.v)}" r="2.4" fill="${col}" opacity=".3" data-tip="${d.id} (${U.zlab(d.id)}) · ${U.MN()[o.m]} ${o.y}\n${U.fmt(o.v)} ${p.unit}"/>`});
  const ys=Object.keys(d.ann).map(Number).sort((a,b)=>a-b);
  s+=`<polyline fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round" points="${ys.map(y=>X(y+.5)+','+Y(d.ann[y])).join(' ')}"/>`;
  ys.forEach(y=>{s+=`<circle cx="${X(y+.5)}" cy="${Y(d.ann[y])}" r="4" fill="${col}" stroke="#fff" stroke-width="1" data-tip="${d.id} (${U.zlab(d.id)}) · ${y}\n${L('annual median','mediana anual')} ${U.fmt(d.ann[y])} ${p.unit}"/>`});
  const t=p.tr[d.id];if(t&&t[0]!=null&&d.mm.length>3){const pts=d.mm.map(o=>[o.y+(o.m+.5)/12,o.v]);const ic=U.median(pts.map(q=>q[1]-t[0]*q[0]));const a=pts[0][0],b=pts[pts.length-1][0];
   s+=`<line x1="${X(a)}" y1="${Y(ic+t[0]*a)}" x2="${X(b)}" y2="${Y(ic+t[0]*b)}" stroke="${col}" stroke-width="1.8" stroke-dasharray="6 4"/>`}});
 $('#schart').innerHTML=`<svg class="ch" viewBox="0 0 ${W} ${H}">${s}</svg>`;
 $('#sbox').innerHTML=data.map(d=>{const st=A.stations[d.si],t=p.tr[d.id]||[];const r=t[3]||'not tested';
  return `<div class="box" style="border:2px solid ${st.color};background:${st.color}14"><b>${d.id}</b>${U.zt(d.id)} ${st.site}<br><span class="small">${t[1]!=null?`${t[1]>0?'+':''}${t[1]} %/yr · ${t[0]>0?'+':''}${U.fmt(t[0])} ${p.unit}/yr`:'–'}<br>q ${t[2]!=null?(t[2]<0.001?'< 0.001':'= '+t[2].toFixed(3)):'–'} · <b>${word(r)}</b></span></div>`}).join('');
}
$('#sch').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;const s=b.dataset.s;SSEL=SSEL.includes(s)?SSEL.filter(x=>x!==s):[...SSEL,s];if(!SSEL.length)SSEL=[s];renderSeries()});
$('#sp').addEventListener('change',e=>{SP=e.target.value;renderSeries()});$('#slog').addEventListener('change',e=>{SLOG=e.target.checked;renderSeries()});
/* ---------- seasonality ---------- */
function renderSeason(){
 const es=U.lang()==='es';
 if(!$('#ep').options.length||$('#ep').dataset.l!==U.lang()){$('#ep').innerHTML=U.paramOpts(EP);$('#es').innerHTML=U.scopeOpts(ES_);$('#et').innerHTML=U.opts([['box',L('Box plots','Cajas')],['boxlog',L('Box plots (log scale)','Cajas (escala log)')],['median',L('Monthly medians','Medianas mensuales')],['count',L('Number of records','Número de registros')]],ET);$('#ep').dataset.l=U.lang()}
 $('#ep').value=EP;$('#es').value=ES_;$('#et').value=ET;
 const p=U.P(EP),rows=U.rows(EP).filter(r=>U.inScope(ES_,r.id)),byM=[...Array(12)].map(()=>[]);rows.forEach(r=>byM[r.m].push(r.v));
 const W=900,H=330,L0=60,T=14,B=34;let s='',clipped=0;const bx=byM.map(boxStats);
 const mn=U.MN();
 if(ET==='count'){const mx=Math.max(...byM.map(a=>a.length),1),Y=v=>T+(1-v/mx)*(H-T-B);
  for(let i=0;i<=4;i++){const y=T+(1-i/4)*(H-T-B);s+=`<line x1="${L0}" x2="${W-10}" y1="${y}" y2="${y}" stroke="#d3dcdc"/><text x="${L0-6}" y="${y+4}" text-anchor="end" font-size="13" fill="#3b4c55">${Math.round(mx*i/4)}</text>`}
  byM.forEach((a,i)=>{const x=L0+10+i*(W-L0-20)/12;s+=`<rect x="${x}" y="${Y(a.length)}" width="${(W-L0-20)/12-10}" height="${H-B-Y(a.length)}" fill="${MC(i)}" data-tip="${mn[i]}\nn = ${a.length}"/><text x="${x+(W-L0-20)/24-5}" y="${H-14}" text-anchor="middle" font-size="13" fill="#3b4c55">${mn[i]}</text>`})}
 else{
  const useLog=ET==='boxlog'&&rows.length&&rows.every(r=>r.v>0),f=v=>useLog?Math.log10(v):v;
  const src=ET==='median'?byM.map(a=>a.length?[U.median(a)]:[]).flat():bx.filter(Boolean).flatMap(b=>[b.lo,b.hi]);
  if(!src.length){$('#echart').innerHTML=`<p class="small">${U.t('noData')}</p>`;return}
  let lo=Math.min(...src.map(f)),hi=Math.max(...src.map(f));if(lo===hi){lo-=1;hi+=1}const pd=(hi-lo)*.06;lo-=pd;hi+=pd;if(!useLog&&lo<0&&Math.min(...src)>=0)lo=0;const Y=v=>T+(1-(f(v)-lo)/(hi-lo))*(H-T-B),cw=(W-L0-20)/12;
  for(let i=0;i<=4;i++){const vv=lo+(hi-lo)*i/4,y=T+(1-i/4)*(H-T-B);s+=`<line x1="${L0}" x2="${W-10}" y1="${y}" y2="${y}" stroke="#d3dcdc"/><text x="${L0-6}" y="${y+4}" text-anchor="end" font-size="13" fill="#3b4c55">${U.fmt(useLog?Math.pow(10,vv):vv)}</text>`}
  s+=`<text x="14" y="${(H-B)/2}" font-size="13" fill="#3b4c55" transform="rotate(-90 14 ${(H-B)/2})" text-anchor="middle">${p.unit}</text>`;
  if(ET==='median'){let d='';byM.forEach((a,i)=>{if(a.length){d+=(d?'L':'M')+(L0+10+i*cw+cw/2-5)+' '+Y(U.median(a))}});s+=`<path d="${d}" fill="none" stroke="#536b7a" stroke-width="2.4"/>`;
   byM.forEach((a,i)=>{if(a.length)s+=`<circle cx="${L0+10+i*cw+cw/2-5}" cy="${Y(U.median(a))}" r="5" fill="${MC(i)}" stroke="#fff" data-tip="${mn[i]}\nn = ${a.length}\n${L('median','mediana')} ${U.fmt(U.median(a))}"/>`})}
  else bx.forEach((b,i)=>{const x=L0+10+i*cw,col=MC(i),m=x+cw/2-5;if(!b)return;
   s+=`<g data-tip="${mn[i]}\nn = ${b.n}\nmax (whisker) ${U.fmt(b.hi)}\nQ3 ${U.fmt(b.q3)}\nmedian ${U.fmt(b.q2)}\nQ1 ${U.fmt(b.q1)}\nmin (whisker) ${U.fmt(b.lo)}"><rect x="${x}" y="${T}" width="${cw-10}" height="${H-T-B}" fill="transparent"/>
    <line x1="${m}" x2="${m}" y1="${Y(b.hi)}" y2="${Y(b.lo)}" stroke="${col}" stroke-width="1.6"/><rect x="${m-cw/2+8}" y="${Y(b.q3)}" width="${cw-16}" height="${Math.max(2,Y(b.q1)-Y(b.q3))}" fill="${col}" opacity=".85"/><line x1="${m-cw/2+8}" x2="${m+cw/2-8}" y1="${Y(b.q2)}" y2="${Y(b.q2)}" stroke="#fff" stroke-width="2.2"/>
    ${b.out.filter(v=>f(v)>=lo&&f(v)<=hi).map(v=>`<circle cx="${m}" cy="${Y(v)}" r="2" fill="none" stroke="${col}"/>`).join('')}</g>`;clipped+=b.out.filter(v=>f(v)<lo||f(v)>hi).length});
  byM.forEach((a,i)=>{s+=`<text x="${L0+10+i*cw+cw/2-5}" y="${H-14}" text-anchor="middle" font-size="13" fill="#3b4c55">${mn[i]}</text>`})}
 $('#echart').innerHTML=`<svg class="ch" viewBox="0 0 ${W} ${H}">${s}</svg>`;
 $('#enote').innerHTML=L('Box = interquartile range, line = median, whiskers = most extreme values within 1.5 × IQR; small circles are values beyond the whiskers (kept, not removed). Months with fewer than 5 samples are blank. '+(clipped?`${clipped} more outliers lie beyond the axis; they stay in the data and are shown in Parameter detail. `:'')+' ','Caja = rango intercuartílico, línea = mediana, bigotes = valores más extremos dentro de 1.5 × RIC; los círculos pequeños son valores más allá de los bigotes (se conservan). Los meses con menos de 5 muestras quedan en blanco. '+(clipped?`${clipped} valores atípicos más quedan fuera del eje; siguen en los datos y se ven en Detalle del parámetro. `:''))+`<span style="color:#3b8f8a">■</span> ${L('rainy months','meses de lluvia')} <span style="color:#536b7a">■</span> ${L('dry months','meses secos')}`;
}
['ep','et','es'].forEach(id=>$('#'+id).addEventListener('change',e=>{if(id==='ep')EP=e.target.value;if(id==='et')ET=e.target.value;if(id==='es')ES_=e.target.value;renderSeason()}));
/* ---------- zones ---------- */
function renderZones(){
 if(!$('#zp').options.length||$('#zp').dataset.l!==U.lang()){$('#zp').innerHTML=U.paramOpts(ZP);$('#zp').dataset.l=U.lang()}$('#zp').value=ZP;
 const p=U.P(ZP),W=900,H=320,L0=60,T=12,B=40;
 const vals=order.map((s,i)=>{const mm=U.monthly(ZP,r=>r.s===i);return {s,i,v:U.median(mm.map(o=>o.v)),n:mm.length}});
 const hi=Math.max(...vals.map(o=>o.v||0),1e-9)*1.08,Y=v=>T+(1-v/hi)*(H-T-B),cw=(W-L0-14)/13;let s='';
 for(let i=0;i<=4;i++){const y=T+(1-i/4)*(H-T-B);s+=`<line x1="${L0}" x2="${W-10}" y1="${y}" y2="${y}" stroke="#d3dcdc"/><text x="${L0-6}" y="${y+4}" text-anchor="end" font-size="13" fill="#3b4c55">${U.fmt(hi*i/4)}</text>`}
 s+=`<text x="14" y="${(H-B)/2}" font-size="13" fill="#3b4c55" transform="rotate(-90 14 ${(H-B)/2})" text-anchor="middle">${p.unit}</text>`;
 vals.forEach(o=>{const x=L0+8+o.i*cw,col=U.ZC[A.zone[o.i]],tr=A.stations[o.i].trib;if(o.v==null)return;
  s+=`<rect x="${x}" y="${Y(o.v)}" width="${cw-10}" height="${H-B-Y(o.v)}" fill="${tr?'#fff':col}" stroke="${col}" stroke-width="${tr?3:1}" data-tip="${o.s} · ${A.stations[o.i].site}\n${U.zn(A.zone[o.i])}${tr?' · '+U.t('trib'):''}\n${L('median','mediana')} ${U.fmt(o.v)} ${p.unit}\n${o.n} ${L('months','meses')}"/><text x="${x+(cw-10)/2}" y="${H-22}" text-anchor="middle" font-size="13" fill="#14232b">${o.s}</text>`});
 $('#zchart').innerHTML=`<svg class="ch" viewBox="0 0 ${W} ${H}">${s}</svg>`;
 $('#zleg').innerHTML=ZK.map(z=>`<span><i style="background:${U.ZC[z]}"></i>${U.zn(z)}</span>`).join('')+`<span><i style="background:#fff;border:3px solid #536b7a"></i>${U.t('trib')}</span>`;
 const z=p.zone;
 $('#zbox').innerHTML=ZK.map((k,i)=>`<div class="box" style="border-left:6px solid ${U.ZC[k]}"><div class="small">${U.zn(k)} · ${L('median','mediana')}</div><b style="font-size:1.3rem">${U.fmt(z.med[i])}</b> <span class="small">${p.unit}</span></div>`).join('')+
  `<div class="box"><div class="small">${L('Zones differ?','¿Difieren las zonas?')}</div><b>${z.result==='zones differ'?L('Yes','Sí')+' · p '+(z.p<0.001?'< 0.001':'= '+z.p):L('No clear difference','Sin diferencia clara')}</b><div class="small">${z.result==='zones differ'?L('Highest','Mayor')+': '+U.zn(z.high):''}</div></div>`;
 $('#znote').textContent=L('Bars are each station’s median over 2009–2025 (median of monthly medians). Hollow bars are tributaries, drawn in the zone they join. The test compares the three zones using all stations; it describes a difference in numbers, not a cause.','Las barras son la mediana de cada estación en 2009–2025 (mediana de medianas mensuales). Las barras huecas son afluentes, dibujados en la zona donde desembocan. La prueba compara las tres zonas con todas las estaciones; describe una diferencia en números, no una causa.');
}
$('#zp').addEventListener('change',e=>{ZP=e.target.value;renderZones()});
/* ---------- trend map ---------- */
function renderTmap(){
 $('#tleg').innerHTML=`<span><i style="background:#d9b3a3"></i>${U.t('sInc')}</span><span><i style="background:#a9c3d6"></i>${U.t('sDec')}</span><span><i style="background:#eef2f2"></i>${U.t('sNone')}</span><span><i style="background:#fff"></i>${U.t('sNt')} (–)</span>`;
 const heads='<tr><th>'+U.t('parameter')+' (%/yr)</th>'+order.map((s,i)=>`<th style="border-bottom:4px solid ${A.stations[i].color};text-align:center">${s}${A.stations[i].trib?' ◦':''}<br>${U.zt(s)}</th>`).join('')+'</tr>';
 $('#tm').innerHTML=heads+A.params.map(p=>`<tr><td style="white-space:nowrap"><b>${U.pn(p)}</b></td>`+order.map(s=>{const t=p.tr[s];if(!t||t[1]==null)return `<td style="text-align:center;color:#8aa0a8">–</td>`;
  const v=t[1],r=t[3];const a=Math.min(1,Math.abs(v)/20);const bg=r==='increased'?`rgba(176,92,60,${.2+a*.6})`:r==='decreased'?`rgba(60,112,160,${.2+a*.6})`:'#eef2f2';
  return `<td style="background:${bg};text-align:center;cursor:pointer;white-space:nowrap" data-p="${p.id}" data-s="${s}" data-tip="${U.pn(p)} · ${s}\n${word(r)}: ${v>0?'+':''}${v} %/yr\nq = ${t[2]!=null?t[2].toFixed(3):'–'}">${v>0?'+':''}${Math.abs(v)>=10?Math.round(v):v.toFixed(1)}</td>`}).join('')+'</tr>').join('');
}
$('#tm').addEventListener('click',e=>{const c=e.target.closest('[data-p]');if(!c)return;SP=c.dataset.p;SSEL=[c.dataset.s];renderSeries();$('#series').scrollIntoView({behavior:'smooth'})});
/* ---------- overview ---------- */
function renderOv(){
 const es=U.lang()==='es',P=A.params;let inc=0,dec=0,none=0,nt=0;P.forEach(p=>{inc+=p.trend.inc;dec+=p.trend.dec;none+=p.trend.none;nt+=p.trend.nt});
 const zd=P.filter(p=>p.zone.result==='zones differ'),cnt=k=>zd.filter(p=>p.zone.high===k).length;
 const mainHold=P.filter(p=>p.zone.main==='zones differ'),sc=k=>P.filter(p=>p.season===k).length;
 const nm=a=>a.map(U.pn).join(', ');
 const noInc=P.filter(p=>p.trend.inc===0&&p.trend.dec===0&&p.trend.nt<13).length;
 const most=P.slice().sort((a,b)=>(b.trend.inc+b.trend.dec)-(a.trend.inc+a.trend.dec)).slice(0,5);
 const tiles=[[inc,L('station-parameter series that increased','series estación-parámetro que aumentaron')],[dec,L('series that decreased','series que disminuyeron')],[none,L('series with no clear change','series sin cambio claro')],[zd.length+' / '+P.length,L('parameters with differences between zones','parámetros con diferencias entre zonas')]];
 const p1=es?`Se probó la tendencia de cada parámetro en cada estación (${inc+dec+none} series). En <b>${inc}</b> hubo un aumento, en <b>${dec}</b> una disminución y en <b>${none}</b> no hubo un cambio claro tras corregir por las muchas pruebas. Los parámetros con más series que cambiaron son ${nm(most)}.`
  :`The trend of each parameter was tested at each station (${inc+dec+none} series). <b>${inc}</b> showed an increase, <b>${dec}</b> a decrease and <b>${none}</b> no clear change after correcting for the many tests. The parameters with the most changing series are ${nm(most)}.`;
 const b=es?[`<b>Zonas.</b> ${zd.length} de ${P.length} parámetros difieren entre zonas con todas las estaciones: el valor más alto está en la zona “${U.zn('Urban')}” en ${cnt('Urban')}, “${U.zn('After')}” en ${cnt('After')} y “${U.zn('Before')}” en ${cnt('Before')}. Solo con el río principal, la diferencia se sostiene en: ${nm(mainHold)}.`,
  `<b>Estacionalidad.</b> ${sc('dry_higher')} parámetros son más altos en los meses secos, ${sc('wet_higher')} en los de lluvia, ${sc('none')} no muestran diferencia clara y ${sc('pooled_only')} solo la muestran al juntar estaciones.`,
  `<b>Cautela.</b> Con 3 a 5 estaciones por zona la potencia es baja, y varios parámetros tienen valores casi idénticos o cambios en la forma de reportar (ver Calidad de los datos).`]
  :[`<b>Zones.</b> ${zd.length} of ${P.length} parameters differ between zones using all stations: the highest value is in the “${U.zn('Urban')}” zone for ${cnt('Urban')}, “${U.zn('After')}” for ${cnt('After')} and “${U.zn('Before')}” for ${cnt('Before')}. With the main river only, the difference holds for: ${nm(mainHold)}.`,
  `<b>Seasonality.</b> ${sc('dry_higher')} parameters are higher in the dry months, ${sc('wet_higher')} in the rainy months, ${sc('none')} show no clear difference and ${sc('pooled_only')} show one only when stations are pooled.`,
  `<b>Caution.</b> With 3–5 stations per zone the power is low, and several parameters have near-identical values or changes in how they are reported (see Data Quality).`];
 $('#ov').innerHTML=`<div class="tiles">${tiles.map(t=>`<div class="tile"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div><p class="lead">${p1}</p><ul class="ov">${b.map(x=>`<li>${x}</li>`).join('')}</ul><p class="note b">${U.t('ov_note')}</p>`;
}
U.init('trends',()=>{renderCards();renderDetail();renderSeries();renderSeason();renderZones();renderTmap();renderOv()});
addEventListener('resize',()=>{renderDetail()});
})();
