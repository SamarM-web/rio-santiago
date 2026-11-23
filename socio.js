(function(){
const A=ATLAS,U=window.U,$=U.$,M=A.munis;
U.add({en:{
 h_map:'3D map of Jalisco municipalities',map_lead:'Each municipality is raised by how it ranks on the chosen census indicator (taller = higher value among the 125 municipalities). Pins are the monitoring stations. Drag to rotate, scroll or pinch to zoom, click a municipality or a pin.',
 indicator:'Indicator',period:'Census period',landmarks:'Show towns',topView:'Top view',resetView:'Reset view',mapHint:'Drag to rotate · scroll to zoom · click for details',
 iM:'Marginalization index',iP:'Poverty (% of people)',iE:'Extreme poverty (% of people)',iN:'Flat (no indicator)',
 mLeg:'Height shows rank among the 125 municipalities, not the raw value. Association only — no causal claims.',
 h_stab:'Stations and their municipalities',stab_lead:'Each monitoring station sits inside one municipality. Indicators below belong to the municipality, not to the station or the river.',
 stn_note:'RS-01 lies outside Jalisco according to its coordinates (Vista Hermosa, Michoacán), although the workbook names Ocotlán. It is left out of every census comparison until this is checked. AA-01 and AA-02 share a municipality, as do RS-05 and RS-06.',
 colSite:'Site (workbook)',colZone:'Zone',colMuni:'Municipality',colPop:'Population 2020',colG:'Grade 2010 / 2015 / 2020',colRank:'Rank 2020 (1 = highest)',colPov:'Poverty 2020 %',colExt:'Extreme poverty 2020 %',colDr:'No drainage %',colWa:'No piped water %',colCr:'Overcrowded %',colEl:'No electricity %',colIl:'Illiteracy %',colDi:'Dirt floor %',
 h_matrix:'Water versus indicator matrix',matrix_lead:'Spearman correlation (rho) between each parameter\'s station medians and each indicator of the station\'s municipality. A boxed cell is one of the few results that stay clear after correcting for the number of tests (Benjamini–Hochberg).',
 negRho:'negative rho',posRho:'positive rho',clearCell:'clear after correction',matrix_note:'A dash means too few stations with data. With 12 stations and about 2,000 tests, most large-looking values are expected by chance. Associations are not causes.',
 h_corr:'Correlation matrix: station values against an indicator',corr_lead:'Each dot is one station (RS-01 left out). Horizontal: the indicator value of its municipality. Vertical: the station\'s median for the chosen parameter over the whole record.',
 logAxis:'Log scale',parameter:'Parameter',municipality:'Municipality',
 corr_n:'{n} stations plotted. Verified rho for this pair and period: {rho}.',corr_na:'not available',
 h_profile:'Municipal profile',pop:'Population',grade:'Marginalization grade',idxRank:'Index rank (1 = highest of 125)',povL:'Poverty',extL:'Extreme poverty',houseH:'Housing and education indicators',linked:'Linked monitoring stations',noStn:'No monitoring station lies inside this municipality.',medians:'Median over the whole record',
 h_periods:'Marginalization index by census period',periods_lead:'Index grade and rank for each census. Rank 1 is the highest index value that year. Index scales differ between censuses, so compare ranks and grades, not raw values.',
 phMuni:'Search municipality…',search:'Search',cName:'Municipality',cIdx:'Index',cGrade:'Grade',cRank:'Rank',cStn:'Stations',
 moranH:'Do neighbouring municipalities look alike?',moran_lead:'Moran\'s I measures spatial clustering of each indicator (neighbours share a border). Values above 0 mean similar values sit next to each other.',mVar:'Indicator',mI:'Moran\'s I',mZ:'z',
 ov_p1:'The census indicators describe municipalities, while the water data describe 13 points on the river. Linking them leaves only 12 stations in {nm} municipalities.',
 ov_tests:'{c} of {t} station-level tests stay clear after correcting for multiple testing.',
 ov_b1:'Clear results: {list}.',ov_b2:'No result is clear at municipality level.',ov_b3:'Indicators cluster in space (Moran\'s I between {lo} and {hi}), so neighbouring municipalities are not independent.',ov_b4:'RS-01 lies outside Jalisco by its coordinates and is excluded from every census comparison.',
 grades:{'Muy bajo':'Very low',Bajo:'Low',Medio:'Medium',Alto:'High','Muy alto':'Very high'},
 x_illit:'Illiteracy %',x_nodrain:'No drainage %',x_noelec:'No electricity %',x_nowater:'No piped water %',x_crowd:'Overcrowded %',x_dirt:'Dirt floor %'
},es:{
 h_map:'Mapa 3D de municipios de Jalisco',map_lead:'Cada municipio se eleva según su lugar en el indicador censal elegido (más alto = valor mayor entre los 125 municipios). Los marcadores son las estaciones de monitoreo. Arrastre para girar, use la rueda o pellizque para acercar, y pulse un municipio o marcador.',
 indicator:'Indicador',period:'Periodo censal',landmarks:'Mostrar localidades',topView:'Vista superior',resetView:'Restablecer vista',mapHint:'Arrastre para girar · rueda para acercar · pulse para ver detalles',
 iM:'Índice de marginación',iP:'Pobreza (% de personas)',iE:'Pobreza extrema (% de personas)',iN:'Plano (sin indicador)',
 mLeg:'La altura muestra el lugar entre los 125 municipios, no el valor. Solo asociaciones; sin afirmaciones causales.',
 h_stab:'Estaciones y sus municipios',stab_lead:'Cada estación está dentro de un municipio. Los indicadores pertenecen al municipio, no a la estación ni al río.',
 stn_note:'Según sus coordenadas, RS-01 queda fuera de Jalisco (Vista Hermosa, Michoacán), aunque el libro de datos indica Ocotlán. Se excluye de toda comparación censal hasta verificarlo. AA-01 y AA-02 comparten municipio, igual que RS-05 y RS-06.',
 colSite:'Sitio (libro de datos)',colZone:'Zona',colMuni:'Municipio',colPop:'Población 2020',colG:'Grado 2010 / 2015 / 2020',colRank:'Lugar 2020 (1 = más alto)',colPov:'Pobreza 2020 %',colExt:'Pobreza extrema 2020 %',colDr:'Sin drenaje %',colWa:'Sin agua entubada %',colCr:'Hacinamiento %',colEl:'Sin electricidad %',colIl:'Analfabetismo %',colDi:'Piso de tierra %',
 h_matrix:'Matriz agua frente a indicador',matrix_lead:'Correlación de Spearman (rho) entre las medianas por estación de cada parámetro y cada indicador del municipio de la estación. Una celda con recuadro es uno de los pocos resultados que siguen claros tras corregir por el número de pruebas (Benjamini–Hochberg).',
 negRho:'rho negativa',posRho:'rho positiva',clearCell:'claro tras la corrección',matrix_note:'Un guion significa que hay muy pocas estaciones con datos. Con 12 estaciones y unas 2,000 pruebas, es esperable que muchos valores grandes sean por azar. Las asociaciones no son causas.',
 h_corr:'Matriz de correlación: valores por estación frente a un indicador',corr_lead:'Cada punto es una estación (sin RS-01). Horizontal: valor del indicador de su municipio. Vertical: mediana de la estación para el parámetro elegido en todo el registro.',
 logAxis:'Escala logarítmica',parameter:'Parámetro',municipality:'Municipio',
 corr_n:'{n} estaciones. Rho verificada para este par y periodo: {rho}.',corr_na:'no disponible',
 h_profile:'Perfil municipal',pop:'Población',grade:'Grado de marginación',idxRank:'Lugar del índice (1 = más alto de 125)',povL:'Pobreza',extL:'Pobreza extrema',houseH:'Indicadores de vivienda y educación',linked:'Estaciones de monitoreo asociadas',noStn:'Ninguna estación de monitoreo está dentro de este municipio.',medians:'Mediana de todo el registro',
 h_periods:'Índice de marginación por periodo censal',periods_lead:'Grado y lugar del índice en cada censo. El lugar 1 es el valor más alto ese año. Las escalas cambian entre censos; compare lugares y grados, no valores.',
 phMuni:'Buscar municipio…',search:'Buscar',cName:'Municipio',cIdx:'Índice',cGrade:'Grado',cRank:'Lugar',cStn:'Estaciones',
 moranH:'¿Se parecen los municipios vecinos?',moran_lead:'La I de Moran mide la agrupación espacial de cada indicador (vecinos comparten frontera). Valores mayores que 0: valores parecidos están juntos.',mVar:'Indicador',mI:'I de Moran',mZ:'z',
 ov_p1:'Los indicadores censales describen municipios; los datos de agua describen 13 puntos del río. Al unirlos quedan solo 12 estaciones en {nm} municipios.',
 ov_tests:'{c} de {t} pruebas por estación siguen siendo claras tras corregir por pruebas múltiples.',
 ov_b1:'Resultados claros: {list}.',ov_b2:'Ningún resultado es claro a nivel municipal.',ov_b3:'Los indicadores se agrupan en el espacio (I de Moran entre {lo} y {hi}), así que los municipios vecinos no son independientes.',ov_b4:'RS-01 queda fuera de Jalisco según sus coordenadas y se excluye de toda comparación censal.',
 grades:{'Muy bajo':'Muy bajo',Bajo:'Bajo',Medio:'Medio',Alto:'Alto','Muy alto':'Muy alto'},
 x_illit:'Analfabetismo %',x_nodrain:'Sin drenaje %',x_noelec:'Sin electricidad %',x_nowater:'Sin agua entubada %',x_crowd:'Hacinamiento %',x_dirt:'Piso de tierra %'
}});
const YR=['2010','2015','2020'],IK={marg:'iM',poverty:'iP',povext:'iE'},MK={marg:'m',poverty:'p',povext:'e'};
const gr=g=>(U.t('grades')||{})[g]||g;
const rk=MK&&[0,1,2].map(k=>{const o=M.map((m,i)=>i).sort((a,b)=>M[b].m[k]-M[a].m[k]),r={};o.forEach((i,j)=>r[M[i].c]=j+1);return r});
const muniOf=c=>M.find(m=>m.c===String(parseInt(c)));
const stMed={};
function med(pid,sid){const k=pid+sid;if(k in stMed)return stMed[k];const si=A.order.indexOf(sid);const v=U.rows(pid).filter(r=>r.s===si).map(r=>r.v);return stMed[k]=U.median(v)}
const PRO=[['P13'],['P26'],['P19'],['P09'],['P31']];
const f1=v=>v==null?'–':(+v).toFixed(1);
let map3,sel=null;
function tpl(s,o){return s.replace(/\{(\w+)\}/g,(a,k)=>o[k])}
function profile(m){
 if(!m)return `<p class="small">${U.t('mapHint')}</p>`;
 const hs=['illit','nodrain','noelec','nowater','crowd','dirt'];
 let h=`<h3>${m.n}</h3><div class="kv"><span>${U.t('pop')} 2020</span><b>${U.nf(m.pop3[2])}</b></div>
 <table><tr><th></th>${YR.map(y=>`<th>${y}</th>`).join('')}</tr>
 <tr><td>${U.t('grade')}</td>${m.g.map(g=>`<td>${gr(g)}</td>`).join('')}</tr>
 <tr><td>${U.t('idxRank')}</td>${[0,1,2].map(k=>`<td>${rk[k][m.c]}</td>`).join('')}</tr>
 <tr><td>${U.t('povL')} %</td>${m.p.map(v=>`<td>${f1(v)}</td>`).join('')}</tr>
 <tr><td>${U.t('extL')} %</td>${m.e.map(v=>`<td>${f1(v)}</td>`).join('')}</tr></table>
 <div class="small" style="margin:8px 0 2px"><b>${U.t('houseH')}</b></div><table>${hs.map(k=>`<tr><td>${U.t('x_'+k)}</td>${m.x[k].map(v=>`<td>${f1(v)}</td>`).join('')}</tr>`).join('')}</table>
 <div class="small" style="margin:8px 0 2px"><b>${U.t('linked')}</b></div>`;
 if(!m.st.length)h+=`<p class="small">${U.t('noStn')}</p>`;
 else h+=`<table><tr><th>${U.t('station')}</th>${PRO.map(p=>`<th data-tip="${U.pn(U.P(p[0]))} (${U.P(p[0]).unit})">${U.pn(U.P(p[0])).split('(')[0].slice(0,12)}</th>`).join('')}</tr>${m.st.map(s=>`<tr><td>${s}${U.zt(s)}</td>${PRO.map(p=>`<td>${U.fmt(med(p[0],s))}</td>`).join('')}</tr>`).join('')}</table><div class="small">${U.t('medians')}.</div>`;
 return h}
function showCard(m){$('#mcard').innerHTML=profile(m)}
function renderMap(){
 const ind=$('#mi'),per=$('#my');
 const iv=ind.value||'marg',pv=per.value||'2';
 ind.innerHTML=U.opts([...['marg','poverty','povext'].map(k=>[k,U.t(IK[k])]),['none',U.t('iN')]],iv);
 per.innerHTML=U.opts(YR.map((y,i)=>[String(i),y]),pv);
 const apply=()=>{const v=ind.value;map3.set({ind:v==='none'?'none':MK[v],yr:+per.value});$('#mleg').innerHTML=`<span><i class="sw" style="background:#ecefe4"></i> ${U.lang()==='es'?'más bajo':'lower'}</span><span><i class="sw" style="background:#64839a"></i></span><span><i class="sw" style="background:#183442"></i> ${U.lang()==='es'?'más alto':'higher'}</span><span>${U.t('mLeg')}</span>`};
 if(!map3){map3=Map3D.create($('#mcv'),{onSelect:o=>{sel=o.m;showCard(o.m);const pm=$('#pm');if(o.m){pm.value=o.m.c;renderProfile()}},pillarMax:20});
  ind.onchange=per.onchange=apply;$('#mlm').onchange=e=>map3.set({landmarks:e.target.checked});$('#mtop').onclick=()=>map3.view('top');$('#mrst').onclick=()=>map3.view('reset');
  const g=M.find(m=>m.n==='Guadalajara');sel=g;map3.select(g,null);showCard(g)}
 apply();showCard(sel)}
function stationTable(){
 const rows=A.stations.map(s=>{const m=s.c?muniOf(s.c):null;return {s,m}});
 const hd=['station','colSite','colZone','colMuni','colPop','colG','colRank','colPov','colExt','colDr','colWa','colCr','colEl','colIl','colDi'];
 $('#stt').innerHTML=`<tr>${hd.map(h=>`<th>${U.t(h)}</th>`).join('')}</tr>`+rows.map(({s,m})=>{
  const c=`<span class="sw" style="background:${s.color}"></span> <b>${s.id}</b>${s.trib?` <span class="tag blue">${U.t('trib')}</span>`:''}`;
  if(!m)return `<tr><td>${c}</td><td>${s.site}</td><td>${U.zt(s.id)}</td><td>${s.muni.replace('outside Jalisco','fuera de Jalisco'.slice(0,0)||'outside Jalisco')}</td><td colspan="${hd.length-4}"><span class="tag gold">${U.lang()==='es'?'sin datos censales de Jalisco':'no Jalisco census data'}</span></td></tr>`;
  return `<tr><td>${c}</td><td>${s.site}</td><td>${U.zt(s.id)}</td><td>${m.n}</td><td>${U.nf(m.pop3[2])}</td><td>${m.g.map(gr).join(' / ')}</td><td>${rk[2][m.c]}</td><td>${f1(m.p[2])}</td><td>${f1(m.e[2])}</td><td>${f1(m.x.nodrain[2])}</td><td>${f1(m.x.nowater[2])}</td><td>${f1(m.x.crowd[2])}</td><td>${f1(m.x.noelec[2])}</td><td>${f1(m.x.illit[2])}</td><td>${f1(m.x.dirt[2])}</td></tr>`}).join('');
 $('#stnote').textContent=U.t('stn_note')}
const clearSet=new Set(A.clear.map(c=>c[0]+'|'+c[1]+'|'+c[2]));
function col(r){if(r==null)return '';const a=Math.min(1,Math.abs(r));const t=.15+.75*a;return r>=0?`rgba(214,150,80,${t})`:`rgba(80,130,180,${t})`}
function matrix(){
 const y=$('#xy');const yv=y.value||'2';y.innerHTML=U.opts(YR.map((v,i)=>[String(i),v]),yv);y.onchange=matrix;const k=+y.value;
 $('#mxt').innerHTML=`<tr><th class="pn">${U.t('parameter')}</th>${['marg','poverty','povext'].map(i=>`<th>${U.t(IK[i])}</th>`).join('')}</tr>`+A.params.map(p=>{
  const a=A.assoc[p.id]||{};return `<tr><td class="pn">${U.pn(p)}</td>${['marg','poverty','povext'].map(i=>{const v=a[i]&&a[i][k],cl=clearSet.has(p.id+'|'+i+'|'+YR[k]);return v==null?`<td class="n">–</td>`:`<td class="${cl?'cl':''}" style="background:${col(v)}" data-tip="${U.pn(p)}\n${U.t(IK[i])} ${YR[k]}\nrho = ${v.toFixed(2)}${cl?'\n'+U.t('clearCell'):''}">${v.toFixed(2)}</td>`}).join('')}</tr>`}).join('')}
function corr(){
 const cp=$('#cp'),ci=$('#ci'),cy=$('#cy');
 const pv=cp.value||'P13',iv=ci.value||'marg',yv=cy.value||'2';
 cp.innerHTML=U.paramOpts(pv);ci.innerHTML=U.opts(['marg','poverty','povext'].map(k=>[k,U.t(IK[k])]),iv);cy.innerHTML=U.opts(YR.map((v,i)=>[String(i),v]),yv);
 cp.onchange=ci.onchange=cy.onchange=$('#clog').onchange=corr;
 const k=+cy.value,key=MK[ci.value],lg=$('#clog').checked;
 const pts=A.stations.filter(s=>s.c).map(s=>{const m=muniOf(s.c);return {s,x:key==='m'?rk[k][m.c]:m[key][k],y:med(cp.value,s.id)}}).filter(p=>p.y!=null&&p.y>0||(!lg&&p.y!=null));
 const W=Math.max(300,$('#cchart').clientWidth||700),H=340,L=62,R=14,T=14,B=44;
 const xs=pts.map(p=>p.x),ys=pts.map(p=>lg?Math.log10(p.y):p.y);
 let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);if(x0===x1){x0-=1;x1+=1}if(y0===y1){y0-=1;y1+=1}const py=(y1-y0)*.08;y0-=py;y1+=py;
 const X=v=>L+(v-x0)/(x1-x0)*(W-L-R),Y=v=>H-B-(v-y0)/(y1-y0)*(H-B-T);
 let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" style="background:#fff;border:1px solid var(--line)">`;
 for(let i=0;i<=4;i++){const v=y0+(y1-y0)*i/4,yy=Y(v);s+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="#e1e8e8"/><text x="${L-6}" y="${yy+4}" text-anchor="end" font-size="13" fill="#3b4c55">${U.fmt(lg?Math.pow(10,v):v)}</text>`}
 for(let i=0;i<=4;i++){const v=x0+(x1-x0)*i/4;s+=`<text x="${X(v)}" y="${H-B+16}" text-anchor="middle" font-size="13" fill="#3b4c55">${key==='m'?Math.round(v):f1(v)}</text>`}
 s+=`<text x="${(L+W-R)/2}" y="${H-6}" text-anchor="middle" font-size="14" fill="#14232b">${key==='m'?U.t('idxRank')+' '+YR[k]:U.t(IK[ci.value])+' '+YR[k]}</text><text transform="translate(14 ${(T+H-B)/2}) rotate(-90)" text-anchor="middle" font-size="14" fill="#14232b">${U.pn(U.P(cp.value))} (${U.P(cp.value).unit})</text>`;
 pts.forEach((p,i)=>{const yy=Y(lg?Math.log10(p.y):p.y),tr=p.s.trib;s+=`<g data-tip="<b>${p.s.id}</b> (${U.zlab(p.s.id)}) · ${muniOf(p.s.c).n}\n${U.pn(U.P(cp.value))}: ${U.fmt(p.y)}\n${key==='m'?U.t('idxRank'):U.t(IK[ci.value])}: ${key==='m'?p.x:f1(p.x)}"><circle cx="${X(p.x)}" cy="${yy}" r="8" fill="${tr?'#fff':p.s.color}" stroke="${tr?p.s.color:'#fff'}" stroke-width="${tr?3:1.5}"/><text x="${X(p.x)+11}" y="${yy+4}" font-size="13" fill="#14232b">${p.s.id}</text></g>`});
 $('#cchart').innerHTML=s+'</svg>';
 const a=A.assoc[cp.value],rho=a&&a[ci.value]&&a[ci.value][k];
 $('#cnote').textContent=tpl(U.t('corr_n'),{n:pts.length,rho:rho==null?U.t('corr_na'):rho.toFixed(2)})}
function renderProfile(){const pm=$('#pm'),v=pm.value||'14039';pm.innerHTML=U.opts(M.slice().sort((a,b)=>a.n.localeCompare(b.n)).map(m=>[m.c,m.n+(m.st.length?' ●':'')]),v);pm.onchange=()=>{$('#pcard').innerHTML=profile(muniOf(pm.value))};$('#pcard').innerHTML=profile(muniOf(pm.value))}
let pSort={k:'n',d:1};
function periods(){
 const q=($('#pq').value||'').toLowerCase();$('#pq').oninput=periods;
 let rows=M.filter(m=>m.n.toLowerCase().includes(q));
 const get={n:m=>m.n,r0:m=>rk[0][m.c],r1:m=>rk[1][m.c],r2:m=>rk[2][m.c],pop:m=>m.pop3[2]}[pSort.k];
 rows.sort((a,b)=>{const x=get(a),y=get(b);return (x>y?1:x<y?-1:0)*pSort.d});
 const hd=`<tr><th data-s="n">${U.t('cName')}</th><th data-s="pop">${U.t('pop')} 2020</th>${YR.map((y,k)=>`<th data-s="r${k}">${U.t('cGrade')} ${y}</th><th data-s="r${k}">${U.t('cRank')} ${y}</th>`).join('')}<th>${U.t('cStn')}</th></tr>`;
 $('#pt').innerHTML=hd+rows.map(m=>`<tr><td>${m.n}</td><td>${U.nf(m.pop3[2])}</td>${[0,1,2].map(k=>`<td>${gr(m.g[k])}</td><td>${rk[k][m.c]}</td>`).join('')}<td>${m.st.join(', ')}</td></tr>`).join('');
 $('#pt').querySelectorAll('th[data-s]').forEach(th=>{th.style.cursor='pointer';th.onclick=()=>{const k=th.dataset.s;pSort=pSort.k===k?{k,d:-pSort.d}:{k,d:1};periods()}});
 const nm={marg:U.t('iM'),poverty:U.t('iP'),povext:U.t('iE')};
 $('#mo').innerHTML=`<tr><th>${U.t('mVar')}</th><th>${U.t('mI')}</th><th>${U.t('mZ')}</th></tr>`+A.moran.map(r=>{const k=r[0].replace(/\d+$/,''),y=r[0].slice(-4);return `<tr><td>${nm[k]} ${y}</td><td>${r[1].toFixed(2)}</td><td>${r[2].toFixed(1)}</td></tr>`}).join('')}
function overview(){
 let tot=0;for(const p in A.assoc)for(const i in A.assoc[p])A.assoc[p][i].forEach(v=>{if(v!=null)tot++});
 const lst=A.clear.map(c=>`${U.pn(U.P(c[0]))} – ${U.t(IK[c[1]])} ${c[2]} (rho ${c[3].toFixed(2)})`).join('; ');
 const Is=A.moran.map(r=>r[1]);
 $('#ov').innerHTML=`<div class="tiles"><div class="tile"><b>12</b><span>${U.lang()==='es'?'estaciones con datos censales':'stations with census data'}</span></div><div class="tile"><b>${new Set(A.stations.filter(s=>s.c).map(s=>s.c)).size}</b><span>${U.lang()==='es'?'municipios con estación':'municipalities with a station'}</span></div><div class="tile"><b>${tot}</b><span>${U.lang()==='es'?'pruebas de asociación':'association tests'}</span></div><div class="tile"><b>${A.clear.length}</b><span>${U.lang()==='es'?'claras tras corrección':'clear after correction'}</span></div></div>
 <p>${tpl(U.t('ov_p1'),{nm:new Set(A.stations.filter(s=>s.c).map(s=>s.c)).size})} ${tpl(U.t('ov_tests'),{c:A.clear.length,t:tot})}</p>
 <ul><li>${tpl(U.t('ov_b1'),{list:lst})}</li><li>${U.t('ov_b2')}</li><li>${tpl(U.t('ov_b3'),{lo:Math.min(...Is).toFixed(2),hi:Math.max(...Is).toFixed(2)})}</li><li>${U.t('ov_b4')}</li></ul><p class="small">${U.t('ov_note')}</p>`}
U.init('socio',()=>{renderMap();stationTable();matrix();corr();renderProfile();periods();overview()});
})();
