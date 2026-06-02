// js/matchCard.js — Renders a single match card HTML string.
// Depends on: Utils, BROADCASTER_CONFIG, and a teamMap object.

var MatchCard = (function () {

  function getBroadcasters(home, away) {
    const byTeam = BROADCASTER_CONFIG.BROADCASTER_BY_TEAM;
    // Collect all per-team links for teams involved in this match
    const links = [];
    const seen = new Set();
    [home, away].forEach(id => {
      if (byTeam[id]) {
        byTeam[id].forEach(b => {
          if (!seen.has(b.label)) {
            seen.add(b.label);
            links.push({ ...b, teamId: id });
          }
        });
      }
    });
    // If no per-team links, fall back to defaults
    if (links.length === 0) {
      return BROADCASTER_CONFIG.BROADCASTER_DEFAULT.map(b => ({ ...b, teamId: null }));
    }
    return links;
  }

  function teamFlag(teamMap, id) {
    const tm = teamMap[id];
    return tm ? tm.flag : "🏳️";
  }

  function teamName(teamMap, id) {
    const tm = teamMap[id];
    return tm ? tm.name : id;
  }

  function teamConf(teamMap, id) {
    const tm = teamMap[id];
    return tm ? tm.conf : "";
  }

  function render(m, teamMap) {
    const ht = teamName(teamMap, m.home);
    const at = teamName(teamMap, m.away);
    const hf = teamFlag(teamMap, m.home);
    const af = teamFlag(teamMap, m.away);
    const hc = teamConf(teamMap, m.home);
    const ac = teamConf(teamMap, m.away);
    const cd = Utils.countdown(m.date);
    const broadcasters = getBroadcasters(m.home, m.away);

    const groupBadge = m.group
      ? `<span class="badge badge-group">Group ${m.group}</span>`
      : `<span class="badge badge-stage">${m.stage}</span>`;

    const watchLinks = broadcasters.map(b => {
      const teamTag = b.teamId
        ? `<span class="watch-team-tag">${teamFlag(teamMap, b.teamId)}</span>`
        : "";
      return `<a class="watch-link" href="${b.url}" target="_blank" rel="noopener"
                 aria-label="Watch on ${b.label}${b.note ? ': ' + b.note : ''}">
        ${teamTag}<span class="watch-label">${b.label}</span>
        ${b.note ? `<span class="watch-note">${b.note}</span>` : ""}
        <svg class="watch-ext" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
      </a>`;
    }).join("");

    return `<article class="match-card" role="article"
              aria-label="${ht} vs ${at}, ${Utils.fmtDate(m.date)}">
  <div class="match-meta">
    ${groupBadge}
    <span class="match-date">${Utils.fmtDate(m.date)} · ${Utils.fmtTime(m.date)}</span>
    <span class="match-venue">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none">
        <path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1Z"
              stroke="currentColor" stroke-width="1.2"/>
        <circle cx="6" cy="4.5" r="1.2" fill="currentColor"/>
      </svg>
      ${m.venue}
    </span>
  </div>
  <div class="match-teams">
    <div class="team-side">
      <span class="team-flag" role="img" aria-label="${ht} flag">${hf}</span>
      <div class="team-info">
        <div class="team-name">${ht}</div>
        <div class="team-conf">${hc}</div>
      </div>
    </div>
    <div class="vs-block">
      <span class="vs-text">VS</span>
      <span class="countdown countdown-${cd.cls}" aria-label="Time until match: ${cd.label}">
        ${cd.label}
      </span>
    </div>
    <div class="team-side team-side-right">
      <span class="team-flag" role="img" aria-label="${at} flag">${af}</span>
      <div class="team-info">
        <div class="team-name">${at}</div>
        <div class="team-conf">${ac}</div>
      </div>
    </div>
  </div>
  <div class="match-footer">
    <span class="match-stage-label">${m.stage}</span>
    <div class="watch-links" role="list" aria-label="Watch links">
      ${watchLinks}
    </div>
  </div>
</article>`;
  }

  return { render };
}());