// js/i18n.js — embedded strings, no XHR
// ═══════════════════════════════════════════════════
// I18n (embedded — no XHR)
// ═══════════════════════════════════════════════════
var STRINGS={
  en:{nav_home:"Home",nav_schedule:"Schedule",nav_teams:"Teams",nav_groups:"Groups",nav_bracket:"Bracket",
      feat:"Featured Match",upcoming:"Upcoming Matches",next_fix:"Next fixtures",
      full_sched:"Full Schedule",sched_sub:"104 matches · group stage and knockouts",
      all_grps:"All groups",all_stages:"All stages",sort_date:"Date",search_tv:"Search team or venue…",
      teams_title:"48 Teams",teams_sub:"Click any team to view their schedule",search_tm:"Search team…",all_confs:"All confederations",
      grp_title:"Group Stage",grp_sub:"12 groups · Top 2 + 8 best 3rd advance",search_gt:"Search group or team…",
      col_team:"Team",col_mp:"MP",col_w:"W",col_d:"D",col_l:"L",col_gf:"GF",col_ga:"GA",col_gd:"GD",col_pts:"Pts",
      brk_title:"Knockout Bracket",brk_sub:"Round of 32 → Final · MetLife Stadium, NJ · July 19",
      watch:"📺 Watch & Channels",prono:"🎯 Pronostic",tags:"# Hashtags",
      ch_ch:"Channel",ch_no:"Number",ch_lg:"Lang",ch_st:"Stream",ch_lk:"Link",watch_lk:"Watch ↗",
      pred_win:"Predicted winner",conf:"confidence",
      disc:"⚠ Pronostics are editorial opinions only — not official predictions or betting advice.",
      s_up:"Upcoming",s_lv:"Live",s_fi:"Final",et:"ET",cot:"COT",
      no_match:"No matches found. Try adjusting your filters.",no_teams:"No teams match your search.",no_grps:"No groups found.",done:"Tournament complete.",
      myteam:"My Team",pick:"Pick your team",reset:"Reset theme",pick_prompt:"Choose a team to personalize your dashboard",lang:"ES",
      draw:"Draw",tbd:"TBD"},
  es:{nav_home:"Inicio",nav_schedule:"Calendario",nav_teams:"Equipos",nav_groups:"Grupos",nav_bracket:"Llaves",
      feat:"Partido Destacado",upcoming:"Próximos Partidos",next_fix:"Próximas fechas",
      full_sched:"Calendario Completo",sched_sub:"104 partidos · fase de grupos y eliminatorias",
      all_grps:"Todos los grupos",all_stages:"Todas las fases",sort_date:"Fecha",search_tv:"Buscar equipo o sede…",
      teams_title:"48 Equipos",teams_sub:"Haz clic en un equipo para ver su calendario",search_tm:"Buscar equipo…",all_confs:"Todas las confederaciones",
      grp_title:"Fase de Grupos",grp_sub:"12 grupos · Top 2 + 8 mejores 3ros clasifican",search_gt:"Buscar grupo o equipo…",
      col_team:"Equipo",col_mp:"PJ",col_w:"G",col_d:"E",col_l:"P",col_gf:"GF",col_ga:"GC",col_gd:"DG",col_pts:"Pts",
      brk_title:"Llaves Eliminatorias",brk_sub:"Ronda de 32 → Final · MetLife Stadium, NJ · 19 Jul",
      watch:"📺 Ver & Canales",prono:"🎯 Pronóstico",tags:"# Hashtags",
      ch_ch:"Canal",ch_no:"Número",ch_lg:"Idioma",ch_st:"Stream",ch_lk:"Enlace",watch_lk:"Ver ↗",
      pred_win:"Ganador previsto",conf:"confianza",
      disc:"⚠ Los pronósticos son opiniones editoriales, no predicciones oficiales ni asesoramiento de apuestas.",
      s_up:"Próximo",s_lv:"En vivo",s_fi:"Final",et:"ET",cot:"COT",
      no_match:"No se encontraron partidos. Ajusta los filtros.",no_teams:"Ningún equipo coincide.",no_grps:"No se encontraron grupos.",done:"Torneo finalizado.",
      myteam:"Mi Equipo",pick:"Elige tu equipo",reset:"Restablecer tema",pick_prompt:"Elige un equipo para personalizar tu panel",lang:"EN",
      draw:"Empate",tbd:"Por definir"}
};
var lang='en';
function setLang(l){lang=(l==='es'?'es':'en');try{localStorage.setItem('wc2026_lang',lang);}catch(e){}}
function t(k){return(STRINGS[lang]&&STRINGS[lang][k])||STRINGS.en[k]||k;}
(function(){var sv;try{sv=localStorage.getItem('wc2026_lang');}catch(e){}
  if(sv==='en'||sv==='es'){lang=sv;}else{var b=((navigator.language||'')+'').slice(0,2).toLowerCase();if(b==='es')lang='es';}})();