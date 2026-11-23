(function(){const A=U.A,$=U.$;
U.add({en:{h_heat:'Data quality: when and where the river was sampled',heat_lead:'Each square counts the months of that year with at least one sample at the station. Years with fewer sampled months give less certain results. Hover over a square to see the months collected.',
 view:'View',v_sm:'Station × year: months with records',v_sp:'Station × year: parameters recorded',v_py:'Parameter × year: share of months with a record',v_ps:'Parameter × station: share of months with a record',
 may:'2025 ended in May: the last records are from 13 May 2025, so 2025 has at most five months.',
 l_none:'No months',l_few:'1–5 months',l_many:'6 or more months',l_low:'lower',l_high:'higher',
 h_hist:'Sampling history',hist_lead:'One cell per month, February 2009 to May 2025. Colour shows how many of the 44 parameters were recorded at the station in that month.',
 hl40:'40–44 parameters',hl30:'30–39 parameters',hl1:'1–29 parameters',hl0:'No records',
 h_tab:'Parameter-level data quality',tab_lead:'Coverage is the share of station-months (13 stations × 196 months) with at least one record of the parameter. At floor is the share of values equal to the parameter’s lowest value, which can point to values coded as zero or at a detection limit. Floor values counts the different yearly minimum values; more than one suggests the reporting limit changed. Bad values are entries that were not valid measurements: they stay in the file and are left out of calculations.',
 search:'Search',phSearch:'Search a parameter…',cov:'Coverage',nrec:'Records',atf:'At floor',nfl:'Floor values',bad:'Bad values',flags:'Flags',
 f_rep:'Reporting changed',f_one:'One value only',f_lim:'Limited period',f_floor:'Mostly at floor',f_bad:'Missing-data code',
 cellM:'months collected',cellP:'parameters recorded',months_of:'of',nomonths:'no months',datesWord:'sampling dates',paramsIn:'parameters recorded',
 ov_p1:(s)=>`The file holds <b>${s.records}</b> records from <b>${s.stations}</b> stations and <b>${s.params}</b> parameters, collected on <b>${s.dates}</b> sampling dates (one station on one day) between February 2009 and May 2025.`,
 },es:{h_heat:'Calidad de los datos: cuándo y dónde se muestreó el río',heat_lead:'Cada cuadro cuenta los meses de ese año con al menos una muestra en la estación. Los años con menos meses muestreados dan resultados menos seguros. Pasa el cursor sobre un cuadro para ver los meses recolectados.',
 view:'Vista',v_sm:'Estación × año: meses con registros',v_sp:'Estación × año: parámetros registrados',v_py:'Parámetro × año: porcentaje de meses con registro',v_ps:'Parámetro × estación: porcentaje de meses con registro',
 may:'2025 terminó en mayo: los últimos registros son del 13 de mayo de 2025, así que 2025 tiene como máximo cinco meses.',
 l_none:'Sin meses',l_few:'1–5 meses',l_many:'6 o más meses',l_low:'menor',l_high:'mayor',
 h_hist:'Historial de muestreo',hist_lead:'Una celda por mes, de febrero de 2009 a mayo de 2025. El color muestra cuántos de los 44 parámetros se registraron en la estación ese mes.',
 hl40:'40–44 parámetros',hl30:'30–39 parámetros',hl1:'1–29 parámetros',hl0:'Sin registros',
 h_tab:'Calidad de los datos por parámetro',tab_lead:'La cobertura es el porcentaje de estación-meses (13 estaciones × 196 meses) con al menos un registro del parámetro. “En el mínimo” es el porcentaje de valores iguales al valor más bajo del parámetro, lo que puede indicar ceros o límites de detección. “Valores mínimos” cuenta los distintos mínimos anuales; más de uno sugiere que cambió el límite de reporte. “Valores inválidos” son entradas que no eran mediciones válidas: se conservan en el archivo y se excluyen de los cálculos.',
 search:'Buscar',phSearch:'Buscar un parámetro…',cov:'Cobertura',nrec:'Registros',atf:'En el mínimo',nfl:'Valores mínimos',bad:'Valores inválidos',flags:'Señales',
 f_rep:'Cambió el reporte',f_one:'Un solo valor',f_lim:'Periodo limitado',f_floor:'Casi todo en el mínimo',f_bad:'Código de dato faltante',
 cellM:'meses recolectados',cellP:'parámetros registrados',months_of:'de',nomonths:'ningún mes',datesWord:'fechas de muestreo',paramsIn:'parámetros registrados'}});
const YRS=A.years,order=A.order;
let view='sm',sortK='id',sortD=1,q='';
const lerp=(a,b,t)=>a.map((x,i)=>Math.round(x+(b[i]-x)*t));
const grad=p=>{const c=lerp([238,242,242],[47,111,149],Math.min(1,p/100));return `rgb(${c})`};
function stLab(s,i){const st=A.stations[i];return `<span class="mark" style="background:${st.color}"></span>${s}${st.trib?' ◦':''}${U.zt(s)}`}
function renderHeat(){
 const mn=U.MN(),el=$('#hm'),sel=$('#hv');
 if(!sel.options.length||sel.dataset.l!==U.lang()){sel.innerHTML=U.opts([['sm',U.t('v_sm')],['sp',U.t('v_sp')],['py',U.t('v_py')],['ps',U.t('v_ps')]],view);sel.dataset.l=U.lang()}
 sel.value=view;
 const head='<tr><th></th>'+(view==='ps'?order.map(s=>`<th>${s}<br>${U.zt(s)}</th>`):YRS.map(y=>`<th>${y}</th>`)).join('')+'</tr>';
 let h=head;
 if(view==='sm'||view==='sp'){
  order.forEach((s,i)=>{h+=`<tr><th class="r">${stLab(s,i)}</th>`+YRS.map((y,j)=>{
   if(view==='sm'){const c=A.heat_m[i][j];const ms=A.months.map((x,k)=>[x,k]).filter(([x,k])=>+x.slice(0,4)===y&&A.hist[s][k]>0).map(([x])=>mn[+x.slice(5)-1]);
    const cls=c>=6?'background:#2f8b94;color:#fff':c>=1?'background:#9bbcc4':'background:#eef2f2;box-shadow:inset 0 0 0 1px #c3cfd1';
    return `<td style="${cls}" data-tip="${s} · ${y}\n${c} ${U.t('cellM')}${ms.length?': '+ms.join(', '):''}">${c}</td>`}
   const c=A.heat_p[i][j];return `<td style="background:${grad(c/44*100)};color:${c/44>.55?'#fff':'#102b2b'}" data-tip="${s} · ${y}\n${c} ${U.t('cellP')}">${c}</td>`}).join('')+'</tr>'});
  $('#hleg').innerHTML=view==='sm'?`<span><i style="background:#eef2f2"></i>${U.t('l_none')}</span><span><i style="background:#9bbcc4"></i>${U.t('l_few')}</span><span><i style="background:#2f8b94"></i>${U.t('l_many')}</span><span>◦ ${U.t('trib')}</span>`:`<span><i style="background:${grad(0)}"></i>${U.t('l_low')}</span><span><i style="background:${grad(100)}"></i>${U.t('l_high')}</span><span>◦ ${U.t('trib')}</span>`;
 }else if(view==='py'){
  A.params.forEach(p=>{h+=`<tr><th class="r">${U.pn(p)}</th>`+p.py.map((v,j)=>`<td style="background:${grad(v)};color:${v>55?'#fff':'#102b2b'}" data-tip="${U.pn(p)} · ${YRS[j]}\n${v}% ${U.lang()==='es'?'de los meses con registro':'of station-months with a record'}">${Math.round(v)}</td>`).join('')+'</tr>'});
  $('#hleg').innerHTML=`<span><i style="background:${grad(0)}"></i>0%</span><span><i style="background:${grad(100)}"></i>100%</span>`;
 }else{
  A.params.forEach(p=>{h+=`<tr><th class="r">${U.pn(p)}</th>`+p.ps.map((v,j)=>`<td style="background:${grad(v)};color:${v>55?'#fff':'#102b2b'}" data-tip="${U.pn(p)} · ${order[j]}\n${v}% ${U.lang()==='es'?'de los meses con registro':'of months with a record'}">${Math.round(v)}</td>`).join('')+'</tr>'});
  $('#hleg').innerHTML=`<span><i style="background:${grad(0)}"></i>0%</span><span><i style="background:${grad(100)}"></i>100%</span>`;
 }
 el.innerHTML='<table>'+h+'</table>';
}
$('#hv').addEventListener('change',e=>{view=e.target.value;renderHeat()});
/* sampling history */
let hgeo=null;
function renderHist(){
 const c=$('#hc'),rowH=22,top=26,left=(c.clientWidth<620?96:300),NM=A.months.length,h=top+order.length*rowH+8;const {g,w}=U.cvs(c,h);
 const cw=(w-left-8)/NM;g.font='14px Palatino Linotype,Palatino,serif';g.fillStyle='#3b4c55';g.textBaseline='middle';
 for(let y=2009;y<=2025;y++){const k=A.months.indexOf(y+'-02')>=0&&y===2009?0:A.months.indexOf(y+'-01');const kk=y===2009?0:k;g.textAlign='left';(w>620||y%4===1)&&g.fillText(String(y),left+kk*cw,12);g.strokeStyle='#c3cfd1';g.beginPath();g.moveTo(left+kk*cw,top-4);g.lineTo(left+kk*cw,h-6);g.stroke()}
 const col=n=>n>=40?'#2f6f95':n>=30?'#7fb0c8':n>=1?'#d9a05b':'#e8ecec';
 order.forEach((s,i)=>{const y=top+i*rowH;g.textAlign='left';g.fillStyle='#14232b';const zc=U.ZC[A.zone[i]],zl=U.zlab(s);g.fillStyle=zc;g.fillRect(0,y+1,5,rowH-3);g.fillText(left<200?s:s+' '+A.stations[i].site.slice(0,18),12,y+rowH/2-1);if(left>=200){g.font='12px Palatino Linotype,Palatino,serif';const zw=g.measureText(zl).width+12;g.fillStyle=zc;g.beginPath();g.roundRect?g.roundRect(left-zw-8,y+3,zw,rowH-6,4):g.rect(left-zw-8,y+3,zw,rowH-6);g.fill();g.fillStyle='#fff';g.fillText(zl,left-zw-2,y+rowH/2-1);}g.font='14px Palatino Linotype,Palatino,serif';g.fillStyle='#14232b';
  for(let k=0;k<NM;k++){g.fillStyle=col(A.hist[s][k]);g.fillRect(left+k*cw,y+2,Math.max(1,cw-1),rowH-5)}});
 hgeo={left,cw,top,rowH,NM};
 $('#hl').innerHTML=`<span><i style="background:#2f6f95"></i>${U.t('hl40')}</span><span><i style="background:#7fb0c8"></i>${U.t('hl30')}</span><span><i style="background:#d9a05b"></i>${U.t('hl1')}</span><span><i style="background:#e8ecec"></i>${U.t('hl0')}</span>`;
}
$('#hc').addEventListener('mousemove',e=>{if(!hgeo)return;const r=e.currentTarget.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
 const k=Math.floor((x-hgeo.left)/hgeo.cw),i=Math.floor((y-hgeo.top)/hgeo.rowH);if(k<0||k>=hgeo.NM||i<0||i>=order.length){U.untip();return}
 const s=order[i],ym=A.months[k],mn=U.MN()[+ym.slice(5)-1];const n=A.hist[s][k],nd=A.histd[s][k];
 U.tip(`<b>${s}</b> · ${A.stations[i].site}<br>${mn} ${ym.slice(0,4)}<br>${n?n+' '+U.t('paramsIn')+', '+nd+' '+U.t('datesWord'):U.t('nomonths')}`,e)});
$('#hc').addEventListener('mouseleave',U.untip);
/* table */
function flagsOf(p){const t=p.tab,f=[];if(p.flags.reporting)f.push(['red',U.t('f_rep')]);if(p.flags.one)f.push(['red',U.t('f_one')]);if(p.flags.limited)f.push(['red',U.t('f_lim')]);if(t.floor>=50)f.push(['red',U.t('f_floor')]);if(t.bad>0)f.push(['red',U.t('f_bad')]);return f}
function renderTable(){
 const cols=[['id',U.t('parameter')],['unit',U.t('unit')],['y',U.t('years')],['cov',U.t('cov')],['n',U.t('nrec')],['floor',U.t('atf')],['nfloor',U.t('nfl')],['bad',U.t('bad')],['flags',U.t('flags')]];
 let rows=A.params.filter(p=>!q||(p.en+' '+p.es+' '+p.id).toLowerCase().includes(q));
 const key=(p)=>({id:p.id,unit:p.unit,y:p.tab.y0,cov:p.tab.cov,n:p.tab.n,floor:p.tab.floor,nfloor:p.tab.nfloor,bad:p.tab.bad,flags:flagsOf(p).length}[sortK]);
 rows.sort((a,b)=>{const x=key(a),y=key(b);return (x>y?1:x<y?-1:0)*sortD});
 $('#tt').innerHTML='<tr>'+cols.map(c=>`<th data-k="${c[0]}" style="cursor:pointer">${c[1]}${sortK===c[0]?(sortD>0?' ▲':' ▼'):''}</th>`).join('')+'</tr>'+
  rows.map(p=>{const t=p.tab;return `<tr><td><b>${U.pn(p)}</b> <span class="small">${p.id}</span></td><td>${p.unit}</td><td style="white-space:nowrap">${t.y0}–${t.y1}</td><td style="white-space:nowrap"><span class="covbar"><i style="width:${t.cov}%"></i></span>${t.cov}%</td><td class="n">${U.nf(t.n)}</td><td class="n">${t.floor}%</td><td class="n">${t.nfloor}</td><td class="n">${t.bad}</td><td>${flagsOf(p).map(f=>`<span class="tag ${f[0]}">${f[1]}</span>`).join('')}</td></tr>`}).join('');
}
$('#tt').addEventListener('click',e=>{const th=e.target.closest('th');if(!th)return;const k=th.dataset.k;if(sortK===k)sortD*=-1;else{sortK=k;sortD=1}renderTable()});
$('#tq').addEventListener('input',e=>{q=e.target.value.toLowerCase();renderTable()});
/* overview */
function renderOv(){
 const es=U.lang()==='es',S=A.stats,dates=S.visits;
 const mm=order.map(s=>A.hist[s].filter(x=>x>0).length),lo=Math.min(...mm),hi=Math.max(...mm),loS=order[mm.indexOf(lo)],hiS=order[mm.indexOf(hi)];
 const ymax=YRS.map((y,j)=>Math.max(...A.heat_m.map(r=>r[j]))),thin=YRS.filter((y,j)=>ymax[j]<=6&&y<2025),thinMax=thin.length?Math.max(...thin.map(y=>ymax[YRS.indexOf(y)])):0;
 const cov75=A.params.filter(p=>p.tab.cov>=75).length,lim=A.params.filter(p=>p.flags.limited),rep=A.params.filter(p=>p.flags.reporting),fl=A.params.filter(p=>p.tab.floor>=50),bad=A.params.filter(p=>p.tab.bad>0);
 const nm=a=>a.map(U.pn).join(', ');
 const p1=es?`El archivo contiene <b>${U.nf(S.records)}</b> registros de <b>${S.stations}</b> estaciones y <b>${S.params}</b> parámetros, recolectados en <b>${U.nf(dates)}</b> fechas de muestreo (una estación en un día) entre febrero de 2009 y mayo de 2025. Las estaciones se muestrearon de forma bastante pareja: cada una tiene registros en entre <b>${lo}</b> (${loS}) y <b>${hi}</b> (${hiS}) de los ${A.months.length} meses posibles.`
  :`The file holds <b>${U.nf(S.records)}</b> records from <b>${S.stations}</b> stations and <b>${S.params}</b> parameters, collected on <b>${U.nf(dates)}</b> sampling dates (one station on one day) between February 2009 and May 2025. Stations were sampled fairly evenly: each has records in between <b>${lo}</b> (${loS}) and <b>${hi}</b> (${hiS}) of the ${A.months.length} possible months.`;
 const b=es?[`<b>El tiempo es la mayor fuente de desigualdad.</b> ${thin.length?`En ${thin.join(', ')} ninguna estación tiene registros en más de ${thinMax} meses. `:''}2025 llega solo hasta mayo.`,
   `<b>Los parámetros se miden casi de forma uniforme.</b> ${cov75} de ${S.params} tienen registros en al menos 75% de los estación-meses. Se midieron solo en algunos años: ${nm(lim)}.`,
   `<b>Consistencia de los datos.</b> Varios parámetros están casi siempre en su valor mínimo (${nm(fl)}), lo que puede indicar límites de detección. Cambió la forma de reportar: ${nm(rep)}. ${bad.map(p=>U.pn(p)+' usa −1 como código de dato faltante en '+p.tab.bad+' filas').join('; ')}.`]
  :[`<b>Time is the main source of unevenness.</b> ${thin.length?`In ${thin.join(', ')} no station has records in more than ${thinMax} months. `:''}2025 runs only to May.`,
   `<b>Parameters are measured almost uniformly.</b> ${cov75} of ${S.params} have records in at least 75% of station-months. Only some years were measured for: ${nm(lim)}.`,
   `<b>Data consistency.</b> Several parameters sit almost always at their lowest value (${nm(fl)}), which can point to detection limits. The way values are reported changed for: ${nm(rep)}. ${bad.map(p=>U.pn(p)+' uses −1 as a missing-data code in '+p.tab.bad+' rows').join('; ')}.`];
 $('#ov').innerHTML=`<p class="lead">${p1}</p><ul class="ov">${b.map(x=>`<li>${x}</li>`).join('')}</ul><p class="note b">${U.t('ov_note')}</p>`;
}
U.init('quality',()=>{renderHeat();renderHist();renderTable();renderOv()});
addEventListener('resize',()=>renderHist());
})();
