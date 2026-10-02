import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeHeroSceneProps {
  onLetGo: () => void;
}

export const ThreeHeroScene: React.FC<ThreeHeroSceneProps> = ({ onLetGo }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionListener);

    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF7FAF8);
    scene.fog = new THREE.FogExp2(0xF7FAF8, 0.04);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // Studio Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x18583d, 2.5);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x2dd4bf, 4.0, 20);
    cyanRimLight.position.set(-6, -3, 3);
    scene.add(cyanRimLight);

    const greenFillLight = new THREE.PointLight(0x18583d, 3.0, 15);
    greenFillLight.position.set(0, -4, 4);
    scene.add(greenFillLight);

    // 3D Objects: Floating Inventory Crates & Parcels with glowing wireframe edges
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Box geometry with rounded appearance and edge lines
    const boxMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0x0f3825,
        roughness: 0.25,
        metalness: 0.8,
        emissive: 0x072417,
        emissiveIntensity: 0.4,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x144c33,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x0a3321,
        emissiveIntensity: 0.35,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x1a6142,
        roughness: 0.2,
        metalness: 0.85,
        emissive: 0x12472f,
        emissiveIntensity: 0.5,
      })
    ];

    const edgeLineMaterial = new THREE.LineBasicMaterial({
      color: 0x61b487,
      transparent: true,
      opacity: 0.75,
    });

    const cyanEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.9,
    });

    interface FloatingBox {
      mesh: THREE.Group;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      floatSpeed: number;
      floatOffset: number;
      initialY: number;
    }

    const floatingBoxes: FloatingBox[] = [];

    // Create 7 distinct stylized inventory parcel crates
    const crateConfigs = [
      { size: [1.6, 1.6, 1.6], pos: [0, 0.2, 0], rot: [0.3, 0.4, 0], mat: boxMaterials[2], cyan: true },
      { size: [1.1, 1.3, 0.9], pos: [-3.2, 1.6, -1.8], rot: [-0.2, 0.6, 0.1], mat: boxMaterials[0], cyan: false },
      { size: [1.3, 0.9, 1.4], pos: [3.3, 1.3, -2.2], rot: [0.5, -0.4, 0.2], mat: boxMaterials[1], cyan: true },
      { size: [0.85, 1.0, 0.85], pos: [-2.6, -2.1, -1.2], rot: [0.1, -0.5, 0.3], mat: boxMaterials[1], cyan: false },
      { size: [1.0, 0.8, 1.2], pos: [2.8, -1.8, -1.0], rot: [-0.4, 0.3, -0.2], mat: boxMaterials[0], cyan: false },
      { size: [0.7, 0.7, 0.7], pos: [-4.2, -0.2, -3.0], rot: [0.2, 0.8, 0], mat: boxMaterials[2], cyan: true },
      { size: [0.75, 0.9, 0.75], pos: [4.4, 0.1, -3.2], rot: [-0.3, -0.7, 0.1], mat: boxMaterials[1], cyan: false },
    ];

    crateConfigs.forEach((cfg, idx) => {
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(cfg.size[0], cfg.size[1], cfg.size[2]);
      const mesh = new THREE.Mesh(geom, cfg.mat);
      group.add(mesh);

      // Glowing edge accents
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, cfg.cyan ? cyanEdgeMaterial : edgeLineMaterial);
      group.add(line);

      // Add a floating glowing inner core in the main center parcel
      if (idx === 0) {
        const coreGeom = new THREE.OctahedronGeometry(0.55);
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0x2dd4bf,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });
        const coreMesh = new THREE.Mesh(coreGeom, coreMat);
        group.add(coreMesh);
      }

      group.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      group.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      objectsGroup.add(group);

      floatingBoxes.push({
        mesh: group,
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        rotSpeedY: 0.005 + Math.random() * 0.006,
        rotSpeedZ: (Math.random() - 0.5) * 0.004,
        floatSpeed: 0.8 + Math.random() * 0.6,
        floatOffset: idx * 1.2,
        initialY: cfg.pos[1],
      });
    });

    // Ambient floating inventory particle dust (green & cyan)
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Color between #61b487 and #2dd4bf
      const isCyan = Math.random() > 0.6;
      if (isCyan) {
        particleColors[i * 3] = 0.17;
        particleColors[i * 3 + 1] = 0.83;
        particleColors[i * 3 + 2] = 0.75;
      } else {
        particleColors[i * 3] = 0.38;
        particleColors[i * 3 + 1] = 0.71;
        particleColors[i * 3 + 2] = 0.53;
      }
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeom, particleMaterial);
    scene.add(particles);

    // Mouse Interaction Parallax with smooth lerp
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetX = mouseX * 0.9;
      targetY = mouseY * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Camera lerp towards target mouse position
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      camera.position.x = currentX;
      camera.position.y = currentY;
      camera.lookAt(0, 0, 0);

      // Rotate and float boxes smoothly
      floatingBoxes.forEach((item) => {
        if (!reducedMotion) {
          item.mesh.rotation.x += item.rotSpeedX;
          item.mesh.rotation.y += item.rotSpeedY;
          item.mesh.rotation.z += item.rotSpeedZ;
          item.mesh.position.y = item.initialY + Math.sin(elapsedTime * item.floatSpeed + item.floatOffset) * 0.18;
        }
      });

      // Slowly rotate particle field
      if (!reducedMotion) {
        particles.rotation.y = elapsedTime * 0.02;
        particles.rotation.x = elapsedTime * 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', motionListener);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F7FAF8] flex flex-col items-center justify-center">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Atmospheric Subtle Soft Radial Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(97, 180, 135, 0.12) 0%, rgba(247, 250, 248, 0.8) 75%, #F7FAF8 100%)',
        }}
      />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'linear-gradient(rgba(220, 232, 224, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 232, 224, 0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Fallback for WebGL missing */}
      {!webGlSupported && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-3xl bg-white border border-[#DCE8E0] shadow-sm animate-pulse" />
        </div>
      )}

      {/* Minimal Brand & Primary Action */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
        {/* Brand Display Wordmark */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-[#173127] mb-3 font-heading">
          Sahayak
        </h1>

        {/* Small supporting line */}
        <p className="text-base sm:text-lg text-[#607269] font-medium mb-10 max-w-md tracking-wide">
          Your shop. Your stock. Simplified.
        </p>

        {/* ONE Primary Button: LET'S GO */}
        <button
          onClick={onLetGo}
          className="group relative inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white bg-[#18583d] rounded-full transition-all duration-300 hover:bg-[#0d3d29] hover:scale-105 active:scale-95 shadow-md cursor-pointer focus-ring"
        >
          <span className="tracking-wider">LET&apos;S GO</span>
          <svg
            className="w-5 h-5 ml-2.5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Minimal Ambient Status Dot */}
      <div className="absolute bottom-6 flex items-center gap-2 text-xs text-[#89988F] font-mono tracking-widest">
        <span className="w-2 h-2 rounded-full bg-[#18583d] animate-ping" />
        <span>AI INVENTORY PROTOCOL ACTIVE</span>
      </div>
    </div>
  );
};
