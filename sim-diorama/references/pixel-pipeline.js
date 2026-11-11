// Hearthblock(2026-10-30)에서 그대로 뽑은 픽셀아트 파이프라인. three.js r128 전역 THREE 기준.
// 필요한 바깥 이름: renderer, scene, cam(OrthographicCamera), V3=THREE.Vector3, hex(0xRRGGBB)->[r,g,b] 0..1, lerp, angLerp, view.{tx,ty,tz,rot,rotA,zoom,pix,raw}, 무대 요소 id 'stage'.
// 팔레트는 주제에 맞게 64색을 다시 고른다(어두운 남색~흰색 램프, 초록·물·나무·불·피부 램프). 개수는 64로 유지(셰이더 배열 크기).
// 별(stars) 줄과 follow 줄은 Hearthblock 전용이라 뺐다.
const PAL_HEX=[0x0d0b14,0x1b1726,0x2a2438,0x3b3350,0x4f4a5e,0x6b6678,0x8a8696,0xaaa6b2,0xc9c6cf,0xe8e6ea,0xffffff,
0x1a2140,0x253463,0x34508a,0x4a72b0,0x6f9ad0,0xa3c6ea,0xd2e7f7,
0x14301f,0x1f4a2a,0x2d6634,0x3f8640,0x5aa44a,0x7fc25a,0xa8d872,0xd2ec9a,
0x10393f,0x1a5a62,0x2a808a,0x44a8b0,0x7bd1d0,
0x2b1a12,0x40271a,0x5a3824,0x774c30,0x96643d,0xb4804f,0xcfa068,0xe6c48e,
0xf2dca8,0xe8c060,0xd09a38,0xa8722a,
0x5c1a1a,0x8e2a22,0xc23e2a,0xe66a32,0xf59a3e,0xffc85a,0xfff0a0,
0x6e3a3a,0xa85a4a,0xd88a6a,0xf0b896,0xffd9c0,
0x3a2348,0x5a3466,0x85507e,0xb57a96,
0x4c6b3a,0x6f8f4d,0x2e1e2e,0xf7f3e3,0x9ab0a0];
function oklab(c){const lin=v=>Math.pow(v,2.2);const r=lin(c[0]),g=lin(c[1]),b=lin(c[2]);
  let l=0.4122214708*r+0.5363325363*g+0.0514459929*b,m=0.2119034982*r+0.6806995451*g+0.1073969566*b,s=0.0883024619*r+0.2817188376*g+0.6299787005*b;
  l=Math.cbrt(l);m=Math.cbrt(m);s=Math.cbrt(s);
  return new V3(0.2104542553*l+0.7936177850*m-0.0040720468*s,1.9779984951*l-2.4285922050*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.8086757660*s);}
const palRGB=PAL_HEX.map(h=>new V3(...hex(h))),palLab=PAL_HEX.map(h=>oklab(hex(h)));
const postU={tColor:{value:null},tDepth:{value:null},uRes:{value:new THREE.Vector2(1,1)},uPal:{value:palRGB},uLab:{value:palLab},uThr:{value:0.0018}};
const postMat=new THREE.ShaderMaterial({uniforms:postU,depthTest:false,depthWrite:false,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}`,
  fragmentShader:`precision highp float;varying vec2 vUv;uniform sampler2D tColor;uniform sampler2D tDepth;uniform vec2 uRes;uniform vec3 uPal[64];uniform vec3 uLab[64];uniform float uThr;
vec3 oklab(vec3 c){c=pow(max(c,vec3(1e-6)),vec3(2.2));
 float l=0.4122214708*c.r+0.5363325363*c.g+0.0514459929*c.b;float m=0.2119034982*c.r+0.6806995451*c.g+0.1073969566*c.b;float s=0.0883024619*c.r+0.2817188376*c.g+0.6299787005*c.b;
 l=pow(l,1.0/3.0);m=pow(m,1.0/3.0);s=pow(s,1.0/3.0);
 return vec3(0.2104542553*l+0.7936177850*m-0.0040720468*s,1.9779984951*l-2.4285922050*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.8086757660*s);}
void main(){vec2 px=1.0/uRes;vec2 uv=(floor(vUv*uRes)+0.5)*px;
 vec3 col=texture2D(tColor,uv).rgb;float d=texture2D(tDepth,uv).r;
 float dn=max(max(texture2D(tDepth,uv+vec2(px.x,0.0)).r,texture2D(tDepth,uv-vec2(px.x,0.0)).r),max(texture2D(tDepth,uv+vec2(0.0,px.y)).r,texture2D(tDepth,uv-vec2(0.0,px.y)).r));
 if(d<0.9999&&dn-d>uThr)col*=0.45;
 vec3 lab=oklab(col);float best=1e9;vec3 bc=col;
 for(int i=0;i<64;i++){vec3 e=uLab[i]-lab;float q=dot(e,e);if(q<best){best=q;bc=uPal[i];}}
 gl_FragColor=vec4(bc,1.0);}`});
const postScene=new THREE.Scene();const postCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),postMat));
let rt=null,lowW=1,lowH=1,cssW=1,cssH=1;
const view={tx:23.5,ty:S+1,tz:26,rot:0,rotA:0,zoom:store.get('zoom',0.9),pix:store.get('pix',3),raw:false,overlay:false,follow:false};
function resize(){const r=document.getElementById('stage').getBoundingClientRect();cssW=Math.max(1,r.width);cssH=Math.max(1,r.height);renderer.setSize(cssW,cssH,false);
  lowW=Math.max(32,Math.floor(cssW/view.pix));lowH=Math.max(24,Math.floor(cssH/view.pix));
  if(rt){rt.dispose();rt.depthTexture.dispose();}
  const dt=new THREE.DepthTexture(lowW,lowH);dt.type=THREE.UnsignedIntType;
  rt=new THREE.WebGLRenderTarget(lowW,lowH,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,depthBuffer:true,depthTexture:dt});
  postU.uRes.value.set(lowW,lowH);}
new ResizeObserver(resize).observe(document.getElementById('stage'));resize();


const _r=new V3(),_u=new V3();
function updateCamera(dt){
  view.rotA=angLerp(view.rotA,view.rot*Math.PI/2,Math.min(1,dt*9));
  const az=Math.PI/4+view.rotA,el=Math.PI/6,dist=150;
  cam.position.set(view.tx+dist*Math.cos(el)*Math.sin(az),view.ty+dist*Math.sin(el),view.tz+dist*Math.cos(el)*Math.cos(az));cam.lookAt(view.tx,view.ty,view.tz);
  const vh=30/view.zoom,asp=cssW/cssH;cam.top=vh/2;cam.bottom=-vh/2;cam.left=-vh*asp/2;cam.right=vh*asp/2;cam.updateProjectionMatrix();cam.updateMatrixWorld();
  if(!view.raw){const ps=vh/lowH;_r.setFromMatrixColumn(cam.matrixWorld,0);_u.setFromMatrixColumn(cam.matrixWorld,1);const a=cam.position.dot(_r),b=cam.position.dot(_u);
    cam.position.addScaledVector(_r,Math.round(a/ps)*ps-a).addScaledVector(_u,Math.round(b/ps)*ps-b);cam.updateMatrixWorld();}
}

// 매 프레임 끝: 원본 3D 또는 저해상도 타깃 → 후처리
function renderPixel(){
  else{renderer.setRenderTarget(rt);renderer.render(scene,cam);renderer.setRenderTarget(null);postU.tColor.value=rt.texture;postU.tDepth.value=rt.depthTexture;renderer.render(postScene,postCam);}
  updateLabels(rdt);
}
