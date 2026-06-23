'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { REELS, PROFILE } from '@/lib/content';

/* ── Distortion shader for hover image planes ── */
const vertexShader = `
  varying vec2 vUv;
  uniform float uProgress;
  uniform vec2 uMouse;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float dist = distance(uv, uMouse);
    pos.z += sin(dist * 10.0 - uProgress * 3.0) * 0.05 * uProgress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform vec2 uMouse;
  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);
    float strength = uProgress * 0.04;
    vec2 offset = normalize(uv - uMouse) * strength * smoothstep(0.0, 0.5, dist);
    float r = texture2D(uTexture, uv + offset).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - offset).b;
    float a = texture2D(uTexture, uv).a;
    gl_FragColor = vec4(r, g, b, a * uProgress);
  }
`;

function HoverPlane({ activeIndex, mousePos }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport } = useThree();
  const texture = useTexture('/uploads/hero.webp');
  const targetPos = useRef(new THREE.Vector3());
  const currentProgress = useRef(0);

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  }), [texture]);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    const targetProgress = activeIndex >= 0 ? 1 : 0;
    currentProgress.current += (targetProgress - currentProgress.current) * 0.08;
    materialRef.current.uniforms.uProgress.value = currentProgress.current;

    const targetX = (mousePos.current.x / window.innerWidth) * viewport.width - viewport.width / 2;
    const targetY = -(mousePos.current.y / window.innerHeight) * viewport.height + viewport.height / 2;
    targetPos.current.set(targetX, targetY, 0);
    meshRef.current.position.lerp(targetPos.current, 0.08);

    const normalizedX = mousePos.current.x / window.innerWidth;
    const normalizedY = 1 - mousePos.current.y / window.innerHeight;
    materialRef.current.uniforms.uMouse.value.set(normalizedX, normalizedY);
  });

  const aspect = 16 / 9;
  const planeWidth = viewport.width * 0.28;
  const planeHeight = planeWidth / aspect;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeWidth, planeHeight, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

function WorksCanvas({ activeIndex, mousePos }) {
  return (
    <Canvas
      className="works-canvas"
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
    >
      <HoverPlane activeIndex={activeIndex} mousePos={mousePos} />
    </Canvas>
  );
}

export default function WorksGrid() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const mousePos = useRef({ x: 0, y: 0 });
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = [...sectionRef.current.querySelectorAll('.work-item')];
    gsap.set(items, { opacity: 0, y: 80 });
    const batch = ScrollTrigger.batch(items, {
      start: 'top 90%',
      onEnter: b => gsap.to(b, {
        opacity: 1, y: 0, duration: 1.4, ease: 'power4.out', stagger: 0.12, overwrite: true
      }),
    });
    return () => batch.forEach(s => s.kill());
  }, [reduced]);

  return (
    <section id="work" className="works-section" ref={sectionRef} onMouseMove={handleMouseMove}>
      <div className="works-header">
        <div className="works-header-label">
          <span className="eyebrow">Selected Work</span>
          <span className="works-count">{REELS.length} Projects</span>
        </div>
        <h2 className="works-title" data-split>Work</h2>
      </div>

      <div className="works-grid">
        <WorksCanvas activeIndex={activeIndex} mousePos={mousePos} />
        <div className="works-list">
          {REELS.map((reel, i) => (
            <a
              key={reel.id}
              className="work-item"
              href={reel.href}
              target="_blank"
              rel="noopener"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              <span className="work-index">{reel.code}</span>
              <span className="work-name">{reel.title}</span>
              <span className="work-cat">{reel.cat}</span>
              <span className="work-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="works-footer">
        <p className="works-footer-text">
          View all on <a href={PROFILE.instagram} target="_blank" rel="noopener">Instagram</a>
        </p>
      </div>
    </section>
  );
}
