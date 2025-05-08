import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface GlbFurnitureModelProps {
  modelPath: string;
  position: {
    x: number;
    y: number;
    z: number;
    rotation: number;
    scale: number;
    color: string;
  };
  furniture: {
    width: number;
    length: number;
    height: number;
  };
  isSelected: boolean;
  onClick: () => void;
  readOnly?: boolean;
}

export const GlbFurnitureModel: React.FC<GlbFurnitureModelProps> = ({ 
  modelPath, 
  position, 
  furniture,
  isSelected, 
  onClick,
  readOnly = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  
  // Calculate bounding box to get actual model dimensions
  useEffect(() => {
    if (groupRef.current && scene) {
      // Create a temporary box to measure the model
      const box = new THREE.Box3().setFromObject(scene);
      const modelSize = new THREE.Vector3();
      box.getSize(modelSize);
      
      // Calculate the scale needed to match the furniture dimensions
      const targetWidth = furniture.width;
      const targetHeight = furniture.height;
      const targetLength = furniture.length;
      
      // Adjust the group's scale to match the target dimensions
      if (groupRef.current) {
        // Normalize the model to have the correct proportions
        const scaleX = targetWidth / modelSize.x;
        const scaleY = targetHeight / modelSize.y;
        const scaleZ = targetLength / modelSize.z;
        
        // Use the minimum scale to prevent distortion
        const normalizedScale = Math.min(scaleX, scaleY, scaleZ);
        
        // Apply this normalized scale to the group
        groupRef.current.scale.set(
          normalizedScale * position.scale,
          normalizedScale * position.scale,
          normalizedScale * position.scale
        );
      }
    }
  }, [scene, furniture, position.scale]);

  // Apply material to all meshes in the model
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: position.color,
        roughness: 0.7,
        metalness: 0.3,
        emissive: isSelected ? "#ffffff" : undefined,
        emissiveIntensity: isSelected ? 0.2 : 0,
      });
      // Make sure we get shadows
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[0, position.rotation * Math.PI / 180, 0]}
      onClick={(e) => {
        if (!readOnly) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <primitive object={scene} />
      {isSelected && !readOnly && (
        <mesh>
          <boxGeometry args={[
            furniture.width + 0.05, 
            furniture.height + 0.05, 
            furniture.length + 0.05
          ]} />
          <meshBasicMaterial 
            color="#ffffff" 
            wireframe 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      )}
    </group>
  );
};