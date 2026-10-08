import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, ZoomIn, ZoomOut, Compass, Info, X, Activity } from 'lucide-react';
import { VesselResult } from '../types';

interface Heart3DProps {
  vesselResults?: {
    LAD?: VesselResult;
    LCX?: VesselResult;
    RCA?: VesselResult;
  } | null;
  selectedVessel?: 'LAD' | 'LCX' | 'RCA' | null;
  onSelectVessel?: (vessel: 'LAD' | 'LCX' | 'RCA' | null) => void;
  heightClass?: string;
}

export const Heart3D: React.FC<Heart3DProps> = ({
  vesselResults,
  selectedVessel: externalSelectedVessel,
  onSelectVessel,
  heightClass = 'h-[460px]'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [internalSelectedVessel, setInternalSelectedVessel] = useState<'LAD' | 'LCX' | 'RCA' | null>(null);
  const [hoveredVessel, setHoveredVessel] = useState<{ id: 'LAD' | 'LCX' | 'RCA'; name: string; x: number; y: number } | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [beating, setBeating] = useState(true);

  const activeSelected = externalSelectedVessel !== undefined ? externalSelectedVessel : internalSelectedVessel;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const heartGroupRef = useRef<THREE.Group | null>(null);
  const vesselMeshesRef = useRef<Record<string, THREE.Mesh[]>>({ LAD: [], LCX: [], RCA: [] });
  const animFrameRef = useRef<number | null>(null);

  // Helper: Get color based on risk probability
  const getVesselColor = (prob?: number) => {
    if (prob === undefined || prob === null) {
      return { base: 0x64748b, emissive: 0x1e293b, intensity: 0.1 }; // Neutral slate
    }
    if (prob < 0.40) {
      return { base: 0x10b981, emissive: 0x059669, intensity: 0.35 }; // Low: emerald green
    }
    if (prob < 0.70) {
      return { base: 0xf59e0b, emissive: 0xd97706, intensity: 0.5 }; // Moderate: amber
    }
    return { base: 0xef4444, emissive: 0xdc2626, intensity: 0.75 }; // High: crimson red
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // Deep medical navy/slate

    // 2. Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 460;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.5;
    controls.maxDistance = 9.0;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(0, -4, -3);
    scene.add(rimLight);

    // 6. Construct 3D Anatomical Heart Model
    const heartGroup = new THREE.Group();
    scene.add(heartGroup);
    heartGroupRef.current = heartGroup;

    // A. Ventricles (Cone/Ellipsoid combined geometry)
    const ventricleGeo = new THREE.SphereGeometry(1.25, 48, 48);
    ventricleGeo.scale(0.9, 1.3, 0.85);
    const posAttr = ventricleGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      let y = posAttr.getY(i);
      let x = posAttr.getX(i);
      let z = posAttr.getZ(i);
      // Taper bottom toward cardiac apex (pointing down and left)
      if (y < 0) {
        const factor = 1 + (y * 0.45);
        posAttr.setX(i, (x * factor) - (y * 0.18));
        posAttr.setZ(i, z * factor);
      }
    }
    ventricleGeo.computeVertexNormals();

    const ventricleMat = new THREE.MeshStandardMaterial({
      color: 0x881337, // Anatomical myocardial deep burgundy
      roughness: 0.48,
      metalness: 0.08,
      bumpScale: 0.04
    });
    const ventricleMesh = new THREE.Mesh(ventricleGeo, ventricleMat);
    ventricleMesh.position.set(0, -0.2, 0);
    heartGroup.add(ventricleMesh);

    // B. Left Atrium & Right Atrium (Upper auricles)
    const atriumGeo = new THREE.SphereGeometry(0.72, 32, 32);
    atriumGeo.scale(1.2, 0.7, 0.8);
    const atriumMat = new THREE.MeshStandardMaterial({
      color: 0x9f1239,
      roughness: 0.52,
      metalness: 0.05
    });
    const atriumMesh = new THREE.Mesh(atriumGeo, atriumMat);
    atriumMesh.position.set(-0.2, 0.95, -0.25);
    heartGroup.add(atriumMesh);

    // Right Auricle
    const rightAuricleGeo = new THREE.SphereGeometry(0.55, 32, 32);
    rightAuricleGeo.scale(0.9, 0.6, 0.7);
    const rightAuricleMesh = new THREE.Mesh(rightAuricleGeo, atriumMat);
    rightAuricleMesh.position.set(0.65, 0.8, 0.3);
    heartGroup.add(rightAuricleMesh);

    // C. Ascending Aorta & Aortic Arch
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.7, 0.1),
      new THREE.Vector3(0.1, 1.4, 0.05),
      new THREE.Vector3(-0.05, 1.85, -0.15),
      new THREE.Vector3(-0.45, 1.75, -0.4),
      new THREE.Vector3(-0.65, 1.25, -0.55)
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 32, 0.28, 16, false);
    const aortaMat = new THREE.MeshStandardMaterial({
      color: 0xbe123c, // Ruby red aortic arch
      roughness: 0.35,
      metalness: 0.12
    });
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    heartGroup.add(aortaMesh);

    // Brachiocephalic branch roots
    const branchGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.45, 16);
    const b1 = new THREE.Mesh(branchGeo, aortaMat);
    b1.position.set(-0.05, 2.0, -0.12);
    b1.rotation.z = -0.15;
    heartGroup.add(b1);
    const b2 = new THREE.Mesh(branchGeo, aortaMat);
    b2.position.set(-0.25, 1.95, -0.25);
    b2.rotation.z = -0.25;
    heartGroup.add(b2);

    // D. Pulmonary Trunk (Crossing anterior to aorta)
    const pulmonaryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.25, 0.55, 0.45),
      new THREE.Vector3(0.0, 1.15, 0.25),
      new THREE.Vector3(-0.35, 1.45, -0.05)
    ]);
    const pulmonaryGeo = new THREE.TubeGeometry(pulmonaryCurve, 24, 0.26, 16, false);
    const pulmonaryMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Deep blue venous/pulmonary trunk
      roughness: 0.4,
      metalness: 0.1
    });
    const pulmonaryMesh = new THREE.Mesh(pulmonaryGeo, pulmonaryMat);
    heartGroup.add(pulmonaryMesh);

    // E. Superior Vena Cava
    const svcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.7, 0.7, -0.2),
      new THREE.Vector3(0.75, 1.5, -0.25)
    ]);
    const svcGeo = new THREE.TubeGeometry(svcCurve, 16, 0.22, 16, false);
    const svcMesh = new THREE.Mesh(svcGeo, pulmonaryMat);
    heartGroup.add(svcMesh);

    // 7. CONSTRUCT SEPARATE CORONARY ARTERY TREES
    // -------------------------------------------------------------
    vesselMeshesRef.current = { LAD: [], LCX: [], RCA: [] };

    // Function to create a vessel segment
    const createVesselBranch = (
      points: THREE.Vector3[],
      radius: number,
      vesselKey: 'LAD' | 'LCX' | 'RCA',
      name: string
    ) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 36, radius, 12, false);
      const col = getVesselColor(vesselResults?.[vesselKey]?.probability);
      const mat = new THREE.MeshStandardMaterial({
        color: col.base,
        emissive: col.emissive,
        emissiveIntensity: col.intensity,
        roughness: 0.3,
        metalness: 0.2
      });
      const mesh = new THREE.Mesh(tubeGeo, mat);
      mesh.userData = { vesselKey, name };
      heartGroup.add(mesh);
      vesselMeshesRef.current[vesselKey].push(mesh);
      return mesh;
    };

    // 1) LAD: Left Anterior Descending Artery
    // Originates near aortic root/pulmonary bifurcation and runs along anterior interventricular sulcus to apex
    createVesselBranch([
      new THREE.Vector3(-0.15, 0.72, 0.42),
      new THREE.Vector3(-0.08, 0.45, 0.65),
      new THREE.Vector3(0.02, 0.1, 0.74),
      new THREE.Vector3(0.12, -0.35, 0.72),
      new THREE.Vector3(0.24, -0.85, 0.60),
      new THREE.Vector3(0.32, -1.35, 0.38)
    ], 0.065, 'LAD', 'Left Anterior Descending Artery (LAD Main)');

    // LAD Diagonal 1 (D1) branch
    createVesselBranch([
      new THREE.Vector3(0.02, 0.1, 0.74),
      new THREE.Vector3(-0.25, -0.15, 0.7),
      new THREE.Vector3(-0.55, -0.5, 0.58)
    ], 0.042, 'LAD', 'LAD Diagonal 1 (D1 Branch)');

    // LAD Diagonal 2 (D2) branch
    createVesselBranch([
      new THREE.Vector3(0.12, -0.35, 0.72),
      new THREE.Vector3(-0.12, -0.65, 0.65),
      new THREE.Vector3(-0.35, -0.98, 0.48)
    ], 0.038, 'LAD', 'LAD Diagonal 2 (D2 Branch)');

    // 2) LCX: Left Circumflex Artery
    // Branches from left main, curves posteriorly along left atrioventricular groove
    createVesselBranch([
      new THREE.Vector3(-0.15, 0.72, 0.42),
      new THREE.Vector3(-0.45, 0.68, 0.35),
      new THREE.Vector3(-0.78, 0.52, 0.12),
      new THREE.Vector3(-0.95, 0.28, -0.22),
      new THREE.Vector3(-0.85, -0.05, -0.55),
      new THREE.Vector3(-0.58, -0.42, -0.68)
    ], 0.060, 'LCX', 'Left Circumflex Artery (LCX Main)');

    // LCX Obtuse Marginal 1 (OM1)
    createVesselBranch([
      new THREE.Vector3(-0.78, 0.52, 0.12),
      new THREE.Vector3(-0.92, 0.12, 0.18),
      new THREE.Vector3(-0.98, -0.4, 0.08)
    ], 0.042, 'LCX', 'LCX Obtuse Marginal 1 (OM1)');

    // LCX Obtuse Marginal 2 (OM2)
    createVesselBranch([
      new THREE.Vector3(-0.95, 0.28, -0.22),
      new THREE.Vector3(-1.02, -0.15, -0.28),
      new THREE.Vector3(-0.88, -0.65, -0.32)
    ], 0.036, 'LCX', 'LCX Obtuse Marginal 2 (OM2)');

    // 3) RCA: Right Coronary Artery
    // Arises from right aortic sinus, courses down right coronary sulcus to inferior border
    createVesselBranch([
      new THREE.Vector3(0.3, 0.75, 0.35),
      new THREE.Vector3(0.68, 0.55, 0.48),
      new THREE.Vector3(0.85, 0.22, 0.42),
      new THREE.Vector3(0.92, -0.18, 0.26),
      new THREE.Vector3(0.82, -0.65, 0.05),
      new THREE.Vector3(0.55, -0.98, -0.25)
    ], 0.062, 'RCA', 'Right Coronary Artery (RCA Main)');

    // RCA Acute Marginal (AM) branch
    createVesselBranch([
      new THREE.Vector3(0.92, -0.18, 0.26),
      new THREE.Vector3(0.85, -0.45, 0.45),
      new THREE.Vector3(0.68, -0.85, 0.52)
    ], 0.040, 'RCA', 'RCA Acute Marginal Branch');

    // RCA Posterior Descending Artery (PDA)
    createVesselBranch([
      new THREE.Vector3(0.55, -0.98, -0.25),
      new THREE.Vector3(0.32, -1.18, -0.38),
      new THREE.Vector3(0.12, -1.35, -0.15)
    ], 0.045, 'RCA', 'RCA Posterior Descending Artery (PDA)');

    // Initial orientation: slightly tilted anterior view
    heartGroup.rotation.y = -0.25;
    heartGroup.rotation.x = 0.1;

    // 8. Raycasting for hover & click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const allMeshes = [
        ...vesselMeshesRef.current.LAD,
        ...vesselMeshesRef.current.LCX,
        ...vesselMeshesRef.current.RCA
      ];
      const intersects = raycaster.intersectObjects(allMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const key = hit.userData.vesselKey as 'LAD' | 'LCX' | 'RCA';
        setHoveredVessel({
          id: key,
          name: hit.userData.name || key,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredVessel(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const allMeshes = [
        ...vesselMeshesRef.current.LAD,
        ...vesselMeshesRef.current.LCX,
        ...vesselMeshesRef.current.RCA
      ];
      const intersects = raycaster.intersectObjects(allMeshes);

      if (intersects.length > 0) {
        const key = intersects[0].object.userData.vesselKey as 'LAD' | 'LCX' | 'RCA';
        setInternalSelectedVessel(key);
        if (onSelectVessel) onSelectVessel(key);
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleClick);

    // 9. Animation loop with subtle anatomical heartbeat
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Controls update
      controls.update();

      // Auto rotation
      if (autoRotate && heartGroup) {
        heartGroup.rotation.y += 0.005;
      }

      // Heartbeat pulse micro-animation (72 bpm = 1.2 Hz)
      if (beating && heartGroup) {
        const beatCycle = (Math.sin(elapsedTime * 6.5) + 0.5 * Math.sin(elapsedTime * 13)) * 0.022;
        const scaleVal = 1.0 + Math.max(0, beatCycle);
        heartGroup.scale.set(scaleVal, scaleVal, scaleVal);
      } else if (heartGroup) {
        heartGroup.scale.set(1, 1, 1);
      }

      renderer.render(scene, camera);
    };
    animate();

    // 10. Resize observer
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update vessel colors and glow when prediction results change
  useEffect(() => {
    (['LAD', 'LCX', 'RCA'] as const).forEach(vKey => {
      const meshes = vesselMeshesRef.current[vKey] || [];
      const prob = vesselResults?.[vKey]?.probability;
      const col = getVesselColor(prob);
      const isSelected = activeSelected === vKey;

      meshes.forEach(mesh => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.color.setHex(col.base);
        mat.emissive.setHex(col.emissive);
        // Elevate intensity if selected or high risk
        mat.emissiveIntensity = isSelected ? 0.95 : (col.intensity);
      });
    });
  }, [vesselResults, activeSelected]);

  // Camera preset handlers
  const setCameraView = (view: 'anterior' | 'posterior' | 'left' | 'right' | 'reset') => {
    if (!cameraRef.current || !controlsRef.current || !heartGroupRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const heart = heartGroupRef.current;

    heart.rotation.set(0.1, -0.25, 0);

    switch (view) {
      case 'anterior':
        camera.position.set(0, 0.8, 5.0);
        break;
      case 'posterior':
        camera.position.set(0, 0.8, -5.0);
        break;
      case 'left':
        camera.position.set(-5.0, 0.8, 0);
        break;
      case 'right':
        camera.position.set(5.0, 0.8, 0);
        break;
      case 'reset':
      default:
        camera.position.set(0, 1.2, 5.2);
        break;
    }
    controls.target.set(0, 0, 0);
    controls.update();
  };

  const zoomCamera = (direction: 'in' | 'out') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const factor = direction === 'in' ? 0.82 : 1.22;
    cameraRef.current.position.multiplyScalar(factor);
    controlsRef.current.update();
  };

  const selectedInfo = activeSelected && vesselResults?.[activeSelected];

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
      {/* Top HUD Ribbon */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">
            3D Coronary Anatomy
          </span>
          <span className="text-slate-500 text-xs">|</span>
          <span className="text-[11px] text-slate-400">AI Risk Mapping</span>
        </div>

        {/* View Controls Toolbar */}
        <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 pointer-events-auto shadow-sm">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              autoRotate ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle Auto-Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setBeating(!beating)}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
              beating ? 'bg-slate-700 text-rose-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle Heartbeat Motion"
          >
            <Activity className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => zoomCamera('in')}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => zoomCamera('out')}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCameraView('reset')}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Reset Camera View"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Camera Angles Bar */}
      <div className="absolute top-14 left-3 z-20 hidden sm:flex items-center gap-1 bg-slate-900/75 backdrop-blur-sm p-1 rounded-md border border-slate-800/80 pointer-events-auto">
        <span className="text-[10px] uppercase font-mono text-slate-400 px-1.5">View:</span>
        <button
          onClick={() => setCameraView('anterior')}
          className="px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
        >
          Anterior
        </button>
        <button
          onClick={() => setCameraView('posterior')}
          className="px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
        >
          Posterior
        </button>
        <button
          onClick={() => setCameraView('left')}
          className="px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
        >
          Left (LAD/LCX)
        </button>
        <button
          onClick={() => setCameraView('right')}
          className="px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
        >
          Right (RCA)
        </button>
      </div>

      {/* WebGL Canvas Container */}
      <div ref={mountRef} className={`w-full ${heightClass} cursor-grab active:cursor-grabbing`} />

      {/* Hover Floating Tooltip */}
      {hoveredVessel && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-900/95 border border-slate-700/80 rounded-md px-2.5 py-1.5 shadow-xl text-xs backdrop-blur-sm transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ left: hoveredVessel.x, top: hoveredVessel.y }}
        >
          <div className="font-semibold text-slate-100">{hoveredVessel.name}</div>
          <div className="text-[11px] text-slate-400">
            {vesselResults?.[hoveredVessel.id] ? (
              <span>
                Model Risk: <strong className="text-white font-mono">{vesselResults[hoveredVessel.id]?.percentage}%</strong>
                {' · '}{vesselResults[hoveredVessel.id]?.category.toUpperCase()}
              </span>
            ) : (
              <span>Click to inspect vessel anatomy</span>
            )}
          </div>
        </div>
      )}

      {/* Selected Vessel Inspector Floating Panel */}
      {activeSelected && (
        <div className="absolute bottom-16 right-3 z-30 w-72 bg-slate-900/95 border border-slate-700/90 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-xs">
          <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
            <div>
              <span className="font-bold text-slate-100 text-sm">{activeSelected}</span>
              <p className="text-[11px] text-slate-400">
                {activeSelected === 'LAD' && 'Left Anterior Descending Artery'}
                {activeSelected === 'LCX' && 'Left Circumflex Artery'}
                {activeSelected === 'RCA' && 'Right Coronary Artery'}
              </p>
            </div>
            <button
              onClick={() => {
                setInternalSelectedVessel(null);
                if (onSelectVessel) onSelectVessel(null);
              }}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedInfo ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded-lg">
                <span className="text-slate-400">Model-Predicted Risk:</span>
                <span className={`text-base font-bold font-mono ${
                  selectedInfo.category === 'high' ? 'text-rose-400' : (selectedInfo.category === 'moderate' ? 'text-amber-400' : 'text-emerald-400')
                }`}>
                  {selectedInfo.percentage}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Classification Category:</span>
                <span className="font-medium capitalize text-slate-200">{selectedInfo.category}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                {selectedInfo.description}
              </p>
            </div>
          ) : (
            <div className="text-slate-400 text-[11px] py-1">
              Enter patient parameters and run <strong className="text-slate-200">Analyze Patient</strong> to evaluate vessel stenosis risk.
            </div>
          )}

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 italic flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Represents AI prediction, not confirmed lumen stenosis.</span>
          </div>
        </div>
      )}

      {/* Bottom Color Legend & Clinical Disclaimer */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-[11px] font-medium tracking-wide">RISK MAPPING:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300 text-[11px]">Low (0–39%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-300 text-[11px]">Moderate (40–69%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-300 text-[11px]">High (70–100%)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 italic">
          ⚠ Illustrative 3D anatomy — AI risk mapped to vessels.
        </div>
      </div>
    </div>
  );
};
