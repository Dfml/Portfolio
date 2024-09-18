"use client"

import Image from "next/image";
import { motion, useAnimation } from 'framer-motion';
import { FC, useState, useEffect   } from 'react';
import CanvasComponent from "./components/generativeAnimationIntro";
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
  const name = "Daniel Mendez";
  const portfolio = "Portfolio";
  const [triggerSecond, setTriggerSecond] = useState(false);
  useEffect(() => {
     const timer = setTimeout(() => {
      setTriggerSecond(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start ">
      <CanvasComponent></CanvasComponent>
      <div className="flex text-8xl relative z-20">
           
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
