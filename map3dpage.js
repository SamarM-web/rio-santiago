(function(){
const A=ATLAS,U=window.U,$=U.$,L=(a,b)=>U.lang()==='es'?b:a,ZC=U.ZC;
U.add({en:{
 h_m3:'Santiago River in 3D',m3_lead:'Station pillars stand on a map of Jalisco municipalities. Pillar height is the station\'s yearly median of the chosen parameter. Drag to rotate, scroll or pinch to zoom, click a pillar or municipality.',
 parameter:'Parameter',season:'Season',barColour:'Pillar colour',baseDisk:'Base map',showFc:'Show model forecast',landmarks:'Show towns',terrain:'Terrain (no elevation data)',relief:'Relief exaggeration',topView:'Top view',resetView:'Reset view',play:'Play',year:'Year',
 sAll:'All months',sWet:'Rainy season (Jun–Oct)',sDry:'Dry season (Nov–May)',cZone:'By zone',cLevel:'By value level',bNone:'Flat',bM:'Marginalization index 2020',bP:'Poverty 2020',bE:'Extreme poverty 2020',
 reminder:'Associations and predictions only. No causal claims.',mapHint:'Drag to rotate · scroll to zoom · click for details',
 noVal:'no data this year',fcTag:'extrapolation',noFc:'No forecast was kept for this parameter and year.',
 pillarNote:'Heights share one scale per parameter (up to the 95th percentile of all station-years; taller values are capped). A missing pillar means no data that year. Terrain is not shown because no elevation data were included.',
 pop:'Population',zone:'Zone',muni:'Municipality',median:'Yearly median',allYears:'Yearly medians, 2009–2024',lowLvl:'lower',hiLvl:'higher',
 ov_p:'This view repeats numbers already on the other pages in three dimensions: yearly station medians from the monitoring record, census indicators for municipalities, and the few extrapolations that passed the checks.',
 ov_b1:'Pillars use medians of the months sampled in each year; years with few sampled months are less certain (see Data Quality).',ov_b2:'Municipality indicators belong to the municipality, not to the river.',ov_b3:'Nothing here shows what causes a value or what will be done about it.'
},es:{
 h_m3:'El río Santiago en 3D',m3_lead:'Los pilares de las estaciones se levantan sobre un mapa de municipios de Jalisco. La altura es la mediana anual de la estación para el parámetro elegido. Arrastre para girar, rueda o pellizco para acercar, y pulse un pilar o municipio.',
 parameter:'Parámetro',season:'Temporada',barColour:'Color del pilar',baseDisk:'Mapa base',showFc:'Mostrar pronóstico del modelo',landmarks:'Mostrar localidades',terrain:'Terreno (sin datos de elevación)',relief:'Exageración del relieve',topView:'Vista superior',resetView:'Restablecer vista',play:'Reproducir',year:'Año',
 sAll:'Todos los meses',sWet:'Lluvias (jun–oct)',sDry:'Secas (nov–may)',cZone:'Por zona',cLevel:'Por nivel de valor',bNone:'Plano',bM:'Índice de marginación 2020',bP:'Pobreza 2020',bE:'Pobreza extrema 2020',
 reminder:'Solo asociaciones y predicciones. Sin afirmaciones causales.',mapHint:'Arrastre para girar · rueda para acercar · pulse para detalles',
 noVal:'sin datos este año',fcTag:'extrapolación',noFc:'No se conservó pronóstico para este parámetro y año.',
 pillarNote:'Las alturas comparten una escala por parámetro (hasta el percentil 95 de todas las estaciones-año; valores mayores se recortan). Un pilar ausente significa que no hay datos ese año. No se muestra terreno porque no se incluyeron datos de elevación.',
 pop:'Población',zone:'Zona',muni:'Municipio',median:'Mediana anual',allYears:'Medianas anuales, 2009–2024',lowLvl:'menor',hiLvl:'mayor',
 ov_p:'Esta vista repite en tres dimensiones números de las otras páginas: medianas anuales por estación del registro, indicadores censales de los municipios y las pocas extrapolaciones que pasaron las verificaciones.',
 ov_b1:'Los pilares usan medianas de los meses muestreados cada año; los años con pocos meses son menos seguros (véase Calidad de los datos).',ov_b2:'Los indicadores municipales pertenecen al municipio, no al río.',ov_b3:'Nada aquí muestra qué causa un valor ni qué se hará al respecto.'
}});
let g,play=null;const cache={};
function ann(pid,season){const k=pid+season;if(cache[k])return cache[k];const o=A.order.map((s,i)=>U.annual(pid,i,season==='all'?null:season));const all=[];o.forEach(a=>Object.values(a).forEach(v=>v>0||v===0?all.push(v):0));all.sort((a,b)=>a-b);return cache[k]={o,cap:all.length?all[Math.floor(.95*(all.length-1))]||all[all.length-1]:1}}
function update(){
 const pid=$('#gp').value,season=$('#gs').value,yr=+$('#gy').value,A_=ann(pid,season),p=U.P(pid),fc=A.fc[pid]||{};
 const lv=$('#gc').value==='level';$('#gyv').textContent=yr;$('#grv').textContent=(+$('#gr').value).toFixed(1)+'×';
 const pil={};let any=false;const useFc=$('#gf').checked,fcH=[1,2,3].find(h=>fc[h]&&fc[h].year===yr),fcv=fcH&&fc[fcH].show?fc[fcH]:null;
 A.order.forEach((id,i)=>{let v=null,gh=false;if(yr<=2024)v=A_.o[i][yr];else if(useFc&&fcv){v=fcv.stn[id];gh=true}
  if(v==null){pil[id]={h:null,tip:U.t('noVal')};return}any=true;const h=Math.min(1,Math.max(0,v/(A_.cap||1)));
  pil[id]={h,ghost:gh,col:lv?lerp(h):ZC[A.zone[i]],tip:`${U.pn(p)}: ${U.fmt(v)} ${p.unit} (${yr}${gh?' · '+U.t('fcTag'):''})`,v}});
 const bd=$('#gb').value;g.set({pillars:pil,ind:bd==='none'?'none':{m:'m',p:'p',e:'e'}[bd],yr:2,relief:+$('#gr').value,landmarks:$('#gl').checked});
 g.state.pillarColor=lv;
 $('#gnote').textContent=(yr>2024?(useFc&&fcv?'':U.t('noFc')+' '):'')+U.t('pillarNote');
 $('#gleg').innerHTML=(lv?`<span><i style="background:${lerp(0)}"></i>${U.t('lowLvl')}</span><span><i style="background:${lerp(1)}"></i>${U.t('hiLvl')}</span>`:'')+['Before','Urban','After'].map(z=>`<span><i style="background:${ZC[z]}"></i>${U.zn(z)}${lv?' ('+L('pin colour','color del marcador')+')':''}</span>`).join('')+`<span>◍ ${L('tributary: hollow pin','afluente: marcador hueco')}</span><span>${U.t('mapHint')}</span>`;
 g.redraw();card(selSt)}
function lerp(h){const a=[132,155,166],b=[128,104,88],c=[10,30,30],t=h<.5?h*2:(h-.5)*2,x=h<.5?[a,b]:[b,c];const m=x[0].map((v,i)=>Math.round(v+(x[1][i]-v)*t));return '#'+m.map(v=>v.toString(16).padStart(2,'0')).join('')}
let selSt=null;
function card(id){const el=$('#gcard');if(!id){el.innerHTML=`<p class="small">${U.t('mapHint')}</p>`;return}
 const s=U.st(id),i=A.order.indexOf(id),pid=$('#gp').value,p=U.P(pid),a=ann(pid,$('#gs').value).o[i],ys=[];for(let y=2009;y<=2024;y++)ys.push(a[y]);
 const vals=ys.filter(v=>v!=null),mx=Math.max(...vals,1e-9),yr=+$('#gy').value;
 const bars=ys.map((v,k)=>`<div style="flex:1;height:${v==null?0:Math.max(2,v/mx*50)}px;background:${2009+k===yr?'#14232b':s.color}" data-tip="${2009+k}: ${v==null?U.t('noVal'):U.fmt(v)+' '+p.unit}"></div>`).join('');
 const m=s.c?A.munis.find(x=>x.c===String(parseInt(s.c))):null;
 el.innerHTML=`<h3><span class="sw" style="background:${s.color}"></span> ${s.id} ${U.zt(s.id)}</h3><div class="small">${s.site}</div>
 <div class="kv"><span>${U.t('zone')}</span><b>${U.zn(s.zone)}${s.trib?' · '+U.t('trib'):''}</b></div><div class="kv"><span>${U.t('muni')}</span><b>${s.muni}</b></div>${m?`<div class="kv"><span>${U.t('pop')} 2020</span><b>${U.nf(m.pop3[2])}</b></div>`:''}
 <div class="small" style="margin-top:8px"><b>${U.pn(p)}</b> (${p.unit})<br>${U.t('allYears')}</div><div style="display:flex;align-items:flex-end;gap:2px;height:54px;border-bottom:1px solid #8aa0a8;margin:4px 0">${bars}</div>
 <div class="kv"><span>${U.t('median')} ${yr}</span><b>${yr<=2024&&a[yr]!=null?U.fmt(a[yr])+' '+p.unit:'–'}</b></div>`}
function build(){
 const gp=$('#gp'),pv=gp.value||'P13';gp.innerHTML=U.paramOpts(pv);
 const o=(id,items)=>{const e=$(id),v=e.value;e.innerHTML=U.opts(items,v||items[0][0])};
 o('#gs',[['all',U.t('sAll')],['wet',U.t('sWet')],['dry',U.t('sDry')]]);o('#gc',[['zone',U.t('cZone')],['level',U.t('cLevel')]]);o('#gb',[['m',U.t('bM')],['p',U.t('bP')],['e',U.t('bE')],['none',U.t('bNone')]]);
 if(!g){g=Map3D.create($('#gcv'),{pillarMax:80,pillarW:3.4,zoom:1.35,spin:false,onSelect:o=>{selSt=o.st?o.st.id:null;card(selSt)}});
  ['#gp','#gs','#gc','#gb','#gf','#gl','#gy','#gr'].forEach(s=>$(s).oninput=$(s).onchange=update);
  $('#gtop').onclick=()=>g.view('top');$('#grst').onclick=()=>g.view('reset');
  $('#gplay').onclick=()=>{if(play){clearInterval(play);play=null;$('#gplay').firstChild.textContent='▶ ';return}$('#gplay').firstChild.textContent='❚❚ ';const y=$('#gy');if(+y.value>=+y.max)y.value=2009;play=setInterval(()=>{if(+y.value>=+y.max){clearInterval(play);play=null;$('#gplay').firstChild.textContent='▶ ';return}y.value=+y.value+1;update()},900)};
  g.state.labels=true}
 $('#gy').max=$('#gf').checked?2027:2024;
 update();
 $('#ov').innerHTML=`<p>${U.t('ov_p')}</p><ul><li>${U.t('ov_b1')}</li><li>${U.t('ov_b2')}</li><li>${U.t('ov_b3')}</li></ul><p class="small">${U.t('ov_note')}</p>`}
$('#gf')&&0;
U.init('map3d',build);
document.addEventListener('change',e=>{if(e.target.id==='gf'){$('#gy').max=e.target.checked?2027:2024;if(!e.target.checked&&+$('#gy').value>2024)$('#gy').value=2024;update()}});
})();
