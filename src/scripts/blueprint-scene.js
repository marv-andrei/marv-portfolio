// Blueprint scene for the homepage story: a page drawn in lines that is checked, taken apart,
// joined to the rest of a funnel and connected, as the visitor scrolls. Decorative: all content
// is in the HTML beside it. Native scroll is never intercepted. Reduced motion is respected.
import * as THREE from 'three';
(function(){
'use strict';
var $=function(i){return document.getElementById(i);};
var canvas=$('st-scene'), story=$('st-story'), hint=$('st-hint'), tag=$('st-tag'), tagName=$('st-tag-name'), tagFin=$('st-tag-sub');
if(!canvas||!story) return;
function off(){canvas.style.display='none';hint.style.display='none';tag.style.display='none';}
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches, renderer;
try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});}catch(e){off();return;}
renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
renderer.outputEncoding=THREE.sRGBEncoding; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.8;
var scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(30,1,.1,80); camera.position.set(0,0,16);
var ORANGE=new THREE.Color(0xf05123), PAPER=new THREE.Color(0xedebe6);
var rig=new THREE.Group(); scene.add(rig);
var B=new THREE.Group(); rig.add(B);
function sm(t,a,b){t=Math.max(0,Math.min(1,(t-a)/(b-a)));return t*t*(3-2*t);}
function lerp(a,b,t){return a+(b-a)*t;}
function at(arr,F){var k=Math.min(arr.length-2,Math.floor(F)),t=sm(F-k,.15,.85);return lerp(arr[k],arr[k+1],t);}

/* ================= B: blueprint lines ================= */
var pickB=[], elsB=[], drawStart=performance.now();
function rect(a,x,y,w,h){var X=x+w,Y=y+h; a.push(x,y,0,X,y,0, X,y,0,X,Y,0, X,Y,0,x,Y,0, x,Y,0,x,y,0);}
function seg(a,x1,y1,x2,y2){a.push(x1,y1,0,x2,y2,0);}
var _bx=new THREE.BoxGeometry(1,1,1), _bp=_bx.attributes.position, _bi=_bx.index, _m=new THREE.Matrix4(), _q=new THREE.Quaternion(), _v=new THREE.Vector3(), _a=new THREE.Vector3(), _b=new THREE.Vector3(), _X=new THREE.Vector3(1,0,0);
/* each line segment is a thin box, so strokes have real width and scale with depth */
function lines(arr,color,op,t,add){
  t=t||.024; var n=arr.length/6, pos=new Float32Array(n*_bp.count*3), idx=[];
  for(var sgi=0;sgi<n;sgi++){
    _a.set(arr[sgi*6],arr[sgi*6+1],arr[sgi*6+2]); _b.set(arr[sgi*6+3],arr[sgi*6+4],arr[sgi*6+5]);
    var len=_a.distanceTo(_b); _v.subVectors(_b,_a).normalize(); _q.setFromUnitVectors(_X,_v);
    _m.compose(_a.clone().add(_b).multiplyScalar(.5),_q,new THREE.Vector3(len+t,t,t));
    for(var k=0;k<_bp.count;k++){ _v.fromBufferAttribute(_bp,k).applyMatrix4(_m); var o=(sgi*_bp.count+k)*3; pos[o]=_v.x; pos[o+1]=_v.y; pos[o+2]=_v.z; }
    for(k=0;k<_bi.count;k++) idx.push(_bi.getX(k)+sgi*_bp.count);
  }
  var g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setIndex(idx);
  var mt=new THREE.MeshBasicMaterial({color:color,transparent:true,opacity:op==null?1:op,toneMapped:false,depthWrite:!add}); if(add) mt.blending=THREE.AdditiveBlending;
  var m=new THREE.Mesh(g,mt); m.userData.segs=n; return m;
}
function range(m,p){ m.geometry.setDrawRange(0,Math.floor(m.userData.segs*p)*36); }
function element(arr,depth,label,hit,base){
  var g=new THREE.Group(), ls=lines(arr,base||0xedebe6), glow=lines(arr,base||0xedebe6,.1,.11,true), h={label:label,hov:0};
  g.add(glow); g.add(ls);
  var hm=new THREE.Mesh(new THREE.PlaneGeometry(hit[2],hit[3]),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
  hm.position.set(hit[0]+hit[2]/2,hit[1]+hit[3]/2,0); hm.userData.h=h; g.add(hm); pickB.push(hm);
  B.add(g); var e={g:g,ls:ls,glow:glow,depth:depth,h:h,base:new THREE.Color(base||0xedebe6)}; elsB.push(e); return e;
}
(function(){
  var a=[]; rect(a,-2.5,-1.9,5,3.8); seg(a,-2.5,1.4,2.5,1.4); element(a,0,'Websites',[-2.5,-1.9,5,3.8]);
  a=[]; for(var k=0;k<3;k++) rect(a,-2.28+k*.24,1.59,.12,.12); for(k=0;k<4;k++) seg(a,.55+k*.46,1.65,.85+k*.46,1.65); element(a,1,'Automations',[-2.5,1.4,5,.5]);
  a=[]; rect(a,-2.15,-1.5,2.05,2.55); seg(a,-2.15,-1.5,-.1,1.05); seg(a,-2.15,1.05,-.1,-1.5); element(a,2,'Ecommerce storefronts',[-2.15,-1.5,2.05,2.55]);
  a=[]; seg(a,.3,.9,1.75,.9); [.55,.28,.01,-.26].forEach(function(y,i){seg(a,.3,y,2.15-(i%2)*.3,y);}); element(a,3,'Landing pages',[.3,-.4,1.9,1.45]);
  a=[]; rect(a,.3,-1.4,1.15,.44); var be=element(a,4,'CRM funnels',[.3,-1.4,1.15,.44],0xf05123);
  var fillB=new THREE.Mesh(new THREE.PlaneGeometry(1.15,.44),new THREE.MeshBasicMaterial({color:0xf05123,transparent:true,opacity:.22,toneMapped:false,depthWrite:false})); fillB.position.set(.875,-1.18,0); be.g.add(fillB); be.fill=fillB;
})();
/* the measuring box that appears when the page is being checked */
var D=-1.7, bx=[]; [[-2.5,-1.9],[2.5,-1.9],[2.5,1.9],[-2.5,1.9]].forEach(function(c,i,all){var n=all[(i+1)%4]; bx.push(c[0],c[1],0,c[0],c[1],D, c[0],c[1],D,n[0],n[1],D);});
var boxLs=lines(bx,0xedebe6,0,.014); B.add(boxLs);
var cp=[]; [[-2.5,-1.9],[2.5,-1.9],[2.5,1.9],[-2.5,1.9]].forEach(function(c){cp.push(c[0],c[1],0,c[0],c[1],D);});
var cg=new THREE.BufferGeometry(); cg.setAttribute('position',new THREE.Float32BufferAttribute(cp,3));
var corners=new THREE.Points(cg,new THREE.PointsMaterial({color:0xf05123,size:.16,transparent:true,opacity:0,toneMapped:false})); B.add(corners);
/* the pages further down the funnel */
var PB=[[3.5,.45,-1.7,.42],[5.15,.85,-3.4,.38],[6.6,1.2,-5.1,.34]], pagesB=PB.map(function(P){
  var g=new THREE.Group(), a=[]; rect(a,-2.5,-1.9,5,3.8); seg(a,-2.5,1.4,2.5,1.4); rect(a,-2.15,-1.5,2.05,2.55); seg(a,-2.15,-1.5,-.1,1.05); seg(a,-2.15,1.05,-.1,-1.5); [.9,.55,.2].forEach(function(y){seg(a,.3,y,2.1,y);});
  var ls=lines(a,0xedebe6,0,.04), b2=[]; rect(b2,.3,-1.4,1.15,.44); var bt=lines(b2,0xf05123,0,.06);
  g.add(ls); g.add(bt); g.position.set(P[0],P[1],P[2]); g.scale.setScalar(P[3]); B.add(g);
  var hm=new THREE.Mesh(new THREE.PlaneGeometry(5,3.8),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false})), h={label:'What happens after the click',hov:0}; hm.userData.h=h; g.add(hm); pickB.push(hm);
  return {g:g,ls:ls,bt:bt,h:h};
});
var way=[new THREE.Vector3(2.5,-.6,0)]; PB.forEach(function(P){way.push(new THREE.Vector3(P[0]-2.5*P[3],P[1]-.6*P[3],P[2])); way.push(new THREE.Vector3(P[0]+2.5*P[3],P[1]-.6*P[3],P[2]));});
var wp=[]; for(var w=0;w<way.length-1;w++) for(var j=0;j<16;j++) wp.push(way[w].clone().lerp(way[w+1],j/16)); wp.push(way[way.length-1]);
var wa=[]; for(w=0;w<wp.length-1;w++) wa.push(wp[w].x,wp[w].y,wp[w].z,wp[w+1].x,wp[w+1].y,wp[w+1].z);
var wayLine=lines(wa,0xf05123,1,.03); B.add(wayLine);
var ng=new THREE.BufferGeometry().setFromPoints(way), wayNodes=new THREE.Points(ng,new THREE.PointsMaterial({color:0xf05123,size:.2,transparent:true,opacity:0,toneMapped:false})); B.add(wayNodes);
var dotB=new THREE.Mesh(new THREE.SphereGeometry(.1,16,12),new THREE.MeshBasicMaterial({color:0xf05123,toneMapped:false})); B.add(dotB);
var SB=[1,1,.95,.7,.7,.7], RYB=[-.42,-.62,-.9,-.5,-.46,-.3], RXB=[.1,.16,.22,.12,.12,.1], XB=[3.7,3.7,3.5,1.5,1.5,1.7], CAPB=[-2.5,-2.5,-2.6,-2.5,-2.5,-2.5];
function frameB(F,now,time){
  var draw=reduced?1:Math.min(1,(now-drawStart)/1500);
  var insp=sm(F,.35,.95)*(1-sm(F,1.5,1.95)), sep=sm(F,1.4,2)*(1-sm(F,2.5,2.95)), more=sm(F,2.4,3.05), link=sm(F,3.15,3.95);
  elsB.forEach(function(e){
    var p=Math.max(0,Math.min(1,draw*1.7-e.depth*.14));
    range(e.ls,p); range(e.glow,p); e.glow.material.opacity=.1+e.h.hov*.25; if(e.fill) e.fill.material.opacity=p>=1?.22+e.h.hov*.4:0;
    e.g.position.z=e.depth*.62*sep+e.h.hov*.18;
    e.ls.material.color.copy(e.base).lerp(ORANGE,e.h.hov); e.glow.material.color.copy(e.ls.material.color);
  });
  boxLs.material.opacity=insp*.45; corners.material.opacity=insp;
  pagesB.forEach(function(pg,i){var o=sm(more,i*.2,.5+i*.2); pg.ls.material.opacity=o*(.55+pg.h.hov*.45); pg.bt.material.opacity=o; pg.ls.material.color.copy(PAPER).lerp(ORANGE,pg.h.hov);});
  range(wayLine,link); wayNodes.material.opacity=link;
  dotB.visible=link>.97;
  if(dotB.visible){var u=reduced?1:(time*.2)%1, x=u*(wp.length-1), i0=Math.floor(x); dotB.position.copy(wp[i0]).lerp(wp[Math.min(wp.length-1,i0+1)],x-i0);}
}

/* ================= shared: dust, scroll, pointer, picking ================= */
var seed=11; function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
var dustN=300, dp=new Float32Array(dustN*3); for(var d=0;d<dustN;d++){dp[d*3]=(rnd()-.5)*20;dp[d*3+1]=(rnd()-.5)*14;dp[d*3+2]=(rnd()-.5)*10-2;}
var dg=new THREE.BufferGeometry(); dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
var dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xedebe6,size:.03,transparent:true,opacity:.4})); scene.add(dust);
var W=0,H=0,wide=true,T=0,F=0,mx=0,my=0,tx=0,ty=0,ux=0,uy=0,vx=0,vy=0,visible=true,raf=0;
var ray=new THREE.Raycaster(), ptr=new THREE.Vector2(9,9), over=false, hot=null, drag=null, moved=0, lx=0, ly=0, v3=new THREE.Vector3(), touched=false;
function size(){var r=canvas.parentNode.getBoundingClientRect(); W=r.width; H=r.height; wide=W>820; renderer.setSize(W,H,false); camera.aspect=W/H; camera.updateProjectionMatrix();}
function progress(){var r=story.getBoundingClientRect(), span=r.height-window.innerHeight; T=span>0?Math.max(0,Math.min(1,-r.top/span)):0;}
function pick(){if(!over) return null; ray.setFromCamera(ptr,camera); var hs=ray.intersectObjects(pickB,false); return hs.length?hs[0].object.userData.h:null;}
function setPtr(e){var r=canvas.getBoundingClientRect(); ptr.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));}
canvas.addEventListener('pointermove',function(e){over=true; setPtr(e); if(drag){var dx=e.clientX-lx, dy=e.clientY-ly; lx=e.clientX; ly=e.clientY; moved+=Math.abs(dx)+Math.abs(dy); uy+=dx*.01; ux+=dy*.01; vy=dx*.01; vx=dy*.01;}});
canvas.addEventListener('pointerleave',function(){over=false;});
canvas.addEventListener('pointerdown',function(e){over=true; setPtr(e); var h=pick(); if(!h) return; drag=h; moved=0; lx=e.clientX; ly=e.clientY; touched=true; try{canvas.setPointerCapture(e.pointerId);}catch(_){ } e.preventDefault();});
canvas.addEventListener('pointerup',function(e){if(!drag) return; var h=drag; drag=null; if(moved<6) drawStart=performance.now(); if(e.pointerType!=='mouse') over=false;});
canvas.addEventListener('pointercancel',function(){drag=null;});
function frame(now){
  raf=0; var time=(now||0)/1000, idle=reduced?0:1;
  F+=(T*5-F)*(reduced?1:.09);
  tx+=(mx-tx)*.06; ty+=(my-ty)*.06;
  if(!drag){vx+=-ux*.04; vy+=-uy*.04; vx*=.9; vy*=.9; ux+=vx; uy+=vy;}
  rig.position.x=wide?at(XB,F):0; rig.position.y=wide?0:1.2;
  rig.scale.setScalar((wide?1:.6)*at(SB,F));
  rig.rotation.y=at(RYB,F)+tx*.18+uy+Math.sin(time*.3)*.04*idle;
  rig.rotation.x=at(RXB,F)-ty*.1+ux;
  rig.updateMatrixWorld(true);
  if(!drag) hot=pick();
  var shown=drag||hot; canvas.style.cursor=drag?'grabbing':(hot?'grab':'');
  elsB.concat(pagesB).forEach(function(o){o.h.hov+=(((shown===o.h)?1:0)-o.h.hov)*.14;});
  frameB(F,now,time);
  dust.rotation.y=time*.012*idle+tx*.05;
  /* caption: what the hovered part stands for */
  v3.set(0,at(CAPB,F),0); rig.localToWorld(v3); v3.project(camera);
  tag.style.transform='translate(-50%,0) translate('+((v3.x+1)/2*W).toFixed(1)+'px,'+Math.min(H-70,(1-v3.y)/2*H).toFixed(1)+'px)';
  var name=shown?shown.label:'Websites', sub=touched?'':'Hover a part, click to redraw, drag to turn';
  if(tagName.textContent!==name) tagName.textContent=name;
  if(tagFin.textContent!==sub) tagFin.textContent=sub;
  tag.style.opacity=1; hint.style.opacity=T<.02?1:0;
  renderer.render(scene,camera);
  if(visible) raf=requestAnimationFrame(frame);
}
function kick(){if(!raf) raf=requestAnimationFrame(frame);}
window.addEventListener('scroll',progress,{passive:true});
window.addEventListener('resize',function(){size();progress();kick();});
window.addEventListener('pointermove',function(e){mx=e.clientX/window.innerWidth*2-1; my=e.clientY/window.innerHeight*2-1;},{passive:true});
if('IntersectionObserver' in window){new IntersectionObserver(function(en){visible=en[0].isIntersecting; if(visible) kick();}).observe(story);}
size(); progress(); kick();
})();
