// Prepares the homepage scene's assets: simplifies the source meshes in assets-src/models into
// public/models, and writes small copies of the project screenshots for use as 3D textures.
// Run with: npm run pack:scene
import fs from 'node:fs';
import sharp from 'sharp';
import {MeshoptSimplifier} from 'meshoptimizer';
await MeshoptSimplifier.ready;
const MODELS={wrench:9000,laptop:11000,parcel:8000,bell:9000}; // target triangle counts
fs.mkdirSync('public/models',{recursive:true});
for(const [name,target] of Object.entries(MODELS)){
  const b=fs.readFileSync(`assets-src/models/${name}.bin`), ab=b.buffer.slice(b.byteOffset,b.byteOffset+b.length);
  const [nv,ni]=new Uint32Array(ab,0,2); let o=8;
  const q=new Int16Array(ab,o,nv*3); o+=nv*6; const n=new Int8Array(ab,o,nv*3); o+=nv*3; o+=o%2;
  const ix=new Uint32Array(new Uint16Array(ab,o,ni)), pos=new Float32Array(nv*3);
  for(let k=0;k<pos.length;k++) pos[k]=q[k]/32767;
  const [simple]=MeshoptSimplifier.simplify(ix,pos,3,target*3,.02);
  // keep only the vertices still in use
  const map=new Int32Array(nv).fill(-1); let used=0;
  const out=new Uint16Array(simple.length);
  for(let k=0;k<simple.length;k++){const v=simple[k]; if(map[v]<0) map[v]=used++; out[k]=map[v];}
  const q2=new Int16Array(used*3), n2=new Int8Array(used*3);
  for(let v=0;v<nv;v++){const m=map[v]; if(m<0) continue; for(let c=0;c<3;c++){q2[m*3+c]=q[v*3+c]; n2[m*3+c]=n[v*3+c];}}
  let size=8+used*6+used*3; const pad=size%2; size+=pad+out.length*2;
  const buf=Buffer.alloc(size); buf.writeUInt32LE(used,0); buf.writeUInt32LE(out.length,4);
  Buffer.from(q2.buffer).copy(buf,8); Buffer.from(n2.buffer).copy(buf,8+used*6); Buffer.from(out.buffer).copy(buf,8+used*9+pad);
  fs.writeFileSync(`public/models/${name}.bin`,buf);
  console.log(name,`${ni/3} to ${out.length/3} triangles,`,`${(b.length/1024).toFixed(0)} KB to ${(size/1024).toFixed(0)} KB`);
}
const projects=JSON.parse(fs.readFileSync('src/data/projects.json','utf8'));
fs.mkdirSync('public/images/shots/tex',{recursive:true});
for(const p of projects){
  const info=await sharp(`public/images/shots/${p.id}.webp`).resize(800,556,{fit:'cover',position:'top'}).webp({quality:68}).toFile(`public/images/shots/tex/${p.id}.webp`);
  console.log(p.id,`${(info.size/1024).toFixed(0)} KB`);
}
