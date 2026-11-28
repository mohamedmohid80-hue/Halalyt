// ---------- ep8 scenes: written on the estimated clock; W('phrase') = estimated time that phrase is spoken ----------
const lerp=(t,a,b,v0,v1)=>t<=a?v0:t>=b?v1:v0+(v1-v0)*(1-Math.pow(1-(t-a)/(b-a),3));
const I=(at,a,h,o={})=>({at,a,h,...o});
const W=(ph,off=0)=>{const i=SCRIPT.indexOf(ph);if(i<0)throw new Error('phrase not found: '+ph);return SCRIPT.slice(0,i).split(/\s+/).filter(Boolean).length/190*60+off;};
const fmt=n=>Math.round(n).toLocaleString('en-US');
const CNT=(to,a,b,x,y,size=170,c='#E8A92E',suf='')=>t=>BIG(fmt(lerp(t,a,b,0,to))+suf,x,y,size,c);
const q={sfx:0};
const IMGF=(f,x,y,w,h)=>`<div class="photo" data-k="photo" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background-image:url(${A}img/${f}.jpg)"></div>`;
const STRIKE=(x,y,w)=>`<div class="a" data-k="bg" style="left:${x}px;top:${y}px;width:${w}px;height:8px;background:#E31B1B;border-radius:4px"></div>`;
const JROW=(x,y,n,h)=>`<div class="a" data-k="hadi" style="left:${x}px;top:${y}px;display:flex;gap:6px">${Array.from({length:n}).map(()=>`<img src="${A}hadi/pray-stand.svg" style="height:${h}px">`).join('')}</div>`;

const SC=[
// 1 · the question
{from:0,to:W('A thousand. Every day.'),zoom:.04,items:[
 I(W('The Prophet'),'rise',CARD('Is any one of you unable to earn <span style="color:#E8A92E">a thousand good deeds</span> every day?',260,150,1400),{idle:'glow'}),
 I(W('once asked'),'fade',REF('Sahih Muslim 2698',830,420)),
 I(W('his Companions'),'slideL',H('hadi-think',150,640,400),{idle:'bob'}),
 I(W('a thousand good deeds every day?'),'pop',Y('a thousand?',1180,700,56),q),
 I(W('every day?'),'wipe',L('every single day',1180,820,56)),
]},
// 2 · a thousand, every day
{from:W('A thousand. Every day.'),to:W('Just doing seven'),zoom:.03,items:[
 I(W('A thousand. Every day.'),'fade',CNT(1000,W('A thousand. Every day.'),W('A thousand. Every day.',0.9),700,200),{idle:'pulse'}),
 I(W('Every day. And he'),'stamp',P('EVERY DAY',760,480,'#151515',60)),
 I(W('something hard.'),'wipe',L('not something hard ✓',680,640,70,'#1FA34A'),{idle:'pulse'}),
]},
// 3 · seven simple acts
{from:W('Just doing seven'),to:W('First, you need'),items:[
 I(W('Just doing seven'),'pop',Y('7 simple acts',110,80,56),q),
 ...[0,1,2,3,4,5,6].map(i=>I(W('seven simple acts',0.15+i*0.2),'pop',N(i+1,600+i*110,92),{sfx:0,idle:i===6?'pulse':undefined})),
 I(W('can earn you'),'wipe',AR('M1370,120 C1440,120 1490,180 1500,240')),
 I(W('thousands of good deeds'),'pop',BIG('1,000s',1300,250,120),{sfx:0,idle:'pulse'}),
 I(W('thousands of good deeds',0.5),'wipe',L('of good deeds',1320,400,56,'#151515')),
 I(W("And it's not only"),'pop',P('not only good deeds…',110,300,'#9AA0A6',44),q),
 I(W('raises your status'),'wipe',STAIRS(110,460)),I(W('raises your status',0.4),'wipe',L('status raised',110,680,56,'#2F80ED')),
 I(W('wipes away your sins'),'fade',`<div class="lbl" data-k="text" style="left:560px;top:500px;font-size:52px;color:#999;line-height:1.3">sin<br>sin<br>sin</div>`),
 I(W('wipes away your sins',0.35),'wipe',STRIKE(550,540,110)),I(W('wipes away your sins',0.55),'wipe',STRIKE(550,608,110),q),I(W('wipes away your sins',0.75),'wipe',STRIKE(550,676,110),q),
 I(W('your sins,',0.4),'wipe',L('sins wiped',540,740,56)),
 I(W('a better Muslim'),'slideR',H('celebrate',960,470,440),{sfx:0,idle:'bob'}),
 I(W('a better Muslim',0.4),'pop',P('a better Muslim ✓',1300,620,'#1FA34A',52),q),
 I(W('one small habit'),'pop',L('one small habit at a time',1310,705,40,'#151515'),q),
 I(W('authentic hadith.'),'stamp',ST('AUTHENTIC HADITH',1330,790,'#1E7B4F',-6,46)),
]},
// 4 · how good deeds are counted
{from:W('First, you need'),to:W('Number one.'),items:[
 I(W('First, you need'),'pop',Y('how good deeds are counted',110,80,52),q),
 I(W('when you do a good deed'),'pop',BOX('1 deed',160,360,70),{sfx:0,idle:'pulse'}),
 I(W('writes it down as ten'),'wipe',AR('M540,430 C595,385 650,385 705,425')),
 I(W('as ten,'),'stamp',BIG('×10',770,330,170,'#1FA34A')),I(W('as ten,',0.5),'wipe',L('written as ten',790,560,52,'#1FA34A')),
 I(W('multiply it up'),'wipe',AR('M1110,430 C1170,380 1230,380 1290,430')),
 I(W('seven hundred times'),'stamp',BIG('×700',1320,330),{idle:'glow'}),
 I(W('and even more.'),'wipe',L('…and even more',1420,560,60,'#151515')),
 I(W('So no good deed'),'slideL',H('point-up',150,620,400),{sfx:0,idle:'bob'}),
 I(W('ever just one.'),'pop',P('never just one',540,760,'#E31B1B',52),q),
 I(W('The Prophet, sallallahu alayhi wa sallam, said that when'),'fade',REF('Sahih al-Bukhari 6491 · Sahih Muslim 131',1180,950)),
]},
// 5 · #1 SubhanAllah
{from:W('Number one.'),to:W('Number two.'),items:[
 I(W('Number one.'),'pop',N(1,60,86),q),I(W('SubhanAllah, one hundred'),'pop',Y('SubhanAllah ×100',130,80,56),q),
 I(W('This is the answer'),'wipe',L('the answer to his question',110,190,52,'#151515')),
 I(W('to his own question'),'slideL',H('point-up',1500,560,380),{sfx:0,idle:'bob'}),
 I(W('glorify Allah one hundred'),'fade',t=>TASBIH(150,300,150,Math.floor(lerp(t,W('glorify Allah one hundred'),W('a thousand good deeds will'),0,33)))),
 I(W('glorify Allah one hundred'),'fade',CNT(100,W('glorify Allah one hundred'),W('a thousand good deeds will'),230,760,90,'#151515')),
 I(W('a thousand good deeds will'),'wipe',AR('M560,500 C660,430 760,430 860,490')),
 I(W('a thousand good deeds will',0.2),'fade',CNT(1000,W('a thousand good deeds will',0.2),W('a thousand good deeds will',1.2),900,380),{idle:'pulse'}),
 I(W('written for you'),'wipe',L('good deeds',940,590,60,'#151515')),
 I(W('or a thousand sins'),'pop',P('or 1,000 sins wiped',940,690,'#E31B1B',46),q),
 I(W('One hundred SubhanAllah takes'),'pop',P('100 × SubhanAllah',1450,90,'#151515',40),q),
 I(W('takes about two minutes'),'pop',`<div class="lbl" data-k="text" style="left:1450px;top:180px;font:900 64px Poppins;color:#2F80ED">≈ 2 min</div>`,q),
 I(W("That's a thousand good deeds in two"),'pop',P('1,000 in 2 min',1450,300,'#1FA34A',44),{sfx:0,idle:'pulse'}),
 I(W('glorify Allah one hundred'),'fade',REF('Sahih Muslim 2698',1530,950)),
]},
// 6 · #2 salawat
{from:W('Number two.'),to:W('So one salawat'),items:[
 I(W('Number two.'),'pop',N(2,60,86),q),I(W('Sending salawat'),'pop',Y('Salawat on the Prophet ﷺ',130,80,56),q),
 I(W('whoever sends one salah'),'rise',CARD('Send <span style="color:#1FA34A">1</span> salawat →',110,240,700,64)),
 I(W('ten blessings'),'pop',BIG('10',230,440,130,'#1FA34A'),q),I(W('ten blessings',0.3),'wipe',L('blessings',220,640,52,'#151515')),
 I(W('ten of his sins'),'pop',BIG('10',620,440,130,'#E31B1B'),q),I(W('ten of his sins',0.3),'wipe',L('sins wiped',590,640,52,'#151515')),
 I(W('raises him ten levels'),'pop',BIG('10',1010,440,130,'#2F80ED'),q),I(W('raises him ten levels',0.3),'wipe',L('levels raised',960,640,52,'#151515')),
 I(W('raises him ten levels',0.6),'wipe',STAIRS(1360,430),{idle:'bob'}),
 I(W('ten good deeds are written'),'pop',P('+ 10 good deeds',1360,700,'#E8A92E',50),{sfx:0,idle:'pulse'}),
 I(W('whoever sends one salah'),'fade',REF('Sunan an-Nasa\'i 1297 · Sahih Muslim 408',1110,950)),
]},
// 7 · ×100
{from:W('So one salawat'),to:W('Number three.'),items:[
 I(W('So one salawat'),'pop',BOX('1 = 10',160,160,70),{sfx:0,idle:'pulse'}),
 I(W('is ten good deeds'),'wipe',L('1 salawat = 10 good deeds',160,350,50,'#1FA34A')),
 I(W('Say it one hundred'),'wipe',AR('M560,230 C640,170 720,170 800,230')),I(W('Say it one hundred',0.3),'stamp',BIG('×100',840,130,150,'#151515')),
 I(W("that's a thousand good deeds, a thousand sins"),'fade',CNT(1000,W("that's a thousand good deeds, a thousand sins"),W("that's a thousand good deeds, a thousand sins",0.9),140,440,120),{idle:'pulse'}),
 I(W("that's a thousand good deeds, a thousand sins",0.3),'wipe',L('good deeds',180,600,52,'#151515')),
 I(W('a thousand sins wiped'),'fade',CNT(1000,W('a thousand sins wiped'),W('a thousand sins wiped',0.9),720,440,120,'#E31B1B')),
 I(W('a thousand sins wiped',0.3),'wipe',L('sins wiped',760,600,52,'#151515')),
 I(W('a thousand levels'),'fade',CNT(1000,W('a thousand levels'),W('a thousand levels',0.9),1300,440,120,'#2F80ED')),
 I(W('a thousand levels',0.3),'wipe',L('levels raised',1310,600,52,'#151515')),
 I(W('Allahumma salli'),'fade',`<div class="lbl ar" data-k="text" style="left:560px;top:720px;font-size:84px;color:#1E7B4F">اللهم صل على محمد</div>`,{idle:'glow'}),
 I(W('about three minutes'),'pop',`<div class="lbl" data-k="text" style="left:1450px;top:160px;font:900 64px Poppins;color:#2F80ED">≈ 3 min</div>`,q),
]},
// 8 · #3 every letter
{from:W('Number three.'),to:W('Surah al-Fatihah has'),items:[
 I(W('Number three.'),'pop',N(3,60,86),q),I(W('Reading the Quran'),'pop',Y('Every letter of the Quran',130,80,56),q),
 I(W('letter by letter.'),'wipe',L('letter by letter',920,90,52,'#151515')),
 I(W('every letter you read'),'pop',BOX('1 letter',160,260,64),q),
 I(W('from the Book of Allah'),'pop',P('= 1 good deed',160,450,'#1FA34A',44),q),
 I(W('multiplied by ten'),'wipe',AR('M500,320 C555,275 610,275 665,315')),I(W('multiplied by ten',0.3),'stamp',BIG('×10',730,230,150,'#1FA34A')),
 I(W("I'm not saying"),'pop',L('not one letter…',1150,300,56,'#151515'),q),
 I(W('Alif is a letter'),'pop',`<div class="lbl ar" data-k="text" style="left:1300px;top:560px;font-size:180px;color:#151515">ا</div>`,{sfx:0,idle:'glow'}),I(W('Alif is a letter',0.3),'pop',P('+10',1450,600,'#1FA34A',46),q),
 I(W('Lam is a letter'),'pop',`<div class="lbl ar" data-k="text" style="left:800px;top:560px;font-size:180px;color:#151515">ل</div>`,{sfx:0,idle:'glow'}),I(W('Lam is a letter',0.3),'pop',P('+10',920,600,'#1FA34A',46),q),
 I(W('Mim is a letter'),'pop',`<div class="lbl ar" data-k="text" style="left:300px;top:560px;font-size:180px;color:#151515">م</div>`,{sfx:0,idle:'glow'}),I(W('Mim is a letter',0.3),'pop',P('+10',440,600,'#1FA34A',46),q),
 I(W('every letter you read'),'fade',REF('Jami\' at-Tirmidhi 2910',1500,950)),
]},
// 9 · al-Fatihah ×17
{from:W('Surah al-Fatihah has'),to:W('And if you read just one page'),zoom:.04,items:[
 I(W('Surah al-Fatihah has'),'fade',IMGF('1-prayer',110,140,820,500),{idle:'zoom'}),
 I(W('more than a hundred letters'),'pop',BIG('100+',1000,140,130,'#151515'),q),I(W('more than a hundred letters',0.4),'wipe',L('letters',1340,200,56,'#151515')),
 I(W('more than a thousand good deeds. You'),'pop',BIG('1,000+',1000,330,130),q),I(W('more than a thousand good deeds. You',0.4),'wipe',L('per Fatihah',1460,390,48,'#151515')),
 I(W('seventeen times a day'),'pop',P('× 17 rakah a day',1000,560,'#151515',50),q),
 I(W('fard prayers alone'),'pop',L('fard prayers alone',1460,570,44,'#151515'),q),
 I(W('more than seventeen thousand'),'fade',CNT(17000,W('more than seventeen thousand'),W('more than seventeen thousand',1.6),980,680,150,'#E8A92E','+'),{idle:'pulse'}),
 I(W('without adding anything new'),'pop',P('nothing new to add ✓',110,700,'#1FA34A',46),q),
]},
// 10 · one page a day
{from:W('And if you read just one page'),to:W('Number four.'),zoom:.06,items:[
 I(W('And if you read just one page'),'fade',IMGF('2-mushaf',260,120,1400,620)),
 I(W("that's thousands more"),'pop',P('1 page a day = thousands more',600,800,'#1FA34A',54),{sfx:0,idle:'pulse'}),
]},
// 11 · #4 al-Ikhlas
{from:W('Number four.'),to:W('Number five.'),items:[
 I(W('Number four.'),'pop',N(4,60,86),q),I(W('Surah al-Ikhlas.'),'pop',Y('Surah al-Ikhlas',130,80,56),q),
 I(W('Surah al-Ikhlas.',0.6),'slideR',H('hadi-think',1550,560,360),{sfx:0,idle:'bob'}),
 I(W('Qul huwallahu ahad'),'fade',`<div class="lbl ar" data-k="text" style="left:150px;top:230px;font-size:90px;color:#1E7B4F">قُلْ هُوَ اللَّهُ أَحَدٌ</div>`,{idle:'glow'}),
 I(W('equal to a third'),'fade',t=>PIE(1100,180,200,t<W('Read it three times')?1:Math.min(3,1+Math.floor((t-W('Read it three times'))/0.5)))),
 I(W('equal to a third',0.3),'wipe',L('= ⅓ of the Quran',170,380,64)),
 I(W('four short ayat'),'pop',L('4 short ayat',560,500,52,'#151515'),q),
 I(W('about ten seconds'),'wipe',L('≈ 10 s',170,500,60,'#2F80ED')),
 I(W('Read it three times'),'stamp',P('× 3',1170,640,'#151515',60)),
 I(W('reward of the whole Quran'),'wipe',L('= the whole Quran',1050,760,64,'#1FA34A')),
 I(W('Thirty seconds a day'),'pop',P('30 seconds a day',170,640,'#1FA34A',50),{sfx:0,idle:'pulse'}),
 I(W('Surah al-Ikhlas.',1.4),'fade',REF('Sahih al-Bukhari 5013 · Sahih Muslim 811',1110,950)),
]},
// 12 · #5 la ilaha illallah
{from:W('Number five.'),to:W('Number six.'),items:[
 I(W('Number five.'),'pop',N(5,60,86),q),I(W('One sentence, one hundred'),'pop',Y('One sentence ×100',130,80,56),q),
 I(W('la ilaha illallah'),'rise',CARD('<span class="ar" style="font-size:54px">لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير</span>',160,200,1600,50),{idle:'glow'}),
 I(W('The Prophet said that whoever says'),'slideR',H('point-up',1560,560,330),{sfx:0,idle:'bob'}),
 I(W('la ilaha illallah,'),'wipe',L('La ilaha illallah',160,365,34,'#151515')),
 I(W('wahdahu la sharika'),'wipe',L('wahdahu la sharika lah',520,365,34,'#151515')),
 I(W('lahul mulku'),'wipe',L('lahul mulku wa lahul hamd',950,365,34,'#151515')),
 I(W('wa huwa ala'),'wipe',L('wa huwa ala kulli shayin qadir',1380,365,34,'#151515')),
 I(W('one hundred times in a day'),'stamp',P('× 100',820,430,'#151515',50)),
 I(W('freeing ten slaves'),'pop',P('freeing 10 slaves',110,565,'#8E44AD',48),q),
 I(W('one hundred good deeds are'),'pop',BIG('100',600,525,110),q),I(W('one hundred good deeds are',0.3),'wipe',L('good deeds',800,565,52,'#151515')),
 I(W('one hundred sins'),'pop',BIG('100',1160,525,110,'#E31B1B'),q),I(W('one hundred sins',0.3),'wipe',L('sins wiped',1360,565,52,'#151515')),
 I(W('protected from Shaytan'),'pop',SHIELD(160,680),{sfx:0,idle:'pulse'}),I(W('protected from Shaytan',0.3),'wipe',L('protected from Shaytan all day',360,740,56,'#2F80ED')),
 I(W('la ilaha illallah'),'fade',REF('Sahih al-Bukhari 3293 · Sahih Muslim 2691',1110,950)),
]},
// 13 · #6 jamaah
{from:W('Number six.'),to:W('Two prayers you already'),items:[
 I(W('Number six.'),'pop',N(6,60,86),q),I(W('Fajr and Isha in congregation'),'pop',Y('Fajr & Isha in jamaah',130,80,56),q),
 I(W('twenty seven times'),'pop',H('pray-stand',150,240,300),q),I(W('than praying alone'),'wipe',L('alone',190,560,52,'#151515')),
 I(W('Praying with the jamaah'),'slideR',JROW(600,240,4,260),{sfx:0,idle:'bob'}),
 I(W('twenty seven times'),'stamp',BIG('×27',1500,240,150,'#1FA34A')),
 I(W('two prayers have something extra'),'pop',P('2 prayers have something extra',600,560,'#E8A92E',40),q),
 I(W('whoever prays Isha'),'wipe',L('Isha',150,690,56,'#151515')),I(W('whoever prays Isha'),'fade',t=>NIGHT(330,670,600,lerp(t,W('whoever prays Isha'),W('half the night',0.6),0,.5))),
 I(W('half the night'),'wipe',L('= half the night',960,690,56,'#E8A92E')),
 I(W('whoever prays Fajr'),'wipe',L('+ Fajr',150,830,56,'#151515')),I(W('whoever prays Fajr'),'fade',t=>NIGHT(330,810,600,lerp(t,W('whoever prays Fajr'),W('the whole night.',0.6),0,1))),
 I(W('the whole night.'),'wipe',L('= the whole night',960,830,56,'#1FA34A'),{idle:'pulse'}),
 I(W('whoever prays Isha'),'fade',REF('Sahih Muslim 656',1600,950)),
]},
// 14 · Fajr image
{from:W('Two prayers you already'),to:W('Number seven.'),zoom:.06,items:[
 I(W('Two prayers you already'),'fade',IMGF('3-jamaah',260,120,1400,620)),
 I(W('the reward of standing'),'pop',P('2 prayers = a whole night of prayer',520,800,'#1FA34A',54),{sfx:0,idle:'pulse'}),
]},
// 15 · #7 walking
{from:W('Number seven.'),to:W('The average walk'),items:[
 I(W('Number seven.'),'pop',N(7,60,86),q),I(W('Walking to the masjid.'),'pop',Y('Walking to the masjid',130,80,56),q),
 I(W('when you make wudu'),'fade',IMGF('4-walking',110,200,820,480),{idle:'zoom'}),
 I(W('every step you take'),'fade',t=>STEPS(1000,300,Math.max(1,Math.min(6,1+Math.floor((t-W('every step you take'))/0.45))))),
 I(W('wipes away a sin, and'),'pop',P('− 1 sin',1000,500,'#E31B1B',44),q),
 I(W('raises you a level'),'pop',P('+ 1 level',1260,500,'#2F80ED',44),q),
 I(W('Every single step.'),'wipe',L('every single step',1050,640,60,'#151515'),{idle:'pulse'}),
 I(W('when you make wudu'),'fade',REF('Sahih Muslim 666',1600,950)),
]},
// 16 · hundreds of steps
{from:W('The average walk'),to:W("So let's add up"),items:[
 I(W('The average walk'),'fade',t=>STEPS(160,200,Math.max(1,Math.min(8,1+Math.floor((t-W('The average walk'))/0.3))))),
 I(W('hundreds of steps'),'fade',CNT(500,W('hundreds of steps'),W('hundreds of steps',1.2),600,400,150,'#151515')),
 I(W('hundreds of steps',0.4),'wipe',L('steps',960,460,60,'#151515')),
 I(W('the further you live'),'wipe',AR('M1120,520 C1180,470 1240,470 1310,510')),
 I(W('the more you earn'),'pop',P('further = more',1360,440,'#2F80ED',50),{sfx:0,idle:'pulse'}),
 I(W('the more you earn',0.3),'wipe',L('500 sins wiped · 500 levels',600,640,52,'#1FA34A')),
]},
// 17 · a normal day
{from:W("So let's add up"),to:W("That's close to twenty"),zoom:.03,oy:300,items:[
 I(W("So let's add up"),'pop',Y('a normal day',110,60,56),q),
 I(W('One hundred SubhanAllah, a'),'wipe',L('SubhanAllah ×100',150,180,52,'#151515')),I(W('a thousand good deeds. One'),'pop',L('1,000',1100,180,52,'#E8A92E'),q),
 I(W('One hundred salawat'),'wipe',L('Salawat ×100',150,260,52,'#151515')),I(W('another thousand'),'pop',L('1,000',1100,260,52,'#E8A92E'),q),
 I(W('Al-Fatihah in your prayers'),'wipe',L('Al-Fatihah ×17',150,340,52,'#151515')),I(W('more than seventeen thousand.'),'pop',L('17,000+',1100,340,52,'#E8A92E'),q),
 I(W('Al-Ikhlas three times'),'wipe',L('Al-Ikhlas ×3',150,420,52,'#151515')),I(W('the reward of a whole Quran'),'pop',L('a whole Quran',1100,420,52,'#1FA34A'),q),
 I(W('One hundred la ilaha'),'wipe',L('La ilaha illallah ×100',150,500,52,'#151515')),I(W('One hundred la ilaha',1.0),'pop',L('100',1100,500,52,'#E8A92E'),q),
 I(W('Fajr and Isha with'),'wipe',L('Fajr + Isha in jamaah',150,580,52,'#151515')),I(W('a whole night of prayer'),'pop',L('a whole night',1100,580,52,'#1FA34A'),q),
 I(W('And every step'),'wipe',L('Every step',150,660,52,'#151515')),I(W('on the way.'),'pop',L('a sin wiped each',1100,660,52,'#1FA34A'),q),
 I(W('on the way.',0.4),'wipe',`<div class="a" data-k="icon" style="left:140px;top:750px;width:1500px;height:8px;background:#151515"></div>`),
 I(W('on the way.',0.6),'wipe',L('Total',150,800,64,'#151515')),
 I(W('One hundred SubhanAllah, a'),'fade',t=>BIG('≈ '+fmt(t<W('a thousand good deeds. One')?0:t<W('another thousand')?1000:t<W('more than seventeen thousand.')?2000:lerp(t,W('more than seventeen thousand.'),W('more than seventeen thousand.',1.2),2000,19000))+(t>=W('more than seventeen thousand.',1.2)?'+':''),1000,775,110),{idle:'pulse'}),
]},
// 18 · ≈ 20,000
{from:W("That's close to twenty"),to:W('So, is any one of us'),items:[
 I(W("That's close to twenty"),'fade',CNT(20000,W("That's close to twenty"),W("That's close to twenty",1.4),520,160,170,'#E8A92E'),{idle:'pulse'}),
 I(W('good deeds a day, before'),'wipe',L('good deeds a day',700,400,64,'#151515')),
 I(W('before even counting'),'pop',P('+ steps + a night of prayer',1250,420,'#9AA0A6',36),q),
 I(W('less than fifteen minutes'),'pop',CLOCK15(300,560),{sfx:0,idle:'pulse'}),I(W('less than fifteen minutes',0.3),'wipe',L('< 15 minutes',620,640,72,'#1FA34A')),
 I(W("or you're already doing it"),'slideR',H('celebrate',1450,520,440),{sfx:0,idle:'bob'}),
 I(W("or you're already doing it",0.4),'pop',P('already doing it ✓',620,780,'#1FA34A',44),q),
]},
// 19 · ending
{from:W('So, is any one of us'),to:W('So, is any one of us',5.2),zoom:.04,items:[
 I(W('So, is any one of us'),'rise',CARD('Is any one of us unable to earn <span style="color:#E8A92E">a thousand good deeds</span> every day?',260,260,1400),{idle:'glow'}),
 I(W('unable to earn'),'slideL',H('point-up',150,600,380),{sfx:0,idle:'bob'}),
 I(W('So, is any one of us',2.4),'pop',Y('every day?',1180,700,56),{sfx:0,idle:'pulse'}),
]},
];
