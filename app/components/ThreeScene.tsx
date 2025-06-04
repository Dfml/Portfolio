import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ThreeSceneProps {
  finalPositions: THREE.Vector3[];
  scale?: number;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ finalPositions, scale = 100 }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelRefs = useRef<THREE.Object3D[]>([]); // Array para guardar las referencias de los modelos
  const animationActive = useRef<boolean>(false); // Ref para controlar si la animación está activa o no

  useEffect(() => {
    if (!mountRef.current) return;

    // Inicializa la escena, cámara y renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x171717);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(15, 5, 20);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Añadir controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // Configurar luces
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
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

    // Cargar el modelo GLTF/GLB
    const loader = new GLTFLoader();
    loader.load("/models/ficha_sola.glb", (gltf) => {
      const model = gltf.scene;

      // Establecer la escala del modelo
      model.scale.set(scale, scale, scale);

      const numFichas = finalPositions.length;
      const radius = 20;

      for (let i = 0; i < numFichas; i++) {
        const modelClone = model.clone();
        const startPosition = generateRandomPositionAroundCenter(radius);
        const startRotation = generateRandomRotation();

        modelClone.position.copy(startPosition);
        modelClone.rotation.copy(startRotation);
        scene.add(modelClone);
        modelRefs.current.push(modelClone);
      }
    });

    const animate = () => {
      requestAnimationFrame(animate);

      if (animationActive.current) {
        modelRefs.current.forEach((model, index) => {
          const targetPosition = finalPositions[index];
          if (model && targetPosition) {
            model.position.lerp(targetPosition, 0.05);
            const targetQuaternion = new THREE.Quaternion().setFromEuler(
              new THREE.Euler(0, 0, 0)
            );
            model.quaternion.slerp(targetQuaternion, 0.05);
          }
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
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
  }, []);

  return (
    <div ref={mountRef} className="absolute w-full h-full left-0 top-0 z-30" />
  );
};

export default ThreeScene;