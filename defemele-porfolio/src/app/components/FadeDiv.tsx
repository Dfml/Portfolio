import { motion } from "framer-motion";

interface FadeDivProps {
  className: string;
}

const FadeDiv: React.FC<FadeDivProps> = ({ className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}  // Empieza transparente
      animate={{ opacity: 1 }}  // Anima hacia opacidad completa (blanco)
      transition={{ duration: 0.5 }}  // Duración de la transición en segundo
      className={className}
    >
      {/* Contenido del div */}
    </motion.div>
  );
};

export default FadeDiv;