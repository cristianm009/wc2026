// js/theme.js — team color theming
// ═══════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════
function lum(hex){hex=hex.replace('#','');if(hex.length===3)hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];var r=parseInt(hex.slice(0,2),16)/255,g=parseInt(hex.slice(2,4),16)/255,b=parseInt(hex.slice(4,6),16)/255;return 0.299*r+0.587*g+0.114*b;}
function blend(a,b,r){a=a.replace('#','');b=b.replace('#','');var ar=parseInt(a.slice(0,2),16),ag=parseInt(a.slice(2,4),16),ab_=parseInt(a.slice(4,6),16),br=parseInt(b.slice(0,2),16),bg=parseInt(b.slice(2,4),16),bb=parseInt(b.slice(4,6),16);return'#'+[Math.round(ar+(br-ar)*r),Math.round(ag+(bg-ag)*r),Math.round(ab_+(bb-ab_)*r)].map(function(v){return('0'+v.toString(16)).slice(-2);}).join('');}

function applyTheme(teamId, rerender){
  var root=document.documentElement;
  var badge=document.getElementById('mbadge');
  var btn=document.getElementById('btn-myteam');
  if(!teamId){
    // Default FIFA World Cup 2026 palette: blue, red, green, white
    root.style.setProperty('--p','#003F87');
    root.style.setProperty('--s','#CC0000');
    root.style.setProperty('--ac','#00A850');
    root.style.setProperty('--ton','#FFFFFF');
    root.style.setProperty('--hl-bg','#FFF8E1');
    root.style.setProperty('--hl-brd','#F5A623');
    if(document.body&&document.body.classList)document.body.classList.remove('has-team');
    if(badge)badge.style.display='none';
    if(btn){var lbl=btn.querySelector('.mt-label');if(lbl)lbl.textContent='My Team';}
    if(rerender)rerenderActivePage();
    return;
  }
  var team=TM[teamId];if(!team){applyTheme(null,rerender);return;}
  var pri=team.primary||'#003F87';
  var sec=team.secondary||'#FFFFFF';
  // Ensure nav primary is always dark enough for readable white text
  var nav=lum(pri)>0.35?blend(pri,'#0A0A2E',0.72):pri;
  // Accent: prefer secondary if bright, else FIFA green
  var ac=lum(sec)>0.22?sec:'#00A850';
  // Ensure text on nav is readable
  var ton=lum(nav)>0.45?'#0D0D1A':'#FFFFFF';
  // Highlight uses team primary tint
  var hlBg=blend(pri,'#FFFFFF',0.88);
  var hlBrd=lum(pri)>0.7?blend(pri,'#888888',0.4):pri;
  root.style.setProperty('--p',nav);
  root.style.setProperty('--s',sec);
  root.style.setProperty('--ac',ac);
  root.style.setProperty('--ton',ton);
  root.style.setProperty('--hl-bg',hlBg);
  root.style.setProperty('--hl-brd',hlBrd);
  if(document.body&&document.body.classList)document.body.classList.add('has-team');
  if(badge){
    badge.style.display='flex';
    document.getElementById('mbflag').textContent=team.flag;
    document.getElementById('mbname').textContent=team.name;
  }
  // Update button tooltip to show team name
  if(btn){var lbl=btn.querySelector('.mt-label');if(lbl)lbl.textContent=team.name;}
  if(rerender)rerenderActivePage();
}

function rerenderActivePage(){
  var active=PAGES.filter(function(p){var pg=document.getElementById('page-'+p);return pg&&pg.style.display==='block';})[0]||'home';
  if(active==='home')renderHome();
  if(active==='schedule')renderSchedule();
  if(active==='teams')renderTeams();
  if(active==='groups')renderGroups();
  if(active==='bracket')renderBracket();
}

function getMainTeam(){try{return localStorage.getItem('wc2026_team');}catch(e){return null;}}
function setMainTeam(id){try{localStorage.setItem('wc2026_team',id);}catch(e){}applyTheme(id,true);}
function resetMainTeam(){try{localStorage.removeItem('wc2026_team');}catch(e){}applyTheme(null,true);}