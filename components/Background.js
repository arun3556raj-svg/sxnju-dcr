'use client';
import dynamic from 'next/dynamic';

const WebGLBackground = dynamic(() => import('./WebGLBackground'), {
  ssr: false,
  loading: () => <div className="webgl-fallback" aria-hidden="true" />,
});

export default function Background() {
  return <WebGLBackground />;
}
