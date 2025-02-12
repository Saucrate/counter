import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';

function LoadingSphere() {
  const meshRef = useRef();

  return (
    <Sphere args={[1, 32, 32]} ref={meshRef}>
      <MeshDistortMaterial
        color="#4ECDC4"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0}
        metalness={1}
      />
    </Sphere>
  );
}

export default function LoadingOverlay({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 12, 41, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <motion.div
            style={{
              width: '150px',
              height: '150px',
              position: 'relative'
            }}
          >
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <LoadingSphere />
            </Canvas>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: '1rem',
              color: '#4ECDC4',
              fontSize: '1.2rem',
              fontWeight: '500',
              letterSpacing: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <motion.span
              animate={{
                opacity: [1, 0.5, 1],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
            >
              •
            </motion.span>
            <motion.span
              animate={{
                opacity: [1, 0.5, 1],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.2
                }
              }}
            >
              •
            </motion.span>
            <motion.span
              animate={{
                opacity: [1, 0.5, 1],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.4
                }
              }}
            >
              •
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 