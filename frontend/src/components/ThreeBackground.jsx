import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Text3D, Float, MeshDistortMaterial, Environment, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Update the ControlBall component for better rotation control
function ControlBall({ onRotate }) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const ballRef = useRef(null);

  // Handle mouse events
  const handleStart = (e) => {
    setIsDragging(true);
    const rect = ballRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    lastPos.current = {
      x: clientX - centerX,
      y: clientY - centerY
    };
    e.preventDefault();
  };

  const handleMove = useCallback((e) => {
    if (!isDragging || !ballRef.current) return;
    
    const rect = ballRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const currentX = clientX - centerX;
    const currentY = clientY - centerY;
    
    const previousAngle = Math.atan2(lastPos.current.y, lastPos.current.x);
    const currentAngle = Math.atan2(currentY, currentX);
    
    let deltaRotation = currentAngle - previousAngle;
    
    // Ensure smooth rotation
    if (deltaRotation > Math.PI) deltaRotation -= 2 * Math.PI;
    if (deltaRotation < -Math.PI) deltaRotation += 2 * Math.PI;
    
    const newRotation = rotation + deltaRotation;
    setRotation(newRotation);
    onRotate(newRotation);
    
    lastPos.current = { x: currentX, y: currentY };
  }, [isDragging, rotation, onRotate]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      // Mouse events
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      
      // Touch events
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    }
    return () => {
      // Cleanup mouse events
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      
      // Cleanup touch events
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div
      ref={ballRef}
      style={{
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        width: '80px',
        height: '80px',
        zIndex: 10000,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      <div
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transform: `rotate(${rotation}rad)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          WebkitTapHighlightColor: 'transparent' // Remove tap highlight on mobile
        }}
      >
        <div
          style={{
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
}

// Update the FloatingNumber component for smoother rotation
function FloatingNumber({ position, number, color, speed, rotationIntensity, floatIntensity, scale, globalRotation }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Smoother rotation with increased effect
    meshRef.current.rotation.x = Math.sin(t * speed * 0.3) * 0.2;
    meshRef.current.rotation.y = globalRotation * 1.5; // Increased rotation effect
    meshRef.current.rotation.z = Math.sin(t * speed * 0.2) * 0.1 + globalRotation * 0.5;
  });

  return (
    <Float 
      speed={speed} 
      rotationIntensity={rotationIntensity} 
      floatIntensity={floatIntensity}
      position={position}
    >
      <group ref={meshRef} scale={scale}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={1.2}
          height={0.4}
          curveSegments={32}
          bevelEnabled
          bevelSize={0.04}
          bevelThickness={0.1}
          bevelSegments={5}
        >
          {number.toString()}
          <MeshDistortMaterial
            color={color}
            envMapIntensity={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            distort={0.3}
            speed={3}
          />
        </Text3D>
      </group>
    </Float>
  );
}

// Update the FloatingNumbers component for better group rotation
function FloatingNumbers({ globalRotation }) {
  const group = useRef();

  const numbers = useMemo(() => {
    const items = [];
    const colors = [
      '#4ECDC4', '#FF6B6B', '#FFE66D', '#4CAF50', '#2196F3',
      '#9C27B0', '#FF9800', '#00BCD4', '#F44336', '#E91E63'
    ];
    
    for (let i = 0; i < 150; i++) {
      const depth = Math.random() * 30 - 15;
      const scale = 0.3 + (1 - Math.abs(depth) / 15) * 1.2;

      items.push({
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          depth
        ],
        number: Math.floor(Math.random() * 10),
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.3 + Math.random() * 1,
        rotationIntensity: 0.5 + Math.random(),
        floatIntensity: 0.5 + Math.random(),
        scale: scale
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Smoother group rotation
    group.current.rotation.y = globalRotation * 1.2; // Main rotation
    group.current.rotation.x = Math.sin(t * 0.05) * 0.05; // Gentle wobble
    group.current.rotation.z = globalRotation * 0.3; // Slight tilt while rotating
  });

  return (
    <group ref={group}>
      <Stars 
        radius={100}
        depth={50}
        count={7000}
        factor={6}
        saturation={0}
        fade
        speed={1.5}
      />
      {numbers.map((item, index) => (
        <FloatingNumber
          key={index}
          {...item}
          globalRotation={globalRotation}
        />
      ))}
    </group>
  );
}

export default function ThreeBackground() {
  const [globalRotation, setGlobalRotation] = useState(0);

  return (
    <>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
        overflow: 'hidden'
      }}>
        <Canvas 
          camera={{ 
            position: [0, 0, 30],
            fov: 75,
            near: 0.1,
            far: 1000
          }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <spotLight
            position={[0, 10, 0]}
            angle={0.6}
            penumbra={1}
            intensity={1.5}
            castShadow
          />
          <FloatingNumbers globalRotation={globalRotation} />
          <Environment preset="night" />
        </Canvas>
      </div>
      <ControlBall onRotate={setGlobalRotation} />
    </>
  );
} 