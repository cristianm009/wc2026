// js/matchCard.js — match card renderer
// ═══════════════════════════════════════════════════
// MATCH CARD
// ═══════════════════════════════════════════════════
function getBroadcasters(home,away){
  var rows=[],seen={};
  [home,away].forEach(function(id){if(BC[id])BC[id].forEach(function(b){if(!seen[b.name]){seen[b.name]=true;rows.push(b);}});});
  return rows.length?rows:BC.DEFAULT;
}
function renderCard(m){
  try{
    var ht=TM[m.home],at=TM[m.away];
    var hname=ht?ht.name:m.home,aname=at?at.name:m.away;
    var hflag=ht?ht.flag:'🏳️',aflag=at?at.flag:'🏳️';
    var hconf=ht?ht.conf:'',aconf=at?at.conf:'';
    var st=getStatus(m);
    var cd=st==='upcoming'?countdown(m.kickoffUTC):null;
    var badge=m.group?'<span class="bg">Group '+m.group+'</span>':'<span class="bg bstg">'+esc(m.stage)+'</span>';
    var stBadge={upcoming:'<span class="sbu su">'+t('s_up')+'</span>',live:'<span class="sbu sl">⚡ '+t('s_lv')+'</span>',final:'<span class="sbu sf">'+t('s_fi')+'</span>'}[st]||'';
    // Main team highlight
    var main=getMainTeam();
    var isTeamMatch=main&&(m.home===main||m.away===main);
    var hlBadge=isTeamMatch?'<span class="team-hl-badge">⭐ '+(TM[main]?TM[main].name:main)+'</span>':'';
    var cardClass='mc'+(isTeamMatch?' team-hl':'');
    var center='<span class="vs">VS</span>';
    if(st==='final'&&m.scores)center='<div class="sco">'+m.scores.h+' – '+m.scores.a+'</div>';
    else if(st==='live'&&m.scores)center='<div class="sco scol">'+m.scores.h+' – '+m.scores.a+' 🔴</div>';
    else if(cd)center='<div class="cdd">'+cd+'</div>';
    // Channels
    var brs=getBroadcasters(m.home,m.away);
    var chRows=brs.map(function(b){return'<tr><td><span style="font-size:14px;margin-right:4px">'+b.flag+'</span><strong>'+esc(b.name)+'</strong></td><td><span class="'+(b.ch==='N/A'?'na':'chnum')+'">'+esc(b.ch)+'</span></td><td><span class="'+(b.lang==='es'?'lbes':'lben')+'">'+b.lang.toUpperCase()+'</span></td><td>'+(b.stream?'<span class="strn">'+esc(b.stream)+'</span>':'-')+'</td><td><a class="wl" href="'+b.url+'" target="_blank" rel="noopener">'+t('watch_lk')+'</a></td></tr>';}).join('');
    var chHtml='<table class="cht"><thead><tr><th>'+t('ch_ch')+'</th><th>'+t('ch_no')+'</th><th>'+t('ch_lg')+'</th><th>'+t('ch_st')+'</th><th>'+t('ch_lk')+'</th></tr></thead><tbody>'+chRows+'</tbody></table>';
    // Pronostic
    var p=PRONOS[m.id]||{w:'TBD',c:'Low',n:'No pronostic available yet.'};
    var wt=TM[p.w];
    var wdisp=p.w==='TBD'?t('tbd'):p.w==='Draw'?t('draw'):(wt?wt.flag+' '+wt.name:p.w);
    var cmap={Low:'clo',Medium:'cme',High:'chi'};
    var pronoHtml='<div class="prono"><div class="prow"><span class="plbl">'+t('pred_win')+'</span><span class="pval">'+esc(wdisp)+'</span><span class="cpl '+(cmap[p.c]||'clo')+'">'+esc(p.c)+' '+t('conf')+'</span></div><p class="pnote">'+esc(p.n)+'</p><p class="pdisc">'+t('disc')+'</p></div>';
    // I3: Hashtags with real links
    var htag=HTAGS[m.id]||{twitter:['#'+m.home+m.away,'#WorldCup2026','#FIFAWorldCup'],tiktok:['#'+m.home+m.away,'#WorldCup2026'],instagram:['#'+m.home+m.away,'#WorldCup2026','#FIFAWorldCup']};
    var plats=[
      {ico:'𝕏',  name:'X/Twitter', key:'twitter',  base:'https://x.com/search?q='},
      {ico:'♪',  name:'TikTok',    key:'tiktok',   base:'https://www.tiktok.com/search?q='},
      {ico:'◻', name:'Instagram', key:'instagram', base:'https://www.instagram.com/explore/tags/'},
    ];
    var tagsHtml='<div class="htags">'+plats.map(function(pl){
      return'<div class="hrow"><span class="hico">'+pl.ico+'</span><span class="hplt">'+pl.name+'</span><div class="hlist">'+
        (htag[pl.key]||[]).map(function(tg){
          // Build platform-specific search URL
          var tag=tg.replace(/^#/,'');
          var url;
          if(pl.key==='instagram'){url=pl.base+encodeURIComponent(tag);}
          else{url=pl.base+encodeURIComponent(tg);}
          return'<a class="htag" href="'+url+'" target="_blank" rel="noopener">'+esc(tg)+'</a>';
        }).join('')+
      '</div></div>';
    }).join('')+'</div>';
    var secs=[{lbl:t('watch'),body:chHtml},{lbl:t('prono'),body:pronoHtml},{lbl:t('tags'),body:tagsHtml}];
    var secsHtml=secs.map(function(s){return'<div class="mcsec"><button class="sechdr" data-sec="1"><span class="sectit">'+s.lbl+'</span><span class="secarr">▼</span></button><div class="secbody">'+s.body+'</div></div>';}).join('');
    return'<article class="'+cardClass+'"><div class="mchdr">'+
      '<div class="mmeta">'+badge+stBadge+hlBadge+'<span class="mdate">'+fmtDate(m.kickoffUTC)+'</span><span class="mven">📍 '+esc(m.venue)+'</span></div>'+
      '<div class="mtimes"><span class="tzp"><span class="tzl">'+t('et')+'</span> '+fmtET(m.kickoffUTC)+'</span><span class="tzp"><span class="tzl">'+t('cot')+'</span> '+fmtCOT(m.kickoffUTC)+'</span></div>'+
      '</div>'+
      '<div class="mcbody">'+
        '<div class="tc"><span class="tf">'+hflag+'</span><div class="ti"><div class="tn">'+esc(hname)+'</div><div class="tco">'+hconf+'</div></div></div>'+
        '<div class="mcc">'+center+'</div>'+
        '<div class="tc tcr"><span class="tf">'+aflag+'</span><div class="ti"><div class="tn">'+esc(aname)+'</div><div class="tco">'+aconf+'</div></div></div>'+
      '</div>'+
      '<div class="mcsecs">'+secsHtml+'</div>'+
    '</article>';
  }catch(e){return'<div class="mc" style="padding:16px;color:#8896AA;font-size:13px">⚠ '+esc(m.id)+'</div>';}
}