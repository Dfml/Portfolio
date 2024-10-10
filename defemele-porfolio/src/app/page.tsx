"use client"

import Image from "next/image";
import { motion, useAnimation } from 'framer-motion';
import { FC, useState, useEffect   } from 'react';
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

  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));

  // Función para cambiar la posición del cubo (puedes hacerla más dinámica)
  const moveCube = () => {
    const newPosition = new THREE.Vector3(
      4, // Valores aleatorios entre -2.5 y 2.5
     4,
    4,
    );
    setPosition(newPosition);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTriggerSecond(true);
    }, 4000);
    const timer3D = setTimeout(() => {    
      setTriggerFade(true);
      setTimeout(() => {
        setTrigger3D(true);
      }, 500);
    }, 11000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer3D);
    }
  }, []);
  return (
    <div className=" w-full flex ">
      <main className="w-full flex flex-col gap-8 row-start-2 items-center sm:items-start ">
      <CanvasComponent></CanvasComponent>
      {triggerFade && <FadeDiv className=" left-0 top-0 absolute w-full h-full z-20 bg-white"></FadeDiv>}
    
      {/* {trigger3D && <ThreeScene position={position}></ThreeScene>} */}
      <ThreeScene position={position}></ThreeScene>
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
