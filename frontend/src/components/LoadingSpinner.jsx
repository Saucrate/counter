import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function Spinner() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime();
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshPhongMaterial color="#4CAF50" wireframe />
    </mesh>
  );
}

export default function LoadingSpinner() {
  return (
    <div style={{ width: '200px', height: '200px' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Spinner />
      </Canvas>
    </div>
  );
} 