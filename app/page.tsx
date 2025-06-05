"use client"

import Image from "next/image";
import { motion, useAnimation } from 'framer-motion';
import { FC, useState, useEffect,useRef   } from 'react';
import CanvasComponent from "./components/generativeAnimationIntro";
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import FadeDiv from "./components/FadeDiv";

// Cargar el componente dinámicamente para evitar el SSR
const ThreeScene = dynamic(() => import('../app/components/ThreeScene'), { ssr: false });

// Definimos el tipo para las propiedades del componente Letter
interface LetterProps {
  letter: string;
  index: number;
}

const Letter: FC<LetterProps> = ({ letter, index }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 1 ,ease: "linear"}
    }).then(() => {
      controls.start({
        opacity: 0,
        y: -20,
        transition: { duration: 1 ,ease: "linear" }
      });
    });
  }, [controls, index]);

  return (
    <motion.span
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
    >
      {letter}
    </motion.span>
  );
};
export default function Home() {
  const name = "Daniel\u00A0Méndez";
  const portfolio = "Portfolio";
  const [triggerSecond, setTriggerSecond] = useState(false);
  const [trigger3D, setTrigger3D] = useState(false);
  const [triggerFade, setTriggerFade] = useState(false);
  // Estado para saber si el modelo está cargado
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Coordenadas y colores para la letra D (ya existentes)
  const dPositions = [
    { pos: new THREE.Vector3(0, 0, 0), color: '#ff0055',startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(0, 0.95, 0), color: '#ff0055',startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(0, 1.9, 0), color: '#ff0055' ,startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(0, 2.85, 0), color: '#ff0055',startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(0, 3.8, 0), color: '#ff0055' ,startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(0, 4.75, 0), color: '#ff0055',startZone:0,endZone:0.5  },
    { pos: new THREE.Vector3(0, 5.7, 0), color: '#ff0055' ,startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(1.6, 0, 0), color: '#ff9900' ,startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(2.4, 0.95, 0), color: '#ff9900',startZone:0,endZone:0.5  },
    { pos: new THREE.Vector3(3.2, 1.9, 0), color: '#ff9900' ,startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(3.2, 2.85, 0), color: '#ff9900' ,startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(3.2, 3.8, 0), color: '#ff9900' ,startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(2.4, 4.75, 0), color: '#ff9900' ,startZone:0,endZone:0.5 },
    { pos: new THREE.Vector3(1.6, 5.7, 0), color: '#ff9900' ,startZone:0,endZone:0.5 },
  ];

  // Coordenadas y colores para la letra A medio cuadriculada
  let aOffsetX = 6;
  let aOffsetY = 0;
  const aPositions = [
    { pos: new THREE.Vector3(aOffsetX + 0,aOffsetY+ 0, 0), color: '#00ccff' ,startZone:0,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 0,aOffsetY+ 0.95, 0), color: '#00ccff',startZone:0,endZone:1 },
    { pos: new THREE.Vector3(aOffsetX + 0,aOffsetY+ 1.9, 0), color: '#00ccff',startZone:0,endZone:1 },
    { pos: new THREE.Vector3(aOffsetX + 0,aOffsetY+ 2.85, 0), color: '#00ccff',startZone:0,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 0,aOffsetY+ 3.8, 0), color: '#00ccff' ,startZone:0,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 0,aOffsetY+ 4.75, 0), color: '#00ccff' ,startZone:0,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 0.8,aOffsetY+ 5.7, 0), color: '#00ccff' ,startZone:0,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 2.4,aOffsetY +5.7, 0), color: '#00ccff' ,startZone:0,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 3.2,aOffsetY+ 4.75, 0), color: '#00ccff',startZone:0,endZone:1 },
    { pos: new THREE.Vector3(aOffsetX + 1.6,aOffsetY +2.85, 0), color: '#00ccff',startZone:0,endZone:1 },
  ];

  aOffsetX = aOffsetX + 12;
  aOffsetY = aOffsetY + 0;
  const bPositions = [
    { pos: new THREE.Vector3(aOffsetX + 0, 0, 0), color: '#00ff99',startZone:0.5,endZone:1 },
    { pos: new THREE.Vector3(aOffsetX + 0, 0.95, 0), color: '#00ff99' ,startZone:0.5,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 0, 1.9, 0), color: '#00ff99',startZone:0.5,endZone:1 },
    { pos: new THREE.Vector3(aOffsetX + 0, 2.85, 0), color: '#00ff99' ,startZone:0.5,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 0, 3.8, 0), color: '#00ff99' ,startZone:0.5,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 0, 4.75, 0), color: '#00ff99' ,startZone:0.5,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 0, 5.7, 0), color: '#00ff99' ,startZone:0.5,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 1.6, 5.7, 0), color: '#00ff99' ,startZone:0.5,endZone:1},
    { pos: new THREE.Vector3(aOffsetX + 3.2, 5.7, 0), color: '#00ff99',startZone:0.5,endZone:1 },
    { pos: new THREE.Vector3(aOffsetX + 1.6, 2.85, 0), color: '#00ff99',startZone:0.5,endZone:1 },
  ];

  // Unir ambas letras
  const finalPositions = [...dPositions, ...aPositions, ...bPositions];

  // Solo setear isModelLoaded en el primer render
  useEffect(() => {
    setIsModelLoaded(false); // Resetear solo cuando cambia la cantidad de posiciones
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalPositions.length]);

  useEffect(() => {
    // const timer = setTimeout(() => {
    //   setTriggerSecond(true);
    // }, 4000);
    // const timer3D = setTimeout(() => {    
    //   setTriggerFade(true);
    //   setTimeout(() => {
    //     setTrigger3D(true);
    //   }, 500);
    // }, 11000);
    // return () => {
    //   clearTimeout(timer);
    //   clearTimeout(timer3D);
    // }
  }, []);

  return (
    <div className=" w-full flex ">
      <main className="w-full flex flex-col gap-8 row-start-2 items-center sm:items-start ">
      <CanvasComponent></CanvasComponent>
      {triggerFade && <FadeDiv className=" left-0 top-0 absolute w-full h-full z-20 bg-white"></FadeDiv>}

      {/* {trigger3D && <ThreeScene position={position}></ThreeScene>} */}
      <ThreeScene finalPositions={finalPositions.map(f => f.pos)} scale={100} onModelLoaded={() => setIsModelLoaded(true)} colors={finalPositions.map(f => f.color)}  startZone={finalPositions.map(f => f.startZone)} endZone={finalPositions.map(f => f.endZone) }/>
      {!isModelLoaded && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-40">
          <span className="text-white text-2xl">Cargando modelo 3D...</span>
        </div>
      )}
      {/* Div temporal para forzar scroll y probar el evento de scroll */}
      <div style={{ height: '3000px', width: '100%' }} />
     
      {/* <div className=" w-full flex flex-wrap z-50 invisible"> 
        <p className=" text-blue-950 text-2xl"> hola</p>
      </div> */}
      <div className="flex text-9xl relative z-20 justify-center content-center items-center w-full h-screen ">
           
            {triggerSecond ? (
            <>  
              {portfolio.split('').map((char, index) => (
              <Letter  letter={char} index={index} key={index} />
            ))}
         
            </>

            ):(
              <> {name.split('').map((char, index) => (
                <Letter  letter={char} index={index} key={index} />
              ))}
              </>
            )
            }
      </div>

     
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      
      </footer>
    </div>
  );
}
