# FIFA World Cup 2026 Dashboard — Project Spec for Claude

This document exists so any Claude session can pick up the project, understand its architecture, fix bugs, and add features without breaking what already works.

---

## What this project is

A static single-page dashboard for the 2026 FIFA World Cup. It runs as a single `index.html` file with no build step, no framework, no server, and no external JS dependencies. It works in Claude's preview, on GitHub Pages, and via `file://`.

**Live URL:** https://cristianm009.github.io/wc2026/  
**Developer:** https://github.com/cristianm009  
**Built with:** Claude (Anthropic)

---

## File structure

```
wc2026/
├── index.html          ← THE app. Everything inlined. This is what runs.
├── README.md           ← GitHub Pages deploy guide
├── css/
│   └── style.css       ← Source CSS (for editing; inline into index.html to deploy)
├── data/
│   ├── teams.js        ← 48 teams: flags, confederation, group, ranking, kit colors, ISO cc
│   ├── matches.js      ← 104 fixtures: UTC kickoff, venue, status, scores
│   └── config.js       ← Broadcasters, pronostics, hashtags
└── js/
    ├── i18n.js         ← EN/ES strings (embedded — no XHR)
    ├── utils.js        ← Date/time, search, filter, sort, standings helpers
    ├── theme.js        ← Team color theming with luminance safety
    ├── matchCard.js    ← Match card + flag images + accordion sections
    └── app.js          ← Navigation, page renders, all event wiring
```

> **Important:** `index.html` is the only file that actually runs. The `css/`, `js/`, and `data/` folders are source files for editing. After editing them, inline them back into `index.html` (see "How to rebuild index.html" below).

---

## Architecture

### Single-file constraint

Claude's preview iframe and some static hosts block `<script src="...">` for local files. Everything must be inlined into `index.html` for universal compatibility. The separate source files exist for readability and editing only.

### Script section order (critical)

The `<script>` block in `index.html` is divided into named sections in this exact order:

```
1. DATA          — TEAMS[], MATCHES[], BC{}, PRONOS{}, HTAGS{}
2. I18n          — STRINGS{en,es}, setLang(), t()
3. UTILS         — esc(), fmtET(), fmtCOT(), getStatus(), filterMatches(), etc.
4. THEME         — lum(), blend(), applyTheme(), getMainTeam(), setMainTeam()
5. MATCH CARD    — flagImg(), getBroadcasters(), renderCard()
6. NAVIGATION    — showPage()
7. PAGE RENDERS  — renderHome(), renderSchedule(), renderTeams(), renderGroups(), renderBracket()
8. TEAM PICKER   — openPicker(), closePicker()
9. INIT          — DOMContentLoaded: builds TM{}, wires all events, calls showPage()
```

**Never move a section above its dependencies.**  
`flagImg()` must be above `renderCard()`.  
`TM{}` is built inside `DOMContentLoaded` (section 9) — not at load time — because data scripts must finish loading first.

### The 5 rules that prevent all past bugs

Every fix in this project came down to one of these:

| Rule | Why |
|---|---|
| **`var` only at top level, never `const`/`let`** | `const`/`let` don't attach to `window`, breaking cross-file access |
| **No IIFEs wrapping exported functions** | All functions must be plain globals accessible from anywhere |
| **No inline `onclick` in HTML** | Functions may not exist yet when HTML parses. Wire everything in `DOMContentLoaded` |
| **No XHR for i18n** | Strings are embedded in JS. XHR fails on `file://` and Claude preview |
| **`style.display` for page show/hide** | CSS class toggling loses to UA stylesheet specificity. `el.style.display='block'` always wins |

---

## Data models

### Team (`data/teams.js`)

```js
{
  id:        "COL",           // 3-letter FIFA code — used as key everywhere
  name:      "Colombia",
  flag:      "🇨🇴",           // emoji — kept for fallback text; use flagImg() for display
  cc:        "co",            // ISO 3166-1 alpha-2 for flagcdn.com images
  conf:      "CONMEBOL",      // UEFA | CONMEBOL | CONCACAF | AFC | CAF | OFC
  group:     "K",             // A–L
  ranking:   15,              // FIFA ranking
  primary:   "#FCD116",       // kit primary color (used for team theme)
  secondary: "#003087",       // kit secondary color
}
```

### Match (`data/matches.js`)

```js
{
  id:          "m62",
  home:        "COL",                         // team ID
  away:        "COD",
  kickoffUTC:  "2026-06-19T02:00:00Z",        // always UTC — derive all display times from this
  venue:       "SoFi Stadium, Inglewood",
  group:       "K",                           // empty string "" for knockout rounds
  stage:       "Group Stage",                 // see STAGES below
  status:      "upcoming",                    // "upcoming" | "live" | "final"
  scores:      null,                          // null = not played; {h:2, a:1} = result
}
```

**Valid stages:** `"Group Stage"` | `"Round of 32"` | `"Round of 16"` | `"Quarterfinal"` | `"Semifinal"` | `"3rd Place"` | `"Final"`

**Time zones:**  
- `kickoffUTC` → displayed as ET (`America/New_York`, UTC-4 in summer)  
- `kickoffUTC` → displayed as COT (`America/Bogota`, UTC-5 always)

### Broadcaster (`data/config.js — BC{}`)

```js
BC = {
  USA: [
    { name:"FOX", ch:"OTA (local)", lang:"en", stream:"FOX One", url:"https://...", flag:"🇺🇸" },
    // ...
  ],
  COL: [ /* Colombia broadcasters */ ],
  DEFAULT: [ /* shown on all other matches */ ],
}
```

### Pronostic (`data/config.js — PRONOS{}`)

```js
PRONOS = {
  "m62": {
    w:    "COL",      // team ID | "Draw" | "TBD"
    c:    "Medium",   // "Low" | "Medium" | "High"
    n:    "Colombia's South American quality should handle DR Congo.",
  }
}
```

### Hashtag (`data/config.js — HTAGS{}`)

```js
HTAGS = {
  "m62": {
    twitter:   ["#COLCOD", "#LosCafeteros", "#WorldCup2026", "#FIFAWorldCup"],
    tiktok:    ["#Colombia", "#LosCafeteros", "#WorldCup2026"],
    instagram: ["#Colombia", "#LosCafeteros", "#WorldCup2026", "#GroupK"],
  }
}
// Matches without an entry get auto-generated tags: #HOMAWAY + #WorldCup2026 + #FIFAWorldCup
```

---

## Key functions reference

### i18n
| Function | Description |
|---|---|
| `t(key)` | Returns translated string for current language. Keys are in `STRINGS.en` / `STRINGS.es` |
| `setLang('es')` | Switch language. Persists to `localStorage('wc2026_lang')` |

### Utils
| Function | Description |
|---|---|
| `fmtET(utcStr)` | Format kickoff as Eastern Time string, e.g. `"3:00 PM ET"` |
| `fmtCOT(utcStr)` | Format kickoff as Colombian Time string, e.g. `"2:00 PM COT"` |
| `fmtDate(utcStr)` | Format as short date, e.g. `"Thu, Jun 19"` |
| `getStatus(m)` | Returns `"upcoming"` / `"live"` / `"final"` from match data + current time |
| `countdown(utcStr)` | Returns `"8d 3h"` / `"2h 15m"` / `null` if past |
| `defaultMatch()` | Returns the match to feature: live → latest final → nearest upcoming |
| `filterMatches(q, group, stage)` | Filters `MATCHES[]` by search query, group letter, and stage string |
| `calcStandings(groupLetter)` | Computes MP/W/D/L/GF/GA/GD/Pts from completed matches |
| `esc(str)` | HTML-escapes a string — always use on user-facing data |
| `empty(icon, message)` | Returns empty-state HTML `<div>` |

### Theme
| Function | Description |
|---|---|
| `applyTheme(teamId, rerender)` | Apply team colors to CSS vars. `null` restores FIFA default. `rerender=true` re-renders the active page |
| `getMainTeam()` | Returns saved team ID from `localStorage` or `null` |
| `setMainTeam(id)` | Save + apply team theme |
| `resetMainTeam()` | Clear + restore FIFA default palette |
| `lum(hex)` | Perceived luminance 0–1. Used to ensure nav is always dark |
| `blend(hexA, hexB, ratio)` | Color blend. Used to darken light team colors for nav |

### Match card
| Function | Description |
|---|---|
| `flagImg(teamId, size)` | Returns `<img>` from flagcdn.com. Falls back to 🏳️ emoji. Size in px |
| `getBroadcasters(home, away)` | Returns broadcaster array for a match (per-team or default) |
| `renderCard(m)` | Renders a full match card HTML string including accordion sections |

### Navigation & pages
| Function | Description |
|---|---|
| `showPage(name)` | Show one page, hide others. Sets `style.display`. Calls the matching render function |
| `renderHome()` | Featured match + 6 upcoming matches |
| `renderSchedule()` | Filtered/sorted match list |
| `renderTeams()` | Team grid with search/filter |
| `renderGroups()` | Group standings tables with search |
| `renderBracket()` | Knockout bracket rounds |
| `openPicker()` | Show team picker modal |
| `closePicker()` | Hide team picker modal |

### Global state
| Variable | Description |
|---|---|
| `TM` | `{COL: teamObj, USA: teamObj, ...}` — built in `DOMContentLoaded` |
| `PAGES` | `['home','schedule','teams','groups','bracket']` |
| `GROUPS_LIST` | `['A','B','C','D','E','F','G','H','I','J','K','L']` |
| `schedSort` | `1` = ascending date, `-1` = descending |
| `lang` | Current language code `'en'` or `'es'` |

---

## CSS variables (theming)

```css
--p    /* nav/primary background — always dark */
--s    /* secondary/accent on dark bg */
--ac   /* accent — active tabs, CTAs, links */
--ton  /* text on primary background */
--hl-bg  /* highlight background for main team matches */
--hl-brd /* highlight border color */
```

**Default (FIFA palette):** `--p:#003F87` blue · `--s:#CC0000` red · `--ac:#00A850` green  
**Team theme:** `applyTheme('COL')` overrides these vars via `document.documentElement.style.setProperty()`

The `body.has-team` class is added when a team is selected. Use it to conditionally style elements:
```css
body.has-team .myteam-btn { /* subtle style when team is picked */ }
```

---

## How to add features

### Add a new match result / update a score

In `data/matches.js`, find the match and update `status` and `scores`:

```js
// Before (upcoming)
{id:"m62", ..., status:"upcoming", scores:null}

// After (final result)
{id:"m62", ..., status:"final", scores:{h:2, a:1}}
```

Then rebuild `index.html` (see below).

### Add a broadcaster for a new country

In `data/config.js`, add an entry to `BC`:

```js
BC["BRA"] = [
  {name:"Globo",  ch:"OTA",  lang:"pt", stream:"Globoplay", url:"https://globo.com", flag:"🇧🇷"},
  {name:"SporTV", ch:"N/A",  lang:"pt", stream:"GloboPlay", url:"https://globo.com", flag:"🇧🇷"},
];
```

### Add a pronostic

In `data/config.js`, add to `PRONOS`:

```js
PRONOS["r16a"] = {
  w: "COL",        // or "Draw" or "TBD"
  c: "Medium",
  n: "Colombia's momentum from the group stage gives them the edge."
};
```

### Add a new i18n string

1. Add the key to both `STRINGS.en` and `STRINGS.es` in `js/i18n.js`
2. Use `t('your_key')` anywhere in render functions

```js
// In js/i18n.js
en: { ..., my_new_key: "My English text" },
es: { ..., my_new_key: "Mi texto en español" },

// In a render function
'<span>' + t('my_new_key') + '</span>'
```

### Add a new page/tab

1. Add HTML section in `index.html`: `<div id="page-newpage" class="page">...</div>`
2. Add nav tab: `<button class="ntab" id="tab-newpage">New Page</button>`
3. Add to `PAGES` array in `app.js`: `var PAGES=['home','schedule','teams','groups','bracket','newpage'];`
4. Add tab wire in `init()`: `document.getElementById('tab-newpage').addEventListener('click', function(){showPage('newpage');});`
5. Add render function: `function renderNewpage(){ ... }`
6. Add case in `showPage()`: `if(name==='newpage') renderNewpage();`

### Add a new accordion section to match cards

In `renderCard()`, add to the `secs` array:

```js
var secs = [
  {lbl: t('watch'),  body: chHtml},
  {lbl: t('prono'),  body: pronoHtml},
  {lbl: t('tags'),   body: tagsHtml},
  {lbl: '📊 Stats',  body: statsHtml},   // ← new section
];
```

---

## How to rebuild index.html

After editing source files, inline them back:

```bash
python3 << 'EOF'
import re

base = './'
# Read shell (index.html with <script src> tags)
# OR just edit index.html directly — it has clear ═══ section markers

# The sections in index.html are separated by:
# // ═══════════════════════════════════════════════════
# // SECTION NAME
# // ═══════════════════════════════════════════════════
EOF
```

Or more practically: **edit `index.html` directly**. Each section has clear `═══ SECTION NAME ═══` markers. The source files in `css/`, `js/`, `data/` mirror these sections exactly — use them as readable references while editing the inlined version.

---

## Known gotchas

### `flagImg` requires `TM` to be built first

`flagImg(teamId)` looks up `TM[teamId].cc`. `TM` is only built inside `DOMContentLoaded`. This means `flagImg` only works correctly after init — which is fine because render functions are only called after init. Never call `flagImg` at script load time (outside a function body).

### Quotes inside JS strings that generate HTML

When a JS string generates HTML attributes, inner quotes must be escaped:

```js
// ✗ WRONG — breaks HTML attribute parsing
' onerror="this.style.display='none'"'

// ✓ CORRECT — escaped single quotes
' onerror="this.style.display=\'none\'"'
```

### `const`/`let` at top level

```js
// ✗ WRONG — not accessible from other script sections
const Utils = (() => { ... })();

// ✓ CORRECT — attaches to window, accessible everywhere
var Utils = { ... };
function myHelper() { ... }
```

### DOMContentLoaded callback scope

```js
// ✗ WRONG — functon is local to the callback, invisible to renderCard()
document.addEventListener('DOMContentLoaded', function() {
  function flagImg(id) { ... }   // not accessible outside
});

// ✓ CORRECT — top-level function, accessible everywhere
function flagImg(id) { ... }
document.addEventListener('DOMContentLoaded', function() {
  // can call flagImg() here too
});
```

### onerror attribute in generated HTML strings

HTML attribute values use double quotes. If your JS string contains the attribute value with single quotes inside, the browser's HTML parser will truncate the attribute at the first unescaped quote. Use `\'` inside the JS string so the output HTML has them escaped.

---

## Deployment

```bash
# GitHub Pages (simplest)
git add index.html
git commit -m "update"
git push origin main
# → live at https://YOUR_USERNAME.github.io/REPO_NAME/

# Local preview (needs server for fonts)
python3 -m http.server 8080
```

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| HTML | Single file | Works in Claude preview, file://, GitHub Pages |
| CSS | Vanilla + CSS vars | Theme switching without JS style recalculation |
| JS | Vanilla ES5-compatible | No transpile, no bundler, max browser compatibility |
| Fonts | Google Fonts (Barlow) | Clean, free, loaded from CDN |
| Flags | flagcdn.com images | Emoji flags don't render in Claude preview |
| i18n | Embedded JS objects | No XHR = no server required |
| State | localStorage | Theme + language persist across sessions |
| Hosting | GitHub Pages | Free, static, no backend |