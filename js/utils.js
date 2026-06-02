// js/utils.js — Shared utilities. No dependencies.

var Utils = (function () {

  /* ── Date helpers ── */

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  }

  function fmtTime(iso) {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", timeZoneName: "short"
    });
  }

  function countdown(iso) {
    const diff = new Date(iso) - Date.now();
    if (diff <= 0) return { label: "Completed", cls: "past" };
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    if (d > 3)  return { label: `${d}d ${h}h`,  cls: "upcoming" };
    if (d > 0)  return { label: `${d}d ${h}h`,  cls: "soon" };
    if (h > 0)  return { label: `${h}h ${m}m`,  cls: "soon" };
    return       { label: `${m}m`,               cls: "soon" };
  }

  /* ── Search ── */

  // Returns true if match m matches query string q.
  // Checks both team names, venue, and group label.
  function matchSearch(m, q, teamMap) {
    if (!q) return true;
    const ql = q.toLowerCase();
    const ht = teamMap[m.home] || {};
    const at = teamMap[m.away] || {};
    return (
      (ht.name || m.home).toLowerCase().includes(ql) ||
      (at.name || m.away).toLowerCase().includes(ql) ||
      m.venue.toLowerCase().includes(ql) ||
      (m.group && ("group " + m.group).toLowerCase().includes(ql)) ||
      m.stage.toLowerCase().includes(ql)
    );
  }

  function teamSearch(teams, q) {
    if (!q) return teams;
    const ql = q.toLowerCase();
    return teams.filter(t =>
      t.name.toLowerCase().includes(ql) ||
      t.conf.toLowerCase().includes(ql) ||
      t.group.toLowerCase().includes(ql)
    );
  }

  /* ── Filter ── */

  function filterMatches(matches, { q, group, stage }, teamMap) {
    return matches.filter(m => {
      if (!matchSearch(m, q, teamMap)) return false;
      if (group && m.group !== group)   return false;
      if (stage && m.stage !== stage)   return false;
      return true;
    });
  }

  /* ── Sort ── */

  function sortByDate(arr, asc = true) {
    return [...arr].sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return asc ? diff : -diff;
    });
  }

  function sortTeams(teams, key) {
    return [...teams].sort((a, b) => {
      if (key === "ranking") return a.ranking - b.ranking;
      if (key === "conf")    return a.conf.localeCompare(b.conf) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name); // default: A-Z
    });
  }

  /* ── DOM helpers ── */

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k.startsWith("data-")) node.dataset[k.slice(5)] = v;
      else node.setAttribute(k, v);
    });
    children.forEach(c => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function html(container, str) {
    container.innerHTML = str;
  }

  return { fmtDate, fmtTime, countdown, matchSearch, teamSearch,
           filterMatches, sortByDate, sortTeams, el, html };
}());