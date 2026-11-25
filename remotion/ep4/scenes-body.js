// ---------- extra helpers for the animated build ----------
const chalkBoard=(plate)=>`<div class="plate" data-k="text">${plate}</div><div class="chalk" data-k="bg"></div>`;
const chalkText=(txt,src)=>`<div class="chalk" data-k="text" style="background:transparent;border-color:transparent;box-shadow:none">${txt}<div class="src">${src}</div></div>`;
const line=(x,y,w,c='#E31B1B',h=12)=>`<div class="a" data-k="bg" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c};border-radius:6px"></div>`;
const glowBox=(x,y,w,h,c='rgba(31,163,74,.35)')=>`<div class="a" data-k="icon" data-over="1" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c};border-radius:16px;box-shadow:0 0 30px ${c}"></div>`;
const over=(html)=>html.replace('data-k="','data-over="1" data-k="');
const lerp=(t,a,b,v0,v1)=>t<=a?v0:t>=b?v1:v0+(v1-v0)*(1-Math.pow(1-(t-a)/(b-a),3));
const sunPath=x=>240+Math.pow((x-960)/660,2)*500;
const I=(at,a,h,o={})=>({at,a,h,...o});

// ---------- scenes (times are the voiceover's word timings) ----------
// scene: {from,to,zoom,ox,oy,shake:[t],quiet,camTo:{at,scale,ox,oy}, items:[I(at,anim,html|fn(t),opts)]}
const SC=[
// 1 · hook: one continuous shot. The camera eases toward the clock, then glides in on Hadi (no cut).
{from:0,to:6.84,cam:[[0,1,960,540],[3.3,1.06,1000,500],[4.5,1.35,1010,560],[6.84,1.38,1005,565]],items:[
 I(0,'cut',bg('classroom')),
 I(0,'cut',H('sit-phone',840,410,660,0,1)),
 I(.6,'drop',notif(200,300,'Dhuhr · 1:15 PM'),{buzz:.9,sfx:'buzz',out:3.35}),
 I(.9,'wipe',cap('1:15 PM',620),{out:2.75}),
 I(1.9,'pop',t=>{const k=lerp(t,2.0,3.0,0,1);const mins=75+105*k;return clock(1305,236,160,Math.floor(mins/60),mins%60,[15,15+Math.max(1,45*k)])},{out:3.35}),
 I(3.0,'wipe',cap('until 3:00',620),{out:3.35}),
 I(5.0,'pop',cloud("I'll pray<br>when I get home",360,190,520,300,48)),
]},
// 3
{from:6.84,to:9.78,items:[
 I(6.84,'drop',PHbg('classroom',40,150,600,780,'school'),{sfx:'whoosh'}),
 I(7.6,'drop',PH('lecture-hall',660,150,600,780,'university'),{sfx:'whoosh'}),
 I(8.4,'drop',PH('office',1280,150,600,780,'work'),{sfx:'whoosh'}),
 I(9.0,'pop',cloud('later',140,600,300,160,44,1)),I(9.05,'pop',cloud('later',760,600,300,160,44,1),{sfx:0}),I(9.1,'pop',cloud('later',1380,600,300,160,44,1),{sfx:0}),
]},
// 4
{from:9.78,to:12.04,items:[
 I(9.8,'stamp',K('IS IT',230,170)),I(10.2,'stamp',K('ACTUALLY',420,170,'#E31B1B')),I(10.7,'stamp',K('OKAY?',610,170)),
 I(10.75,'slideR',SI('shrug-plain',1480,520,440)),
]},
// 5 · the short answer
{from:12.04,to:21.46,shake:[20.3],items:[
 I(12.04,'pop',Y('The short answer',110,90)),
 I(13.4,'wipe',bar(110,420,1700,[['DHUHR',0,55,'#1FA34A'],['ASR',55,100,'#E8A92E']],0,100,130),{d:.6,sfx:'marker'}),
 I(13.9,'fade',`<div class="a" data-k="icon" data-over="1" style="left:1040px;top:380px;width:10px;height:210px;background:#151515"></div>`),
 I(14.0,'wipe',L('Asr comes in',940,600,50,'#151515')),
 I(14.4,'fade',t=>{const x=t<16.7?lerp(t,14.4,15.0,420,760):lerp(t,16.7,17.4,760,1300);return SI('walk1',x,140,270)+P('home',x+200,110,'#151515',36)},{sfx:'whoosh'}),
 I(15.2,'pop',P("you're fine ✓",230,620,'#1FA34A',48)),
 I(16.9,'fade',glowBox(1048,420,762,130,'rgba(227,27,27,.45)')),
 I(18.8,'wipe',L('delayed',600,770,84,'#151515')),
 I(19.4,'wipe',line(590,825,300)),
 I(20.3,'stamp',ST('MISSED',1180,700,'#E31B1B',-8,90)),
]},
// 6 · roadmap
{from:21.46,to:27.82,zoom:.04,items:[
 I(21.5,'pop',PH('quran-ms',90,250,500,500)),I(21.5,'pop',N(1,60,190),{sfx:0}),I(21.7,'wipe',L('why',260,780,72)),
 I(22.5,'pop',PH('alarm',710,250,500,500)),I(22.5,'pop',N(2,680,190),{sfx:0}),I(22.7,'wipe',L('real excuses',820,780,72)),
 I(23.9,'pop',PH('lecture-hall',1330,250,240,240)),I(23.9,'pop',N(3,1300,190),{sfx:0}),I(24.3,'pop',PHbg('office',1580,250,240,240)),I(24.7,'pop',PH('empty-classroom',1330,510,490,240)),
 I(25.0,'wipe',L('what to do',1440,780,72)),
]},
// 7 · how prayer times work (flows on, whiteboard)
{from:27.82,to:30.38,items:[
 I(27.8,'pop',clock(420,500,210,12,0)),I(28.0,'wipe',L('how prayer times work',190,780,64,'#151515')),
 I(28.8,'wipe',AR('M700,480 C820,380 960,380 1080,470')),
 I(29.0,'pop',`<div class="a" data-k="icon" style="left:1140px;top:360px;width:260px;height:260px;border-radius:50%;background:#FFC83D;box-shadow:0 0 60px #FFC83D"></div>`),
 I(29.2,'wipe',L('they follow the sun',1080,700,64)),
]},
// 8 · sun path
{from:30.38,to:40.08,items:[
 I(0,'cut',t=>{const x=t<35.3?lerp(t,30.6,35.3,300,960):lerp(t,37.0,39.4,960,1250);return sky(x,sunPath(x))}),
 I(30.6,'pop',P('start',140,880,'#151515',40),{out:33.2}),I(30.9,'pop',P('end',1640,880,'#151515',40),{out:33.2}),
 I(35.3,'wipe',L('highest point',1060,200,54,'#151515'),{out:37.0}),
 I(36.0,'drop',flag(980,'Dhuhr starts','#1FA34A',440),{sfx:'thud'}),
 I(37.6,'drop',flag(1440,'Asr comes in','#E8A92E',560),{sfx:'thud'}),
 I(38.4,'wipe',`<div class="a" data-k="icon" style="left:990px;top:760px;width:440px;height:16px;background:#1FA34A;border-radius:8px"></div>`),
 I(38.6,'wipe',L('Dhuhr window',1060,690,52,'#0E6B32')),
]},
// 9 · sunset
{from:40.08,to:46.02,items:[
 I(0,'cut',t=>{const x=lerp(t,40.1,41.6,1250,1660);const col=t<43.3?'#FFC83D':'#FFB000';return sky(x,sunPath(x),col,'#FFB36B,#FFE2B8')}),
 I(0,'cut',flag(1440,'Asr','#E8A92E',560)),
 I(40.9,'wipe',L('sunset = Asr ends',300,150,64,'#151515')),
 I(41.5,'wipe',`<div class="a" data-k="bg" style="left:1640px;top:440px;width:200px;height:380px;background:repeating-linear-gradient(45deg,rgba(227,27,27,.45) 0 18px,transparent 18px 36px)"></div>`),
 I(42.9,'wipe',L('the sun turns yellow',1240,400,50,'#B07A00')),
 I(44.2,'pop',P("don't push it here without a reason",380,300,'#E31B1B',40)),
]},
// 10 · deadline vs window
{from:46.02,to:53.48,items:[
 I(46.0,'stamp',K('DEADLINE',120,150,'#999')),
 I(47.6,'wipe',line(560,205,800,'#E31B1B',16),{sfx:'marker'}),
 I(49.0,'stamp',K("IT'S A WINDOW",300,110,'#1FA34A')),
 I(49.0,'rise',bar(160,520,1600,[['6 AM',6,9,'#cfcfcf'],['',9,12,'#e3e3e3'],['DHUHR',12,15,'#1FA34A'],['ASR',15,18,'#E8A92E'],['9 PM',18,21,'#3A2A6A']],6,21,120),{sfx:0}),
 I(49.6,'drop',`<div class="a" data-k="icon" data-over="1" style="left:782px;top:502px;width:350px;height:156px;border:14px solid #151515;border-radius:20px"></div>`,{pulse:50.2,sfx:'thud'}),
 I(51.4,'wipe',L('shorter than most people think',560,740,64)),
]},
// 11 · Quran and Sunnah
{from:53.48,to:58.08,items:[
 I(53.5,'pop',PH('quran-ms',110,180,340,380)),I(53.7,'wipe',L('Quran',200,590,70)),
 I(54.6,'pop',PH('books-shelf',540,180,380,380)),I(54.8,'wipe',L('Sunnah',630,590,70)),
 I(55.6,'wipe',AR('M960,370 C1060,300 1160,300 1250,360')),
 I(56.2,'pop',cloud('pray it<br>later?',1270,220,480,300,52)),I(56.3,'slideR',H('point-up',1500,560,480),{sfx:0}),
]},
// 12 · Quran 4:103 (calm: fades only, no sfx)
{from:58.08,to:64.92,zoom:.03,quiet:1,items:[
 I(58.1,'fade',chalkBoard('QURAN')),I(58.3,'fade',H('explain',1430,380,620)),
 I(59.1,'wipe',chalkText('"Prayer has been prescribed for the believers at fixed times."','Surah An-Nisa 4:103'),{d:1.8}),
 I(62.5,'wipe',L('not whenever it fits',990,960,54)),
]},
// 13 · most beloved deed
{from:64.92,to:74.04,zoom:.05,quiet:1,items:[
 I(0,'cut',bgPhoto('nabawi-top',.55,'center 30%')),
 I(66.6,'fade',`<div class="a" data-k="text" style="left:0;right:0;top:110px;text-align:center;font:800 46px Nunito;color:#fff">The Prophet <span style="font-family:Amiri">ﷺ</span> was asked</div>`),
 I(68.8,'rise',`<div class="a" data-k="text" style="left:260px;top:220px;width:1400px;background:#fff;border-radius:24px;padding:30px 40px;font:900 64px Nunito;text-align:center">Which deed does Allah love the most?</div>`,{dim:71.0}),
 I(72.0,'rise',K('THE PRAYER AT ITS TIME',560,104,'#FFE14D','text-shadow:0 8px 30px rgba(0,0,0,.6)')),
 I(72.4,'fade',`<div class="ref" data-k="text" style="top:920px;color:#ddd">Sahih al-Bukhari 527 · Sahih Muslim 85</div>`),
]},
// 14 · missing Asr
{from:74.04,to:81.36,items:[
 I(74.0,'pop',Y('About Asr',110,90)),
 I(75.7,'pop',PH('sunset',110,260,460,300,'misses Asr','#FFB36B')),
 I(77.3,'pop',L('=',650,330,160,'#151515')),
 I(78.3,'pop',PH('home',800,260,460,300,'family'),{gray:80.0}),
 I(79.3,'pop',PH('coins',1330,260,460,300,'wealth','#FFE14D'),{gray:80.0}),
 I(80.0,'wipe',L('as if he lost both',760,640,72)),
 I(80.2,'fade',`<div class="ref" data-k="text" style="top:900px">Sahih al-Bukhari 552 · Sahih Muslim 626</div>`),
]},
// 15 · Quran 107:4-5
{from:81.36,to:87.08,zoom:.03,quiet:1,items:[
 I(81.4,'fade',chalkBoard('QURAN')),I(81.6,'fade',H('explain',1430,380,620)),
 I(83.3,'wipe',chalkText('"Woe to those who pray, but are heedless of their prayer."','Surah Al-Ma\'un 107:4–5'),{d:1.6}),
]},
// 16 · early scholars
{from:87.08,to:98.96,shake:[96.6],items:[
 I(87.1,'pop',PH('books-shelf',110,110,300,240)),I(87.3,'wipe',L('early scholars',110,370,52)),
 I(88.8,'pop',SI('pray-stand',520,90,280)),
 I(90.5,'wipe',bar(860,170,900,[['DHUHR',0,60,'#1FA34A'],['ASR',60,100,'#E8A92E']],0,100,90)),
 I(90.9,'wipe',AR('M900,330 C1100,420 1300,420 1480,330','#E31B1B',9)),I(91.3,'wipe',L('pushed past its time',1050,410,50)),
 I(93.0,'wipe',`<div class="a" data-k="icon" style="left:950px;top:680px;width:8px;height:320px;background:#ddd"></div>`,{sfx:0}),
 I(93.0,'slideL',SI('walk1',300,600,330,1)),I(93.3,'wipe',L("don't pray",280,940,54,'#151515')),
 I(95.7,'slideR',SI('sleep',1260,600,330)),I(95.9,'wipe',L('pray late out of laziness',1100,940,54)),
 I(96.6,'stamp',ST('WARNING',720,540,'#E31B1B',-6,60)),
]},
// 17 · what's not your fault
{from:98.96,to:101.48,items:[
 I(99.0,'wipe',L("what's not your fault?",560,120,84,'#151515')),
 I(99.6,'pop',SI('sleep',300,380,460)),I(99.7,'wipe',L('fell asleep',330,880,60)),
 I(100.2,'pop',SI('sad',1220,380,460)),I(100.3,'pop',cloud('?',1540,190,200,150,80),{sfx:0}),I(100.4,'wipe',L('forgot',1290,880,60)),
]},
// 18 · sleep / forget
{from:101.48,to:112.38,zoom:.05,ox:500,oy:600,items:[
 I(0,'cut',bg('bedroom',.45)),I(0,'cut',H('sleep',260,330,640)),
 I(102.2,'pop',PH('alarm',1380,140,330,420),{buzz:102.4,gray:110.6,sfx:'buzz'}),
 I(103.4,'pop',cloud('?',800,280,170,130,70),{out:107.4}),
 I(107.6,'fade',glowBox(910,650,880,90,'rgba(31,163,74,.25)').replace('data-k="icon"','data-k="bg"')),
 I(105.1,'rise',`<div class="a" data-k="text" style="left:900px;top:640px;width:900px;background:#F4F1E8;border:10px solid #5B3A1E;border-radius:16px;padding:26px 30px;font:italic 700 54px 'Comic Neue';text-align:center;text-transform:uppercase">"Pray it when you remember"<div style="font:700 26px Nunito;color:#666;text-transform:none;font-style:normal;margin-top:8px">Sahih al-Bukhari 597 · Sahih Muslim 684</div></div>`,{sfx:'whoosh'}),
 I(109.3,'pop',P('not sinful ✓',360,180,'#1FA34A',54),{sfx:'ding'}),
]},
// 19 · not forgetting
{from:112.38,to:116.44,shake:[114.6],items:[
 I(0,'cut',bg('classroom')),I(0,'cut',notif(260,300,'Dhuhr · 1:15 PM')),I(0,'cut',H('sit-bored',980,330,700)),
 I(113.4,'pop',cloud('too awkward<br>to ask…',1380,120,440,260,40)),
 I(114.6,'stamp',ST('NOT FORGETTING',300,640,'#E31B1B',-8,70)),
]},
// 20 · the Trench
{from:116.44,to:124.72,zoom:.06,ox:700,oy:700,shake:[120.2],items:[
 I(0,'cut',trench(.15)),
 I(116.5,'wipe',cap('The Battle of the Trench')),
 I(117.9,'pop',map(1300,170)),
 I(120.0,'wipe',AR('M1120,540 C1190,490 1230,450 1270,420','#E31B1B',10)),
 I(120.2,'wipe',AR('M80,900 C160,860 250,840 330,830','#E31B1B',10),{sfx:0}),I(120.4,'wipe',AR('M560,1010 C570,980 590,950 600,925','#E31B1B',10),{sfx:0}),
 I(122.1,'fade',t=>`<div class="a" data-k="bg" style="inset:0;background:rgba(40,10,60,${lerp(t,122.1,123.8,0,.45)})"></div><div class="a" data-k="bg" style="left:240px;top:${lerp(t,122.1,124.0,560,800)}px;width:180px;height:180px;border-radius:50%;background:#FFB347;box-shadow:0 0 80px #FF8A3D"></div>`,{sfx:0}),
 I(123.2,'stamp',K('ASR PASSED',640,120,'#fff','text-shadow:0 6px 24px rgba(0,0,0,.6)')),
]},
// 21 · upset (calm)
{from:124.72,to:130.72,zoom:.03,quiet:1,items:[
 I(0,'cut',trench(.55)),
 I(124.8,'fade',K('He was upset about it',300,96,'#fff','text-shadow:0 6px 24px rgba(0,0,0,.6)')),
 I(126.7,'wipe',line(560,420,800,'#E31B1B',10)),
 I(128.2,'rise',K('and prayed it as soon as he could',470,80,'#FFE14D','text-shadow:0 6px 24px rgba(0,0,0,.6)')),
 I(128.6,'fade',`<div class="ref" data-k="text" style="top:880px;color:#ddd">Sahih al-Bukhari 596</div>`),
]},
// 22 · war vs school day
{from:130.72,to:135.92,items:[
 I(130.72,'slideL',`<div class="a" data-k="bg" style="left:0;top:0;width:960px;height:1080px;background:url(${A}bg-trench.png) 0% 100%/370% auto"></div>`,{sfx:'whoosh'}),
 I(130.9,'pop',P('a war',330,120,'#151515',64)),
 I(133.3,'slideR',`<div class="a" data-k="bg" style="left:960px;top:0;width:960px;height:1080px;background:url(${A}photos/lecture-hall.jpg) center/cover"></div>`,{sfx:'whoosh'}),
 I(133.5,'pop',P('a school day',1220,120,'#151515',64)),
 I(134.4,'drop',t=>scale(700,560,lerp(t,134.6,135.3,0,-14)),{sfx:'thud'}),
]},
// 23 · there is a solution
{from:135.92,to:138.04,items:[
 I(135.9,'pop',P('but there is a solution',600,200,'#1FA34A',64),{sfx:'ding'}),
 I(136.6,'slideL',bar(160,520,700,[['DHUHR',0,100,'#1FA34A']],0,100,130)),I(136.6,'slideR',bar(1060,520,700,[['ASR',0,100,'#E8A92E']],0,100,130),{sfx:0}),
 I(136.9,'wipe',AR('M700,760 C800,820 860,820 920,760','#151515',8)),I(137.0,'wipe',AR('M1220,760 C1120,820 1060,820 1000,760','#151515',8),{sfx:0}),
]},
// 24 · Ibn Abbas combined
{from:138.04,to:147.84,items:[
 I(138.0,'pop',PH('quran-ms',90,110,260,260)),I(138.3,'wipe',L('Ibn Abbas (RA)',70,390,52)),
 I(139.6,'wipe',over(AR('M362,240 C380,225 395,225 412,238','#151515',6))),
 I(141.6,'pop',PH('nabawi-top',420,110,420,260,'Madinah')),
 I(142.0,'fade',t=>{const g=lerp(t,142.0,142.6,90,0);return bar(940-g,170,440,[['DHUHR',0,100,'#1FA34A']],0,100,110)+bar(1380+g,170,440,[['ASR',0,100,'#E8A92E']],0,100,110)},{sfx:'whoosh'}),
 I(142.7,'pop',P('COMBINED',1200,320,'#151515',48),{sfx:'thud'}),
 I(143.9,'pop',PH('suitcase',120,560,420,320)),I(144.1,'wipe',L('no travel ✕',180,900,58)),
 I(145.3,'pop',SI('panic-plain',800,520,380)),I(145.5,'wipe',L('no fear ✕',760,900,58)),
 I(146.3,'pop',PH('rain2',1380,560,420,320)),I(146.5,'wipe',L('no rain ✕',1450,900,58)),
]},
// 25 · reason (calm)
{from:147.84,to:152.94,zoom:.03,quiet:1,items:[
 I(147.9,'wipe',L('Why?',860,150,90,'#151515')),
 I(150.8,'fade',`<div class="quote" data-k="text">"So his ummah wouldn't be put in <mark>hardship</mark>."</div>`),
 I(151.2,'fade',`<div class="ref" data-k="text" style="top:760px">Sahih Muslim 705</div>`),
]},
// 26 · scholars allow
{from:152.94,to:161.34,items:[
 I(152.95,'pop',PH('books-shelf2',110,120,300,300)),I(153.2,'wipe',L('many scholars allow it',450,200,64,'#151515')),
 I(154.4,'pop',bar(1200,215,520,[['DHUHR',0,49,'#1FA34A'],['ASR',51,100,'#E8A92E']],0,100,80)),
 I(157.0,'pop',P('real hardship ✓',130,560,'#1FA34A',58)),
 I(158.5,'pop',P('occasional ✓',720,560,'#1FA34A',58)),
 I(159.8,'pop',P('a habit ✕',1230,560,'#E31B1B',58)),
 I(160.0,'wipe',bar(560,780,1200,[['MON',0,20,'#E31B1B'],['TUE',20,40,'#E31B1B'],['WED',40,60,'#E31B1B'],['THU',60,80,'#E31B1B'],['FRI',80,100,'#E31B1B']],0,100,90),{d:1.0,sfx:0}),
]},
// 27 · Hanafi
{from:161.34,to:165.86,zoom:.04,items:[
 I(161.4,'pop',Y('Hanafi scholars',110,110,56)),I(161.8,'pop',P('stricter',640,118,'#E31B1B',48)),
 I(163.4,'stamp',K('ONLY DURING',400,120,'#151515')),
 I(164.4,'stamp',K('HAJJ',560,200,'#C98A12')),
]},
// 28 · hardship vs inconvenience
{from:165.86,to:170.16,items:[
 I(165.9,'pop',SI('panic-plain',300,240,460)),I(166.3,'stamp',ST('GENUINE HARDSHIP ✓',140,780,'#1FA34A',-4,58)),
 I(168.4,'pop',SI('sit-bored',1260,240,460)),I(168.7,'stamp',ST('INCONVENIENCE ✕',1130,780,'#E31B1B',4,58)),
]},
// 29 · how does this work at school or work
{from:170.16,to:181.22,noAuditAfter:180.2,camTo:{at:180.2,scale:2.6,ox:275,oy:665},items:[
 I(170.2,'pop',PH('lecture-hall',110,110,380,250,'school')),I(171.4,'pop',PHbg('office',530,110,380,250,'work')),
 I(172.2,'wipe',L('how does this work?',970,170,72,'#151515')),I(174.0,'wipe',L('4 parts',1100,270,60)),
 I(175.8,'pop',PH('stopwatch',110,500,330,330)),I(176.0,'wipe',L('timing',190,850,60,'#151515')),
 I(176.6,'pop',PH('tap',560,500,330,330)),I(176.8,'wipe',L('wudu',660,850,60,'#151515')),
 I(177.4,'pop',PH('empty-classroom',1010,500,330,330)),I(177.6,'wipe',L('where you pray',1010,850,56,'#151515')),
 I(178.5,'pop',PH('alarm',1460,500,330,330)),I(178.7,'wipe',L('if it already passed',1400,850,52,'#151515')),
]},
// 30 · timing board
{from:181.22,to:192.4,items:[
 I(181.3,'pop',Y('Know your timing',110,80)),
 I(182.6,'wipe',bar(110,260,1700,[['CLASS',8,12,'#9AA0A6'],['LUNCH',12,13,'#2F80ED'],['CLASS',13,17,'#9AA0A6']],8,17,100),{d:.6,sfx:'marker'}),
 I(184.3,'pop',PH('lunch-tray',150,420,380,280,'12:30')),
 I(186.0,'pop',P('12:00–1:00',850,180,'#2F80ED',36)),
 I(187.6,'wipe',`<div class="a" data-k="icon" style="left:860px;top:400px;width:660px;height:60px;background:#1FA34A;border-radius:12px"></div>`),I(187.8,'wipe',L('Dhuhr window',960,470,52,'#1FA34A')),
 I(189.6,'fade',glowBox(866,252,184,116)),I(189.8,'pop',P('pray then ✓',1540,390,'#1FA34A',46),{sfx:'ding'}),
]},
// 31 · ask (office)
{from:192.4,to:195.9,zoom:.04,items:[
 I(0,'cut',bg('office')),
 I(192.4,'slideR',H('raise-hand',1180,330,700)),
 I(193.0,'pop',cloud('5 minutes<br>to pray?',600,180,480,280,52)),
 I(194.0,'stamp',P('✓',1000,520,'#1FA34A',90),{sfx:'ding'}),
]},
// 32 · five minutes
{from:195.9,to:201.26,items:[
 I(0,'cut',Y('Know your timing',110,80)+bar(110,260,1700,[['CLASS',8,12,'#9AA0A6'],['LUNCH',12,13,'#2F80ED'],['CLASS',13,17,'#9AA0A6']],8,17,100)+PH('lunch-tray',150,420,380,280,'12:30')+`<div class="a" data-k="icon" style="left:860px;top:400px;width:660px;height:60px;background:#1FA34A;border-radius:12px"></div>`+L('Dhuhr window',960,470,52,'#1FA34A')),
 I(195.9,'pop',PH('stopwatch',1500,560,300,400)),
 I(196.0,'pop',t=>{const s=Math.round(lerp(t,196.0,197.6,0,300));return L(t<197.7?`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`:'≈ 5 min',1100,640,90,'#151515')},{sfx:'tick'}),
 I(198.3,'wipe',L('&lt; a toilet break',1060,780,60)),
 I(199.7,'pop',P('literally',1060,880,'#151515',36)),
]},
// 33 · wudu
{from:201.26,to:224.04,zoom:.03,items:[
 I(201.3,'pop',Y('A simple trick',110,80)),
 I(202.6,'pop',PH('tap',110,200,320,420,'7:00 AM')),I(202.8,'slideR',H('wudu',470,190,440),{sfx:0}),
 I(205.0,'pop',P('wudu stays valid',900,220,'#1FA34A',46)),
 I(207.7,'wipe',L('until: toilet ✕',900,320,54)),I(208.6,'wipe',L('· sleep ✕',1300,320,54)),
 I(210.3,'wipe',L('make it at home',900,410,48,'#151515')),
 I(212.9,'stamp',over(ST('NO SINK NEEDED',96,540,'#E31B1B',-6,34))),
 I(215.7,'drop',khuff(1340,520,1),{sfx:'thud'}),I(215.9,'wipe',L('khuffs',1420,920,60,'#151515')),
 I(218.5,'pop',P('put on with wudu',1360,440,'#151515',36)),
 I(219.8,'wipe',over(AR('M1300,560 C1380,500 1500,500 1580,560','#2F80ED',9))),I(219.9,'wipe',L('wipe over',1060,560,56,'#2F80ED')),
 I(222.0,'pop',P('up to 24 hours',900,760,'#151515',48)),
]},
// 34 · where you pray
{from:224.04,to:239.0,items:[
 I(224.1,'pop',Y('Where you pray',110,80)),
 I(225.2,'pop',PH('wudu-fountain',110,200,360,240)),I(225.5,'pop',PH('pray-rug',500,200,240,240)),I(226.0,'pop',P('not required',300,460,'#9AA0A6',44)),
 I(227.4,'pop',globe(860,200,200),{spin:229.4}),I(227.6,'wipe',L('"the whole earth has been made a place of prayer"',1120,240,44,'#151515'),{d:1.2}),
 I(228.0,'fade',`<div class="ref" data-k="text" style="top:330px;left:1120px;right:auto;font-size:28px">Sahih al-Bukhari 335</div>`),
 I(230.9,'pop',P('any clean place ✓',1080,420,'#1FA34A',44)),
 I(233.3,'slideR',PH('empty-classroom',110,600,540,360,'classroom')),
 I(235.7,'slideR',PH('library-crop',690,600,540,360,'library')),
 I(237.0,'slideR',PHbg('office',1270,600,540,360,'office')),
]},
// 35 · standing, not in the car
{from:239.0,to:247.94,zoom:.03,items:[
 I(0,'cut',`<div class="a" data-k="bg" style="left:0;top:0;width:960px;height:1080px;background:url(${A}bg-car.png) 30% center/cover"></div><div class="a" data-k="bg" style="left:960px;top:0;width:960px;height:1080px;background:url(${A}bg-street.png) 60% center/cover"></div><div class="a" data-k="bg" style="left:954px;top:0;width:12px;height:1080px;background:#fff"></div>`),
 I(239.1,'pop',Y('obligatory prayer = standing',110,80,52)),
 I(240.4,'pop',P('fard',900,88,'#151515',40)),
 I(242.2,'pop',P("if you're able",110,170,'#151515',40)),
 I(243.9,'stamp',ST('SITTING INSIDE ✕',140,460,'#E31B1B',-6,60)),
 I(245.9,'slideR',H('pray-stand',1420,380,620)),I(246.1,'pop',P('standing, outside ✓',1160,240,'#1FA34A',50),{sfx:'ding'}),
]},
// 36 · qibla
{from:247.94,to:256.4,items:[
 I(248.0,'pop',Y('Qibla',110,80)),
 I(248.9,'pop',PH('compass',110,200,520,360)),
 I(249.9,'pop',PH('phone-hand',690,200,520,360)),
 I(251.6,'wipe',AR('M1400,760 L1700,620','#1FA34A',12)),I(252.0,'wipe',over(AR('M1400,760 L1690,700','#E8A92E',8)),{sfx:0}),I(252.3,'wipe',L('slightly off',1360,820,54,'#E8A92E')),
 I(254.3,'pop',P('still valid ✓',1300,260,'#1FA34A',54),{sfx:'ding'}),
]},
// 37 · qada
{from:256.4,to:268.16,items:[
 I(256.4,'pop',t=>{const mins=lerp(t,256.5,257.8,75,280);return clock(300,330,200,Math.floor(mins/60),mins%60,[15,40])},{sfx:'whoosh'}),
 I(258.2,'fade',bar(560,500,740,[['DHUHR',0,100,'#E31B1B']],0,100,70),{out:260.3}),
 I(260.5,'stamp',`<div class="kin" data-k="text" style="top:190px;font-size:190px;color:#151515;left:560px;right:auto;text-align:left">QADA</div>`),
 I(260.9,'wipe',L('= a make-up prayer',580,400,64,'#151515')),
 I(262.4,'pop',P('Hanafi ✓',110,640,'#1FA34A',48)),I(262.9,'pop',P('Maliki ✓',560,640,'#1FA34A',48)),I(263.4,'pop',P("Shafi'i ✓",980,640,'#1FA34A',48)),I(263.9,'pop',P('Hanbali ✓',1420,640,'#1FA34A',48)),
 I(265.0,'wipe',L('as soon as you can',520,800,60)),I(266.2,'wipe',L('· same rakah',1020,800,60)),
]},
// 38 · tawbah (calm)
{from:268.16,to:277.86,zoom:.03,items:[
 I(268.2,'wipe',L('missed on purpose',110,110,70)),
 I(270.3,'fade',t=>progress(110,330,1700,lerp(t,270.3,271.0,0,.5),lerp(t,272.6,273.3,0,.5))),
 I(270.5,'wipe',L('making it up',260,460,56,'#2F80ED')),
 I(271.1,'wipe',L('not the whole fix',700,230,52,'#151515')),
 I(272.8,'wipe',L('tawbah',1200,460,56,'#C98A12')),
 I(274.6,'fade',H('dua',800,520,440)),I(274.8,'wipe',L('sincerely asking Allah for forgiveness',470,980,50,'#151515')),
 I(276.2,'fade',`<div class="a" data-k="bg" style="left:720px;top:480px;width:600px;height:540px;border-radius:50%;background:radial-gradient(circle,rgba(242,183,5,.35),rgba(242,183,5,0) 70%)"></div>`),
]},
// 39 · the answer
{from:277.86,to:290.6,items:[
 I(277.9,'pop',Y('So, to answer the question',110,80)),
 I(279.7,'wipe',bar(110,260,1700,[['DHUHR',0,55,'#1FA34A'],['ASR',55,100,'#E8A92E']],0,100,110),{d:.5,sfx:'marker'}),
 I(279.9,'fade',t=>SI('walk1',lerp(t,279.9,280.7,200,700),400,240)),
 I(281.0,'pop',P('home before Asr ✓',140,440,'#1FA34A',44)),
 I(283.6,'slideR',PH('lecture-hall',110,680,520,320,'school')),
 I(285.0,'slideR',PHbg('office',690,680,520,320,'work')),
 I(287.0,'pop',over(P('✓',540,700,'#1FA34A',44))),I(287.2,'pop',over(P('✓',1120,700,'#1FA34A',44)),{sfx:0}),
 I(288.1,'pop',PH('stopwatch',1300,640,300,380)),I(288.3,'wipe',L('5 min',1640,760,90,'#151515')),
]},
];
