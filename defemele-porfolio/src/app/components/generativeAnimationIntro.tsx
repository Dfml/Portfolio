import { useRef, useEffect } from 'react';


const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
  



    const plusSize = 50; // Tamaño de cada símbolo "+"
    const padding = 100; // Espacio entre cada símbolo "+"
    const rows = Math.floor(canvas.height / padding); // Número de filas
    const cols = Math.floor(canvas.width / padding); // Número de columnas

    const symbols: { x: number, y: number, opacity: number, scale: number }[] = [];

    // Crear los símbolos "+" en una cuadrícula
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * padding + padding / 2; // Posición X
        const y = row * padding + padding / 2; // Posición Y
        symbols.push({ x, y, opacity: 0, scale: 0 });
      }
    }

    // Función para dibujar un "+" en una posición dada con opacidad y escala
    const drawPlus = (x: number, y: number, size: number, opacity: number, scale: number) => {
      ctx.save();
      ctx.globalAlpha = opacity; // Establece la opacidad
      ctx.translate(x, y);       // Mueve el contexto al centro del "+"
      ctx.scale(scale, scale);   // Aplica el escalado
      ctx.beginPath();

      // Dibujar la línea vertical
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(0, size / 2);

      // Dibujar la línea horizontal
      ctx.moveTo(-size / 2, 0);
      ctx.lineTo(size / 2, 0);

      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    };

    // Animar cada símbolo uno por uno, recorriendo las filas de izquierda a derecha
    const animateSymbols = (index: number) => {
      if (index >= symbols.length) return;

      const symbol = symbols[index];
      let opacity = 0;
      let scale = 0;

      const duration = 50; // Duración de la animación en milisegundos
      const startTime = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1); // Normalizar el progreso entre 0 y 1

        opacity = progress;         // Animar la opacidad
        scale = 0.5 + progress * 0.5; // Escalado desde 0.5 hasta 1

        // Limpiar el canvas y redibujar todos los símbolos anteriores
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        symbols.forEach((s, i) => {
          const currentOpacity = i <= index ? (i === index ? opacity : 1) : 0;
          const currentScale = i <= index ? (i === index ? scale : 1) : 0;
          drawPlus(s.x, s.y, plusSize, currentOpacity, currentScale);
        });

        if (progress < 1) {
          requestAnimationFrame(animate); // Continuar la animación
        } else {
          // Iniciar la animación del siguiente símbolo
          animateSymbols(index + 1);
        }
      };

      requestAnimationFrame(animate);
    };

    // Iniciar la animación con el primer símbolo
    
    setTimeout(() => {
      animateSymbols(0);
    }, 3000);
  }, []);


  return <canvas ref={canvasRef}  className=' absolute w-full h-full left-0 top-0' />;
};

export default CanvasComponent;