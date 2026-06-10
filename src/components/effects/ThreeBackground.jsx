import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Wallpaper-Engine-style breathing WebGL background, ported 1:1 from the original
// threejs-bg.js: a full-screen simplex-noise nebula + a 5000-point breathing
// particle field that reacts to the mouse, with a slow parallax camera drift.
// (The two decorative spheres from the original were hidden there, so omitted.)

const nebulaVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}`;

const nebulaFragment = `
precision highp float;
uniform float uTime;
uniform vec2  uMouse;
varying vec2  vUv;

vec3 mod289_3(vec3 x){ return x - floor(x*(1./289.))*289.; }
vec2 mod289_2(vec2 x){ return x - floor(x*(1./289.))*289.; }
vec3 permute3(vec3 x){ return mod289_3(((x*34.)+1.)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(.211324865,.366025404,-.577350269,.024390244);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289_2(i);
  vec3 p = permute3(permute3(i.y + vec3(0.,i1.y,1.)) + i.x + vec3(0.,i1.x,1.));
  vec3 m = max(.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.);
  m = m*m; m = m*m;
  vec3 a0 = 2.*fract(p*C.www) - 1.;
  vec3 h  = abs(a0) - .5;
  vec3 ox = floor(a0 + .5);
  a0 -= ox;
  m *= 1.79284291 - .85373472*(a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x *x0.x  + h.x *x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.*dot(m,g);
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.10;
  float breath = sin(uTime * 0.38) * 0.5 + 0.5;

  float n1 = snoise(uv*2.2 + vec2(t*.25, t*.18) + uMouse*.12);
  float n2 = snoise(uv*4.8 + vec2(-t*.18, t*.12));
  float n3 = snoise(uv*9.5 + vec2(t*.08, -t*.20));
  float n4 = snoise(uv*1.1 + vec2(t*.04,  t*.06));

  float neb = (n1*.50 + n2*.25 + n3*.15 + n4*.10) * 0.5 + 0.5;

  vec3 c1 = vec3(.005, .010, .060);
  vec3 c2 = vec3(.080, .010, .280);
  vec3 c3 = vec3(.000, .160, .340);
  vec3 c4 = vec3(.050, .020, .200);

  vec3 col = mix(c1, c2, neb);
  col = mix(col, c3, (n2*.5+.5)*.65);
  col = mix(col, c4, (n4*.5+.5)*.45);

  float glow = pow(max(0., neb - .38), 2.0) * 2.8;
  col += vec3(0.0, .45, .80) * glow * (breath*.5 + .5);

  float glow2 = pow(max(0., n2*.5+.5 - .48), 1.8) * 2.0;
  col += vec3(.50, .04, .80) * glow2;

  float glow3 = pow(max(0., n3*.5+.5 - .55), 2.2) * 1.4;
  col += vec3(0.0, .70, .60) * glow3 * .4;

  float sparkle = pow(max(0., n3*.5+.5 - .78), 4.) * 8.;
  col += vec3(1., 1., 1.) * sparkle;

  vec2 ctr = uv - .5;
  float vig = 1. - dot(ctr,ctr) * 0.70;
  col *= max(0., vig);

  gl_FragColor = vec4(col, 0.55);
}`;

const particleVertex = `
attribute vec3  aRandom;
attribute float aSize;
uniform float   uTime;
uniform vec2    uMouse;
varying float   vAlpha;
varying vec3    vColor;

void main() {
  vec3 p = position;
  p.y += sin(uTime*.55 + aRandom.x*6.2832 + p.x*.45) * .28
       + sin(uTime*.38 + aRandom.y*6.2832 + p.y*.35) * .20;
  p.x += cos(uTime*.32 + aRandom.z*6.2832 + p.z*.28) * .18;

  vec2  mW  = uMouse * vec2(10., 7.);
  float d   = length(p.xy - mW);
  float def = smoothstep(2.8, 0., d);
  p.xy += normalize(p.xy - mW + .001) * def * .8;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position  = projectionMatrix * mv;
  gl_PointSize = aSize * (380. / -mv.z);

  vColor = mix(
    vec3(0., .85, 1.0),
    mix(vec3(.75, .10, 1.0), vec3(1., 1., 1.), aRandom.z),
    aRandom.x);

  vAlpha = .15 + .30*(sin(uTime*.75 + aRandom.y*12.5664)*.5+.5);
}`;

const particleFragment = `
precision highp float;
varying float vAlpha;
varying vec3  vColor;
void main() {
  vec2  uv   = gl_PointCoord - .5;
  float d    = length(uv);
  if (d > .5) discard;
  float a    = pow(1. - d*2., 1.4) * vAlpha;
  float glow = pow(1. - d*2., 3.) * 1.0;
  gl_FragColor = vec4(vColor + glow, a * 1.0);
}`;

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;';
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const handleMouse = (e) => {
      target.x = (e.clientX / W) * 2 - 1;
      target.y = -(e.clientY / H) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouse);

    // Nebula
    const nebMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: nebulaVertex,
        fragmentShader: nebulaFragment,
        uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) } },
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    );
    nebMesh.frustumCulled = false;
    nebMesh.renderOrder = -10;
    scene.add(nebMesh);

    // Particle field
    const N = 5000;
    const pos = new Float32Array(N * 3);
    const rnd = new Float32Array(N * 3);
    const szs = new Float32Array(N);
    for (let i = 0; i < N; i += 1) {
      if (Math.random() < 0.35) {
        const side = Math.random() < 0.5 ? -1 : 1;
        pos[i * 3] = side * (5.0 + Math.random() * 5.0);
      } else {
        pos[i * 3] = (Math.random() - 0.5) * 20;
      }
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      rnd[i * 3] = Math.random();
      rnd[i * 3 + 1] = Math.random();
      rnd[i * 3 + 2] = Math.random();
      szs[i] = Math.random() * 2.5 + 0.8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('aRandom', new THREE.BufferAttribute(rnd, 3));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(szs, 1));
    const pMat = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    const clock = new THREE.Clock();
    let frameId;
    const tick = () => {
      frameId = window.requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      mouse.x += (target.x - mouse.x) * 0.055;
      mouse.y += (target.y - mouse.y) * 0.055;
      nebMesh.material.uniforms.uTime.value = t;
      nebMesh.material.uniforms.uMouse.value = mouse;
      pMat.uniforms.uTime.value = t;
      pMat.uniforms.uMouse.value = mouse;
      camera.position.x = Math.sin(t * 0.07) * 0.25;
      camera.position.y = Math.cos(t * 0.05) * 0.18;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    tick();

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      nebMesh.geometry.dispose();
      nebMesh.material.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" />;
}
