import React, { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

const Model = () => {
  const { scene } = useGLTF("/path/to/model.glb"); // Reemplaza con tu ruta al archivo .glb

  return <primitive object={scene} scale={1} />;
};

export default Model;