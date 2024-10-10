import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeSceneProps {
  position: THREE.Vector3;
  scale?: number;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ position, scale = 1 }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Inicializa la escena, cámara y renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x171717);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Añadir controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Habilitar amortiguamiento para un movimiento más suave
    controls.dampingFactor = 0.25; // Factor de amortiguamiento
    controls.screenSpacePanning = false; // No permitir el desplazamiento en el espacio de la pantalla


    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2 );
				hemiLight.color.setHSL( 0.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 0, 50, 0 );
				scene.add( hemiLight );

				const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
				scene.add( hemiLightHelper );

				const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
				dirLight.color.setHSL( 0.1, 1, 0.95 );
				dirLight.position.set( - 1, 1.75, 1 );
				dirLight.position.multiplyScalar( 30 );
				scene.add( dirLight );
				dirLight.castShadow = true;
				dirLight.shadow.mapSize.width = 2048;
				dirLight.shadow.mapSize.height = 2048;
				const d = 50;
				dirLight.shadow.camera.left = - d;
				dirLight.shadow.camera.right = d;
				dirLight.shadow.camera.top = d;
				dirLight.shadow.camera.bottom = - d;
				dirLight.shadow.camera.far = 3500;
				dirLight.shadow.bias = - 0.0001;
				const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
				scene.add( dirLightHelper );
        camera.position.z = 5;

    // Cargar modelo GLTF/GLB
    const loader = new GLTFLoader();
    loader.load('/models/ficha_sola.glb', (gltf) => {
      const model = gltf.scene;
      modelRef.current = model; // Guardar referencia al modelo

      // Establecer la escala del modelo
      model.scale.set(40, 40, 40); // Ajusta la escala aquí

  
      scene.add(model); // Añadir modelo a la escena
    });

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);

      // if (modelRef.current) {
      //   modelRef.current.position.lerp(position, 0.1); // Transición suave
      //   modelRef.current.rotation.y += 0.01; // Rotación suave del modelo
      // }

      controls.update(); // Actualizar controles en cada cuadro

      renderer.render(scene, camera);
    };
    animate();

    // Limpieza cuando el componente se desmonte
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [position, scale]);

  return <div ref={mountRef} className='absolute w-full h-full left-0 top-0 z-30' />;
};

export default ThreeScene;