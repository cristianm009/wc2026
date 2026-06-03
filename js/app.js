// js/app.js — navigation, page renders, event wiring
var PAGES=['home','schedule','teams','groups','bracket'];
var GROUPS_LIST=['A','B','C','D','E','F','G','H','I','J','K','L'];
var schedSort=1;
var TM={};  // built in DOMContentLoaded after data scripts load


function showPage(name){
  if(PAGES.indexOf(name)===-1)name='home';
  PAGES.forEach(function(p){
    var pg=document.getElementById('page-'+p);
    if(pg)pg.style.display=p===name?'block':'none';
    var tab=document.getElementById('tab-'+p);
    if(tab)tab.className='ntab'+(p===name?' on':'');
  });
  try{if(history.replaceState)history.replaceState(null,'','#'+name);}catch(e){}
  if(name==='home')renderHome();
  if(name==='schedule')renderSchedule();
  if(name==='teams')renderTeams();
  if(name==='groups')renderGroups();
  if(name==='bracket')renderBracket();
  window.scrollTo(0,0);
}

// ═══════════════════════════════════════════════════
// PAGE RENDERS
// ═══════════════════════════════════════════════════
function renderHome(){
  var def=defaultMatch();
  var de=document.getElementById('default-match');
  if(de)de.innerHTML=def?renderCard(def):'';
  var fl=document.getElementById('feat-lbl');if(fl)fl.textContent=t('feat');
  var now=Date.now();
  var up=sortByDate(MATCHES.filter(function(m){return new Date(m.kickoffUTC)>now;}),true).slice(0,6);
  var he=document.getElementById('home-matches');
  if(he)he.innerHTML=up.length?up.map(renderCard).join(''):empty('📅',t('done'));
}
function renderSchedule(){
  var q=(document.getElementById('s-search')||{value:''}).value.trim();
  var gr=(document.getElementById('s-group')||{value:''}).value;
  var st=(document.getElementById('s-stage')||{value:''}).value;
  var ms=sortByDate(filterMatches(q,gr,st),schedSort===1);
  var sb=document.getElementById('s-sort');if(sb)sb.textContent=(schedSort===1?'↑ ':'↓ ')+t('sort_date');
  var el=document.getElementById('schedule-list');
  if(el)el.innerHTML=ms.length?ms.map(renderCard).join(''):empty('🔍',t('no_match'));
}
function renderTeams(){
  var q=(document.getElementById('t-search')||{value:''}).value.trim().toLowerCase();
  var cf=(document.getElementById('t-conf')||{value:''}).value;
  var so=(document.getElementById('t-sort')||{value:'name'}).value;
  var ts=TEAMS.filter(function(x){if(cf&&x.conf!==cf)return false;if(q&&x.name.toLowerCase().indexOf(q)===-1)return false;return true;});
  ts=sortTeams(ts,so);
  var el=document.getElementById('teams-grid');if(!el)return;
  var main=getMainTeam();
  var html='';
  ts.forEach(function(x){
    var isMn=main===x.id;
    html+='<div class="tcard'+(isMn?' main':'')+'" data-team="'+x.id+'" tabindex="0">'+
      '<div class="tcfl">'+x.flag+'</div>'+
      '<div class="tcnm">'+esc(x.name)+'</div>'+
      '<div class="tcmt">Group '+x.group+' · #'+x.ranking+'</div>'+
      '<span class="cbdg c'+x.conf+'">'+x.conf+'</span>'+
      (isMn?'<span class="mstar">⭐</span>':'')+
      '<button class="pbtn" data-pick="'+x.id+'" title="Pick as main team">🎯</button>'+
    '</div>';
  });
  el.innerHTML=html||empty('👥',t('no_teams'));
}
function renderGroups(){
  var q=(document.getElementById('gr-search')||{value:''}).value.trim().toLowerCase();
  var gl=GROUPS_LIST.filter(function(g){
    if(!q)return true;
    if(('group '+g).indexOf(q)!==-1)return true;
    return TEAMS.some(function(x){return x.group===g&&x.name.toLowerCase().indexOf(q)!==-1;});
  });
  var el=document.getElementById('groups-grid');if(!el)return;
  if(!gl.length){el.innerHTML=empty('🔍',t('no_grps'));return;}
  var html='';
  gl.forEach(function(g){
    var rows=calcStandings(g);
    var thead='<tr><th class="cpos">#</th><th>'+t('col_team')+'</th><th class="num">'+t('col_mp')+'</th><th class="num">'+t('col_w')+'</th><th class="num">'+t('col_d')+'</th><th class="num">'+t('col_l')+'</th><th class="num">'+t('col_gf')+'</th><th class="num">'+t('col_ga')+'</th><th class="num">'+t('col_gd')+'</th><th class="num pts">'+t('col_pts')+'</th></tr>';
    var tbody='';
    var main=getMainTeam();
    rows.forEach(function(r,i){
      var tm=TM[r.id]||{flag:'🏳️',name:r.id};
      var isMain=main&&r.id===main;
      tbody+='<tr class="'+(i<2?'radv':'')+(isMain?' tr-hl':'')+'"><td class="cpos">'+(i+1)+'</td>'+
        '<td><button class="tlink" data-team="'+r.id+'">'+tm.flag+' '+esc(tm.name)+(isMain?' ⭐':'')+(i<2?' <span class="atick">✓</span>':'')+'</button></td>'+
        '<td class="num">'+r.mp+'</td><td class="num">'+r.w+'</td><td class="num">'+r.d+'</td><td class="num">'+r.l+'</td>'+
        '<td class="num">'+r.gf+'</td><td class="num">'+r.ga+'</td>'+
        '<td class="num">'+(r.gd>=0?'+'+r.gd:r.gd)+'</td>'+
        '<td class="num pts"><strong>'+r.pts+'</strong></td></tr>';
    });
    html+='<div class="gcrd"><div class="ghdr"><h3>GROUP '+g+'</h3></div><div class="gtwrap"><table class="gtbl"><thead>'+thead+'</thead><tbody>'+tbody+'</tbody></table></div></div>';
  });
  el.innerHTML=html;
}
function renderBracket(){
  var rounds=[{l:'Round of 32',k:'Round of 32'},{l:'Round of 16',k:'Round of 16'},{l:'Quarterfinals',k:'Quarterfinal'},{l:'Semifinals',k:'Semifinal'},{l:'3rd Place',k:'3rd Place'},{l:'Final',k:'Final'}];
  var el=document.getElementById('bracket-inner');if(!el)return;
  var html='';
  rounds.forEach(function(r){
    var ms=MATCHES.filter(function(m){return m.stage===r.k;});
    var slots='';
    ms.forEach(function(m){
      var ht=TM[m.home],at=TM[m.away];
      var st=getStatus(m),sH='',sA='';
      if((st==='final'||st==='live')&&m.scores){sH='<span class="bsc">'+m.scores.h+'</span>';sA='<span class="bsc">'+m.scores.a+'</span>';}
      slots+='<div class="bm">'+
        '<div class="bt'+(ht?'':' btbd')+'"><span class="bfl">'+(ht?ht.flag:'🏳️')+'</span><span class="bnm">'+esc(ht?ht.name:m.home)+'</span>'+sH+'</div>'+
        '<div class="bt'+(at?'':' btbd')+'"><span class="bfl">'+(at?at.flag:'🏳️')+'</span><span class="bnm">'+esc(at?at.name:m.away)+'</span>'+sA+'</div>'+
      '</div>';
    });
    html+='<div class="brd"><div class="brhdr">'+r.l+'</div><div class="bslots">'+slots+'</div></div>';
  });
  el.innerHTML=html;
}

// ═══════════════════════════════════════════════════
// TEAM PICKER MODAL
// ═══════════════════════════════════════════════════
function openPicker(){
  var grid=document.getElementById('picker-grid');
  var current=getMainTeam();
  var html='';
  TEAMS.forEach(function(x){
    var sel=current===x.id;
    html+='<button data-pick="'+x.id+'" style="background:'+(sel?'#FFFBF0':'#F5F7FA')+';border:2px solid '+(sel?'#F5A623':'#DDE3EC')+';border-radius:10px;padding:10px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;width:100%;font-family:inherit">'+
      '<span style="font-size:26px;line-height:1">'+x.flag+'</span>'+
      '<span style="font-size:11px;font-weight:600;color:#0B1A2B;text-align:center;line-height:1.3">'+x.name+'</span>'+
      (sel?'<span style="font-size:10px;color:#1A7A3C;font-weight:700">✓</span>':'')+
    '</button>';
  });
  grid.innerHTML=html;
  document.getElementById('modal').style.display='flex';
}
function closePicker(){document.getElementById('modal').style.display='none';}

// ═══════════════════════════════════════════════════
// INIT — all event wiring in one place after DOM ready
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',function(){
  // Build team lookup map after data scripts have loaded
  TM={};
  TEAMS.forEach(function(x){TM[x.id]=x;});

  // Apply saved theme
  applyTheme(getMainTeam());

  // Update lang button
  document.getElementById('btn-lang').textContent=t('lang');

  // Populate group filter
  var gsel=document.getElementById('s-group');
  var opt0=document.createElement('option');opt0.value='';opt0.textContent=t('all_grps');gsel.appendChild(opt0);
  GROUPS_LIST.forEach(function(g){var o=document.createElement('option');o.value=g;o.textContent='Group '+g;gsel.appendChild(o);});

  // Tab navigation
  PAGES.forEach(function(p){
    var tab=document.getElementById('tab-'+p);
    if(tab)tab.addEventListener('click',function(){showPage(p);});
  });
  document.getElementById('btn-home').addEventListener('click',function(){showPage('home');});
  document.getElementById('btn-go-schedule').addEventListener('click',function(){showPage('schedule');});
  document.getElementById('btn-go-bracket').addEventListener('click',function(){showPage('bracket');});

  // Schedule filters
  document.getElementById('s-search').addEventListener('input',renderSchedule);
  document.getElementById('s-group').addEventListener('change',renderSchedule);
  document.getElementById('s-stage').addEventListener('change',renderSchedule);
  document.getElementById('s-sort').addEventListener('click',function(){schedSort*=-1;renderSchedule();});

  // Team filters
  document.getElementById('t-search').addEventListener('input',renderTeams);
  document.getElementById('t-conf').addEventListener('change',renderTeams);
  document.getElementById('t-sort').addEventListener('change',renderTeams);

  // Groups search
  document.getElementById('gr-search').addEventListener('input',renderGroups);

  // Global search
  document.getElementById('gsearch').addEventListener('input',function(){
    var q=this.value.trim();if(q.length<2)return;
    var ex=null;TEAMS.forEach(function(x){if(x.name.toLowerCase()===q.toLowerCase())ex=x;});
    if(ex){var si=document.getElementById('s-search');if(si)si.value=ex.name;showPage('schedule');}
    else{var si2=document.getElementById('s-search');if(si2)si2.value=q;showPage('schedule');}
  });

  // Lang switch
  document.getElementById('btn-lang').addEventListener('click',function(){
    setLang(lang==='en'?'es':'en');
    this.textContent=t('lang');
    showPage(PAGES.find(function(p){var pg=document.getElementById('page-'+p);return pg&&pg.style.display==='block';})||'home');
  });

  // My Team button
  document.getElementById('btn-myteam').addEventListener('click',openPicker);

  // Modal buttons
  document.getElementById('modal-close').addEventListener('click',closePicker);
  document.getElementById('modal-skip').addEventListener('click',closePicker);
  document.getElementById('modal-reset').addEventListener('click',function(){resetMainTeam();closePicker();});
  document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)closePicker();});

  // Picker grid — event delegation for team selection
  document.getElementById('picker-grid').addEventListener('click',function(e){
    var btn=e.target.closest('[data-pick]');
    if(btn){setMainTeam(btn.getAttribute('data-pick'));closePicker();}
  });

  // Teams grid — event delegation
  document.getElementById('teams-grid').addEventListener('click',function(e){
    var pb=e.target.closest('.pbtn');
    if(pb){e.stopPropagation();var id=pb.getAttribute('data-pick');if(getMainTeam()===id)resetMainTeam();else setMainTeam(id);return;}
    var card=e.target.closest('[data-team]');
    if(card){var si=document.getElementById('s-search');if(si)si.value=TM[card.getAttribute('data-team')]?TM[card.getAttribute('data-team')].name:'';showPage('schedule');}
  });
  document.getElementById('teams-grid').addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){var card=e.target.closest('[data-team]');if(card){var si=document.getElementById('s-search');if(si)si.value=TM[card.getAttribute('data-team')]?TM[card.getAttribute('data-team')].name:'';showPage('schedule');}}
  });

  // Groups grid — event delegation
  document.getElementById('groups-grid').addEventListener('click',function(e){
    var btn=e.target.closest('[data-team]');
    if(btn){var si=document.getElementById('s-search');if(si)si.value=TM[btn.getAttribute('data-team')]?TM[btn.getAttribute('data-team')].name:'';showPage('schedule');}
  });

  // Accordion — event delegation on main
  document.querySelector('main').addEventListener('click',function(e){
    var hdr=e.target.closest('.sechdr');
    if(!hdr)return;
    var body=hdr.nextElementSibling;
    var arrow=hdr.querySelector('.secarr');
    var open=body.classList.toggle('open');
    if(arrow)arrow.style.transform=open?'rotate(180deg)':'';
    hdr.setAttribute('aria-expanded',open);
  });

  // Start on correct page
  var hash='';try{hash=window.location.hash.replace('#','');}catch(e){}
  showPage(PAGES.indexOf(hash)!==-1?hash:'home');
});