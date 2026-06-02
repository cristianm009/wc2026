// data/broadcasters.js
// Config-driven broadcaster data sourced from FIFA's official broadcasters page
// and confirmed rights holders (FOX/FS1 for English, Telemundo/Peacock for Spanish in USA;
// RCN/Win Sports/Caracol for Colombia).
//
// BROADCASTER_BY_TEAM: keyed by team ID.
// Each entry lists links shown on every match card featuring that team.
// BROADCASTER_DEFAULT: shown on all other match cards.

window.BROADCASTER_CONFIG = {

  // Per-team watch links — shown on any match card involving this team
  BROADCASTER_BY_TEAM: {
    "USA": [
      {
        label: "FOX / FS1",
        url:   "https://www.foxsports.com/soccer/fifa-world-cup",
        note:  "English · Free OTA or stream via FOX One"
      },
      {
        label: "Telemundo / Peacock",
        url:   "https://www.telemundo.com/shows/copa-mundial-2026",
        note:  "Spanish · 92 matches free OTA, rest on Peacock"
      },
      {
        label: "FOX One (stream)",
        url:   "https://www.fox.com/foxone/",
        note:  "All 104 matches in 4K with TV provider login"
      }
    ],
    "COL": [
      {
        label: "RCN",
        url:   "https://www.canalrcn.com/",
        note:  "Free OTA · Colombia"
      },
      {
        label: "Caracol TV",
        url:   "https://www.caracoltv.com/",
        note:  "Free OTA · Colombia"
      },
      {
        label: "Win Sports+",
        url:   "https://www.winsports.co/",
        note:  "Pay TV / streaming · Colombia"
      },
      {
        label: "ViX (intl.)",
        url:   "https://www.vix.com/",
        note:  "Spanish streaming internationally"
      }
    ]
  },

  // Default links shown on every match card (global fallback)
  BROADCASTER_DEFAULT: [
    {
      label: "FOX / FS1",
      url:   "https://www.foxsports.com/soccer/fifa-world-cup",
      note:  "USA – English"
    },
    {
      label: "Telemundo",
      url:   "https://www.telemundo.com/shows/copa-mundial-2026",
      note:  "USA – Spanish"
    },
    {
      label: "FIFA+ (intl.)",
      url:   "https://www.fifa.com/fifaplus/",
      note:  "Check your region's rights"
    }
  ]
};
