# FIFA World Cup 2026 Dashboard

A static HTML/CSS/JS dashboard for the 2026 FIFA World Cup (USA · Canada · Mexico).
No build step, no framework, no dependencies beyond Google Fonts.

## Features

- **Home** — hero banner + next 6 upcoming matches
- **Schedule** — all 104 matches with search, group/stage filters, and date sort
- **Teams** — all 48 qualified nations, filterable by confederation and sortable by name/ranking; click any team to open their filtered match calendar
- **Groups** — all 12 groups with FIFA rankings; click any team to jump to their schedule
- **Bracket** — full knockout bracket from Round of 32 to the Final
- **Watch links** — every match card shows broadcaster links; USA and Colombia matches display official per-team broadcaster links (FOX/FS1/Telemundo for USA matches; RCN/Caracol/Win Sports+ for Colombia matches)
- **Team search** — typing a team name in the global search bar navigates directly to that team's match calendar

## File structure

```
wc2026/
├── index.html          ← single entry point
├── css/
│   └── style.css       ← all styles (light theme, responsive)
├── js/
│   ├── utils.js        ← shared utilities (date, search, filter, sort, DOM)
│   ├── matchCard.js    ← match card renderer with broadcaster logic
│   └── app.js          ← main controller: routing, page renders, event wiring
└── data/
    ├── teams.js        ← 48 teams with flags, confederation, group, FIFA ranking
    ├── matches.js      ← all 104 fixtures (group stage + knockouts)
    └── broadcasters.js ← config-driven broadcaster data per team and global default
```

## Running locally

Just open `index.html` in any browser — no server needed for local development.

```bash
# Optional: serve with Python's built-in server
python3 -m http.server 8080
# then open http://localhost:8080
```

## Updating data

All source data is plain JavaScript objects in `data/`. No build or transpilation needed.

| File | What to change |
|------|----------------|
| `data/teams.js` | Team flags, rankings, confederation assignments |
| `data/matches.js` | Match dates, venues, kick-off times |
| `data/broadcasters.js` | Watch links per team or global defaults |

To add a broadcaster for a new country, add an entry to `BROADCASTER_BY_TEAM` in `data/broadcasters.js`:

```js
"BRA": [
  { label: "Globo / YouTube", url: "https://www.youtube.com/...", note: "Free · Brazil" }
]
```

---

## Publishing on GitHub Pages

### Prerequisites
- A free [GitHub](https://github.com) account
- Git installed locally (`git --version`)

### Steps

1. **Ensure `index.html` is in the repo root** (or in a `/docs` folder if you prefer that layout). This project keeps `index.html` in the root.

2. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit — WC2026 dashboard"
   ```
   Then create a new repo on GitHub and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/wc2026.git
   git branch -M main
   git push -u origin main
   ```

3. **Open repo Settings → Pages**
   - In your repository on GitHub, click the **Settings** tab.
   - In the left sidebar, click **Pages**.

4. **Set the source**
   - Under **Build and deployment**, set **Source** to **Deploy from a branch**.
   - Choose the branch: `main`.
   - Choose the folder: `/ (root)` (or `/docs` if you moved files there).
   - Click **Save**.

5. **Wait for deployment**
   - GitHub will run a short deployment job (usually under 60 seconds).
   - A green banner will appear at the top of the Pages settings with your URL.

6. **Your site is live at:**
   ```
   https://YOUR_USERNAME.github.io/REPO_NAME/
   ```
   For example: `https://cristian.github.io/wc2026/`

### Updating the site

Push any changes to `main` and GitHub Pages will redeploy automatically within ~30 seconds:
```bash
git add .
git commit -m "Update match data"
git push
```

### Notes

- No build pipeline needed. GitHub Pages serves the static files directly.
- Google Fonts loads from `fonts.googleapis.com`; if you need a fully offline build, download the fonts and reference them locally.
- The site works without JavaScript disabled for content reading (server-side rendering is not needed), but interactivity requires JS.

---

## Broadcaster data source

Watch links are sourced from:
- FIFA official broadcasters page: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/draw-official-broadcasters
- FOX Sports (USA English rights): https://www.foxsports.com/soccer/fifa-world-cup
- Telemundo/Peacock (USA Spanish rights)
- RCN, Caracol TV, Win Sports+ (Colombia rights)

All broadcaster URLs are stored in `data/broadcasters.js` and can be updated independently of the match data.
