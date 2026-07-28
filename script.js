const learner = {
  skills: [
    {name:'Expression écrite', type:'writing', icon:'✎', score:68, level:'B1+', progress:42, strength:'Vocabulaire précis', weakness:'Organisation des idées'},
    {name:'Expression orale', type:'speaking', icon:'◒', score:54, level:'B1', progress:35, strength:'Prononciation', weakness:'Fluidité & argumentation'},
    {name:'Compréhension écrite', type:'reading', icon:'▤', score:76, level:'B2', progress:64, strength:'Repérage des idées', weakness:'Vocabulaire abstrait'},
    {name:'Compréhension orale', type:'listening', icon:'◖', score:61, level:'B1+', progress:51, strength:'Compréhension globale', weakness:'Détails rapides'}
  ],
  profile:[['Grammaire',72],['Vocabulaire',65],['Fluidité',48],['Prononciation',68],['Argumentation',45],['Compréhension',70]],
  plan:[['Apprendre','Les connecteurs logiques','10 min',true],['S’entraîner','Développer un argument','15 min',false],['Répondre','Sujet d’expression orale','5 min',false],['Recevoir une correction','Analyse IA personnalisée','2 min',false]],
  performance:[['Expression écrite','68%','+8%','up','✎','#edf1ff'],['Expression orale','54%','+4%','up','◒','#fff0e9'],['Compréhension écrite','76%','Stable','up','▤','#e5f7f0'],['Compréhension orale','61%','−3%','down','◖','#fff5d9']]
};
function recommendation(){
  const low = learner.profile.reduce((a,b)=>a[1]<b[1]?a:b);
  const rules={Argumentation:['Expression orale','Développer un argument avec un exemple concret','15 min · Niveau B1+','Votre dernière réponse était intéressante, mais vos idées manquaient d’organisation. Cette activité vous aidera à structurer vos réponses pour gagner des points au TCF.'],Fluidité:['Expression orale','Gagner en fluidité avec des réponses guidées','12 min · Niveau B1','Vous hésitez encore entre vos idées. Une pratique courte et structurée vous aidera à parler plus naturellement.'],Vocabulaire:['Vocabulaire','Réviser le vocabulaire des thèmes du TCF','10 min · Niveau B1+','Vos résultats montrent que le vocabulaire abstrait reste un frein dans les questions complexes.'],Grammaire:['Grammaire','Corriger les erreurs récurrentes','12 min · Niveau B1+','Certaines erreurs grammaticales reviennent dans vos productions. Une révision ciblée aura un impact immédiat.']};
  return rules[low[0]] || rules.Argumentation;
}
function render(){
 const rec=recommendation();
 document.querySelector('#priorityTitle').textContent=rec[0];document.querySelector('#activityName').textContent=rec[1];document.querySelector('#activityTime').textContent=rec[2];document.querySelector('#whyText').textContent=rec[3];
 document.querySelector('#skillGrid').innerHTML=learner.skills.map(s=>`<article class="skill ${s.type}" style="--skill:${s.type==='writing'?'#7b90d5':s.type==='speaking'?'#e18c6c':s.type==='reading'?'#59a98c':'#d0a13e'};--w:${s.progress}%"><div class="skill-top"><span class="skill-icon">${s.icon}</span><span class="level">Niveau ${s.level}</span></div><p class="exam-label">ÉPREUVE TCF CANADA</p><h3>${s.name}</h3><div class="score">${s.progress}% <small>préparation</small></div><div class="bar"><i></i></div><div class="skill-info"><b>Point fort :</b> ${s.strength}<br><b>À travailler :</b> ${s.weakness}</div><button data-exam="${s.type}">Préparer l'épreuve →</button></article>`).join('');
 document.querySelector('#profileBars').innerHTML=learner.profile.map(([n,v])=>`<div class="profile-row"><span>${n}</span><div class="track"><i style="width:${v}%"></i></div><b>${v}%</b></div>`).join('');
 document.querySelector('#planList').innerHTML=learner.plan.map((p,i)=>`<div class="plan-item"><button class="checkbox ${p[3]?'done':''}" data-plan="${i}">${p[3]?'✓':''}</button><div><strong>${i+1}. ${p[0]} — ${p[1]}</strong><small>${p[2]}</small></div><span>${p[3]?'Terminé':'À faire'}</span></div>`).join('');
 const completed=learner.plan.filter(x=>x[3]).length, percent=completed*25;document.querySelector('#planCount').textContent=`${completed} / 4 terminée${completed>1?'s':''}`;document.querySelector('#progressNumber').textContent=percent;document.querySelector('#planProgress').style.width=percent+'%';
 document.querySelector('#performanceList').innerHTML=learner.performance.map(p=>`<div class="performance-row"><span class="performance-icon" style="background:${p[5]}">${p[4]}</span><div><strong>${p[0]}</strong><small>Dernière activité</small></div><b>${p[1]}</b><span class="trend ${p[3]}">${p[2]}</span></div>`).join('');
 document.querySelectorAll('[data-plan]').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.plan;learner.plan[i][3]=!learner.plan[i][3];render()}));
 document.querySelectorAll('[data-exam]').forEach(b=>b.addEventListener('click',()=>location.href=`epreuves.html?skill=${b.dataset.exam}`));
}
render();
const objectiveButton=document.querySelector('#objectiveButton'),menu=document.querySelector('#objectiveMenu');objectiveButton.onclick=()=>menu.classList.toggle('show');menu.querySelectorAll('button').forEach(b=>b.onclick=()=>{document.querySelector('#objectiveText').textContent=b.textContent;menu.classList.remove('show')});
document.querySelector('#startButton').onclick=()=>{const t=document.querySelector('#toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800)};
const navToggle=document.querySelector('#navToggle'),navLinks=document.querySelector('#navLinks');
navToggle?.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');navToggle.setAttribute('aria-expanded',open);});
