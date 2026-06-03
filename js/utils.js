// js/utils.js — shared helpers
// ═══════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════
var GROUPS_LIST=['A','B','C','D','E','F','G','H','I','J','K','L'];

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function empty(ic,msg){return '<div class="empty"><span class="eico">'+ic+'</span><p>'+esc(msg)+'</p></div>';}

var tzOK=(function(){try{new Date().toLocaleString('en-US',{timeZone:'America/New_York'});return true;}catch(e){return false;}})();
function fmtTime(utc,tz,lbl){
  try{if(tzOK)return new Date(utc).toLocaleTimeString('en-US',{timeZone:tz,hour:'numeric',minute:'2-digit',hour12:true})+' '+lbl;}catch(e){}
  var d=new Date(utc),h=d.getUTCHours(),m=d.getUTCMinutes(),ap=h>=12?'PM':'AM';
  h=h%12||12;return h+':'+(m<10?'0':'')+m+' '+ap+' UTC';
}
function fmtDate(utc){
  try{if(tzOK)return new Date(utc).toLocaleDateString('en-US',{timeZone:'America/New_York',weekday:'short',month:'short',day:'numeric'});}catch(e){}
  var d=new Date(utc),days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return days[d.getUTCDay()]+', '+months[d.getUTCMonth()]+' '+d.getUTCDate();
}
function fmtET(utc){return fmtTime(utc,'America/New_York',t('et'));}
function fmtCOT(utc){return fmtTime(utc,'America/Bogota',t('cot'));}

function getStatus(m){
  if(m.status==='final')return'final';if(m.status==='live')return'live';
  var diff=Date.now()-new Date(m.kickoffUTC).getTime();
  if(diff>=0&&diff<7200000)return'live';if(diff>=7200000)return'final';return'upcoming';
}
function countdown(utc){
  var d=new Date(utc)-Date.now();if(d<=0)return null;
  var dd=Math.floor(d/864e5),hh=Math.floor((d%864e5)/36e5),mm=Math.floor((d%36e5)/6e4);
  return dd>0?dd+'d '+hh+'h':hh>0?hh+'h '+mm+'m':mm+'m';
}
function defaultMatch(){
  var live=MATCHES.filter(function(m){return getStatus(m)==='live';});
  if(live.length)return live[0];
  var fin=MATCHES.filter(function(m){return getStatus(m)==='final';}).sort(function(a,b){return new Date(b.kickoffUTC)-new Date(a.kickoffUTC);});
  if(fin.length)return fin[0];
  var up=MATCHES.filter(function(m){return getStatus(m)==='upcoming';}).sort(function(a,b){return new Date(a.kickoffUTC)-new Date(b.kickoffUTC);});
  return up.length?up[0]:null;
}
function sortByDate(arr,asc){return arr.slice().sort(function(a,b){var d=new Date(a.kickoffUTC)-new Date(b.kickoffUTC);return asc?d:-d;});}
function sortTeams(ts,key){return ts.slice().sort(function(a,b){if(key==='ranking')return a.ranking-b.ranking;if(key==='conf')return a.conf.localeCompare(b.conf)||a.name.localeCompare(b.name);return a.name.localeCompare(b.name);});}
function calcStandings(g){
  var rows={};
  TEAMS.filter(function(x){return x.group===g;}).forEach(function(x){rows[x.id]={id:x.id,mp:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0};});
  MATCHES.filter(function(m){return m.group===g&&m.status==='final'&&m.scores;}).forEach(function(m){
    var h=rows[m.home],a=rows[m.away];if(!h||!a)return;
    h.mp++;a.mp++;h.gf+=m.scores.h;h.ga+=m.scores.a;h.gd=h.gf-h.ga;a.gf+=m.scores.a;a.ga+=m.scores.h;a.gd=a.gf-a.ga;
    if(m.scores.h>m.scores.a){h.w++;h.pts+=3;a.l++;}else if(m.scores.h<m.scores.a){a.w++;a.pts+=3;h.l++;}else{h.d++;h.pts++;a.d++;a.pts++;}
  });
  return Object.values(rows).sort(function(a,b){return b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.id.localeCompare(b.id);});
}
function filterMatches(q,gr,st){
  return MATCHES.filter(function(m){
    if(gr&&m.group!==gr)return false;
    if(st&&m.stage!==st)return false;
    if(q){var ql=q.toLowerCase(),hn=(TM[m.home]?TM[m.home].name:m.home).toLowerCase(),an=(TM[m.away]?TM[m.away].name:m.away).toLowerCase();
      if(!hn.includes(ql)&&!an.includes(ql)&&!m.venue.toLowerCase().includes(ql)&&!('group '+m.group).toLowerCase().includes(ql))return false;}
    return true;
  });
}