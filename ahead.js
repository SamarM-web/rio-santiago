(function(){
const A=ATLAS,U=window.U,$=U.$,L=(a,b)=>U.lang()==='es'?b:a;
U.add({en:{
 h_fc:'Looking ahead, honestly',fc_lead:'Lines are yearly medians for each zone. Markers beyond 2024 are extrapolations from past patterns, shown only where a model beat the simple baselines in held-out years. They are not predictions of what will happen.',
 parameter:'Parameter',logAxis:'Log scale',
 h_can:'Looking ahead: what a forecast can and cannot do',can_lead:'Every parameter was tested at three horizons (1, 2 and 3 years ahead). A forecast is shown only if it clears several checks; most do not.',
 shownH:'The forecasts that were kept',feature:'Horizon',model:'Model',
 h_obs:'Observed versus predicted',obs_lead:'Each dot is one station-year from years held out of model fitting. The diagonal is a perfect match. Skill compares the model with the best simple baseline: above 0 means better, below 0 means worse.',
 h_solid:'Overview: how solid are the findings?',
 yr:'year',baseline:'Baseline',mdl:'Model',zoneLo:'range 90%',notFc:'not forecast',
 ridge:'Ridge',lasso:'Lasso',random_forest:'Random forest',gradient_boosting:'Gradient boosting',persistence:'Persistence (last value)',station_mean:'Station mean',linear_trend:'Linear trend',
 hz1:'1 year ahead',hz2:'2 years ahead',hz3:'3 years ahead',
 sBase:'No model beats the best simple baseline',sRep:'Reporting precision changed',sCov:'90% range covered too few held-out values',sShown:'Forecast shown'
},es:{
 h_fc:'Mirando adelante, con honestidad',fc_lead:'Las líneas son medianas anuales por zona. Los marcadores después de 2024 son extrapolaciones de patrones pasados, y solo se muestran donde un modelo superó a las referencias simples en años no usados para ajustar. No son predicciones de lo que ocurrirá.',
 parameter:'Parámetro',logAxis:'Escala logarítmica',
 h_can:'Mirando adelante: lo que un pronóstico puede y no puede hacer',can_lead:'Cada parámetro se probó con tres horizontes (1, 2 y 3 años). Un pronóstico solo se muestra si supera varias verificaciones; la mayoría no.',
 shownH:'Los pronósticos que se conservaron',feature:'Horizonte',model:'Modelo',
 h_obs:'Observado frente a predicho',obs_lead:'Cada punto es una estación-año de años no usados al ajustar el modelo. La diagonal es una coincidencia perfecta. La habilidad compara el modelo con la mejor referencia simple: mayor que 0 es mejor, menor que 0 es peor.',
 h_solid:'Resumen: ¿qué tan sólidos son los hallazgos?',
 yr:'año',baseline:'Referencia',mdl:'Modelo',zoneLo:'rango 90%',notFc:'sin pronóstico',
 ridge:'Ridge',lasso:'Lasso',random_forest:'Bosque aleatorio',gradient_boosting:'Gradient boosting',persistence:'Persistencia (último valor)',station_mean:'Media de la estación',linear_trend:'Tendencia lineal',
 hz1:'1 año adelante',hz2:'2 años adelante',hz3:'3 años adelante',
 sBase:'Ningún modelo supera la mejor referencia simple',sRep:'Cambió la precisión del reporte',sCov:'El rango de 90% cubrió pocos valores',sShown:'Pronóstico mostrado'
}});
const ZK=['Before','Urban','After'],ZC=U.ZC,Y0=2009;
const METH=['ridge','lasso','random_forest','gradient_boosting','persistence','station_mean','linear_trend'];
const fmt=U.fmt;
function fchart(){
 const sel=$('#fp'),pv=sel.value||'P13';sel.innerHTML=U.paramOpts(pv);sel.onchange=$('#flog').onchange=fchart;
 const p=U.P(sel.value),lg=$('#flog').checked,fc=A.fc[p.id]||{};
 const W=Math.max(320,$('#fchart').clientWidth||800),H=360,Lm=64,R=16,T=14,B=36;
 const hs=[1,2,3].filter(h=>fc[h]);let ys=[];
 ZK.forEach(z=>p.series[z].forEach(v=>v!=null&&ys.push(v)));hs.forEach(h=>{if(fc[h].show)ZK.forEach(z=>ys.push(fc[h].z[z][1],fc[h].z[z][2]))});
 const tf=v=>lg?Math.log10(Math.max(v,1e-9)):v;if(lg)ys=ys.filter(v=>v>0);
 let y0=Math.min(...ys.map(tf)),y1=Math.max(...ys.map(tf));if(!lg)y0=Math.min(0,y0);const pd=(y1-y0)*.06||1;y1+=pd;if(lg)y0-=pd;
 const x0=Y0,x1=2027.6,X=v=>Lm+(v-x0)/(x1-x0)*(W-Lm-R),Y=v=>H-B-(tf(v)-y0)/(y1-y0)*(H-B-T);
 let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="background:#fff;border:1px solid var(--line)">`;
 for(let i=0;i<=4;i++){const v=y0+(y1-y0)*i/4,yy=H-B-(v-y0)/(y1-y0)*(H-B-T);s+=`<line x1="${Lm}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="#e1e8e8"/><text x="${Lm-6}" y="${yy+4}" text-anchor="end" font-size="13" fill="#3b4c55">${fmt(lg?Math.pow(10,v):v)}</text>`}
 for(let y=2010;y<=2027;y+=y<2024?2:1)s+=`<text x="${X(y)}" y="${H-B+15}" text-anchor="middle" font-size="13" fill="${y>2024?'#806858':'#3b4c55'}">${y}</text>`;
 s+=`<rect x="${X(2024.5)}" y="${T}" width="${W-R-X(2024.5)}" height="${H-B-T}" fill="#f1ece6" opacity=".7"/>`;
 ZK.forEach(z=>{const pts=p.series[z].map((v,i)=>v==null||(lg&&v<=0)?null:[X(Y0+i),Y(v)]).filter(Boolean);s+=`<polyline fill="none" stroke="${ZC[z]}" stroke-width="2" points="${pts.map(q=>q.join(',')).join(' ')}"/>`;
  p.series[z].forEach((v,i)=>{if(v!=null&&!(lg&&v<=0))s+=`<circle cx="${X(Y0+i)}" cy="${Y(v)}" r="3.5" fill="${ZC[z]}" data-tip="${U.zn(z)} · ${Y0+i}\n${fmt(v)} ${p.unit}"/>`})});
 hs.forEach(h=>{const f=fc[h],x=X(f.year);if(f.show){ZK.forEach((z,k)=>{const xx=x+(k-1)*8,m=f.z[z];s+=`<line x1="${xx}" x2="${xx}" y1="${Y(Math.max(m[1],lg?1e-9:-1e18))}" y2="${Y(m[2])}" stroke="${ZC[z]}" stroke-width="2"/><rect x="${xx-4.5}" y="${Y(m[0])-4.5}" width="9" height="9" fill="#fff" stroke="${ZC[z]}" stroke-width="2" data-tip="${U.zn(z)} · ${f.year} (${U.t('hz'+h)})\n${fmt(m[0])} ${p.unit}\n${U.t('zoneLo')}: ${fmt(m[1])} – ${fmt(m[2])}\n${U.t('mdl')}: ${U.t(f.model)}"/>`})}
  else s+=`<text x="${x}" y="${H-B-8}" text-anchor="middle" font-size="12" fill="#806858" data-tip="${f.year}: ${f.reason.replace('not forecast: ','')}">✕</text>`});
 $('#fchart').innerHTML=s+'</svg>';
 $('#fleg').innerHTML=ZK.map(z=>`<span><i style="background:${ZC[z]}"></i>${U.zn(z)}</span>`).join('')+`<span>□ ${L('extrapolation with 90% range','extrapolación con rango de 90%')}</span><span>✕ ${U.t('notFc')}</span>`;
 $('#fnote').textContent=L('Shaded area: years beyond the data. ','Área sombreada: años más allá de los datos. ')+(hs.some(h=>fc[h].show)?'':L('No forecast was kept for this parameter.','No se conservó ningún pronóstico para este parámetro.'))}
function can(){
 const f=A.fsum,parts=[[f.shown,'#536b7a',U.t('sShown')],[f.baseline,'#b9c6c6',U.t('sBase')],[f.reporting,'#806858',U.t('sRep')],[f.coverage,'#d8c58a',U.t('sCov')]];
 $('#cbar').innerHTML=`<div style="display:flex;height:34px;border:2px inset #c1d0d2">${parts.map(p=>`<div style="flex:${p[0]};background:${p[1]};display:flex;align-items:center;justify-content:center;font-weight:bold;color:${p[1]==='#536b7a'||p[1]==='#806858'?'#fff':'#14232b'}" data-tip="${p[2]}: ${p[0]}">${p[0]}</div>`).join('')}</div>`;
 $('#cleg').innerHTML=`<span><b>${f.total}</b> ${L('combinations tested','combinaciones probadas')}</span>`+parts.map(p=>`<span><i style="background:${p[1]}"></i>${p[2]}</span>`).join('');
 const cards=[];for(const pid in A.fc)for(const h in A.fc[pid])if(A.fc[pid][h].show)cards.push([pid,+h,A.fc[pid][h]]);
 $('#cards').innerHTML=cards.map(([pid,h,f])=>{const p=U.P(pid);return `<div class="box" data-tip="${U.t('mdl')}: ${U.t(f.model)}\n${L('Skill vs best baseline','Habilidad frente a la mejor referencia')} (${U.t(f.base)}): ${f.skill}\n${L('90% range coverage','Cobertura del rango 90%')}: ${Math.round(f.cov*100)}%"><b>${U.pn(p)}</b><div class="small">${U.t('hz'+h)} · ${f.year} · ${U.t(f.model)}</div>${ZK.map(z=>`<div style="display:flex;justify-content:space-between;font-size:.86rem;border-top:1px dotted #c4d0d2;margin-top:3px"><span><i class="sw" style="background:${ZC[z]}"></i> ${U.zn(z)}</span><span>${fmt(f.z[z][0])} <span class="small">(${fmt(f.z[z][1])}–${fmt(f.z[z][2])})</span></span></div>`).join('')}<div class="small">${p.unit}</div></div>`}).join('')}
function obs(){
 const ps=Object.keys(A.bt),sp=$('#op'),sh=$('#oh'),sm=$('#om');
 const pv=sp.value||ps[0];sp.innerHTML=U.opts(ps.map(id=>[id,U.pn(U.P(id))]),pv);sh.innerHTML=U.opts([1,2,3].filter(h=>A.bt[sp.value][h]).map(h=>[String(h),U.t('hz'+h)]),sh.value||'1');
 const mv=sm.value||'random_forest';sm.innerHTML=U.opts(METH.map(m=>[m,(['persistence','station_mean','linear_trend'].includes(m)?U.t('baseline')+': ':'')+U.t(m)]),mv);
 sp.onchange=sh.onchange=sm.onchange=$('#olog').onchange=obs;
 const bt=A.bt[sp.value][sh.value],m=sm.value,lg=$('#olog').checked,pr=bt.p[m];
 const pts=[];bt.y.forEach((y,i)=>bt.a[i].forEach((a,j)=>{const q=pr[i][j];if(a!=null&&q!=null&&(!lg||(a>0&&q>0)))pts.push({a,q,y,j})}));
 const W=Math.max(260,($('#ochart').clientWidth||420)),H=360,Lm=56,R=12,T=12,B=40,tf=v=>lg?Math.log10(v):v;
 const all=pts.flatMap(p=>[tf(p.a),tf(p.q)]);let lo=Math.min(...all),hi=Math.max(...all);const pd=(hi-lo)*.05||1;lo-=pd;hi+=pd;
 const X=v=>Lm+(tf(v)-lo)/(hi-lo)*(W-Lm-R),Y=v=>H-B-(tf(v)-lo)/(hi-lo)*(H-B-T);
 let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="background:#fff;border:1px solid var(--line)">`;
 for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4,r=lg?Math.pow(10,v):v,xx=Lm+(W-Lm-R)*i/4,yy=H-B-(H-B-T)*i/4;s+=`<line x1="${Lm}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="#e1e8e8"/><text x="${Lm-5}" y="${yy+4}" text-anchor="end" font-size="12" fill="#3b4c55">${fmt(r)}</text><text x="${xx}" y="${H-B+14}" text-anchor="middle" font-size="12" fill="#3b4c55">${fmt(r)}</text>`}
 s+=`<line x1="${Lm}" y1="${H-B}" x2="${W-R}" y2="${T}" stroke="#806858" stroke-dasharray="5 4"/><text x="${(Lm+W-R)/2}" y="${H-6}" text-anchor="middle" font-size="14">${L('Observed','Observado')}</text><text transform="translate(12 ${(T+H-B)/2}) rotate(-90)" text-anchor="middle" font-size="14">${L('Predicted','Predicho')}</text>`;
 pts.forEach(p=>{const st=A.order[p.j];s+=`<circle cx="${X(p.a)}" cy="${Y(p.q)}" r="4.5" fill="${U.st(st).color}" fill-opacity=".85" stroke="#fff" stroke-width=".8" data-tip="<b>${st}</b> (${U.zlab(st)}) · ${p.y}\n${L('Observed','Observado')}: ${fmt(p.a)}\n${L('Predicted','Predicho')}: ${fmt(p.q)}"/>`});
 $('#ochart').innerHTML=s+'</svg>';
 const mean=pts.reduce((a,p)=>a+p.a,0)/pts.length,sst=pts.reduce((a,p)=>a+(p.a-mean)**2,0),ssr=pts.reduce((a,p)=>a+(p.a-p.q)**2,0),r2=1-ssr/sst;
 const sc=(A.btscore[sp.value][sh.value]||{})[m];
 const rows=METH.map(k=>{const q=(A.btscore[sp.value][sh.value]||{})[k];return q?`<tr${k===m?' style="background:#dbe6e8;font-weight:bold"':''}><td>${(q[3]==='baseline'?'◦ ':'')+U.t(k)}</td><td>${fmt(q[0])}</td><td>${fmt(q[4])}</td><td>${q[2]==null?'–':q[2]}</td><td>${Math.round(q[1]*100)}%</td></tr>`:''}).join('');
 $('#oscore').innerHTML=`<table class="t"><tr><th>${U.t('model')}</th><th>MAE</th><th>RMSE</th><th>${L('Skill','Habilidad')}</th><th>${L('90% range covered','Rango 90% cubierto')}</th></tr>${rows}</table><p class="small">R² (${L('this chart','este gráfico')}): ${r2.toFixed(2)} · ${pts.length} ${L('points','puntos')} · ${bt.y[0]}–${bt.y[bt.y.length-1]}. ${L('Models marked with ◦ are the simple baselines.','Los marcados con ◦ son las referencias simples.')}</p>`;
 $('#onote').textContent=L('MAE and RMSE are in the parameter unit. Held-out years only; no information from those years was used to fit the models.','MAE y RMSE están en la unidad del parámetro. Solo años no usados para ajustar los modelos.')}
function overview(){
 const P=A.params,zd=P.filter(p=>p.zone.result==='zones differ'),loo=zd.filter(p=>p.robust.loo==='holds when any one station is left out').length,agg=zd.filter(p=>p.robust.agg_same).length,sim=P.filter(p=>p.robust.simpson==='same direction').length;
 const pa=A.perm['all_stations|A'],pm=A.perm['main_river_only|A'],f=A.fsum;
 const T=(n,t)=>`<div class="tile"><b>${n}</b><span>${t}</span></div>`;
 $('#ov').innerHTML=`<div class="tiles">${T(loo+' / '+zd.length,L('zone differences hold if any one station is left out','diferencias por zona se mantienen al quitar una estación'))}${T(agg+' / '+zd.length,L('keep the same result with yearly and seasonal averages','mantienen el resultado con promedios anuales y estacionales'))}${T(sim+' / '+P.length,L('trend direction unchanged when stations are separated','dirección de la tendencia sin cambio al separar estaciones'))}${T(f.shown+' / '+f.total,L('forecasts kept','pronósticos conservados'))}</div>
 <p>${L(`Of the ${zd.length} parameters whose zones differ, ${loo} survive removing any single station and ${agg} give the same result with yearly and seasonal averages. Across all stations, the overall pattern of parameters differs between zones (permutation test p = ${pa[1]}); using the main river only, it does not clearly differ (p = ${pm[1]}).`,`De los ${zd.length} parámetros cuyas zonas difieren, ${loo} resisten quitar cualquier estación y ${agg} dan el mismo resultado con promedios anuales y estacionales. Con todas las estaciones, el patrón conjunto de parámetros difiere entre zonas (prueba de permutaciones p = ${pa[1]}); solo con el río principal no difiere claramente (p = ${pm[1]}).`)}</p>
 <ul><li>${L(`Forecasts: ${f.shown} of ${f.total} combinations were kept; in ${f.baseline} a simple baseline did as well or better.`,`Pronósticos: se conservaron ${f.shown} de ${f.total} combinaciones; en ${f.baseline} una referencia simple fue igual o mejor.`)}</li><li>${L('Parameters with changed reporting precision or nearly constant values are flagged and treated with caution.','Los parámetros con cambio de precisión o valores casi constantes están marcados y se tratan con cautela.')}</li><li>${L('Extrapolations continue past patterns only; they say nothing about causes or future actions.','Las extrapolaciones solo continúan patrones pasados; no dicen nada sobre causas ni acciones futuras.')}</li></ul><p class="small">${U.t('ov_note')}</p>`}
U.init('ahead',()=>{fchart();can();obs();overview()});
})();
