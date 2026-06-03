// data/config.js — broadcasters, pronostics, hashtags
// Broadcaster data
var BC={
    USA:[
      {name:"FOX",        ch:"OTA (local)",      lang:"en",stream:"FOX One",   url:"https://www.foxsports.com/soccer/fifa-world-cup",flag:"🇺🇸"},
      {name:"FS1",        ch:"219 (DirecTV)",    lang:"en",stream:"FOX One",   url:"https://www.foxsports.com/soccer/fifa-world-cup",flag:"🇺🇸"},
      {name:"Telemundo",  ch:"OTA (local)",      lang:"es",stream:"Peacock",   url:"https://www.telemundo.com/shows/copa-mundial-2026",flag:"🇺🇸"},
      {name:"Universo",   ch:"418 (DirecTV)",    lang:"es",stream:"Peacock",   url:"https://www.telemundo.com/shows/copa-mundial-2026",flag:"🇺🇸"},
    ],
    COL:[
      {name:"Caracol TV", ch:"2 (OTA)",          lang:"es",stream:"Caracol Play",url:"https://www.caracoltv.com/",flag:"🇨🇴"},
      {name:"RCN",        ch:"3 (OTA)",          lang:"es",stream:"RCN Play",  url:"https://www.canalrcn.com/",flag:"🇨🇴"},
      {name:"Win Sports+",ch:"N/A",              lang:"es",stream:"Win+",      url:"https://www.winsports.co/",flag:"🇨🇴"},
      {name:"DSports",    ch:"621 (DirecTV CO)", lang:"es",stream:"DGO",       url:"https://www.dgo.com.co/",flag:"🇨🇴"},
    ],
    DEFAULT:[
      {name:"FOX/FS1",    ch:"N/A",              lang:"en",stream:"FOX One",   url:"https://www.foxsports.com/soccer/fifa-world-cup",flag:"🌎"},
      {name:"Telemundo",  ch:"N/A",              lang:"es",stream:"Peacock",   url:"https://www.telemundo.com/shows/copa-mundial-2026",flag:"🌎"},
      {name:"FIFA+",      ch:"N/A",              lang:"en",stream:"FIFA+",     url:"https://www.fifa.com/fifaplus/",flag:"🌎"},
    ]
  };
  
  // Pronostics (sample — full list in separate config)
  var PRONOS={
    m1:{w:"MEX",c:"Medium",n:"Mexico's home support gives them the edge over a spirited South Africa."},
    m2:{w:"KOR",c:"Medium",n:"South Korea's technical quality should edge out Czechia."},
    m3:{w:"MEX",c:"Medium",n:"Mexico with home advantage; South Korea's counter-attack is dangerous."},
    m4:{w:"CZE",c:"Low",   n:"Very evenly matched; Czechia's European experience may be the differentiator."},
    m5:{w:"MEX",c:"Medium",n:"Mexico likely clinches qualification here with a win or draw."},
    m6:{w:"Draw",c:"Low",  n:"Both sides fighting for third — expect a cautious, hard-fought draw."},
    m7:{w:"CAN",c:"Medium",n:"Canada on home soil is a significant factor."},
    m8:{w:"SUI",c:"Medium",n:"Switzerland's defensive solidity should handle Qatar comfortably."},
    m13:{w:"BRA",c:"High", n:"Brazil favorites to top Group C; Morocco will test but not stop them."},
    m19:{w:"USA",c:"Medium",n:"USA open at home with a winnable fixture."},
    m21:{w:"USA",c:"Medium",n:"USA vs Australia — home advantage tips it."},
    m23:{w:"USA",c:"Medium",n:"A win here likely secures first place for USA."},
    m55:{w:"ARG",c:"High", n:"Argentina, defending champions, should beat Jordan without issues."},
    m62:{w:"COL",c:"Medium",n:"Colombia's quality should handle DR Congo."},
    m63:{w:"POR",c:"Medium",n:"Portugal vs Colombia — star match of Group K. Ronaldo's experience tips it."},
    m66:{w:"COL",c:"Medium",n:"Colombia vs Uzbekistan — Colombia win and secure second place."},
  };
  
  // Hashtag overrides for key matches
  var HTAGS={
    m19:{twitter:["#USAPAR","#USMNT","#WorldCup2026","#FIFAWorldCup"],tiktok:["#USMNT","#WorldCup2026","#FIFAWorldCup"],instagram:["#USMNT","#WorldCup2026","#GroupD","#FIFAWorldCup"]},
    m21:{twitter:["#USAAUS","#USMNT","#Socceroos","#WorldCup2026"],tiktok:["#USMNT","#Socceroos","#WorldCup2026"],instagram:["#USMNT","#Socceroos","#WorldCup2026","#GroupD"]},
    m23:{twitter:["#USATUR","#USMNT","#WorldCup2026","#FIFAWorldCup"],tiktok:["#USMNT","#WorldCup2026","#FIFAWorldCup"],instagram:["#USMNT","#WorldCup2026","#GroupD"]},
    m62:{twitter:["#COLCOD","#LosCafeteros","#WorldCup2026","#FIFAWorldCup"],tiktok:["#Colombia","#LosCafeteros","#WorldCup2026"],instagram:["#Colombia","#LosCafeteros","#WorldCup2026","#GroupK"]},
    m63:{twitter:["#PORCOL","#Ronaldo","#LosCafeteros","#WorldCup2026"],tiktok:["#Colombia","#Portugal","#Ronaldo","#WorldCup2026"],instagram:["#Colombia","#Portugal","#Ronaldo","#WorldCup2026","#GroupK"]},
    m66:{twitter:["#UZBCOL","#LosCafeteros","#WorldCup2026","#FIFAWorldCup"],tiktok:["#Colombia","#LosCafeteros","#WorldCup2026"],instagram:["#Colombia","#LosCafeteros","#WorldCup2026","#GroupK"]},
  };