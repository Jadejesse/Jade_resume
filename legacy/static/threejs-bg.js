// threejs-bg.js — Wallpaper Engine style WebGL background for resume.html
// Three.js r128  |  GLSL ES 1.0 shaders

(function () {
  'use strict';

  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = init;
  document.head.appendChild(s);

  function init() {
    var W = window.innerWidth, H = window.innerHeight;

    // ── Renderer ────────────────────────────────────────────────
    var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    var canvas = renderer.domElement;
    canvas.id = 'threejs-bg';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;';

    // Insert after .ambient-dust so EVA body::before stays below
    var anchor = document.querySelector('.ambient-dust') ||
                 document.querySelector('.bg-anim') ||
                 document.body.firstChild;
    anchor.parentNode.insertBefore(canvas, anchor.nextSibling);

    // ── Scene & Camera ───────────────────────────────────────────
    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    // ── Mouse tracking ───────────────────────────────────────────
    var mouse  = new THREE.Vector2(0, 0);
    var target = new THREE.Vector2(0, 0);
    window.addEventListener('mousemove', function (e) {
      target.x =  (e.clientX / W) * 2 - 1;
      target.y = -(e.clientY / H) * 2 + 1;
    });

    // ═══════════════════════════════════════════════════════════════
    // 1. NEBULA BACKGROUND  (full-screen clip-space quad)
    // ═══════════════════════════════════════════════════════════════
    // Vertex: directly output NDC so the quad always fills the screen
    var nebVert = [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = vec4(position.xy, 0.9999, 1.0);',
      '}'
    ].join('\n');

    // GLSL ES 1.0 simplex noise — no overloaded functions
    var nebFrag = [
      'precision highp float;',
      'uniform float uTime;',
      'uniform vec2  uMouse;',
      'varying vec2  vUv;',

      'vec3 mod289_3(vec3 x){ return x - floor(x*(1./289.))*289.; }',
      'vec2 mod289_2(vec2 x){ return x - floor(x*(1./289.))*289.; }',
      'vec3 permute3(vec3 x){ return mod289_3(((x*34.)+1.)*x); }',

      'float snoise(vec2 v) {',
      '  const vec4 C = vec4(.211324865,.366025404,-.577350269,.024390244);',
      '  vec2 i  = floor(v + dot(v, C.yy));',
      '  vec2 x0 = v - i + dot(i, C.xx);',
      '  vec2 i1 = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);',
      '  vec4 x12 = x0.xyxy + C.xxzz;',
      '  x12.xy -= i1;',
      '  i = mod289_2(i);',
      '  vec3 p = permute3(permute3(i.y + vec3(0.,i1.y,1.)) + i.x + vec3(0.,i1.x,1.));',
      '  vec3 m = max(.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.);',
      '  m = m*m; m = m*m;',
      '  vec3 a0 = 2.*fract(p*C.www) - 1.;',
      '  vec3 h  = abs(a0) - .5;',
      '  vec3 ox = floor(a0 + .5);',
      '  a0 -= ox;',
      '  m *= 1.79284291 - .85373472*(a0*a0 + h*h);',
      '  vec3 g;',
      '  g.x  = a0.x *x0.x  + h.x *x0.y;',
      '  g.yz = a0.yz*x12.xz + h.yz*x12.yw;',
      '  return 130.*dot(m,g);',
      '}',

      'void main() {',
      '  vec2 uv = vUv;',
      '  float t = uTime * 0.10;',
      '  float breath = sin(uTime * 0.38) * 0.5 + 0.5;',

      '  float n1 = snoise(uv*2.2 + vec2(t*.25, t*.18) + uMouse*.12);',
      '  float n2 = snoise(uv*4.8 + vec2(-t*.18, t*.12));',
      '  float n3 = snoise(uv*9.5 + vec2(t*.08, -t*.20));',
      '  float n4 = snoise(uv*1.1 + vec2(t*.04,  t*.06));',

      '  float neb = (n1*.50 + n2*.25 + n3*.15 + n4*.10) * 0.5 + 0.5;',

      // deep-space palette — vivid purples, rich teals, dark navy base
      '  vec3 c1 = vec3(.005, .010, .060);',  // near-black deep space
      '  vec3 c2 = vec3(.080, .010, .280);',  // rich violet
      '  vec3 c3 = vec3(.000, .160, .340);',  // deep teal
      '  vec3 c4 = vec3(.050, .020, .200);',  // indigo

      '  vec3 col = mix(c1, c2, neb);',
      '  col = mix(col, c3, (n2*.5+.5)*.65);',
      '  col = mix(col, c4, (n4*.5+.5)*.45);',

      // bright cyan nebula glow pockets
      '  float glow = pow(max(0., neb - .38), 2.0) * 2.8;',
      '  col += vec3(0.0, .45, .80) * glow * (breath*.5 + .5);',

      // magenta/violet cloud bloom
      '  float glow2 = pow(max(0., n2*.5+.5 - .48), 1.8) * 2.0;',
      '  col += vec3(.50, .04, .80) * glow2;',

      // teal accent wisps
      '  float glow3 = pow(max(0., n3*.5+.5 - .55), 2.2) * 1.4;',
      '  col += vec3(0.0, .70, .60) * glow3 * .4;',

      // star sparkles
      '  float sparkle = pow(max(0., n3*.5+.5 - .78), 4.) * 8.;',
      '  col += vec3(1., 1., 1.) * sparkle;',

      // vignette — darker edges for depth
      '  vec2 ctr = uv - .5;',
      '  float vig = 1. - dot(ctr,ctr) * 0.70;',
      '  col *= max(0., vig);',

      '  gl_FragColor = vec4(col, 0.55);',
      '}'
    ].join('\n');

    var nebMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader:   nebVert,
        fragmentShader: nebFrag,
        uniforms: {
          uTime:  { value: 0.0 },
          uMouse: { value: new THREE.Vector2(0, 0) }
        },
        transparent: true,
        depthWrite:  false,
        depthTest:   false
      })
    );
    nebMesh.frustumCulled = false;
    nebMesh.renderOrder   = -10;
    scene.add(nebMesh);

    // ═══════════════════════════════════════════════════════════════
    // 2. GLOWING BREATHING SPHERE (rim lighting + AdditiveBlending)
    // ═══════════════════════════════════════════════════════════════
    var sphVert = [
      'varying vec3 vNormal;',
      'varying vec3 vWorldPos;',
      'uniform float uTime;',
      'void main() {',
      '  vNormal   = normalMatrix * normal;',
      '  float b   = sin(uTime * 0.45) * 0.07 + 1.0;',
      '  vec3  p   = position * b;',
      '  vWorldPos = (modelMatrix * vec4(p, 1.0)).xyz;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);',
      '}'
    ].join('\n');

    var sphFrag = [
      'precision highp float;',
      'varying vec3  vNormal;',
      'varying vec3  vWorldPos;',
      'uniform float uTime;',
      'uniform vec3  uCamPos;',
      'void main() {',
      '  vec3  N     = normalize(vNormal);',
      '  vec3  V     = normalize(uCamPos - vWorldPos);',
      '  float rim   = 1.0 - max(0.0, dot(N, V));',
      '  rim         = pow(rim, 2.2);',
      '  float breath = sin(uTime * 0.45) * 0.5 + 0.5;',
      '  vec3 rimCol  = mix(vec3(0.0, .95, 1.0), vec3(.75, 0., 1.0), breath);',
      '  vec3 coreCol = vec3(0.0, .30, .55) * (.4 + breath * .5);',
      '  vec3 col     = coreCol*(1.-rim) + rimCol*rim*3.2;',
      '  gl_FragColor = vec4(col, rim*.90 + .06);',
      '}'
    ].join('\n');

    var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 48, 48),
      new THREE.ShaderMaterial({
        vertexShader:   sphVert,
        fragmentShader: sphFrag,
        uniforms: {
          uTime:   { value: 0.0 },
          uCamPos: { value: camera.position }
        },
        transparent: true,
        side:        THREE.FrontSide,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false
      })
    );
    sphere.position.set(2.8, -0.6, -1.5);
    scene.add(sphere);

    // Left sphere — magenta primary, phase-offset breathing
    var sphFragL = [
      'precision highp float;',
      'varying vec3  vNormal;',
      'varying vec3  vWorldPos;',
      'uniform float uTime;',
      'uniform vec3  uCamPos;',
      'void main() {',
      '  vec3  N      = normalize(vNormal);',
      '  vec3  V      = normalize(uCamPos - vWorldPos);',
      '  float rim    = 1.0 - max(0.0, dot(N, V));',
      '  rim          = pow(rim, 2.4);',
      '  float breath = sin(uTime * 0.45 + 1.57) * 0.5 + 0.5;',
      '  vec3 rimCol  = mix(vec3(.85, 0., 1.0), vec3(0., .85, 1.0), breath);',
      '  vec3 coreCol = vec3(.35, 0., .55) * (.4 + breath * .5);',
      '  vec3 col     = coreCol*(1.-rim) + rimCol*rim*3.0;',
      '  gl_FragColor = vec4(col, rim*.88 + .06);',
      '}'
    ].join('\n');

    var sphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 48, 48),
      new THREE.ShaderMaterial({
        vertexShader:   sphVert,
        fragmentShader: sphFragL,
        uniforms: {
          uTime:   { value: 0.0 },
          uCamPos: { value: camera.position }
        },
        transparent: true,
        side:        THREE.FrontSide,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false
      })
    );
    sphere2.position.set(-2.8, 0.6, -1.5);
    scene.add(sphere2);

    // Decorative spheres kept out of view — nebula + particles only.
    sphere.visible = false;
    sphere2.visible = false;

    // ═══════════════════════════════════════════════════════════════
    // 3. PARTICLE FIELD  (5000 pts, wave breathing + mouse deflect)
    //    35% of particles biased to side columns (x ± 5–10)
    //    for visible density beside the content cards
    // ═══════════════════════════════════════════════════════════════
    var N   = 5000;
    var pos = new Float32Array(N * 3);
    var rnd = new Float32Array(N * 3);
    var szs = new Float32Array(N);

    for (var i = 0; i < N; i++) {
      // 35% go to side columns, rest fill the full spread
      if (Math.random() < 0.35) {
        var side = Math.random() < 0.5 ? -1 : 1;
        pos[i*3] = side * (5.0 + Math.random() * 5.0);
      } else {
        pos[i*3] = (Math.random() - .5) * 20;
      }
      pos[i*3+1] = (Math.random() - .5) * 14;
      pos[i*3+2] = (Math.random() - .5) * 6;
      rnd[i*3]   = Math.random();
      rnd[i*3+1] = Math.random();
      rnd[i*3+2] = Math.random();
      szs[i]     = Math.random() * 2.5 + 0.8;
    }

    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('aRandom',  new THREE.BufferAttribute(rnd, 3));
    pGeo.setAttribute('aSize',    new THREE.BufferAttribute(szs, 1));

    var pVert = [
      'attribute vec3  aRandom;',
      'attribute float aSize;',
      'uniform float   uTime;',
      'uniform vec2    uMouse;',
      'varying float   vAlpha;',
      'varying vec3    vColor;',

      'void main() {',
      '  vec3 p = position;',

      // wave breathing — two independent sine layers
      '  p.y += sin(uTime*.55 + aRandom.x*6.2832 + p.x*.45) * .28',
      '       + sin(uTime*.38 + aRandom.y*6.2832 + p.y*.35) * .20;',
      '  p.x += cos(uTime*.32 + aRandom.z*6.2832 + p.z*.28) * .18;',

      // mouse field deflection
      '  vec2  mW  = uMouse * vec2(10., 7.);',
      '  float d   = length(p.xy - mW);',
      '  float def = smoothstep(2.8, 0., d);',
      '  p.xy += normalize(p.xy - mW + .001) * def * .8;',

      '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
      '  gl_Position  = projectionMatrix * mv;',
      '  gl_PointSize = aSize * (380. / -mv.z);',

      // cyan → violet → white gradient
      '  vColor = mix(',
      '    vec3(0., .85, 1.0),',
      '    mix(vec3(.75, .10, 1.0), vec3(1., 1., 1.), aRandom.z),',
      '    aRandom.x);',

      '  vAlpha = .15 + .30*(sin(uTime*.75 + aRandom.y*12.5664)*.5+.5);',
      '}'
    ].join('\n');

    var pFrag = [
      'precision highp float;',
      'varying float vAlpha;',
      'varying vec3  vColor;',
      'void main() {',
      '  vec2  uv   = gl_PointCoord - .5;',
      '  float d    = length(uv);',
      '  if (d > .5) discard;',
      '  float a    = pow(1. - d*2., 1.4) * vAlpha;',
      '  float glow = pow(1. - d*2., 3.) * 1.0;',
      '  gl_FragColor = vec4(vColor + glow, a * 1.0);',
      '}'
    ].join('\n');

    var pMat = new THREE.ShaderMaterial({
      vertexShader:   pVert,
      fragmentShader: pFrag,
      uniforms: {
        uTime:  { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false
    });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── Animation loop ───────────────────────────────────────────
    var nebMat = nebMesh.material;
    var sphMat = sphere.material;
    var clock  = new THREE.Clock();

    (function tick() {
      requestAnimationFrame(tick);
      var t = clock.getElapsedTime();

      // smooth mouse lerp
      mouse.x += (target.x - mouse.x) * 0.055;
      mouse.y += (target.y - mouse.y) * 0.055;

      // push uniforms
      nebMat.uniforms.uTime.value  = t;
      nebMat.uniforms.uMouse.value = mouse;
      sphMat.uniforms.uTime.value          = t;
      sphere2.material.uniforms.uTime.value = t;
      pMat.uniforms.uTime.value            = t;
      pMat.uniforms.uMouse.value   = mouse;

      // gentle camera drift (Wallpaper Engine parallax feel)
      camera.position.x = Math.sin(t * 0.07) * 0.25;
      camera.position.y = Math.cos(t * 0.05) * 0.18;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }());

    // ── Resize ───────────────────────────────────────────────────
    window.addEventListener('resize', function () {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });
  }
}());
