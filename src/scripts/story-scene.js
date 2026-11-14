// Story scene for the homepage: six physical set pieces, one per beat of the story, joined by a rail
// that an orange marble (the visitor) rolls along as the page scrolls. Every piece can be poked.
// Decorative: all content is in the HTML beside it. Native scroll is never intercepted.
// Reduced motion removes idle movement; without WebGL the canvas is hidden.
// Loaded after the page is idle; each model and screenshot is fetched only as its beat comes near.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
(function(){
'use strict';
var $=function(i){return document.getElementById(i);};
var canvas=$('st-scene'), story=$('st-story'), hint=$('st-hint'), tag=$('st-tag'), tagName=$('st-tag-name'), tagSub=$('st-tag-sub');
if(!canvas||!story) return;
function off(){story.classList.add('st-off');}
var TAP=window.matchMedia('(pointer: coarse)').matches?'Tap':'Click';
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches, renderer;
try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});}catch(e){off();return;}
renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
renderer.outputEncoding=THREE.sRGBEncoding; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.85;
var scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(30,1,.1,80); camera.position.set(0,0,16);
try{var pm=new THREE.PMREMGenerator(renderer); scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture;}catch(e){}
var key=new THREE.DirectionalLight(0xffffff,.9); key.position.set(5,8,8); scene.add(key);
var rim=new THREE.DirectionalLight(0xf05123,.3); rim.position.set(-7,-3,3); scene.add(rim);

var P=THREE.MeshPhysicalMaterial;
var plaster=new P({color:0xdcd9d2,roughness:.62,metalness:0,clearcoat:.15,clearcoatRoughness:.5,envMapIntensity:.45});
var graphite=new P({color:0x141413,roughness:.45,metalness:.6,envMapIntensity:.7});
var steel=new P({color:0xbfbdb8,roughness:.3,metalness:1,envMapIntensity:.9});
/* tone mapping washes orange out to peach, so the brand orange is left out of it and lit low */
var orange=new P({color:0xd63f12,roughness:.5,metalness:0,clearcoat:.25,clearcoatRoughness:.4,envMapIntensity:.18,toneMapped:false});
var paper=new P({color:0xedebe6,roughness:.7,metalness:0,envMapIntensity:.4});
var gunmetal=new P({color:0x3b3b39,roughness:.38,metalness:.85,envMapIntensity:.8});
var rubber=new P({color:0x0d0d0d,roughness:.85,metalness:0,envMapIntensity:.25});
function glow(){return new THREE.MeshBasicMaterial({color:0xf05123,transparent:true,opacity:0,toneMapped:false,depthWrite:false});}

var PROJ={}; try{PROJ=JSON.parse(canvas.dataset.projects||'{}');}catch(e){}
var texLoader=new THREE.TextureLoader();
/* a screenshot of one of Marv's real builds (1440 x 1000), cropped from the top to fit w x h. Brightness 0 is a dark screen. */
function shot(id,w,h){
  h=h||w/1.44;
  var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:0x000000,toneMapped:false}));
  m.userData.id=id; m.userData.b=0; m.userData.a=w/h; return m;
}
/* the texture (an 800 px copy made by scripts/pack-scene-assets.mjs) is only fetched the first time the screen is lit */
function bright(m,target,k){
  if(target>0&&!m.userData.req){m.userData.req=1; texLoader.load('/images/shots/tex/'+m.userData.id+'.webp',function(t){t.encoding=THREE.sRGBEncoding; t.anisotropy=4; var a=m.userData.a; if(a>1.44){t.repeat.set(1,1.44/a); t.offset.y=1-1.44/a;} m.material.map=t; m.material.needsUpdate=true;});}
  m.userData.b+=(target-m.userData.b)*(k||.12); m.material.color.setScalar(m.userData.b);
}
/* the same screenshot mounted on a graphite panel, so it is an object in the scene */
function framed(id,w){var g=new THREE.Group(), sh=shot(id,w), back=new THREE.Mesh(new THREE.BoxGeometry(w+.1,w/1.44+.1,.05),graphite); sh.position.z=.031; g.add(back); g.add(sh); g.userData.s=sh; g.userData.back=back; return g;}
function label(id){var p=PROJ[id]; return p?p.name+', '+p.kind.toLowerCase():'';}
function sm(t,a,b){t=Math.max(0,Math.min(1,(t-a)/(b-a)));return t*t*(3-2*t);}
function lerp(a,b,t){return a+(b-a)*t;}
var GAP=9, picks=[], pieces=[];
var rig=new THREE.Group(); scene.add(rig);
var stage=new THREE.Group(); rig.add(stage);

/* packed model: uint32 vertex count, uint32 index count, int16 positions, int8 normals, uint16 indices */
/* mat may be a list of materials with part(x,y,z,nx,ny,nz) choosing one per triangle, so a single mesh gets coloured parts */
function load(name,mat,size,done,part){
  fetch('/models/'+name+'.bin').then(function(r){if(!r.ok) throw 0; return r.arrayBuffer();}).then(function(buf){
    var h=new Uint32Array(buf,0,2), nv=h[0], ni=h[1], o=8;
    var q=new Int16Array(buf,o,nv*3); o+=nv*6;
    var nq=new Int8Array(buf,o,nv*3); o+=nv*3; o+=o%2;
    var ix=new Uint16Array(buf,o,ni), pos=new Float32Array(nv*3);
    for(var k=0;k<pos.length;k++) pos[k]=q[k]/32767;
    var geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.setAttribute('normal',new THREE.BufferAttribute(nq,3,true));
    geo.setIndex(new THREE.BufferAttribute(ix,1));
    if(part){
      var bins=mat.map(function(){return [];}), a,b,c,x,y,z;
      for(var t=0;t<ni;t+=3){a=ix[t]*3; b=ix[t+1]*3; c=ix[t+2]*3;
        x=(pos[a]+pos[b]+pos[c])/3; y=(pos[a+1]+pos[b+1]+pos[c+1])/3; z=(pos[a+2]+pos[b+2]+pos[c+2])/3;
        bins[part(x,y,z,(nq[a]+nq[b]+nq[c])/381,(nq[a+1]+nq[b+1]+nq[c+1])/381,(nq[a+2]+nq[b+2]+nq[c+2])/381)].push(ix[t],ix[t+1],ix[t+2]);}
      var all=new Uint16Array(ni), at=0;
      bins.forEach(function(l,k){all.set(l,at); geo.addGroup(at,l.length,k); at+=l.length;});
      geo.setIndex(new THREE.BufferAttribute(all,1));
    }
    geo.computeBoundingBox(); geo.computeBoundingSphere();
    var m=new THREE.Mesh(geo,mat); m.scale.setScalar(size); done(m,geo.boundingBox);
  }).catch(function(){});
}
function piece(i,name,sub,yaw,pitch){
  var g=new THREE.Group(); g.position.y=-i*GAP; stage.add(g);
  var p={i:i,g:g,name:name,sub:sub,yaw:yaw,pitch:pitch,cap:-3.05,hov:0,ux:0,uy:0,vx:0,vy:0,k:0,ready:true,need:null,click:function(){},tick:function(){}};
  pieces.push(p); return p;
}
function pickable(m,p){m.userData.p=p; picks.push(m);}
function spring(o,k,d){o.v+=-o.x*k; o.v*=d; o.x+=o.v;}
function pulseRing(r){var m=new THREE.Mesh(new THREE.TorusGeometry(r,.03,8,96),glow()); m.rotation.x=Math.PI/2; m.userData.t=0; return m;}
function runPulse(m,dt,speed){ if(!m.userData.t) return; m.userData.t+=dt*speed; var t=m.userData.t; if(t>=1){m.userData.t=0;m.material.opacity=0;return;} m.scale.setScalar(1+t*2.2); m.material.opacity=(1-t)*.9; }

/* ---------- 0. After the click: a sales funnel in four floating tiers. Visitors trickle in and leak out of the gaps;
   tapping a tier closes the gap under it, and more of them reach the dish ---------- */
var p0=piece(0,'After the click','',-.45,.3); p0.done=0; p0.outN=0; p0.ms=[]; p0.tray=[]; p0.cap=-3.5; p0.acc=0;
p0.shut=[false,false,false]; p0.c=[0,0,0]; p0.msg=TAP+' a tier to close the gap under it.'; p0.sub=p0.msg;
/* one straight cone, cut into four tiers with open gaps between them */
var STAGES=['Visit','Lead','Booking','Customer'], F_TOP=1.6, TIER=.58, F_GAP=.22, F_BOT=F_TOP-4*TIER-3*F_GAP, LEAK=[.42,.42,.5];
var FIXED=['Visit to lead: the form writes straight into the CRM.','Lead to booking: the calendar, confirmations and reminders run on their own.','Booking to customer: follow-ups go out, and the sale is traced back to its ad.'];
function coneR(y){return .3+(y-F_BOT)*(1.6/(F_TOP-F_BOT));}
function gapTop(g){return F_TOP-g*(TIER+F_GAP)-TIER;}
/* how far a point at height u has risen because gaps above the dish have closed beneath the tiers over it */
function lift(u){var s=0; for(var g=0;g<3;g++){var t=gapTop(g); if(u<=t-F_GAP) s+=p0.c[g]*F_GAP; else if(u<t) s+=p0.c[g]*(t-u);} return s;}
function lathe(pts,mat,both){var m=mat; if(both){m=mat.clone(); m.side=THREE.DoubleSide;} return new THREE.Mesh(new THREE.LatheGeometry(pts.map(function(q){return new THREE.Vector2(q[0],q[1]);}),72),m);}
function word(text){
  var c=document.createElement('canvas'); c.width=320; c.height=80; var x=c.getContext('2d');
  x.font='500 44px "Manrope Variable",system-ui,sans-serif'; x.textAlign='right'; x.textBaseline='middle'; x.fillStyle='#fff'; x.fillText(text,312,42);
  var t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding;
  var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,color:0xedebe6,transparent:true,toneMapped:false,depthWrite:false})); sp.center.set(1,.5); sp.scale.set(1.3,.325,1); return sp;
}
var INK=new THREE.Color(0xedebe6), SIGNAL=new THREE.Color(0xf05123);
var tiers=STAGES.map(function(name,k){
  var W=.07, yt=F_TOP-k*(TIER+F_GAP), yb=yt-TIER, rt=coneR(yt), rb=coneR(yb);
  /* the last tier, the customer, is the orange one */
  var tier=lathe([[rb,yb],[rt,yt],[rt+W,yt],[rb+W,yb],[rb,yb]],k===3?orange:paper,true); tier.userData.tier=k; tier.userData.h=0; tier.userData.ph=k*1.7; p0.g.add(tier); pickable(tier,p0);
  var sp=word(name); /* stage names sit in one column to the left of the widest tier, like a legend */
  sp.position.set(-(coneR(F_TOP)+W+.55),(yt+yb)/2,0); tier.add(sp); tier.userData.word=sp;
  /* an orange seal that appears round the joint when the gap under this tier is closed */
  if(k<3){var seal=new THREE.Mesh(new THREE.TorusGeometry(rb+W*.6,.045,10,96),orange); seal.rotation.x=Math.PI/2; seal.position.y=yb; seal.visible=false; tier.add(seal); tier.userData.seal=seal;}
  return tier;
});
(function(){
  var base=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.25,.1,64),graphite); base.position.y=-2.06; p0.g.add(base); pickable(base,p0);
  var tray=lathe([[0,-1.98],[.74,-1.98],[.88,-1.8]],paper,true); p0.g.add(tray); pickable(tray,p0);
})();
var ballGeo=new THREE.SphereGeometry(.1,20,14), TRAY_Y=-1.88;
function visitors(n){for(var k=0;k<n&&p0.ms.length<26;k++){var mesh=new THREE.Mesh(ballGeo,orange); mesh.visible=false; p0.g.add(mesh);
  p0.ms.push({mesh:mesh,st:'wait',t:k*.1,th:rnd()*6.283,y:F_TOP+1.3,r:0,vy:0,life:1,g:0});}}
p0.click=function(o){
  hop=1; var k=o&&o.userData.tier;
  if(k===0||k===1||k===2){
    p0.shut[k]=!p0.shut[k]; p0.done=0; p0.outN=0; tiers[k].userData.h=1.6;
    var n=p0.shut.filter(Boolean).length;
    p0.msg=p0.shut[k]?FIXED[k]+(n===3?' All three closed.':''):'That gap is open again.';
    visitors(6);
  } else { visitors(8); if(!p0.shut.some(Boolean)) p0.msg='Most slip out between stages. '+TAP+' a tier to close the gap under it.'; }
  p0.sub=p0.msg;
};
p0.tick=function(dt,time,F){
  var idle=reduced?0:1, y0=F_TOP-.1, changed=false;
  /* a steady trickle of visitors while the funnel is on stage */
  p0.acc+=dt; if(idle&&Math.abs(F)<.6&&p0.acc>.7){p0.acc=0; visitors(1);}
  for(var g=0;g<3;g++) p0.c[g]+=((p0.shut[g]?1:0)-p0.c[g])*.14;
  tiers.forEach(function(t,k){
    var u=t.userData, up=0; for(var g=0;g<k;g++) up+=p0.c[g]*F_GAP;
    u.h+=(((hotObj===t&&k<3)?1:0)-u.h)*.12;
    t.position.y=up+Math.sin(time*.9+u.ph)*.025*idle; t.scale.set(1+u.h*.035,1,1+u.h*.035);
    if(u.seal){u.seal.visible=p0.c[k]>.5; u.seal.scale.setScalar(.9+.1*p0.c[k]);}
    var ws=wide?1.3:1.5; u.word.scale.set(ws,ws/4,1);
    u.word.material.color.lerp(((k<3&&p0.shut[k])||(k>0&&p0.shut[k-1]))?SIGNAL:INK,.12);
  });
  p0.ms=p0.ms.filter(function(m){
    var o=m.mesh, r;
    if(m.st==='wait'){m.t-=dt; if(m.t>0) return true; m.st='fall'; o.visible=true;}
    if(m.st==='fall'){m.y-=dt*5; r=coneR(y0)-.13; o.position.set(Math.cos(m.th)*r,m.y,Math.sin(m.th)*r); if(m.y<=y0) m.st='spin';}
    else if(m.st==='spin'){
      m.y-=dt*(.42+(y0-m.y)*.22); r=Math.max(0,coneR(m.y)-.13); m.r=r; m.th+=dt*2.6/Math.max(.35,r);
      o.position.set(Math.cos(m.th)*r,m.y+lift(m.y)+.04,Math.sin(m.th)*r);
      /* at each gap that is still open, some slip out sideways */
      if(m.g<3&&m.y<=gapTop(m.g)-F_GAP/2){ if(!p0.shut[m.g]&&rnd()<LEAK[m.g]){m.st='out'; m.vy=.6; m.y=o.position.y;} else m.g++; }
      else if(m.y<=F_BOT){m.st='drop'; m.vy=0;}
    }
    else if(m.st==='out'){m.r+=dt*2.6; m.vy-=9*dt; m.y+=m.vy*dt; m.life-=dt*1.15; o.position.set(Math.cos(m.th)*m.r,m.y,Math.sin(m.th)*m.r); o.scale.setScalar(Math.max(.001,Math.min(1,m.life*2.2))); if(m.life<=0){p0.g.remove(o); p0.done++; changed=true; return false;}}
    /* the ones that make it drop out of the last tier into the dish */
    else if(m.st==='drop'){m.vy-=9*dt; o.position.x*=.8; o.position.z*=.8; o.position.y+=m.vy*dt;
      if(o.position.y<=TRAY_Y){o.position.y=TRAY_Y; if(m.vy<-1.2) m.vy=-m.vy*.35; else{
        p0.tray.push(o); if(p0.tray.length>7) p0.g.remove(p0.tray.shift()); p0.outN++; p0.done++; changed=true; return false;}}}
    return true;
  });
  /* the running score waits for a few results so it does not open on "0 of 1" */
  if(changed&&p0.done>=4) p0.sub=p0.msg+' '+p0.outN+' of '+p0.done+' made it.';
  p0.tray.forEach(function(o,k){var a=k*1.047, n=k===0?0:.36; o.position.x+=(Math.cos(a)*n-o.position.x)*.1; o.position.z+=(Math.sin(a)*n-o.position.z)*.1;});
};

/* ---------- 1. Checked twice: a torque wrench that clicks ---------- */
var p1=piece(1,'Checked twice',TAP+' the wrench. Twice.',-.2,.35); p1.s={x:0,v:0}; p1.n=0;
var seal=new THREE.Mesh(new THREE.TorusGeometry(.42,.07,12,48),orange); seal.position.set(1.9,1.5,.4); seal.scale.setScalar(.001); p1.g.add(seal); p1.sealS=0;
/* steel head and shaft, an orange collar where the torque is set, rubber grip. t runs along the wrench from head to handle. */
p1.ready=false; p1.need=function(){load('wrench',[steel,orange,rubber],2.7,function(m){p1.ready=true; p1.m=m; p1.g.add(m); pickable(m,p1);
  /* the wrench is thin, so an unseen box along its length makes it easy to hit with a thumb */
  var d=new THREE.Vector3(.595,.332,-.732).normalize(), hit=new THREE.Mesh(new THREE.BoxGeometry(2.3,.42,.42),new THREE.MeshBasicMaterial({visible:false}));
  hit.position.set(-.031,.094,.031).addScaledVector(d,.5); hit.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),d); m.add(hit); pickable(hit,p1);},function(x,y,z){var t=(x+.031)*.595+(y-.094)*.332-(z-.031)*.732; return t<.33?0:t<.66?1:2;});};
p1.click=function(){p1.s.v=-.11; p1.n++; p1.sub=p1.n===1?'Once more.':'Signed off. That habit came with me.';};
p1.tick=function(){spring(p1.s,.16,.8); if(p1.m) p1.m.rotation.z=p1.s.x; p1.sealS+=((p1.n>=2?1:0)-p1.sealS)*.12; seal.scale.setScalar(Math.max(.001,p1.sealS)); seal.rotation.z+=.01;};

/* ---------- 2. Built by hand: a page assembles on the laptop's own screen, then the real build shows ---------- */
var p2=piece(2,'Built by hand','Scroll to build the page.',-.42,.08); p2.kn=0; p2.cur=0;
/* the screen's centre, tilt and size were measured from the laptop mesh (normalised units) */
var SW=1.86, SH=1.134, screenG=new THREE.Group(); screenG.position.set(0,.141,-.731); screenG.rotation.x=-.263;
screenG.add(new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),new THREE.MeshBasicMaterial({color:0x050505,toneMapped:false})));
var BUILT=['orias','gawangdiwa','cowmit'].map(function(id){var m=shot(id,SW,SH); m.position.z=.004; screenG.add(m); return m;});
var page=new THREE.Group(); page.position.z=.02; page.scale.setScalar(SW/4.5); screenG.add(page);
/* gunmetal shell, black keys, and an orange front lip */
p2.ready=false; p2.need=function(){load('laptop',[gunmetal,rubber,orange],2.5,function(m,bb){p2.ready=true; m.position.set(-.3,-2-bb.min.y*2.5,0); m.add(screenG); p2.g.add(m); pickable(m,p2);},function(x,y,z,nx,ny,nz){return (nz>.75&&z>.9&&y<-.5)?2:(ny>.8&&y<-.55&&z>-.42&&z<.3&&Math.abs(x)<.86)?1:0;});};
var seed=7; function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
var qI=new THREE.Quaternion(), v=new THREE.Vector3();
var blocks=[[0,1.02,4.1,.2,steel],[-1.05,.45,1.9,.38,plaster],[-1.2,.02,1.6,.15,steel],[-1.52,-.34,.86,.26,orange],[1.15,.2,1.75,1.15,plaster],[-1.4,-.95,1.25,.42,plaster],[0,-.95,1.25,.42,plaster],[1.4,-.95,1.25,.42,plaster]].map(function(d){
  var m=new THREE.Mesh(new THREE.BoxGeometry(d[2],d[3],.08),d[4]); page.add(m); pickable(m,p2);
  var a=rnd()*6.283, r=3+rnd()*2.4;
  return {m:m,home:new THREE.Vector3(d[0],d[1],0),loose:new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r*.7+1,1.5+rnd()*4),
          q0:new THREE.Quaternion().setFromEuler(new THREE.Euler((rnd()-.5)*2.6,(rnd()-.5)*2.6,(rnd()-.5)*1.8)),ph:rnd()*6.283};
});
p2.click=function(){p2.kn=1; p2.cur=(p2.cur+1)%BUILT.length;};
p2.tick=function(dt,time,F){
  p2.kn=Math.max(0,p2.kn-dt*.45);
  var built=sm(F,1.25,1.9), mix=Math.max(1-built,sm(p2.kn,0,.7)), idle=reduced?0:1;
  blocks.forEach(function(b){
    v.copy(b.loose); v.y+=Math.sin(time*.5+b.ph)*.2*idle*mix;
    b.m.position.lerpVectors(b.home,v,mix);
    b.m.quaternion.copy(qI).slerp(b.q0,mix);
  });
  /* once the blocks are in place the screen comes on with the real build; each knock-down builds the next one */
  var show=sm(1-mix,.8,1);
  /* the loose blocks only come into view as this beat approaches, so they do not drift through the wrench's */
  var near=sm(F,1.05,1.5); page.visible=show<.97&&near>0; blocks.forEach(function(b){b.m.scale.setScalar(Math.max(.001,near));});
  BUILT.forEach(function(m,i){bright(m,i===p2.cur?show:0,.2); m.visible=i===p2.cur;});
  p2.sub=show>.5?label(BUILT[p2.cur].userData.id)+'. '+TAP+' the laptop to knock it down and build the next.':'Scroll to build the page.';
};

/* ---------- 3. One step of many: a parcel on a line with three stops ---------- */
var p3=piece(3,'One step of many',TAP+' the parcel to send it down the line. Each stop is a real build.',-.32,.2); p3.stop=0; p3.x=-1.7;
var STOPS=[-1.7,0,1.7], STEPID=['balzy','artin','komforten'], STEPWORD=['The advertorial','The product page','The store and checkout'];
var boards=STEPID.map(function(id,i){var g=framed(id,1.42), post=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1.5,12),graphite); post.position.y=-1.26; g.add(post); g.position.set(STOPS[i],.8,-.8); return g;});
var rail3=new THREE.Mesh(new THREE.BoxGeometry(5,.14,1.2),graphite); rail3.position.y=-1.3; p3.g.add(rail3); pickable(rail3,p3);
var stops=STOPS.map(function(x){var d=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.08,40),plaster); d.position.set(x,-1.2,0); p3.g.add(d); return d;});
/* paper box, orange tape around it, a dark shipping label on top */
p3.ready=false; p3.need=function(){load('parcel',[paper,orange,graphite],.95,function(m,bb){p3.ready=true; p3.m=m; m.position.y=-1.16-bb.min.y*.95; p3.g.add(m); pickable(m,p3);},function(x,y,z,nx,ny,nz){return (Math.abs(z)<.09||Math.abs(x)<.09)?1:((ny>.8&&y>.55&&x>.3&&x<.85&&z>.2&&z<.62)||(nz>.8&&z>.6&&x<-.3&&x>-.85&&Math.abs(y)<.3))?2:0;});};
boards.forEach(function(g){p3.g.add(g); pickable(g.userData.back,p3);});
p3.click=function(){p3.stop=(p3.stop+1)%3; p3.sub=STEPWORD[p3.stop]+'. This one is '+label(STEPID[p3.stop])+'.';};
p3.tick=function(){p3.x+=(STOPS[p3.stop]-p3.x)*.1; if(p3.m){p3.m.position.x=p3.x; p3.m.rotation.y=(STOPS[p3.stop]-p3.x)*.12;} stops.forEach(function(d,i){d.material=i===p3.stop?orange:plaster;});
  boards.forEach(function(g,i){var on=i===p3.stop; bright(g.userData.s,on?1:.22); g.scale.setScalar(g.scale.x+((on?1.08:1)-g.scale.x)*.12);});};

/* ---------- 4. Connected: three gears that drive each other ---------- */
var p4=piece(4,'Connected',TAP+' a gear to power the screen.',-.3,.1); p4.a=0; p4.spin=0;
function gear(teeth,mat,hubMat){
  var r=teeth*.085, s=new THREE.Shape(), n=teeth*4, ro=r+.15, ri=r-.15;
  for(var k=0;k<n;k++){var a=(k-.5)/n*Math.PI*2, rr=(k%4<2)?ro:ri, x=Math.cos(a)*rr, y=Math.sin(a)*rr; if(k) s.lineTo(x,y); else s.moveTo(x,y);}
  s.closePath(); var h=new THREE.Path(); h.absarc(0,0,r*.2,0,Math.PI*2,true); s.holes.push(h);
  if(teeth>=12) for(var q=0;q<6;q++){var hh=new THREE.Path(), qa=q/6*Math.PI*2; hh.absarc(Math.cos(qa)*r*.58,Math.sin(qa)*r*.58,r*.15,0,Math.PI*2,true); s.holes.push(hh);}
  var geo=new THREE.ExtrudeGeometry(s,{depth:.34,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:2,curveSegments:28}); geo.translate(0,0,-.17);
  var m=new THREE.Mesh(geo,mat); m.userData.r=r; m.userData.teeth=teeth; p4.g.add(m); pickable(m,p4);
  var hub=new THREE.Mesh(new THREE.CylinderGeometry(r*.34,r*.34,.46,40),hubMat), pin=new THREE.Mesh(new THREE.CylinderGeometry(r*.12,r*.12,.56,24),steel); hub.rotation.x=pin.rotation.x=Math.PI/2; m.add(hub); m.add(pin); return m;
}
/* the small orange gear is the driver; the steel and paper ones follow */
var g1=gear(18,paper,graphite), g2=gear(12,gunmetal,orange), g3=gear(8,orange,graphite);
g1.position.set(-1.8,-.35,0); g2.position.set(-1.8+g1.userData.r+g2.userData.r,-.35,0);
var ang=1.05; g3.position.set(g2.position.x+Math.cos(ang)*(g2.userData.r+g3.userData.r),g2.position.y+Math.sin(ang)*(g2.userData.r+g3.userData.r),0);
var vscreen=framed('vendrato',2.2); vscreen.position.set(-2.45,2.15,-1); p4.g.add(vscreen); pickable(vscreen.userData.back,p4); p4.lit=0;
p4.click=function(){p4.spin=Math.min(9,p4.spin+4.5); p4.lit=1; p4.sub='One turns and the rest follow. They are running '+(label('vendrato')||'the funnel')+'.';};
p4.tick=function(dt,time,F){
  p4.spin*=Math.pow(.35,dt); p4.a+=dt*((reduced?0:.25)+p4.spin);
  var a=p4.a+F*1.2;
  bright(vscreen.userData.s,p4.lit?1:.18,.08);
  g1.rotation.z=a;
  g2.rotation.z=-a*18/12+Math.PI/12;
  g3.rotation.z=a*18/8+ang*(1+12/8)+Math.PI/8+Math.PI/12*12/8;
};

/* ---------- 5. Book the call: a desk bell ---------- */
var p5=piece(5,'Book the call','Ring it.',-.4,.42); p5.s={x:0,v:0};
var ring5=pulseRing(1.5); ring5.position.y=.3; p5.g.add(ring5);
/* graphite base, steel dome, orange plunger: the part you press is always the orange one */
p5.ready=false; p5.need=function(){load('bell',[graphite,steel,orange],2.1,function(m){p5.ready=true; p5.m=m; p5.g.add(m); pickable(m,p5);},function(x,y){return y<-.6?0:y<.56?1:2;});};
p5.click=function(){p5.s.v=-.13; ring5.userData.t=.001; p5.sub='Ding. The real one is the orange button, top right.';};
p5.tick=function(dt){spring(p5.s,.22,.8); if(p5.m){p5.m.scale.y=2.1*(1+p5.s.x); p5.m.position.y=p5.s.x;} runPulse(ring5,dt,1.2);};

/* ---------- the rail and the marble that rides it ---------- */
var REST=[[2.4,-1.5,.9],[2.1,-1.9,.9],[2.5,-2.1,.9],[2.3,-2.1,.9],[2.5,-2,.9],[2.2,-1.6,.9]];
var anchors=REST.map(function(a,i){return new THREE.Vector3(a[0],a[1]-i*GAP,a[2]);});
var marble=new THREE.Mesh(new THREE.SphereGeometry(.27,32,24),orange); stage.add(marble);
var railGeo=new THREE.BufferGeometry().setFromPoints(anchors);
stage.add(new THREE.Line(railGeo,new THREE.LineBasicMaterial({color:0x4a4845,toneMapped:false})));
var posts=anchors.map(function(a){var m=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.06,40),graphite); m.position.copy(a); m.position.y-=.3; stage.add(m); return m;});
var hop=0;

/* dust for depth */
var dp=new Float32Array(300*3); for(var d=0;d<300;d++){dp[d*3]=(rnd()-.5)*20;dp[d*3+1]=(rnd()-.5)*14;dp[d*3+2]=(rnd()-.5)*10-2;}
var dg=new THREE.BufferGeometry(); dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
var dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xedebe6,size:.03,transparent:true,opacity:.4})); scene.add(dust);

/* ---------- scroll, pointer, frame ---------- */
var shownOnce=false, W=0,H=0,wide=true,T=0,F=0,mx=0,my=0,tx=0,ty=0,visible=true,raf=0,last=0;
var ray=new THREE.Raycaster(), ptr=new THREE.Vector2(9,9), over=false, hot=null, drag=null, moved=0, lx=0, ly=0, v3=new THREE.Vector3(), touched=false;
function size(){var r=canvas.parentNode.getBoundingClientRect(); W=r.width; H=r.height; wide=W>820; renderer.setSize(W,H,false); camera.aspect=W/H; camera.updateProjectionMatrix();}
/* which beat is on stage: 0 to 5, read from where each beat's text sits against a reference line (its middle at mid-screen, or on small screens its top just under the stage) */
var beatEls=[].slice.call(story.querySelectorAll('.st-beat'));
function progress(){
  var vh=window.innerHeight, ref=wide?vh/2:H+48, c=beatEls.map(function(b){var r=b.getBoundingClientRect();return wide?r.top+r.height/2:r.top;}), f=0;
  for(var i=0;i<c.length-1;i++) if(ref>=c[i]) f=i+Math.min(1,(ref-c[i])/(c[i+1]-c[i]));
  T=f;
}
var hotObj=null, dragObj=null;
function pick(){hotObj=null; if(!over) return null; ray.setFromCamera(ptr,camera); var hs=ray.intersectObjects(picks,false); if(!hs.length) return null; hotObj=hs[0].object; return hotObj.userData.p;}
function setPtr(e){var r=canvas.getBoundingClientRect(); ptr.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));}
canvas.addEventListener('pointermove',function(e){over=true; setPtr(e); if(drag){var dx=e.clientX-lx, dy=e.clientY-ly; lx=e.clientX; ly=e.clientY; moved+=Math.abs(dx)+Math.abs(dy); drag.uy+=dx*.01; drag.ux+=dy*.01; drag.vy=dx*.01; drag.vx=dy*.01;}});
canvas.addEventListener('pointerleave',function(){over=false;});
canvas.addEventListener('pointerdown',function(e){over=true; setPtr(e); var p=pick(); if(!p) return; drag=p; dragObj=hotObj; moved=0; lx=e.clientX; ly=e.clientY; try{canvas.setPointerCapture(e.pointerId);}catch(_){ } e.preventDefault();});
canvas.addEventListener('pointerup',function(e){if(!drag) return; var p=drag; drag=null; if(moved<6){touched=true; p.click(dragObj);} if(e.pointerType!=='mouse') over=false;});
canvas.addEventListener('pointercancel',function(){drag=null;});
function frame(now){
  raf=0; var time=(now||0)/1000, dt=Math.min(.05,(now-last)/1000||.016), idle=reduced?0:1; last=now;
  F+=(T-F)*(reduced?1:.09);
  tx+=(mx-tx)*.06; ty+=(my-ty)*.06;
  /* half the visible width at the stage's depth; narrower windows shrink the set and pull it in so nothing is cut off on the right */
  var hw=4.287*W/H, fit=wide?Math.min(1,hw/6.86):Math.min(1.05,hw/3.6);
  rig.position.set(wide?hw*.51:0,wide?0:.75,0); rig.scale.setScalar(fit);
  stage.position.y=F*GAP;
  rig.updateMatrixWorld(true);
  if(!drag) hot=pick();
  var shown=drag||hot; canvas.style.cursor=drag?'grabbing':(hot?'pointer':'');
  pieces.forEach(function(p){
    if(Math.abs(F-p.i)>1.4){p.g.visible=false;return;} p.g.visible=true;
    if(p.need){p.need(); p.need=null;} p.k+=((p.ready?1:0)-p.k)*.1;
    if(drag!==p){p.vx+=-p.ux*.045; p.vy+=-p.uy*.045; p.vx*=.9; p.vy*=.9; p.ux+=p.vx; p.uy+=p.vy;}
    p.hov+=(((shown===p)?1:0)-p.hov)*.14;
    var dF=F-p.i;
    p.g.rotation.y=p.yaw+dF*.9+Math.sin(time*.35+p.i)*.12*idle*(1-p.hov)+tx*.25+p.uy;
    p.g.rotation.x=p.pitch-ty*.12+p.ux;
    p.g.scale.setScalar((1+p.hov*.04)*(.8+.2*p.k));
    p.tick(dt,time,F);
  });
  /* the marble rests at the piece on stage and rolls down the rail between beats */
  var k=Math.max(0,Math.min(4,Math.floor(F))), t=sm(F-k,.2,.8);
  marble.position.lerpVectors(anchors[k],anchors[k+1],t);
  hop=Math.max(0,hop-dt*1.6); marble.position.y+=Math.sin(hop*Math.PI)*.9+Math.abs(Math.sin(time*2.2))*.05*idle*(1-Math.min(1,Math.abs(F-Math.round(F))*4));
  posts.forEach(function(m,i){m.visible=Math.abs(F-i)<1.4;});
  dust.rotation.y=time*.012*idle+tx*.05;
  /* caption: what this piece stands for, and what to do with it */
  var cur=pieces[Math.max(0,Math.min(5,Math.round(F)))], near=Math.abs(F-cur.i)<.3;
  if(near){
    v3.set(0,cur.cap,0); cur.g.localToWorld(v3); v3.project(camera);
    /* keep the whole caption inside the part of the stage that is on screen */
    var floor=Math.min(H,window.innerHeight-canvas.getBoundingClientRect().top)-tag.offsetHeight-12;
    tag.style.transform='translate(-50%,0) translate('+((v3.x+1)/2*W).toFixed(1)+'px,'+Math.min(floor,(1-v3.y)/2*H).toFixed(1)+'px)';
    if(tagName.textContent!==cur.name) tagName.textContent=cur.name;
    if(tagSub.textContent!==cur.sub) tagSub.textContent=cur.sub;
  }
  tag.style.opacity=near?1:0; hint.style.opacity=T<.05?1:0;
  renderer.render(scene,camera);
  if(!shownOnce){shownOnce=true; story.classList.add('st-on');}
  if(visible) raf=requestAnimationFrame(frame);
}
function kick(){if(!raf) raf=requestAnimationFrame(frame);}
window.addEventListener('scroll',progress,{passive:true});
window.addEventListener('resize',function(){size();progress();kick();});
window.addEventListener('pointermove',function(e){mx=e.clientX/window.innerWidth*2-1; my=e.clientY/window.innerHeight*2-1;},{passive:true});
if('IntersectionObserver' in window){new IntersectionObserver(function(en){visible=en[0].isIntersecting; if(visible) kick();}).observe(story);}
size(); progress(); kick();
})();
