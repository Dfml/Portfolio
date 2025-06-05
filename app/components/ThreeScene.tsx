import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ThreeSceneProps {
  finalPositions: THREE.Vector3[];
  scale?: number;
  onModelLoaded?: () => void;
  colors?: string[];
  startZone: number[];
  endZone: number [];
}

function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}
const ThreeScene: React.FC<ThreeSceneProps> = ({ finalPositions, scale = 100, onModelLoaded, colors, startZone, endZone }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelRefs = useRef<THREE.Object3D[]>([]);
  const animationActive = useRef<boolean>(false); 

  useEffect(() => {
    if (!mountRef.current) return;

    mountRef.current.innerHTML = "";

    // Inicializa la escena, cámara y renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x171717);
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15,40);
    camera.lookAt(0, 5, 0);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Eliminar controles de órbita para no interferir con el scroll
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.screenSpacePanning = false;

    // Configurar luces
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-1, 1.75, 1).multiplyScalar(30);
    scene.add(dirLight);

    // Función para generar posiciones aleatorias alrededor de un centro
    const generateRandomPositionAroundCenter = (radius: number) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const z = Math.random() * 4 - 2;
      return new THREE.Vector3(x, y, z);
    };

    // Función para generar rotaciones aleatorias
    const generateRandomRotation = () => {
      const x = Math.random() * Math.PI * 2;
      const y = Math.random() * Math.PI * 2;
      const z = Math.random() * Math.PI * 2;
      return new THREE.Euler(x, y, z);
    };

    // Scroll virtual: progreso controlado por wheel
    // useRef solo puede usarse en el cuerpo del componente, así que declaramos fuera del useEffect
    // y usamos variables normales dentro del useEffect
    let virtualProgress = 0; // de 0 a 1
    let targetProgress = 0; // de 0 a 1

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const handleVirtualScroll = (e: WheelEvent) => {
      e.preventDefault();
      targetProgress += e.deltaY * 0.003;
      targetProgress = clamp(targetProgress, 0, 1);
    };

    const updateModelsWithProgress = (progress: number) => {
      modelRefs.current.forEach((model, index) => {
        const targetPosition = finalPositions[index];
        const startPosition = (model as any)._startPosition;
        const startEuler = (model as any)._startRotation;
        const targetEuler = new THREE.Euler(0, 0, 0);
        if (model && targetPosition && startPosition) {
          if (progress < startZone[index]) {
            // Antes de su rango: posición inicial
            model.position.copy(startPosition);
            model.rotation.copy(startEuler);
          } else if (progress > endZone[index]) {
            // Después de su rango: posición final
            model.position.copy(targetPosition);
            model.rotation.copy(targetEuler);
          } else {
            // Animando: interpolar
            const t = remap(progress, startZone[index], endZone[index], 0, 1);
            model.position.lerpVectors(startPosition, targetPosition, t);
            const lerpedEuler = new THREE.Euler(
              startEuler.x + (targetEuler.x - startEuler.x) * t,
              startEuler.y + (targetEuler.y - startEuler.y) * t,
              startEuler.z + (targetEuler.z - startEuler.z) * t
            );
            model.rotation.copy(lerpedEuler);
          }
        }
      });
    };

    // Cargar el modelo GLTF/GLB
    const loader = new GLTFLoader();
    loader.load(
      "/models/ficha_sola.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(scale, scale, scale);
        const numFichas = finalPositions.length;
        const radius = 20;
        modelRefs.current = [];
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
        scene.add(hemiLight);
        scene.add(dirLight);
        for (let i = 0; i < numFichas; i++) {
          const modelClone = model.clone();
          const color = colors && colors[i] ? colors[i] : new THREE.Color(Math.random(), Math.random(), Math.random());
          modelClone.traverse((child: any) => {
            if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
              child.material = child.material.clone();
              if (typeof color === 'string') {
                child.material.color.set(color);
              } else {
                child.material.color.copy(color);
              }
            }
          });
          const startPosition = generateRandomPositionAroundCenter(radius);
          const startRotation = generateRandomRotation();
          modelClone.position.copy(startPosition);
          modelClone.rotation.copy(startRotation);
          (modelClone as any)._startPosition = startPosition.clone();
          (modelClone as any)._startRotation = startRotation.clone();
          scene.add(modelClone);
          modelRefs.current.push(modelClone);
        }

        updateModelsWithProgress(virtualProgress);
        if (onModelLoaded) onModelLoaded();
      },
      undefined,
      (error) => {
        console.error('Error loading GLB:', error);
      }
    );

    // Deshabilitar scroll real
    document.body.style.overflow = 'hidden';
    // Escuchar el wheel para scroll virtual
    window.addEventListener('wheel', handleVirtualScroll, { passive: false });

    const animate = () => {
      requestAnimationFrame(animate);
      
      virtualProgress = lerp(virtualProgress, targetProgress, 0.08);
      updateModelsWithProgress(virtualProgress);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('wheel', handleVirtualScroll);
      document.body.style.overflow = '';
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [finalPositions, scale]);

  // Función para activar la animación externamente
  const startAnimation = () => {
    animationActive.current = true; // Cambia la ref para activar la animación
  };

  // Exponemos la función para ser usada desde fuera del componente
  useEffect(() => {
    (window as any).startAnimation = startAnimation;
    return () => {
      delete (window as any).startAnimation;
    };
  }, [startAnimation]);

  return (
    <div ref={mountRef} className="absolute w-full h-full left-0 top-0 z-30" />
  );
};

export default ThreeScene;