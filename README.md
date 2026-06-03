# ⚽ FIFA World Cup 2026 Dashboard

Static HTML/CSS/JS dashboard. No build step. Works on GitHub Pages.

## File structure

```
wc2026/
├── index.html          ← entry point, references all external files
├── css/
│   └── style.css       ← all styles
├── js/
│   ├── i18n.js         ← EN/ES strings (embedded, no XHR)
│   ├── utils.js        ← date/time, search, filter, sort, standings
│   ├── theme.js        ← team color theming + luminance safety
│   ├── matchCard.js    ← match card renderer
│   └── app.js          ← navigation, page renders, all event wiring
├── data/
│   ├── teams.js        ← 48 teams (flags, kit colors, rankings)
│   ├── matches.js      ← 104 fixtures (UTC kickoff, confirmed venues)
│   └── config.js       ← broadcasters, pronostics, hashtags
└── README.md
```

## Script loading order (important)

```html
<script src="data/teams.js"></script>    <!-- TEAMS global -->
<script src="data/matches.js"></script>  <!-- MATCHES global -->
<script src="data/config.js"></script>   <!-- BC, PRONOS, HTAGS globals -->
<script src="js/i18n.js"></script>       <!-- STRINGS, t(), setLang() -->
<script src="js/utils.js"></script>      <!-- helpers, GROUPS_LIST -->
<script src="js/theme.js"></script>      <!-- applyTheme(), lum(), blend() -->
<script src="js/matchCard.js"></script>  <!-- renderCard(), openPicker() -->
<script src="js/app.js"></script>        <!-- showPage(), init(), DOMContentLoaded -->
```

`app.js` builds `TM` (team lookup map) inside `DOMContentLoaded` — after all
data scripts have loaded. Never move data scripts below app scripts.

## Key rules that prevent the bugs

1. **`var` only at top level** — `const`/`let` don't attach to `window`, breaking cross-file access.
2. **No IIFEs** — all functions are plain globals so every file can call them.
3. **No inline `onclick`** — all buttons wired via `addEventListener` in `DOMContentLoaded`.
4. **No XHR for i18n** — strings embedded in `i18n.js`; works with `file://` and GitHub Pages.
5. **`style.display`** controls page visibility, not CSS classes — immune to specificity issues.

## Running locally

Requires a local server (browser blocks cross-origin file reads for the external JS files):

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploying to GitHub Pages

1. Push all files to a GitHub repo with `index.html` in the root.
2. Go to **Settings → Pages**.
3. Set source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save — site goes live at `https://YOUR_USERNAME.github.io/REPO_NAME/`.

## Updating data

| File | What to change |
|---|---|
| `data/teams.js` | Rankings, groups, kit colors |
| `data/matches.js` | Scores (`scores:{h:2,a:1}`), status (`"final"`) |
| `data/config.js` | Channel numbers, pronostics, hashtags |