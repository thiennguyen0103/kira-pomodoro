"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function cssColor(name: string, fallback: string): THREE.Color {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  try {
    return new THREE.Color(value || fallback);
  } catch {
    return new THREE.Color(fallback);
  }
}

function softTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,0.95)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.28)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function AmbientField() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const element = host;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    if (!renderer.getContext()) {
      renderer.dispose();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "block h-full w-full";
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
    camera.position.z = 7;

    const texture = softTexture();
    const palette = [
      cssColor("--primary", "#246b5b"),
      cssColor("--primary", "#246b5b"),
      cssColor("--break", "#3b637f"),
      cssColor("--primary", "#246b5b"),
    ];
    const sprites = palette.map((color, index) => {
      const material = new THREE.SpriteMaterial({
        map: texture,
        color,
        transparent: true,
        opacity: 0.42 - index * 0.05,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      const scale = 4.2 + index * 0.85;
      sprite.scale.set(scale, scale, 1);
      scene.add(sprite);
      return sprite;
    });

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: cssColor("--primary", "#246b5b"),
      transparent: true,
      opacity: 0.45,
    });
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.012, 24, 96),
      ringMaterial,
    );
    ring.position.set(-2.1, 0.35, 0);
    scene.add(ring);

    const haloMaterial = new THREE.MeshBasicMaterial({
      color: cssColor("--break", "#3b637f"),
      transparent: true,
      opacity: 0.22,
    });
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.006, 16, 80),
      haloMaterial,
    );
    halo.position.copy(ring.position);
    scene.add(halo);

    const pointer = { x: 0, y: 0 };

    function onPointerMove(event: PointerEvent) {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    }

    function resize() {
      const width = element.clientWidth;
      const height = element.clientHeight;

      if (width === 0 || height === 0) {
        return;
      }

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    resize();
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", resize);

    const started = performance.now();
    let frame = 0;

    function render(now: number) {
      const time = reduced ? 0 : (now - started) / 1000;
      sprites.forEach((sprite, index) => {
        const drift = time * (0.12 + index * 0.03);
        sprite.position.set(
          Math.cos(drift + index * 1.2) * (1.8 + index * 0.35) +
            pointer.x * 0.8,
          Math.sin(drift * 0.75 + index) * (1.1 + (index % 2) * 0.4) -
            pointer.y * 0.6,
          -index * 0.4,
        );
      });
      ring.rotation.x = time * 0.25 + pointer.y * 0.4;
      ring.rotation.y = time * 0.35 + pointer.x * 0.5;
      halo.rotation.x = -time * 0.18;
      halo.rotation.y = time * 0.22;
      camera.position.x += (pointer.x * 0.45 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    render(started);

    function loop(now: number) {
      frame = window.requestAnimationFrame(loop);

      if (!document.hidden) {
        render(now);
      }
    }

    if (!reduced) {
      frame = window.requestAnimationFrame(loop);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      texture.dispose();
      ring.geometry.dispose();
      halo.geometry.dispose();
      ringMaterial.dispose();
      haloMaterial.dispose();
      sprites.forEach((sprite) => {
        sprite.material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
