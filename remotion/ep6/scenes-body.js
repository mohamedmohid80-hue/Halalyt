// ---------- ep6 preview (first ~37 s, estimated timing until the voiceover is recorded) ----------
const lerp=(t,a,b,v0,v1)=>t<=a?v0:t>=b?v1:v0+(v1-v0)*(1-Math.pow(1-(t-a)/(b-a),3));
const over=(html)=>html.replace('data-k="','data-over="1" data-k="');
const SUB=(t)=>`<div class="a" data-k="bg" style="left:0;right:0;bottom:30px;text-align:center"><span style="font:800 36px Nunito;color:#fff;background:rgba(0,0,0,.72);padding:8px 22px;border-radius:10px">${t}</span></div>`;
const I=(at,a,h,o={})=>({at,a,h,...o});
const subs=(list)=>list.map(([a,b,t])=>I(a,'cut',SUB(t),{out:b,sfx:0}));
const whiteCap=(t)=>cap(t).replace('color:#111','color:#fff;text-shadow:0 4px 18px #000');
const SC=[
{from:0,to:10,zoom:.04,ox:395,oy:560,items:[
 I(0,'fade',BG('baphomet-handonly.jpg',0,'25% center')),
 I(1.3,'fade',P('Satanic Temple statue',1200,140,'#151515',40)),
 I(2.6,'wipe',whiteCap('Look at the hand').replace('left:60px','left:160px').replace('width:1800px','width:1300px')),
 I(3.4,'fade',RING(395,560,175,'#E31B1B',10,330),{sfx:'thud'}),
 I(4.7,'wipe',L('two fingers up',610,300,60,'#fff')),
 I(6.0,'slideR',HAND('1-peace-palm-out.png',1180,640,560),{sfx:0}),
 I(7.2,'wipe',AR('M620,560 C820,520 1000,560 1160,700','#FFE14D',8)),
 I(8.2,'pop',L('= peace sign?',1260,480,80,'#FFE14D'),{sfx:0}),
 ...subs([[0,3.4,'This is a statue of Baphomet, made by the Satanic Temple.'],[3.4,6.0,'Look at its hand. Two fingers up.'],[6.0,10,'A lot of people say this is where the peace sign comes from.']]),
]},
{from:10,to:14.5,zoom:.08,ox:960,oy:200,items:[
 I(0,'cut',BG('7-selfie.png')),
 I(10.8,'fade',RING(532,690,140,'#FFE14D')),
 I(11.6,'wipe',L('the peace sign',280,880,60,'#FFE14D')),
 I(12.0,'pop',cloud('should we<br>stop?',1250,620,420,240,46),{sfx:0}),
 I(13.2,'pop',P('everyone does it',1250,940,'#151515',40),{sfx:0}),
 ...subs([[10,14.5,'So should Muslims stop doing it in pictures?']]),
]},
{from:14.5,to:19,items:[
 I(14.5,'pop',HAND('1-peace-palm-out.png',90,180,400,'peace'),{sfx:0}),I(15.0,'pop',HAND('4-devil-horns.png',530,180,400,'horns'),{sfx:0}),
 I(15.5,'pop',HAND('5-i-love-you.png',970,180,400,'"I love you"'),{sfx:0}),I(16.0,'pop',HAND('6-ok-sign.png',1410,180,400,'OK'),{sfx:0}),
 I(16.8,'pop',Y('where it comes from',300,640,54),{sfx:0}),I(18.0,'pop',Y('avoid it?',1100,640,54),{sfx:0}),
 ...subs([[14.5,19,"Let's go through the poses, where each comes from, and which to avoid."]]),
]},
{from:19,to:37,items:[
 I(19,'pop',Y('First, the peace sign',110,80),{sfx:0}),
 I(20.5,'pop',IM('baphomet-hand-crop.jpg',110,220,300,420),{sfx:0}),I(20.8,'wipe',L('statue',190,660,52,'#151515')),
 I(22.5,'pop',HAND('3-two-fingers-together.png',470,240,560,'pressed together'),{sfx:0}),I(23.4,'fade',RING(750,313,85)),
 I(25.0,'pop',HAND('1-peace-palm-out.png',1150,240,560,'spread apart','#1FA34A'),{sfx:0}),I(25.9,'fade',RING(1426,312,130,'#1FA34A')),
 I(27.0,'stamp',ST('NOT THE SAME',760,700,'#E31B1B',-6,64)),
 I(29.0,'wipe',L('old blessing gesture',220,880,52,'#151515')),
 I(31.0,'wipe',L('· church paintings',700,880,52,'#151515')),
 I(32.5,'wipe',L('· drawing from 1856',1130,880,52,'#151515')),
 I(34.0,'pop',L('↑ one hand up · ↓ one hand down',110,780,46,'#E31B1B'),{sfx:0}),
 I(35.6,'pop',P('the real peace sign ✓',1330,640,'#1FA34A',36),{sfx:0}),
 ...subs([[19,20.5,'First, the peace sign.'],[20.5,25,'Look closely. The two fingers are pressed together, pointing straight up.'],[25,29,"That isn't the peace sign."],[29,33,"It's an old blessing gesture you'll find in church paintings,"],[33,37,'copied from an 1856 drawing, one hand up and one hand down.']]),
]},
];
const TMAP=[[0,0],[1000,1000]];const VO_PARTS=[];const VO_TOTAL=36.6;
