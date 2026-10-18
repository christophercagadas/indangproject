/* ============================================================
   Indang Residence — procedural 3D model built from plan set
   Sheets: A-01..A-04, S-01, S-02, E-01, P-01
   Units: meters. Origin: NW corner of main house.
   x → east,  y → up,  z → south.
   FFL = +0.35 above natural grade (NGL = 0).
   ============================================================ */

// ---------------- key dimensions (mm → m) ----------------
const FFL      = 0.35;    // finish floor line (main rooms)
const GENKAN_FL= 0.20;    // genkan floor (+0.20 above NGL)
const LANAI_FL = 0.30;    // lanai floor
const CEIL     = FFL + 2.55;   // interior ceiling 2.55 m above FFL (2.90 m)
const PORCH_CEIL = FFL + 2.15; // window head / porch & C-frame soffit line (2.50 m)
const PARAPET_LO = 3.15;  // top of WF-03 cream C-frame / east wing (300+50+2150+650)
const PARAPET  = 3.95;    // main house parapet line (3150+800 WF-04 band) per A-03
const APEX     = 4.55;    // WF-01 stone-brick accent tower apex (3950+600) per A-03
const EXT_T    = 0.15;    // 150 mm CHB exterior walls
const INT_T    = 0.10;    // interior partitions

// ---------------- procedural textures ----------------
function texCanvas(w,h,draw,rx=1,ry=1){
  const c=document.createElement('canvas'); c.width=w; c.height=h;
  draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(rx,ry);
  t.encoding=THREE.sRGBEncoding; t.anisotropy=4;
  return t;
}
const R=(a,b)=>a+Math.random()*(b-a);

const woodTex = texCanvas(256,256,(g,w,h)=>{          // FF-01 15x100cm wood tiles, oak
  g.fillStyle='#8f6a41'; g.fillRect(0,0,w,h);
  const pw=256/15, ph=256/5; // stylized planks
  for(let r=0;r<5;r++){ for(let i=0;i<15;i++){
    const x=i*pw,y=r*ph;
    g.fillStyle=`rgb(${140+R(-18,22)|0},${100+R(-15,15)|0},${60+R(-12,12)|0})`;
    g.fillRect(x+1,y+1,pw-2,ph-2);
    g.strokeStyle='rgba(80,55,30,.5)'; g.beginPath();
    g.moveTo(x,y+ph*R(.2,.8)); g.lineTo(x+pw,y+ph*R(.2,.8)); g.stroke();
  }}
});
const tileTex = texCanvas(256,256,(g,w,h)=>{          // FF-02 60x60 glazed white
  g.fillStyle='#d8d5cf'; g.fillRect(0,0,w,h);
  const s=256/4;
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){
    g.fillStyle=`rgb(${240+R(-6,4)|0},${240+R(-6,4)|0},${236+R(-6,4)|0})`;
    g.fillRect(i*s+1.5,j*s+1.5,s-3,s-3);
    g.strokeStyle='rgba(255,255,255,.35)';
    g.strokeRect(i*s+4,j*s+4,s-8,s-8);
  }
});
const tileNSTex = texCanvas(256,256,(g,w,h)=>{        // FF-03 30x30 non-skid
  g.fillStyle='#a9a49b'; g.fillRect(0,0,w,h);
  const s=256/8;
  for(let i=0;i<8;i++)for(let j=0;j<8;j++){
    g.fillStyle=`rgb(${186+R(-12,12)|0},${180+R(-12,12)|0},${170+R(-12,12)|0})`;
    g.fillRect(i*s+1,j*s+1,s-2,s-2);
  }
});
const stoneTex = texCanvas(512,512,(g,w,h)=>{         // WF-01 light grey-beige stone brick accent
  g.fillStyle='#9b958b'; g.fillRect(0,0,w,h);
  const rows=18;
  for(let r=0;r<rows;r++){
    const bh=h/rows; let x = (r%2)? -32:0;
    while(x<w){
      const bw=R(55,105);
      const v=188+R(-22,20)|0;
      g.fillStyle=`rgb(${v+4},${v},${v-8})`;
      g.fillRect(x+2,r*bh+2,bw-4,bh-3);
      g.fillStyle='rgba(60,55,48,.22)';
      g.fillRect(x+2,r*bh+bh-5,bw-4,3);
      x+=bw;
    }
  }
},2,3);
const grassTex = texCanvas(256,256,(g,w,h)=>{
  g.fillStyle='#7c9a58'; g.fillRect(0,0,w,h);
  for(let i=0;i<2500;i++){
    g.fillStyle=`rgba(${90+R(-20,40)|0},${130+R(-25,30)|0},${60+R(-15,15)|0},.6)`;
    g.fillRect(R(0,w),R(0,h),2,2);
  }
},8,8);
const concTex = texCanvas(256,256,(g,w,h)=>{
  g.fillStyle='#b5b2aa'; g.fillRect(0,0,w,h);
  for(let i=0;i<1500;i++){
    g.fillStyle=`rgba(${150+R(-25,25)|0},${148+R(-25,25)|0},${140+R(-25,25)|0},.5)`;
    g.fillRect(R(0,w),R(0,h),3,3);
  }
},4,4);
const marbleTex = texCanvas(256,256,(g,w,h)=>{        // kitchen counter top
  g.fillStyle='#ececea'; g.fillRect(0,0,w,h);
  for(let i=0;i<26;i++){
    g.strokeStyle=`rgba(${120+R(-20,20)|0},${120+R(-20,20)|0},${128+R(-20,20)|0},${R(.15,.4)})`;
    g.lineWidth=R(0.5,2); g.beginPath();
    let x=R(0,w),y=R(0,h); g.moveTo(x,y);
    for(let k=0;k<5;k++){ x+=R(-50,50); y+=R(-50,50); g.lineTo(x,y); }
    g.stroke();
  }
},2,2);
const soffitTex = texCanvas(256,256,(g,w,h)=>{        // CF-02 PVC wood soffit
  g.fillStyle='#7c5a38'; g.fillRect(0,0,w,h);
  const sw=256/8;
  for(let i=0;i<8;i++){
    g.fillStyle=`rgb(${135+R(-15,20)|0},${95+R(-12,15)|0},${58+R(-10,10)|0})`;
    g.fillRect(i*sw+1,0,sw-2,h);
    g.fillStyle='rgba(40,25,12,.55)'; g.fillRect(i*sw,0,2,h);
  }
},2,2);

// ---------------- materials ----------------
const MAT = {
  extWall   : new THREE.MeshStandardMaterial({color:0xeeebe3, roughness:.9}),          // WF-02 smooth white
  extCream  : new THREE.MeshStandardMaterial({color:0xf5f2ea, roughness:.82}),         // WF-03 bright cream C-frame
  limeWash  : new THREE.MeshStandardMaterial({color:0xbab4ac, roughness:.95}),         // WF-04 warm grey-taupe limewash
  stone     : new THREE.MeshStandardMaterial({map:stoneTex, roughness:.9}),             // WF-01 accent
  intWall   : new THREE.MeshStandardMaterial({color:0xf6f4ee, roughness:.95}),
  floorWood : new THREE.MeshStandardMaterial({map:woodTex, roughness:.6}),              // FF-01
  floorWhite: new THREE.MeshStandardMaterial({map:tileTex, roughness:.35}),             // FF-02
  floorNS   : new THREE.MeshStandardMaterial({map:tileNSTex, roughness:.8}),            // FF-03
  ceil      : new THREE.MeshStandardMaterial({color:0xfbfbf8, roughness:.9}),           // CF-01
  soffit    : new THREE.MeshStandardMaterial({map:soffitTex, roughness:.7}),            // CF-02
  roof      : new THREE.MeshStandardMaterial({color:0x5d6b7a, roughness:.55,metalness:.5}), // RF-03 ribbed
  gutter    : new THREE.MeshStandardMaterial({color:0x3e4a56, roughness:.5,metalness:.4}),
  frame     : new THREE.MeshStandardMaterial({color:0x3b332c, roughness:.4,metalness:.35}), // dark bronze analok frames
  glass     : new THREE.MeshStandardMaterial({color:0x6e8fa3, roughness:.1,metalness:.25,transparent:true,opacity:.42}),
  doorWood  : new THREE.MeshStandardMaterial({color:0x8a6742, roughness:.6}),
  doorPVC   : new THREE.MeshStandardMaterial({color:0xe9e9e6, roughness:.5}),
  concrete  : new THREE.MeshStandardMaterial({map:concTex, roughness:.9}),
  steel     : new THREE.MeshStandardMaterial({color:0x707880, roughness:.4,metalness:.7}),
  grass     : new THREE.MeshStandardMaterial({map:grassTex, roughness:1}),
  marble    : new THREE.MeshStandardMaterial({map:marbleTex, roughness:.25}),
  cabOak    : new THREE.MeshStandardMaterial({color:0x9a7448, roughness:.55}),
  cabGrey   : new THREE.MeshStandardMaterial({color:0x63686e, roughness:.35,metalness:.1}),
  flutedOak : new THREE.MeshStandardMaterial({color:0x7d5c36, roughness:.6}),
  applWhite : new THREE.MeshStandardMaterial({color:0xdde0e2, roughness:.3,metalness:.2}),
  porcelain : new THREE.MeshStandardMaterial({color:0xf4f6f6, roughness:.2}),
  fabric    : new THREE.MeshStandardMaterial({color:0x50607a, roughness:1}),
  wood      : new THREE.MeshStandardMaterial({color:0x8a6a45, roughness:.65}),
  dark      : new THREE.MeshStandardMaterial({color:0x36302b, roughness:.55}),
  lightDisc : new THREE.MeshStandardMaterial({color:0xfff6dd, emissive:0xffe9b0, emissiveIntensity:.9}),
};

// ---------------- helpers ----------------
function grp(name){ const g=new THREE.Group(); g.name=name; return g; }
function box(parent,w,h,d,mat,x,y,z,ry=0){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
  m.position.set(x,y,z); if(ry)m.rotation.y=ry;
  m.castShadow=m.receiveShadow=true; parent.add(m); return m;
}
function cyl(parent,r1,r2,h,mat,x,y,z,seg=18){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg),mat);
  m.position.set(x,y,z); m.castShadow=m.receiveShadow=true; parent.add(m); return m;
}
/* wall along X (z fixed). openings: [{a,b (x range), bot, top (abs y)}] */
function wallX(parent,x1,x2,z,t,y0,yTop,mat,openings=[]){
  openings=openings.slice().sort((p,q)=>p.a-q.a);
  let cur=x1;
  for(const o of openings){
    if(o.a>cur) box(parent,o.a-cur,yTop-y0,t,mat,(cur+o.a)/2,(y0+yTop)/2,z);
    if(o.bot>y0) box(parent,o.b-o.a,o.bot-y0,t,mat,(o.a+o.b)/2,(y0+o.bot)/2,z);          // sill
    if(o.top<yTop) box(parent,o.b-o.a,yTop-o.top,t,mat,(o.a+o.b)/2,(o.top+yTop)/2,z);   // lintel
    cur=o.b;
  }
  if(cur<x2) box(parent,x2-cur,yTop-y0,t,mat,(cur+x2)/2,(y0+yTop)/2,z);
}
/* wall along Z (x fixed). openings: [{a,b (z range), bot, top}] */
function wallZ(parent,z1,z2,x,t,y0,yTop,mat,openings=[]){
  openings=openings.slice().sort((p,q)=>p.a-q.a);
  let cur=z1;
  for(const o of openings){
    if(o.a>cur) box(parent,t,yTop-y0,o.a-cur,mat,x,(y0+yTop)/2,(cur+o.a)/2);
    if(o.bot>y0) box(parent,t,o.bot-y0,o.b-o.a,mat,x,(y0+o.bot)/2,(o.a+o.b)/2);
    if(o.top<yTop) box(parent,t,yTop-o.top,o.b-o.a,mat,x,(o.top+yTop)/2,(o.a+o.b)/2);
    cur=o.b;
  }
  if(cur<z2) box(parent,t,yTop-y0,z2-cur,mat,x,(y0+yTop)/2,(cur+z2)/2);
}
function windowUnit(parent,x,z,alongX,w,sillAbs,h){
  const fT=0.045, g=grp('win');
  const sill=0.03;
  if(alongX){
    box(g,w,sill,0.16,MAT.frame,x,sillAbs-sill/2,z);                    // sill
    box(g,w,fT,0.09,MAT.frame,x,sillAbs+h-fT/2,z);                      // head
    box(g,fT,h,0.09,MAT.frame,x-w/2+fT/2,sillAbs+h/2,z);
    box(g,fT,h,0.09,MAT.frame,x+w/2-fT/2,sillAbs+h/2,z);
    if(w>1.0) box(g,fT,h,0.07,MAT.frame,x,sillAbs+h/2,z);               // mullion
    box(g,w-2*fT,h-2*fT,0.02,MAT.glass,x,sillAbs+h/2,z);
  } else {
    box(g,0.16,sill,w,MAT.frame,x,sillAbs-sill/2,z);
    box(g,0.09,fT,w,MAT.frame,x,sillAbs+h-fT/2,z);
    box(g,0.09,h,fT,MAT.frame,x,sillAbs+h/2,z-w/2+fT/2);
    box(g,0.09,h,fT,MAT.frame,x,sillAbs+h/2,z+w/2-fT/2);
    if(w>1.0) box(g,0.07,h,fT,MAT.frame,x,sillAbs+h/2,z);
    box(g,0.02,h-2*fT,w-2*fT,MAT.glass,x,sillAbs+h/2,z);
  }
  parent.add(g); return g;
}
function doorUnit(parent,x,z,alongX,w,h,mat,botAbs,leafAngle=0.6,hingeEnd=false){
  const fT=0.05, g=grp('door');
  if(alongX){
    box(g,w+0.08,fT,0.14,MAT.frame,x,botAbs+h+fT/2,z);
    box(g,fT,h,0.14,MAT.frame,x-w/2,botAbs+h/2,z);
    box(g,fT,h,0.14,MAT.frame,x+w/2,botAbs+h/2,z);
    const leaf=box(g,w-0.04,h-0.02,0.04,mat,0,botAbs+h/2,0);
    const dir=hingeEnd?-1:1, hx=hingeEnd?(x+w/2):(x-w/2);
    leaf.position.set(hx+dir*(w-0.04)/2*Math.cos(leafAngle), botAbs+h/2, z+(w-0.04)/2*Math.sin(leafAngle));
    leaf.rotation.y=-dir*leafAngle;
  } else {
    box(g,0.14,fT,w+0.08,MAT.frame,x,botAbs+h+fT/2,z);
    box(g,0.14,h,fT,MAT.frame,x,botAbs+h/2,z-w/2);
    box(g,0.14,h,fT,MAT.frame,x,botAbs+h/2,z+w/2);
    const leaf=box(g,0.04,h-0.02,w-0.04,mat,0,botAbs+h/2,0);
    const dir=hingeEnd?-1:1, hz=hingeEnd?(z+w/2):(z-w/2);
    leaf.position.set(x+(w-0.04)/2*Math.sin(leafAngle), botAbs+h/2, hz+dir*(w-0.04)/2*Math.cos(leafAngle));
    leaf.rotation.y=dir*leafAngle;
  }
  parent.add(g); return g;
}
function floorSlab(parent,x1,z1,x2,z2,yTop,th,mat){
  return box(parent,x2-x1,th,z2-z1,mat,(x1+x2)/2,yTop-th/2,(z1+z2)/2);
}
function label(parent,text,x,y,z){
  const c=document.createElement('canvas'); c.width=512; c.height=128;
  const g=c.getContext('2d');
  g.font='bold 56px Segoe UI,Arial'; g.textAlign='center'; g.textBaseline='middle';
  g.fillStyle='rgba(20,25,35,.75)'; const tw=g.measureText(text).width;
  if(g.roundRect){ g.beginPath(); g.roundRect(256-tw/2-26,20,tw+52,88,18); g.fill(); }
  else g.fillRect(256-tw/2-26,20,tw+52,88);
  g.fillStyle='#eef2f8'; g.fillText(text,256,64);
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false}));
  sp.scale.set(2.4,0.6,1); sp.position.set(x,y,z); parent.add(sp); return sp;
}

/* ============================================================
   BUILD
   ============================================================ */
function buildHouse(scene){
  const L={};
  for(const k of ['extwalls','intwalls','roof','porchroof','ceiling','openings','fixtures','furniture','structure','lights','labels','site']) L[k]=grp(k);

  /* ================= SITE ================= */
  const site=L.site;
  floorSlab(site,-3,-2.5,22.0,10.8,0.0,0.15,MAT.grass);                           // lot pad
  floorSlab(site,18.2,-2.5,22.0,10.8,0.02,0.10,MAT.concrete);                     // front road / street
  floorSlab(site,13.65,4.95,18.4,8.05,0.06,0.12,MAT.concrete);                    // carport + driveway slab
  floorSlab(site,15.0,2.85,18.2,4.95,0.06,0.12,MAT.concrete);                     // approach walk to D-2
  floorSlab(site,-0.3,-0.3,13.75,6.3,0.30,0.60,MAT.concrete);                     // plinth block under main house
  floorSlab(site,13.65,-0.2,15.5,5.05,0.20,0.45,MAT.concrete);                    // east wing / genkan step plinth
  // front breeze-block screen wall & perimeter fence per PERSPECTIVE-01 (A-01)
  (function(){
    const fw=grp('frontWall');
    const wallMat=MAT.limeWash;
    // solid base + piers + top rail of breeze-block screen in front of east window (x=17.95, z=0..3.35)
    box(fw,0.16,0.72,3.45,wallMat,17.95,0.36,1.675);                              // lower solid wall
    box(fw,0.16,0.14,3.45,wallMat,17.95,1.48,1.675);                              // top rail
    box(fw,0.16,0.12,3.45,wallMat,17.95,1.10,1.675);                              // mid horizontal bar
    for(let i=0;i<=7;i++){
      const pz=0.05+i*(3.30/7);
      box(fw,0.16,0.68,0.12,wallMat,17.95,1.08,pz);                               // vertical breeze-block mullions
    }
    box(fw,2.95,1.55,0.15,wallMat,16.5,0.775,-0.02);                              // return wall along z=0
    // flanking solid perimeter walls (north of screen & south of carport) + sidewalk curbs
    box(fw,0.16,1.55,2.55,wallMat,17.95,0.775,-1.25);                             // north perimeter wall
    box(fw,0.16,1.55,2.70,wallMat,17.95,0.775,9.40);                              // south perimeter wall
    box(fw,1.1,0.10,4.8,MAT.concrete,18.4,0.05,1.1);                              // north sidewalk curb
    box(fw,1.1,0.10,2.7,MAT.concrete,18.4,0.05,9.4);                              // south sidewalk curb
    // perimeter backdrop wall on west/north/south lot boundaries
    box(fw,21.0,1.8,0.15,MAT.extWall,7.5,0.9,-2.4);
    box(fw,0.15,1.8,12.9,MAT.extWall,-2.9,0.9,4.05);
    site.add(fw);
  })();
  // trees positioned per PERSPECTIVE-01 (framing left/south & right/north without blocking Lanai)
  const leafMat1=new THREE.MeshStandardMaterial({color:0x486d36,roughness:.95});
  const leafMat2=new THREE.MeshStandardMaterial({color:0x587f42,roughness:.95});
  for(const [tx,tz,s] of [[7.5,9.6,1.35],[4.2,9.2,1.25],[15.6,-1.7,1.35],[11.5,-1.8,1.1],[-1.6,8.8,1.0]]){
    cyl(site,0.10*s,0.15*s,1.8*s,MAT.wood,tx,0.9*s,tz);
    for(const [dx,dy,dz,r,m] of [[0,2.2,0,0.95,leafMat1],[-0.45,1.95,0.35,0.72,leafMat2],
                                 [0.45,2.0,-0.3,0.75,leafMat2],[0.15,2.65,0.2,0.68,leafMat1]]){
      const cr=new THREE.Mesh(new THREE.SphereGeometry(r*s,12,10),m);
      cr.position.set(tx+dx*s,dy*s,tz+dz*s); cr.castShadow=true; site.add(cr);
    }
  }

  /* ================= FLOORS ================= */
  const fl=grp('floors'); L.extwalls.add(fl);   // keep floors with walls layer
  // interior rooms (FF-01 wood tile): B3+B4 occupy full 6m depth on west;
  // B2 has an L-shape around the central hallway pocket; B1 reaches z=3.25
  floorSlab(fl,0,0,3.0,6.0,FFL,0.12,MAT.floorWood);          // B3 + B4 (touching, no west hallway)
  floorSlab(fl,3.0,0,6.1,2.15,FFL,0.12,MAT.floorWood);       // B2 north body
  floorSlab(fl,4.15,2.15,6.45,3.15,FFL,0.12,MAT.floorWood);  // B2 SE wing
  floorSlab(fl,6.1,0,9.35,3.15,FFL,0.12,MAT.floorWood);      // B1 (depth 3.15)
  floorSlab(fl,9.35,0,15.0,2.95,FFL,0.12,MAT.floorWood);     // Living (incl. NE alcove to x=15.0)
  floorSlab(fl,13.67,2.95,15.0,5.0,GENKAN_FL,0.12,MAT.floorWood); // Genkan (+0.20, z=2.95..5.0 per A-02)
  // wet / service (FF-02 white tile includes the central hallway pocket; FF-03 in T&B)
  floorSlab(fl,3.0,2.15,4.15,4.05,FFL,0.12,MAT.floorWhite);  // Hallway pocket (between B3 & B2)
  floorSlab(fl,4.15,3.15,5.6,4.05,FFL,0.12,MAT.floorWhite);  // Hallway strip in front of T&B
  floorSlab(fl,3.0,4.05,4.3,6.0,FFL,0.12,MAT.floorNS);       // T&B-a
  floorSlab(fl,4.3,4.05,5.6,6.0,FFL,0.12,MAT.floorNS);       // T&B-b
  floorSlab(fl,5.6,3.15,9.1,6.0,FFL,0.12,MAT.floorWhite);    // Kitchen (open plan)
  floorSlab(fl,9.1,2.95,13.67,6.0,FFL,0.12,MAT.floorWhite);  // Dining (ends at grid 5 x=13.67)
  // outdoor
  floorSlab(fl,8.95,6.0,12.97,8.0,LANAI_FL,0.12,MAT.floorWood); // Lanai deck (+0.30, 4.02x2.0m)
  floorSlab(fl,12.97,6.15,13.45,7.85,0.18,0.10,MAT.floorWood);  // Lanai steps down to carport
  floorSlab(fl,13.65,5.0,18.0,8.0,0.10,0.10,MAT.concrete);      // Carport pad (15.0 sqm zone)

  /* ================= EXTERIOR WALLS ================= */
  const W=L.extwalls;
  const sillW2=FFL+1.15, topW2=FFL+2.15;           // W-2: 1400x1000, sill 1150 (top=2.50)
  const sillW1=FFL+0.0,  topW1=FFL+2.15;           // W-1 / front tall windows (top=2.50)
  const sillW3=FFL+1.55, topW3=FFL+2.15;           // W-3: 600x600, sill 1550
  const sillW4=FFL+1.55, topW4=FFL+2.15;           // W-4: 1300x600, sill 1550
  const doorTop=FFL+2.10;                          // door heads

  // ---- North wall (grid A): main wing x=0..13.67 to PARAPET (3.95), east wing x=13.67..15.0 to PARAPET_LO (3.15) ----
  wallX(W,-0.075,13.67,0,EXT_T,0,PARAPET,MAT.extWall,[
    {a:0.90,b:2.30,bot:sillW2,top:topW2},          // B3 window
    {a:3.95,b:5.35,bot:sillW2,top:topW2},          // B2 window
    {a:6.95,b:8.35,bot:sillW2,top:topW2},          // B1 window
  ]);
  wallX(W,13.67,15.075,0,EXT_T,0,PARAPET_LO,MAT.extWall,[
    {a:14.10,b:14.60,bot:FFL+0.95,top:topW2},      // Living NE alcove W-1
  ]);
  // ---- South wall (grid C, z=6.0, x=0..13.67) ----
  wallX(W,-0.075,13.67,6.0,EXT_T,0,PARAPET,MAT.extWall,[
    {a:0.90,b:2.30,bot:sillW2,top:topW2},          // B4 window
    {a:3.35,b:3.95,bot:sillW3,top:topW3},          // T&B-a vent
    {a:4.65,b:5.25,bot:sillW3,top:topW3},          // T&B-b vent
    {a:6.35,b:7.65,bot:sillW4,top:topW4},          // Kitchen W-4 window (centered in 1500mm bay at x=7.00)
    {a:10.40,b:12.50,bot:FFL,top:doorTop},         // D-1 sliding door (2100x2100mm connecting Dining & Lanai)
  ]);
  // ---- West wall (grid 1) — B3 & B4 touch directly ----
  wallZ(W,-0.075,6.075,0,EXT_T,0,PARAPET,MAT.extWall,[
    {a:0.80,b:2.20,bot:sillW2,top:topW2},          // B3 west window
    {a:3.80,b:5.20,bot:sillW2,top:topW2},          // B4 west window
  ]);
  // ---- East facade (x=15.0, z=0..5.0): Living alcove (z=0..2.95) + Genkan (z=2.95..5.0) ----
  wallZ(W,-0.075,5.05,15.0,EXT_T,0,PARAPET_LO,MAT.extWall,[
    {a:0.35,b:2.85,bot:FFL+0.35,top:topW2},        // Front 4x4 grid window wall (Living E)
    {a:3.05,b:3.55,bot:GENKAN_FL+0.15,top:topW2},  // Genkan W-1 full-height grid window
    {a:3.80,b:4.70,bot:GENKAN_FL,top:doorTop},     // D-2 main entrance door (near Grid C per plan & Front Elev)
  ]);
  // ---- Genkan south wall (z=5.0, x=13.67..15.0) + Dining east wall along Grid 5 (x=13.67, z=5.0..6.0) ----
  wallX(W,13.67,15.075,5.0,EXT_T,0,PARAPET_LO,MAT.extWall,[
    {a:13.85,b:14.85,bot:GENKAN_FL+0.15,top:topW2}, // Grid window visible on Left Side Elevation
  ]);
  wallZ(W,5.0,6.075,13.67,EXT_T,0,PARAPET,MAT.extWall);
  // Main house parapet wall along Grid 5 (x=13.67, z=0..5.0) rising from PARAPET_LO (3.15) to PARAPET (3.95)
  box(W,EXT_T,PARAPET-PARAPET_LO,5.15,MAT.limeWash,13.67,(PARAPET+PARAPET_LO)/2,2.5);

  // ---- Architectural Finishes & Feature Volumes per A-01 Perspective & A-03 Elevations ----
  // 1. WF-04 Limewash stucco upper parapet band (800 mm band from y=3.15 to y=3.95 around main wing)
  box(W,13.82,0.80,0.04,MAT.limeWash,6.83,3.55,-0.085);            // North WF-04 band
  box(W,9.45,0.80,0.04,MAT.limeWash,4.65,3.55,6.085);              // South WF-04 band (Grids 1..4)
  box(W,0.04,0.80,6.18,MAT.limeWash,-0.085,3.55,3.0);              // West WF-04 band
  box(W,0.04,0.80,5.05,MAT.limeWash,13.76,3.55,2.45);              // East main parapet face (seen above C-frame!)
  // Parapet coping caps at y=3.95
  box(W,13.90,0.07,0.22,MAT.extWall,6.85,PARAPET-0.035,0);
  box(W,9.50,0.07,0.22,MAT.extWall,4.65,PARAPET-0.035,6.0);
  box(W,0.22,0.07,6.20,MAT.extWall,0,PARAPET-0.035,3.0);
  box(W,0.24,0.07,5.15,MAT.extWall,13.67,PARAPET-0.035,2.45);

  // 2. WF-03 Projecting Cream C-Frame Portal on East Facade (x=13.67..15.48, z=-0.18..5.0, top y=3.15)
  box(W,1.82,0.65,5.18,MAT.extCream,14.57,2.825,2.41);             // C-frame top fascia header (y=2.50..3.15)
  box(W,0.46,0.04,4.90,MAT.soffit,15.25,2.49,2.48);                // CF-02 warm wood soffit under C-frame overhang
  box(W,1.82,2.50,0.46,MAT.extCream,14.57,1.25,0.05);              // C-frame north vertical pier (z=-0.18..0.28)
  box(W,0.52,0.16,4.85,MAT.extCream,15.24,0.16,2.50);              // C-frame base step/ledge in front of D-2
  // Low brick planter box under the front 4x4 grid window (z=0.28..2.88) per Front Elevation
  box(W,0.42,0.45,2.60,MAT.stone,15.22,0.35,1.58);

  // 3. WF-01 Stone-Brick Feature Tower & South Lanai Cladding (per PERSPECTIVE-01 & A-03)
  // Full-height stone-brick tower at Grid 5 / Grid C corner rising to APEX = 4.55 m
  box(W,1.38,APEX,0.75,MAT.stone,14.34,APEX/2,4.82);               // Iconic vertical stone tower (y=0..4.55)
  // South Lanai facade WF-01 stone-brick cladding between Grid 4 & Grid 5 (exterior face only, up to PARAPET=3.95m)
  box(W,4.45,PARAPET-2.50,0.14,MAT.stone,11.525,(PARAPET+2.50)/2,6.08);
  // Flanking WF-01 stone-brick piers on either side of D-1 sliding door (exterior face of South Lanai facade)
  box(W,0.95,2.50,0.14,MAT.stone,9.82,1.25,6.09);                  // West stone pier (x=9.35..10.30)
  box(W,1.05,2.50,0.14,MAT.stone,13.12,1.25,6.09);                 // East stone pier (x=12.60..13.65)
  // WF-03 cream surround frame around the Lanai / D-1 bay
  box(W,4.48,0.22,0.18,MAT.extCream,11.525,2.52,6.11);

  /* ================= INTERIOR WALLS ================= */
  const I=L.intwalls;
  const iTop=CEIL, iBot=FFL;
  // B3 | B4 stepped partition along Grid B (z=3.15, stepping south to z=3.50 at x=1.05..1.95 per A-02)
  wallX(I,0,1.05,3.15,INT_T,iBot,iTop,MAT.intWall);
  wallZ(I,3.15,3.50,1.05,INT_T,iBot,iTop,MAT.intWall);
  wallX(I,1.05,1.95,3.50,INT_T,iBot,iTop,MAT.intWall);
  wallZ(I,3.15,3.50,1.95,INT_T,iBot,iTop,MAT.intWall);
  wallX(I,1.95,3.0,3.15,INT_T,iBot,iTop,MAT.intWall);
  // x=3.0 wall (B3+B4 | B2+Hallway+T&B):
  // - z=0..2.15 separates B3 from B2
  // - z=2.15..3.15 faces the hallway pocket and holds B3's D-4 door (z=2.23..3.03)
  // - z=3.15..4.05 faces the hallway and holds B4's D-4 door (z=3.20..4.00)
  wallZ(I,0,6.0,3.0,INT_T,iBot,iTop,MAT.intWall,[
    {a:2.23,b:3.03,bot:iBot,top:doorTop},          // B3 D-4 (in hallway pocket z=2.15..3.15, opens W into B3)
    {a:3.20,b:4.00,bot:iBot,top:doorTop},          // B4 D-4 (south of z=3.15 partition, opens W into B4)
  ]);
  // B2 L-recess around hallway pocket: N wall of pocket (z=2.15, x=3.0..4.15) + E wall w/ B2 D-4 (x=4.15, z=2.15..3.15)
  wallX(I,3.0,4.15,2.15,INT_T,iBot,iTop,MAT.intWall);
  wallZ(I,2.15,3.15,4.15,INT_T,iBot,iTop,MAT.intWall,[
    {a:2.23,b:3.03,bot:iBot,top:doorTop},          // B2 D-4 (faces B3 D-4 across pocket, opens E into B2)
  ]);
  // B2+B1 south wall at z=3.15 (with B1 D-4 at east end)
  wallX(I,4.15,9.35,3.15,INT_T,iBot,iTop,MAT.intWall,[
    {a:8.30,b:9.10,bot:iBot,top:doorTop},          // B1 D-4
  ]);
  // B2 | B1 stepped partition (the 500 segment on the top dim string)
  wallZ(I,0,2.0,5.95,INT_T,iBot,iTop,MAT.intWall);
  wallX(I,5.95,6.45,2.0,INT_T,iBot,iTop,MAT.intWall);
  wallZ(I,2.0,3.15,6.45,INT_T,iBot,iTop,MAT.intWall);
  box(I,0.4,iTop-iBot,0.2,MAT.intWall,6.35,(iBot+iTop)/2,3.15); // grid-3 column pier
  wallZ(I,0,3.15,9.35,INT_T,iBot,iTop,MAT.intWall);    // B1|Living
  // T&B north wall (z=4.05, x=3.0..5.6) with 2x D-3; kitchen stays open east of 5.6
  wallX(I,3.0,5.6,4.05,INT_T,iBot,iTop,MAT.intWall,[
    {a:3.50,b:4.10,bot:iBot,top:doorTop},          // D-3 T&B-a
    {a:4.50,b:5.10,bot:iBot,top:doorTop},          // D-3 T&B-b
  ]);
  wallZ(I,4.05,6.0,4.3,INT_T,iBot,iTop,MAT.intWall);   // T&B split
  wallZ(I,4.05,6.0,5.6,INT_T,iBot,iTop,MAT.intWall);   // T&B|Kitchen
  // kitchen | dining: no wall — open plan (peninsula counter is the divider)
  // dining | genkan (along grid 5 x=13.67, z=2.95..5.0)
  wallZ(I,2.95,5.0,13.67,INT_T,iBot,iTop,MAT.intWall);
  // genkan | living NE alcove (at z=2.95, x=13.67..15.0) with step-up doorway (UP on A-02)
  wallX(I,13.67,15.0,2.95,INT_T,iBot,iTop,MAT.intWall,[
    {a:13.95,b:14.75,bot:iBot,top:doorTop},
  ]);

  /* ================= DOORS & WINDOWS ================= */
  const O=L.openings;
  windowUnit(O,1.60,0,true,1.40,sillW2,1.00);      // B3 N
  windowUnit(O,4.65,0,true,1.40,sillW2,1.00);      // B2 N
  windowUnit(O,7.65,0,true,1.40,sillW2,1.00);      // B1 N
  windowUnit(O,14.35,0,true,0.50,FFL+0.95,1.20);   // Living NE alcove W-1
  windowUnit(O,1.60,6.0,true,1.40,sillW2,1.00);    // B4 S
  windowUnit(O,3.65,6.0,true,0.60,sillW3,0.60);    // T&B-a
  windowUnit(O,4.95,6.0,true,0.60,sillW3,0.60);    // T&B-b
  windowUnit(O,7.00,6.0,true,1.30,sillW4,0.60);    // Kitchen W-4 (centered at x=7.00 over sink)
  windowUnit(O,0,1.50,false,1.40,sillW2,1.00);     // B3 W
  windowUnit(O,0,4.50,false,1.40,sillW2,1.00);     // B4 W
  // Front 4x4 dark-grid window wall on East facade (z=0.35..2.85, per PERSPECTIVE-01 & Front Elev)
  (function(){
    const g=grp('frontGridWin');
    const x=15.0, z1=0.35, z2=2.85, w=z2-z1, zc=(z1+z2)/2;
    const yb=FFL+0.35, yt=topW2, h=yt-yb, yc=(yb+yt)/2;
    box(g,0.16,h,w,MAT.glass,x,yc,zc);
    for(let r=0;r<=4;r++) box(g,0.18,0.05,w+0.04,MAT.dark,x,yb+r*(h/4),zc);
    for(let c=0;c<=4;c++) box(g,0.18,h+0.04,0.05,MAT.dark,x,yc,z1+c*(w/4));
    O.add(g);
  })();
  // Genkan tall 4-pane grid window W-1 (z=3.05..3.55 on x=15.0, and x=13.85..14.85 on z=5.0)
  (function(){
    const g=grp('genkanGridWins');
    const yb=GENKAN_FL+0.15, yt=topW2, h=yt-yb, yc=(yb+yt)/2;
    // East W-1 next to D-2
    box(g,0.16,h,0.50,MAT.glass,15.0,yc,3.30);
    for(let r=0;r<=4;r++) box(g,0.18,0.045,0.54,MAT.dark,15.0,yb+r*(h/4),3.30);
    for(const cz of [3.05,3.55]) box(g,0.18,h,0.045,MAT.dark,15.0,yc,cz);
    // South grid window at z=5.0 (facing carport, shown on Left Side Elevation)
    box(g,1.00,h,0.16,MAT.glass,14.35,yc,5.0);
    for(let r=0;r<=4;r++) box(g,1.04,0.045,0.18,MAT.dark,14.35,yb+r*(h/4),5.0);
    for(let c=0;c<=3;c++) box(g,0.045,h,0.18,MAT.dark,13.85+c*(1.0/3),yc,5.0);
    O.add(g);
  })();
  // D-1 Sliding Door (2100x2100mm connecting Dining & Lanai, per A-03 Schedule of Doors):
  // 3/16mm thk. dark-tinted glass w/ Analok framing, 2 sliding panels (4x4 = 16 square panes w/ continuous white sash grid & <| |> center handles)
  (function(){
    const g=grp('D1');
    const w=2.10, h=2.10, x=11.45, z=6.0, yb=FFL, yc=FFL+h/2;
    const sashMat=new THREE.MeshStandardMaterial({color:0xf4f4f0,roughness:.32,metalness:.12});
    const darkGlass=new THREE.MeshPhysicalMaterial({color:0x101419,transparent:true,opacity:.86,roughness:.10,metalness:.20});
    // Outer Analok perimeter door jamb (2.10 x 2.10 m)
    box(g,w+0.08,0.05,0.18,MAT.dark,x,yb+h+0.015,z);               // head jamb
    box(g,w+0.08,0.04,0.18,MAT.dark,x,yb+0.02,z);                  // bottom track sill
    box(g,0.05,h+0.04,0.18,MAT.dark,x-w/2-0.015,yc,z);             // left outer jamb
    box(g,0.05,h+0.04,0.18,MAT.dark,x+w/2+0.015,yc,z);             // right outer jamb
    // Inner white perimeter frame (matching Schedule of Doors D-1 diagram)
    box(g,w+0.02,0.035,0.16,sashMat,x,yb+h-0.01,z);
    box(g,w+0.02,0.035,0.16,sashMat,x,yb+0.035,z);
    box(g,0.035,h,0.16,sashMat,x-w/2+0.01,yc,z);
    box(g,0.035,h,0.16,sashMat,x+w/2-0.01,yc,z);
    // Two 2x4-grid sliding leaves (Left leaf at z-0.018, Right leaf at z+0.018 on 2-track rail)
    const leafW=w/2, innerH=h-0.06, cellW=leafW/2, cellH=innerH/4;
    for(let s=0;s<2;s++){
      const lx0 = (s===0) ? (x-w/2) : x;
      const lxc = lx0 + leafW/2;
      const lz  = (s===0) ? (z-0.018) : (z+0.018);
      // Continuous vertical stiles (left, center muntion, right) — no gaps between panes
      for(let c=0;c<=2;c++){
        const sx = lx0 + c*cellW + (c===0?0.022:(c===2?-0.022:0));
        const sw = (c===1) ? 0.042 : 0.045;
        box(g,sw,innerH,0.042,sashMat,sx,yc,lz);
      }
      // Continuous horizontal rails (5 rails for 4 rows) — no gaps between panes
      for(let r=0;r<=4;r++){
        const ry = yb + 0.03 + r*cellH;
        const rh = (r===0||r===4) ? 0.045 : 0.042;
        box(g,leafW,rh,0.042,sashMat,lxc,ry,lz);
      }
      // Center vertical black meeting line between the two sliding leaves
      box(g,0.022,innerH+0.02,0.052,MAT.dark,x,yc,z);
      // 2 cols x 4 rows = 8 dark square glass panes per leaf (4x4 = 16 squares total)
      for(let r=0;r<4;r++){
        const py = yb + 0.03 + (r+0.5)*cellH;
        for(let c=0;c<2;c++){
          const px = lx0 + (c+0.5)*cellW;
          box(g,cellW-0.048,cellH-0.048,0.028,darkGlass,px,py,lz);
        }
      }
      // Center "<|" and "|>" sliding handles on the middle rail (matching Schedule of Doors D-1)
      const dir = (s===0) ? -1 : 1;
      const hx = x + dir*0.11, hy = yb + 0.03 + 2*cellH;
      box(g,0.018,0.11,0.065,MAT.dark,hx-dir*0.035,hy,lz);         // vertical handle bar
      // triangular arrow head pointing left (<|) on left leaf and right (|>) on right leaf
      box(g,0.075,0.018,0.062,MAT.dark,hx+dir*0.01,hy+0.026,lz);
      box(g,0.075,0.018,0.062,MAT.dark,hx+dir*0.01,hy-0.026,lz);
      box(g,0.018,0.065,0.062,MAT.dark,hx-dir*0.025,hy,lz);
    }
    O.add(g);
  })();
  // D-2 Main Entrance Door (z=3.80..4.70 on x=15.0): vertical fluted light-oak door w/ black bar handle per PERSPECTIVE-01
  (function(){
    const g=grp('D2'); const w=0.90,h=2.10,x=15.0,z=4.25,yb=GENKAN_FL,yc=yb+h/2;
    box(g,0.18,h+0.06,0.06,MAT.extCream,x,yc+0.03,z-w/2-0.02);
    box(g,0.18,h+0.06,0.06,MAT.extCream,x,yc+0.03,z+w/2+0.02);
    box(g,0.18,0.06,w+0.10,MAT.extCream,x,yb+h+0.03,z);
    const oakLight=new THREE.MeshStandardMaterial({color:0xc8ab83,roughness:.55});
    box(g,0.06,h,w,oakLight,x+0.02,yc,z);
    for(let i=0;i<11;i++){
      const sz=z-w/2+0.05+i*0.055;
      box(g,0.015,h-0.08,0.018,MAT.flutedOak,x+0.055,yc,sz);
    }
    box(g,0.03,0.42,0.025,MAT.dark,x+0.065,yb+1.05,z-0.28);        // vertical black bar handle
    O.add(g);
  })();
  doorUnit(O,3.80,4.05,true,0.60,2.10,MAT.doorPVC,iBot,0.7);                 // D-3 a
  doorUnit(O,4.80,4.05,true,0.60,2.10,MAT.doorPVC,iBot,0.7);                 // D-3 b
  doorUnit(O,3.0,2.63,false,0.80,2.10,MAT.doorWood,iBot,-0.85,true);         // D-4 B3 (on x=3.0 wall, hinged S at z=3.03, swings W into B3)
  doorUnit(O,3.0,3.60,false,0.80,2.10,MAT.doorWood,iBot,-0.85,false);        // D-4 B4 (on x=3.0 wall, hinged N at z=3.20, swings W into B4)
  doorUnit(O,4.15,2.63,false,0.80,2.10,MAT.doorWood,iBot,0.85,true);         // D-4 B2 (on x=4.15 wall, hinged S at z=3.03, swings E into B2)
  doorUnit(O,8.70,3.15,true,0.80,2.10,MAT.doorWood,iBot,-0.85,true);         // D-4 B1 (on z=3.15 wall, hinged E at x=9.10, swings N into B1)

  /* ================= CEILING ================= */
  const C=L.ceiling;
  // interior flat ceiling CF-01 (main house x=0..13.65, z=0..6.0)
  box(C,13.5,0.05,5.8,MAT.ceil,6.80,CEIL+0.025,3.0);
  // east wing (Living NE alcove + Genkan x=13.67..15.0, z=0..5.0) ceiling at PORCH_CEIL (2.50 m)
  box(C,1.30,0.05,4.90,MAT.ceil,14.33,PORCH_CEIL+0.025,2.48);
  // recessed pin lights
  const Lg=L.lights;
  const pts=[[1.5,1.4],[4.5,1.4],[7.6,1.4],[11.5,1.4],[11.5,4.5],[8.1,4.4],[4.0,4.9],[1.5,5.0],[3.7,3.3]];
  for(const [lx,lz] of pts) cyl(Lg,0.09,0.09,0.02,MAT.lightDisc,lx,CEIL-0.02,lz);
  for(const lz of [1.2,3.9]) cyl(Lg,0.08,0.08,0.02,MAT.lightDisc,14.35,PORCH_CEIL-0.02,lz);
  // exterior soffit downlights under East C-frame & Carport canopy (visible in PERSPECTIVE-01)
  for(const lz of [1.2,2.6,4.2]) cyl(Lg,0.06,0.06,0.02,MAT.lightDisc,15.22,PORCH_CEIL-0.02,lz);
  // chandelier over dining table
  cyl(Lg,0.22,0.22,0.06,MAT.dark,11.5,CEIL-0.45,4.6);
  cyl(Lg,0.015,0.015,0.42,MAT.dark,11.5,CEIL-0.24,4.6);

  /* ================= MAIN ROOF ================= */
  const Rf=L.roof;
  // monopitch deck over main wing (x=0..13.65, z=0..6.0) concealed below 3.95 m parapet — drains N
  const roofHi=3.76, roofLo=3.40, rz1=0.08, rz2=5.92;
  const deck=new THREE.Mesh(new THREE.BoxGeometry(13.5,0.09,rz2-rz1),MAT.roof);
  deck.position.set(6.80,(roofHi+roofLo)/2,(rz1+rz2)/2);
  deck.rotation.x=-Math.atan2(roofHi-roofLo,rz2-rz1);
  deck.castShadow=deck.receiveShadow=true; Rf.add(deck);
  // east (genkan) wing flat deck (1350 x 5000 on Roof Plan: x=13.67..15.0, z=0..5.0) concealed under 3.15 m C-frame
  box(Rf,1.28,0.08,4.90,MAT.roof,14.33,2.98,2.48);
  // inside gutter at north edge
  box(Rf,13.5,0.12,0.18,MAT.gutter,6.80,roofLo-0.08,0.12);

  // ================= LANAI & CARPORT CANOPY ROOFS (A-01 / A-02 / A-03) =================
  // Per A-02 Roof Plan & PERSPECTIVE-01:
  // - Lanai canopy: x=8.95..12.97 (4020), z=6.0..8.05 (2000)
  // - Carport canopy: x=13.65..18.0 (1350+2970=4320), z=5.0..8.05 (1000+2000=3000)
  // - Both share the same south edge (z=8.05) and ceiling line (PORCH_CEIL=2.50m) with dark bronze fascia & CF-02 wood soffit
  const P=L.porchroof;
  // Lanai canopy
  box(P,4.02,0.14,2.05,MAT.dark,10.96,PORCH_CEIL+0.12,7.025);       // dark fascia / roof body
  box(P,3.90,0.04,1.95,MAT.soffit,10.96,PORCH_CEIL+0.03,7.025);     // CF-02 warm wood soffit
  // Carport canopy (aligned at z=8.05 with Lanai, spanning x=13.65..18.0, z=5.0..8.05)
  box(P,4.35,0.16,3.05,MAT.dark,15.825,PORCH_CEIL+0.13,6.525);      // dark bronze fascia / roof body
  box(P,4.18,0.04,2.88,MAT.soffit,15.825,PORCH_CEIL+0.03,6.525);    // CF-02 warm wood soffit
  // Square dark-bronze portal columns supporting Carport & Lanai canopies (per PERSPECTIVE-01)
  for(const [cx,cz] of [[17.90,5.08],[17.90,7.95],[13.75,7.95],[9.05,7.95],[12.88,7.95]])
    box(P,0.16,PORCH_CEIL+0.20,0.16,MAT.dark,cx,(PORCH_CEIL+0.20)/2,cz);
  // Lanai dark metal horizontal railing along south edge
  box(P,3.70,0.05,0.05,MAT.dark,10.96,LANAI_FL+0.85,7.95);
  box(P,3.70,0.04,0.04,MAT.dark,10.96,LANAI_FL+0.48,7.95);

  /* ================= KITCHEN & T&B FIXTURES ================= */
  const F=L.fixtures;
  const kTop=FFL+0.85;
  // Kitchen (9.64 sqm per A-02 Floor Plan & A-04 Kitchen Blow-Up / Isometric):
  // Exact A-02/A-04 width chain from T&B wall (x=5.60) to east bar face (x=8.75) = 3150 mm:
  //   650 mm west leg & fridge (x=5.60..6.25)
  // + 1500 mm clear center floor & south sink counter (x=6.25..7.75)
  // + 600 mm east stove peninsula (x=7.75..8.35, z=4.35..5.95, length 1600 mm)
  // + 400 mm raised counter table / bar w/ fluted oak front (x=8.35..8.75, z=4.35..5.95)
  const bTop=FFL+1.00;                                            // 850 + 150 = 1000 mm bar height per A-04 Elev A/B
  // 1. West leg base counter (x=5.65..6.25, z=4.82..5.40) + Fridge at NW (x=5.65..6.28, z=4.10..4.80)
  box(F,0.60,0.85,0.58,MAT.cabOak,5.95,FFL+0.425,5.11);           // west leg base (500mm+corner per A-04)
  box(F,0.64,0.05,0.62,MAT.marble,5.95,kTop+0.025,5.11);          // west leg white marble top
  box(F,0.64,1.80,0.70,MAT.applWhite,5.97,FFL+0.90,4.45);         // 1800mm refrigerator (700mm wide per A-04)
  box(F,0.60,0.30,0.70,MAT.cabGrey,5.95,FFL+1.95,4.45);           // 300mm bridge cabinet over fridge per A-04
  // 2. South sink counter run spanning west corner + 1500mm center bay (x=5.65..7.75, z=5.35..5.95)
  box(F,2.10,0.85,0.60,MAT.cabOak,6.70,FFL+0.425,5.65);           // south oak base cabinet
  box(F,2.14,0.05,0.64,MAT.marble,6.70,kTop+0.025,5.65);          // south white marble slab
  // Double-bowl sink centered in the 1500mm center bay (x=7.00) under W-4 window per A-04
  box(F,0.82,0.04,0.46,MAT.steel,7.00,kTop+0.05,5.65);            // double sink rim
  box(F,0.35,0.03,0.36,MAT.dark,6.80,kTop+0.055,5.65);            // left sink bowl
  box(F,0.35,0.03,0.36,MAT.dark,7.20,kTop+0.055,5.65);            // right sink bowl
  cyl(F,0.02,0.02,0.28,MAT.steel,7.00,kTop+0.18,5.84);            // faucet stem
  // 3. East stove peninsula (600mm wide: x=7.75..8.35, 1600mm long: z=4.35..5.95)
  box(F,0.60,0.85,1.60,MAT.cabOak,8.05,FFL+0.425,5.15);           // stove counter base (600x1600)
  box(F,0.64,0.05,1.64,MAT.marble,8.05,kTop+0.025,5.15);          // stove counter marble top
  box(F,0.52,0.03,0.52,MAT.dark,8.05,kTop+0.06,4.90);             // 4-burner cooktop
  for(const [sx,sz] of [[7.92,4.76],[8.18,4.76],[7.92,5.04],[8.18,5.04]])
    cyl(F,0.055,0.055,0.01,MAT.applWhite,sx,kTop+0.075,sz);
  box(F,0.60,0.06,0.45,MAT.steel,8.05,CEIL-0.85,4.90);            // range hood
  box(F,0.10,0.55,0.10,MAT.steel,8.05,CEIL-0.55,4.90);
  // 4. East raised Counter Table / Breakfast Bar (400mm wide: x=8.35..8.75, 1600mm long: z=4.35..5.95)
  box(F,0.40,1.00,1.60,MAT.dark,8.55,FFL+0.50,5.15);              // raised bar frame (400x1600, h=1000mm)
  box(F,0.44,0.05,1.64,MAT.dark,8.55,bTop+0.025,5.15);            // bar top slab
  box(F,0.04,0.96,1.56,MAT.flutedOak,8.76,FFL+0.48,5.15);         // WPC fluted oak panel facing dining
  // Overhead gloss-grey cabinets (650mm high) along south & west walls per A-04 Isometric
  box(F,2.10,0.65,0.35,MAT.cabGrey,6.70,FFL+1.78,5.78);           // south overhead cabinet
  box(F,0.35,0.65,0.65,MAT.cabGrey,5.82,FFL+1.78,5.12);           // west overhead cabinet
  // Suspended bar drop-soffit & 2 pendant lights above Counter Table per A-04 Isometric & Elev A/B
  box(F,0.42,0.12,1.60,MAT.cabOak,8.55,CEIL-0.45,5.15);           // suspended bar ceiling feature
  for(const pz of [4.75,5.45]){
    cyl(F,0.01,0.01,0.45,MAT.dark,8.55,CEIL-0.70,pz);             // pendant cord
    cyl(F,0.05,0.07,0.16,MAT.lightDisc,8.55,CEIL-0.95,pz);        // pendant lamp
  }
  // Bar stools on the dining side of the Counter Table (x=9.02, well clear of dining table at x=10.6..12.4)
  for(const sz of [4.75,5.45]){
    cyl(F,0.025,0.025,0.68,MAT.dark,9.02,FFL+0.34,sz);
    cyl(F,0.19,0.16,0.06,MAT.cabOak,9.02,FFL+0.70,sz);
  }
  // T&B-a (west): WC + lavatory
  cyl(F,0.22,0.28,0.42,MAT.porcelain,3.75,FFL+0.21,4.65);
  box(F,0.42,0.55,0.2,MAT.porcelain,3.75,FFL+0.62,4.2);          // tank
  cyl(F,0.18,0.15,0.12,MAT.porcelain,3.75,FFL+0.85,5.4);         // lavatory bowl
  box(F,0.5,0.05,0.4,MAT.marble,3.75,FFL+0.8,5.45);              // vanity top
  box(F,0.5,0.6,0.05,MAT.glass,3.75,FFL+1.4,5.85);               // mirror
  // T&B-b (east): shower + WC
  cyl(F,0.22,0.28,0.42,MAT.porcelain,4.95,FFL+0.21,4.6);
  box(F,0.42,0.55,0.2,MAT.porcelain,4.95,FFL+0.62,4.2);
  box(F,1.0,0.06,0.9,MAT.floorNS,5.05,FFL+0.03,5.4);            // shower tray
  cyl(F,0.02,0.02,1.9,MAT.steel,5.35,FFL+0.95,5.8);
  cyl(F,0.09,0.09,0.02,MAT.steel,5.35,FFL+1.95,5.62);           // shower head

  /* ================= FURNITURE (estimated) ================= */
  const Fu=L.furniture;
  function bed(x,z,w,l,mat2,ry=0){
    const g=grp('bed');
    box(g,w,0.28,l,MAT.wood,0,FFL+0.14,0);
    box(g,w-0.1,0.16,l-0.1,MAT.applWhite,0,FFL+0.36,0);
    box(g,w-0.14,0.12,l*0.72,mat2,0,FFL+0.46,l*0.08);
    box(g,w,0.7,0.08,MAT.wood,0,FFL+0.35,-l/2+0.04);
    box(g,w*0.4,0.12,0.3,MAT.applWhite,-w*0.22,FFL+0.5,-l/2+0.25);
    box(g,w*0.4,0.12,0.3,MAT.applWhite,w*0.22,FFL+0.5,-l/2+0.25);
    g.position.set(x,0,z); g.rotation.y=ry; Fu.add(g);
  }
  bed(7.7,1.4,1.6,2.0,new THREE.MeshStandardMaterial({color:0x7d8fb0}));              // B1 queen
  bed(4.3,0.95,1.2,1.9,new THREE.MeshStandardMaterial({color:0x9a8a72}),Math.PI/2);  // B2 bed (head W, along N wall per plan)
  bed(1.1,1.1,1.4,1.9,new THREE.MeshStandardMaterial({color:0x6f8a6f}),Math.PI/2);   // B3 double (head against W wall per plan)
  bed(1.1,4.9,1.4,1.9,new THREE.MeshStandardMaterial({color:0x8a6f7d}),Math.PI/2);   // B4 double (head against W wall per plan)
  // wardrobes ( clear of the stepped walls + vertical D-4 doors )
  for(const [wx,wz,w,ry] of [[9.1,1.6,0.5,Math.PI/2],[5.7,1.0,0.5,Math.PI/2],[2.5,0.45,0.5,0],[2.5,5.55,0.5,0]])
    box(Fu,0.6,1.9,w,MAT.cabOak,wx,FFL+0.95,wz,ry);
  // living area: TV console + wall-mounted TV on north wall (x=11.65, z=0.25),
  // large 3-seater couch directly in front of the TV (x=11.65, z=2.25, facing north toward TV),
  // coffee table & area rug centered between couch and TV, plus accent armchair on west side
  floorSlab(Fu,10.0,0.65,13.1,2.55,FFL+0.015,0.015,new THREE.MeshStandardMaterial({color:0xd8d2c7,roughness:.92})); // area rug
  // Large 3-seater couch facing the TV (centered at x=11.65, z=2.25, facing north -Z)
  box(Fu,2.20,0.40,0.85,MAT.fabric,11.65,FFL+0.20,2.22);          // couch seat base + cushions
  box(Fu,2.20,0.82,0.22,MAT.fabric,11.65,FFL+0.41,2.58);          // couch backrest (on south side, facing north TV)
  box(Fu,0.18,0.60,0.85,MAT.fabric,10.64,FFL+0.30,2.22);          // left armrest
  box(Fu,0.18,0.60,0.85,MAT.fabric,12.66,FFL+0.30,2.22);          // right armrest
  // Single accent armchair on west side facing east toward coffee table (per A-02 plan)
  box(Fu,0.80,0.40,0.82,MAT.fabric,9.95,FFL+0.20,1.30);           // armchair seat
  box(Fu,0.20,0.78,0.82,MAT.fabric,9.62,FFL+0.39,1.30);           // armchair backrest
  box(Fu,0.80,0.56,0.14,MAT.fabric,9.95,FFL+0.28,0.94);           // armchair N arm
  box(Fu,0.80,0.56,0.14,MAT.fabric,9.95,FFL+0.28,1.66);           // armchair S arm
  // Corner side table next to couch/armchair
  box(Fu,0.48,0.48,0.48,MAT.wood,9.95,FFL+0.24,2.25);
  // Coffee table centered between the large couch and TV
  box(Fu,1.25,0.36,0.62,MAT.wood,11.65,FFL+0.18,1.28);            // coffee table
  // TV console + TV centered at x=11.65 on north wall directly opposite the large couch
  box(Fu,1.65,0.42,0.38,MAT.cabOak,11.65,FFL+0.21,0.26);          // TV console
  box(Fu,1.30,0.72,0.05,MAT.dark,11.65,FFL+0.92,0.12);            // TV screen
  // dining table + 6 chairs
  box(Fu,1.8,0.06,0.95,MAT.wood,11.5,FFL+0.72,4.6);
  for(const [tx,tz] of [[10.85,4.25],[12.15,4.25],[10.85,4.95],[12.15,4.95]])
    box(Fu,0.05,0.72,0.05,MAT.wood,tx,FFL+0.36,tz);
  for(const [cx,cz,ry] of [[10.7,3.95,0],[11.4,3.95,0],[12.1,3.95,0],[10.7,5.25,Math.PI],[11.4,5.25,Math.PI],[12.1,5.25,Math.PI]]){
    const ch=grp('chair');
    box(ch,0.42,0.05,0.42,MAT.cabGrey,0,FFL+0.45,0);
    box(ch,0.42,0.5,0.05,MAT.cabGrey,0,FFL+0.72,-0.2);
    for(const [lx,lz] of [[-0.17,-0.17],[0.17,-0.17],[-0.17,0.17],[0.17,0.17]])
      box(ch,0.04,0.45,0.04,MAT.dark,lx,FFL+0.22,lz);
    ch.position.set(cx,0,cz); ch.rotation.y=ry; Fu.add(ch);
  }
  // genkan bench + shoe cabinet (Genkan is at z=2.95..5.0 per A-02)
  box(Fu,0.38,0.85,1.0,MAT.cabOak,13.95,GENKAN_FL+0.425,3.85);
  // lanai chairs + table
  for(const [lx,lz] of [[10.3,7.2],[11.9,7.2]]){
    cyl(Fu,0.03,0.03,0.45,MAT.dark,lx,LANAI_FL+0.22,lz);
    box(Fu,0.45,0.05,0.45,MAT.cabOak,lx,LANAI_FL+0.47,lz);
  }
  cyl(Fu,0.35,0.35,0.05,MAT.wood,11.1,LANAI_FL+0.6,7.0);
  cyl(Fu,0.03,0.03,0.6,MAT.dark,11.1,LANAI_FL+0.3,7.0);
  // carport car (parked under SE carport canopy x=13.65..18.0, z=5.0..8.0 per A-02)
  (function(){
    const g=grp('car');
    box(g,4.1,0.52,1.72,MAT.dark,0,0.42,0);
    box(g,2.1,0.46,1.58,MAT.dark,-0.15,0.85,0);
    box(g,1.9,0.40,1.48,MAT.glass,-0.15,0.86,0);
    for(const [wx,wz] of [[-1.35,-0.82],[1.35,-0.82],[-1.35,0.82],[1.35,0.82]]){
      const wgeo=new THREE.CylinderGeometry(0.31,0.31,0.22,14);
      const wm=new THREE.Mesh(wgeo,MAT.frame);
      wm.rotation.x=Math.PI/2; wm.position.set(wx,0.31,wz); g.add(wm);
    }
    g.position.set(15.85,0.10,6.55); Fu.add(g);
  })();

  /* ================= STRUCTURE (S-02) ================= */
  const S=L.structure;
  // columns C-1 160x250 at grid intersections
  const colX=[0,3.0,5.95,9.35,13.67,15.0], colZ=[0,6.0];
  for(const cx of colX) for(const cz of colZ)
    if(!(cx===15.0 && cz===6.0)) box(S,0.16,3.4,0.25,MAT.concrete,cx,1.7,cz);
  for(const cx of [0,3.0,5.95,9.35,13.67,15.0])
    box(S,0.16,3.4,0.25,MAT.concrete,cx,1.7,2.75);
  // roof beams along walls (200x400 est.)
  for(const bz of [0,6.0]) box(S,13.67,0.4,0.2,MAT.concrete,6.835,CEIL+0.35,bz);
  for(const bx of [0,13.67]) box(S,0.2,0.4,6.0,MAT.concrete,bx,CEIL+0.35,3.0);
  // rafters 2x3 tubular @600 along x (spanning N-S at roof slope)
  for(let x=0.3;x<13.6;x+=0.6){
    const r=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.075,5.9),MAT.steel);
    r.position.set(x,(roofHi+roofLo)/2-0.06,3.0);
    r.rotation.x=-Math.atan2(roofHi-roofLo,5.9);
    S.add(r);
  }
  // purlins 2x4 @600 along slope
  for(let i=0;i<9;i++){
    const z=0.2+i*0.70;
    const y=roofLo+(roofHi-roofLo)*(5.92-z)/5.84 - 0.02;
    box(S,13.6,0.05,0.1,MAT.steel,6.8,y,z);
  }
  // porch roofs: 2x3 rafters N-S @600 (S-02 framing plan)
  for(let x=9.1;x<13.0;x+=0.6) box(S,0.05,0.075,2.0,MAT.steel,x,PORCH_CEIL+0.02,7.05);
  for(let x=13.75;x<18.0;x+=0.6) box(S,0.05,0.075,3.0,MAT.steel,x,PORCH_CEIL+0.02,6.55);

  /* ================= LABELS ================= */
  const Lb=L.labels;
  label(Lb,'BEDROOM 3',1.5,CEIL+0.4,1.4);
  label(Lb,'BEDROOM 2',4.5,CEIL+0.4,1.4);
  label(Lb,'BEDROOM 1',7.6,CEIL+0.4,1.4);
  label(Lb,'LIVING',11.5,CEIL+0.4,1.5);
  label(Lb,'GENKAN',14.3,CEIL+0.4,4.0);
  label(Lb,'BEDROOM 4',1.4,CEIL+0.4,4.7);
  label(Lb,'T&B',4.3,CEIL+0.4,5.0);
  label(Lb,'KITCHEN',7.0,CEIL+0.4,4.7);
  label(Lb,'DINING',11.5,CEIL+0.4,4.9);
  label(Lb,'HALLWAY',3.7,CEIL+0.4,3.3);
  label(Lb,'LANAI',11.0,CEIL+0.4,7.1);
  label(Lb,'D-1',11.45,CEIL+0.4,6.0);
  label(Lb,'CARPORT',15.8,CEIL+0.4,6.5);

  for(const k in L){ scene.add(L[k]); }
  L.structure.visible=false;
  L.labels.visible=false;
  return {layers:L};
}
