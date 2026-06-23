'use client';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* Fullscreen liquid-distortion shader field (Lusion DNA).
   A dark violet flow that warps toward the cursor. */

const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0); // fill clip space
  }
`;

const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;     // 0..1
  uniform vec2  uRes;
  uniform float uStrength;  // eased cursor influence

  // cheap value noise
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
  }
  float fbm(vec2 p){
    float v=0., a=.5;
    for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uRes.x / uRes.y;
    vec2 auv = vec2(uv.x*aspect, uv.y);
    vec2 am  = vec2(uMouse.x*aspect, uMouse.y);

    float d = distance(auv, am);
    float ripple = smoothstep(0.55, 0.0, d) * uStrength;

    // liquid displacement toward cursor
    vec2 p = uv * 3.0;
    p += ripple * vec2(sin(uv.y*9.0 + uTime*0.8), cos(uv.x*9.0 + uTime*0.8));
    float n = fbm(p + uTime*0.05);
    float n2 = fbm(p*1.7 - uTime*0.04);

    // violet palette over near-black
    vec3 base   = vec3(0.020, 0.020, 0.024);
    vec3 violet = vec3(0.545, 0.361, 0.965);  // #8b5cf6
    vec3 plum   = vec3(0.753, 0.518, 0.988);  // #c084fc

    float field = smoothstep(0.35, 0.95, n) * 0.55 + n2*0.15;
    vec3 col = mix(base, violet*0.6, field);
    col = mix(col, plum*0.7, ripple*0.6);

    // soft glow halo at cursor
    col += violet * smoothstep(0.4, 0.0, d) * 0.10 * (0.6 + 0.4*sin(uTime));

    // vignette
    float vig = smoothstep(1.15, 0.25, distance(uv, vec2(0.5)));
    col *= mix(0.55, 1.0, vig);

    // subtle grain
    col += (hash(uv*uRes + uTime)-0.5)*0.025;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Field() {
  const ref = useRef();
  const { size, viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const strength = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uStrength: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    const onMove = e => {
      target.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
      strength.current = 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    const u = ref.current.material.uniforms;
    u.uTime.value += delta;
    mouse.current.lerp(target.current, 0.06);
    u.uMouse.value.copy(mouse.current);
    u.uRes.value.set(size.width, size.height);
    strength.current += (0 - strength.current) * 0.02; // ease back to calm
    u.uStrength.value += (Math.min(1, strength.current + 0.25) - u.uStrength.value) * 0.08;
  });

  return (
    <mesh ref={ref} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthTest={false} />
    </mesh>
  );
}

export default function WebGLBackground() {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) setOk(false);
    } catch {
      setOk(false);
    }
  }, []);

  if (!ok) return <div className="webgl-fallback" aria-hidden="true" />;

  return (
    <div className="webgl-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1] }}
      >
        <Field />
      </Canvas>
    </div>
  );
}
