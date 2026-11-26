// ---------- ep6 full video, timed to audio/06-photo-poses.mp3 ----------
const lerp=(t,a,b,v0,v1)=>t<=a?v0:t>=b?v1:v0+(v1-v0)*(1-Math.pow(1-(t-a)/(b-a),3));
const over=(html)=>html.replace('data-k="','data-over="1" data-k="');
const I=(at,a,h,o={})=>({at,a,h,...o});
const whiteCap=(t)=>cap(t).replace('color:#111','color:#fff;text-shadow:0 4px 18px #000');
const q={sfx:0};
const HLB=(x,y,w,h,c='#FFE14D')=>`<div class="a" data-k="hl" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:10px solid ${c};border-radius:24px;box-shadow:0 0 24px ${c}"></div>`;
const SC=[
// 1 · hook: the statue (blurred, only the hand sharp)
{from:0,to:10.38,zoom:.04,ox:395,oy:560,items:[
 I(0,'fade',BG('baphomet-handonly.jpg',0,'25% center')),
 I(1.8,'fade',P('Satanic Temple statue',1200,140,'#151515',40)),
 I(4.1,'wipe',whiteCap('Look at the hand').replace('left:60px','left:160px').replace('width:1800px','width:1300px')),
 I(4.5,'fade',RING(395,560,175,'#E31B1B',10,330),{sfx:'thud'}),
 I(5.3,'wipe',L('two fingers up',610,300,60,'#fff')),
 I(7.2,'wipe',AR('M620,560 C820,520 1000,560 1160,700','#FFE14D',8)),
 I(8.0,'slideR',HAND('1-peace-palm-out.png',1180,640,560),q),
 I(9.3,'pop',L('= peace sign?',1260,480,80,'#FFE14D'),q),
]},
// 2 · selfie
{from:10.38,to:13.14,zoom:.06,ox:960,oy:200,items:[
 I(0,'cut',BG('7-selfie.png')),
 I(10.8,'fade',RING(532,690,140,'#FFE14D')),
 I(11.4,'wipe',L('the peace sign',280,880,60,'#FFE14D')),
 I(12.0,'pop',cloud('should we<br>stop?',1250,620,420,240,46),q),
]},
// 3 · the four poses
{from:13.14,to:19.66,items:[
 I(13.5,'pop',HAND('1-peace-palm-out.png',90,180,400,'peace'),q),I(14.1,'pop',HAND('4-devil-horns.png',530,180,400,'horns'),q),
 I(14.7,'pop',HAND('5-i-love-you.png',970,180,400,'"I love you"'),q),I(15.3,'pop',HAND('6-ok-sign.png',1410,180,400,'OK'),q),
 I(16.4,'pop',Y('where it comes from',300,640,54),q),I(18.0,'pop',Y('avoid it?',1100,640,54),q),
]},
// 4 · statue hand vs peace sign
{from:19.66,to:39.18,items:[
 I(19.7,'pop',Y('First, the peace sign',110,80),q),
 I(21.3,'pop',IM('baphomet-hand-crop.jpg',110,220,300,420),q),I(21.6,'wipe',L('statue',190,660,52,'#151515')),
 I(23.5,'pop',HAND('3-two-fingers-together.png',470,240,560,'pressed together'),q),I(24.4,'fade',RING(750,313,85)),
 I(25.6,'pop',HAND('1-peace-palm-out.png',1150,240,560,'spread apart','#1FA34A'),q),I(26.2,'fade',RING(1426,312,130,'#1FA34A')),
 I(27.2,'stamp',ST('NOT THE SAME',760,700,'#E31B1B',-6,64)),
 I(28.8,'wipe',L('old blessing gesture',220,880,52,'#151515')),
 I(30.6,'wipe',L('· church paintings',700,880,52,'#151515')),
 I(32.4,'wipe',L('· copied from a drawing',1100,880,52,'#151515')),
 I(34.6,'pop',P('1856',1700,960,'#151515',40),q),
 I(36.4,'wipe',L('↑ one hand up · ↓ one hand down',110,780,46,'#E31B1B')),
 I(38.4,'pop',P('the real peace sign ✓',1330,640,'#1FA34A',36),q),
]},
// 5 · the peace sign is different
{from:39.18,to:44.96,items:[
 I(39.2,'pop',HAND('1-peace-palm-out.png',510,120,900),q),
 I(41.0,'fade',RING(960,330,190,'#1FA34A')),
 I(41.8,'wipe',L('spread apart in a V',600,660,64,'#1FA34A')),
 I(43.4,'pop',P('palm facing out ✓',760,780,'#1FA34A',50),q),
]},
// 6 · 1941
{from:44.96,to:57.28,zoom:.05,ox:1100,oy:520,items:[
 I(0,'cut',BG('8-radio-1941.png')),
 I(45.1,'wipe',whiteCap('1941 · BBC radio')),
 I(46.6,'pop',P('a Belgian politician',700,160,'#151515',44),q),
 I(48.6,'pop',P('"use the letter V"',740,260,'#151515',44),q),
 I(50.9,'stamp',K('V = Victoire',380,130,'#FFE14D','text-shadow:0 6px 24px #000')),
 I(52.4,'pop',P('a sign of victory',760,560,'#1FA34A',44),q),
 I(54.0,'pop',P('Churchill made it famous',560,660,'#151515',50),q),
 I(55.8,'pop',P('→ later: the peace sign',580,780,'#1FA34A',50),q),
]},
// 7 · the fatwa
{from:57.28,to:65.3,zoom:.03,quiet:1,items:[
 I(57.4,'slideR',H('explain',1500,560,460)),
 I(58.2,'pop',Y('Islamic rulings say the same',110,80)),
 I(60.6,'rise',CARD('"V (Victory Sign) Has Nothing to Do with Satan"','Islamweb · Fatwa No. 398227')),
 I(62.8,'pop',P('not a devil sign ✓',240,640,'#1FA34A',50)),
 I(64.2,'fade',HLB(226,246,1468,330,'#1FA34A')),
]},
// 8 · the catch
{from:65.3,to:75.68,items:[
 I(65.4,'pop',Y('one catch',110,80),q),
 I(66.4,'pop',HAND('1-peace-palm-out.png',110,220,620,'palm out ✓','#1FA34A'),q),
 I(68.0,'pop',HAND('2-peace-back-of-hand.png',1190,220,620,'palm facing you'),q),
 I(69.4,'fade',HLB(1176,206,648,377,'#E31B1B')),
 I(70.6,'pop',P('UK',1190,820,'#151515',40),q),I(71.4,'pop',P('Australia',1330,820,'#151515',40),q),I(72.2,'pop',P('New Zealand',1590,820,'#151515',36),q),
 I(73.6,'stamp',ST('INSULT',820,620,'#E31B1B',-8,80)),
]},
// 9 · verdict: avoid
{from:75.68,to:94.24,items:[
 I(75.8,'pop',P('not a devil sign ✓',110,90,'#1FA34A',50),q),
 I(77.2,'pop',HAND('1-peace-palm-out.png',560,620,400),q),
 I(78.9,'slideL',H('point-up',120,560,460),q),
 I(80.3,'pop',P('but…',600,90,'#151515',50),q),
 I(81.9,'rise',CARD('"Leave what makes you doubt for what does not make you doubt."','Jami\' at-Tirmidhi 2518 · Sunan an-Nasa\'i 5711',230)),
 I(83.6,'fade',HLB(226,216,1468,330)),
 I(85.2,'pop',IM('baphomet-hand-crop.jpg',1000,600,150,210),q),
 I(86.6,'wipe',L('looks close to the statue',1180,610,44,'#151515')),
 I(88.0,'fade',RING(1075,705,95,'#E31B1B',8,125)),
 I(89.4,'wipe',L('can be an insult',1180,670,44,'#151515')),
 I(90.8,'pop',HAND('2-peace-back-of-hand.png',560,870,260),q),
 I(92.6,'stamp',ST('AVOID IT',1240,790,'#E31B1B',-8,80)),
]},
// 10 · devil horns
{from:94.24,to:108.06,items:[
 I(94.3,'pop',Y('Second, the devil horns',110,80),q),
 I(95.9,'pop',HAND('4-devil-horns.png',110,220,720),q),
 I(97.6,'fade',RING(476,427,85)),
 I(99.0,'wipe',L('thumb holds the fingers down',150,660,54)),
 I(101.3,'wipe',AR('M870,420 C960,360 1040,360 1110,420')),
 I(101.8,'pop',IM('10-italy-charm.png',1130,220,680,383,'70% center','Italy'),q),
 I(103.8,'wipe',L('a charm against the evil eye',1160,640,52,'#151515')),
 I(105.8,'wipe',L('to protect · or to curse',1200,720,48,'#E31B1B')),
]},
// 11 · concerts
{from:108.06,to:119.5,zoom:.06,ox:960,oy:420,items:[
 I(0,'cut',BG('9-concert.png')),
 I(108.2,'wipe',whiteCap('1980s · heavy metal concerts')),
 I(110.4,'pop',P('Ronnie James Dio',760,180,'#151515',46),q),
 I(112.4,'pop',P('made it famous',800,280,'#151515',44),q),
 I(114.4,'stamp',K('"THE DEVIL HORNS"',420,110,'#fff','text-shadow:0 6px 24px #000')),
 I(115.8,'pop',P('the nickname stuck',800,560,'#151515',40),q),
 I(117.0,'pop',P('also a gang sign',760,700,'#E31B1B',54),q),
]},
// 12 · verdict: avoid
{from:119.5,to:127.62,items:[
 I(119.6,'pop',HAND('4-devil-horns.png',660,120,600),q),
 I(121.2,'pop',P('evil eye superstition',110,580,'#E31B1B',48),q),I(122.6,'pop',P('the devil',780,580,'#E31B1B',48),q),I(123.4,'pop',P('a gang',1280,580,'#E31B1B',48),q),
 I(124.6,'wipe',L('nothing good in it for a Muslim',560,680,56,'#151515')),
 I(126.4,'stamp',ST('AVOID IT',720,800,'#E31B1B',-6,90)),
]},
// 13 · "I love you"
{from:127.62,to:151.18,items:[
 I(127.7,'pop',Y('Third, the "I love you" sign',110,80),q),
 I(129.5,'pop',HAND('4-devil-horns.png',110,220,780,'thumb in ✕'),q),
 I(130.6,'slideR',HAND('5-i-love-you.png',1030,220,780,'thumb out ✓','#1FA34A'),q),
 I(132.0,'fade',RING(506,444,90)),I(132.8,'fade',RING(1282,425,90,'#1FA34A')),
 I(134.6,'wipe',L('index · pinky · thumb',1100,760,44,'#151515')),
 I(136.8,'wipe',L('American Sign Language',1100,950,46,'#151515')),
 I(139.0,'pop',P('I + L + Y = I love you',1080,840,'#1FA34A',48),q),
 I(140.8,'fade',HLB(1066,826,560,96,'#1FA34A')),
  I(142.4,'wipe',L('nothing to do with the horns',110,760,50,'#1FA34A')),
 I(145.2,'wipe',L('make sure your thumb is out',110,840,50,'#E31B1B')),
 I(143.8,'pop',P('fine to use ✓',620,920,'#1FA34A',40),q),
 I(147.4,'pop',P('the only difference',110,920,'#151515',40),q),
 I(149.2,'pop',P('✓',1720,760,'#1FA34A',44),q),
]},
// 14 · OK sign
{from:151.18,to:178.16,items:[
 I(151.3,'pop',Y('Fourth, the OK sign',110,80),q),
 I(153.3,'pop',HAND('6-ok-sign.png',110,220,640),q),
 I(154.8,'pop',P('= OK ✓',820,240,'#1FA34A',58),q),
 I(156.4,'wipe',L('2017: an online hoax',820,350,58)),
 I(158.6,'wipe',L('a fake "secret meaning"',820,430,46,'#151515')),
 I(160.2,'stamp',ST('HOAX',1500,330,'#E31B1B',-8,56)),
 I(162.0,'wipe',L('later used by some extremists',820,500,46,'#151515')),
 I(164.6,'wipe',L('even flashed in court after the Christchurch attack',820,560,38,'#151515')),
 I(167.2,'pop',P('listed by the ADL in 2019',1300,240,'#151515',36),q),
 I(169.3,'pop',P('normal use ✓',820,640,'#1FA34A',50),q),
 I(171.3,'wipe',L('be careful how and where',820,720,44,'#151515')),
 I(173.4,'pop',P('upside-down joke ✕',820,790,'#E31B1B',50),q),
 I(176.6,'fade',HLB(806,776,568,112,'#E31B1B')),
 I(175.0,'pop',P('avoid this one',1400,790,'#151515',40),q),
]},
// 15 · why it matters
{from:178.16,to:197.52,zoom:.03,quiet:1,items:[
 I(178.3,'slideR',H('explain',1500,700,360)),
 I(178.6,'pop',Y('why does it matter?',110,40,46)),
 I(180.1,'rise',CARD('"Whoever imitates a people is one of them."','Sunan Abi Dawud 4031',120)),
 I(181.8,'fade',HLB(226,106,1468,300)),
 I(183.0,'wipe',L('imitating = copying what makes them who they are',150,450,46,'#151515')),
 I(184.9,'pop',P('one of them',1250,545,'#151515',36)),
 I(186.6,'pop',P('special to their religion or identity → avoid',150,560,'#E31B1B',48)),
 I(188.6,'pop',P('beliefs',1040,440,'#E31B1B',40)),I(190.0,'pop',P('identity',1250,440,'#E31B1B',40)),
 I(191.6,'pop',P('everything else → fine',150,680,'#1FA34A',48)),
 I(196.0,'pop',P('know the difference',150,900,'#151515',40)),
 I(194.4,'wipe',L('some are a problem · some aren\'t',150,800,54,'#151515')),
]},
// 16 · intentions
{from:197.52,to:210.0,zoom:.03,quiet:1,items:[
 I(197.6,'rise',CARD('"Actions are judged by intentions."','Sahih al-Bukhari 1',120)),
 I(199.8,'pop',IM('7-selfie.png',220,520,560,315),{gray:201.3}),
 I(201.6,'wipe',L('most people have no idea',900,560,56,'#151515')),
 I(203.8,'pop',P('no judging old photos ✓',260,880,'#1FA34A',44)),
 I(205.2,'fade',HLB(214,514,572,327,'#1FA34A')),
 I(206.6,'wipe',L('now you know',900,660,60,'#1FA34A')),
 I(208.2,'wipe',L('what your hands are saying',900,750,56,'#151515')),
]},
// 17 · ending
{from:210.0,to:217.9,zoom:.04,ox:640,oy:400,items:[
 I(0,'cut',BG('11-park-photo.png')),
 I(211.6,'pop',HAND('4-devil-horns.png',60,600,360),q),I(212.0,'stamp',ST('✕',440,660,'#E31B1B',0,60)),
 I(213.0,'pop',HAND('1-peace-palm-out.png',60,810,360),q),I(213.4,'stamp',ST('✕',440,870,'#E31B1B',0,60),q),
 I(216.0,'pop',P('you look good without them ✓',760,940,'#1FA34A',44),q),
 I(214.8,'wipe',whiteCap("you don't need them").replace('left:60px','left:660px').replace('width:1800px','width:1200px')),
]},
];
const TMAP=[[0,0],[1000,1000]];const VO_PARTS=[['vo.mp3',0]];const VO_TOTAL=217.08;
