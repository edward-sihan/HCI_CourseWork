import React, { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDesign } from "@/contexts/DesignContext";

// Import OBJLoader from Three.js
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

interface FurnitureModelProps {
  modelPath: string;
  position: {
    x: number;
    y: number;
    z: number;
    rotation: number;
    scale: number;
    color: string;
  };
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export const FurnitureModel: React.FC<FurnitureModelProps> = ({ 
  modelPath, 
  position, 
  index,
  isSelected, 
  onClick
}) => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { updateFurniturePosition, currentRoom, furnitureCatalog, placedFurniture } = useDesign();
  const { camera, raycaster, gl, scene } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const dragPlane = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersection = useRef<THREE.Vector3>(new THREE.Vector3());
  const offset = useRef<THREE.Vector3>(new THREE.Vector3());
  
  // Load the OBJ model
  useEffect(() => {
    if (modelPath) {
      const loader = new OBJLoader();
      loader.load(
        modelPath,
        (loadedModel) => {
          // Apply material to all meshes in the model
          loadedModel.traverse((child) => {
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
          setModel(loadedModel);
        },
        // Progress callback
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        // Error callback
        (error) => {
          console.error('Error loading model', error);
        }
      );
    }
  }, [modelPath, position.color, isSelected]);

  // Handle dragging logic
  useFrame(() => {
    if (!isDragging || !currentRoom) return;
    
    // Cast a ray from the camera through the mouse position
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Find floor intersection
    const floorIntersection = intersects.find(intersect => {
      // Check if it's the floor (y position near 0 and it's a mesh)
      if (!(intersect.object instanceof THREE.Mesh)) return false;
      return Math.abs(intersect.point.y) < 0.1 && 
             intersect.object.geometry instanceof THREE.PlaneGeometry;
    });
    
    if (floorIntersection) {
      // Update the furniture position based on intersection
      const newPosition = floorIntersection.point.clone().sub(offset.current);
      
      // Get the current furniture item
      const furnitureItem = placedFurniture[index];
      const furnitureDetails = furnitureCatalog.find(f => f.id === furnitureItem.furnitureId);
      
      if (furnitureDetails) {
        // Constrain to room boundaries
        const roomWidth = currentRoom.width;
        const roomLength = currentRoom.length;
        
        const halfWidth = furnitureDetails.width * position.scale / 2;
        const halfLength = furnitureDetails.length * position.scale / 2;
        
        // Clamp position within room boundaries
        newPosition.x = Math.max(halfWidth, Math.min(roomWidth - halfWidth, newPosition.x));
        newPosition.z = Math.max(halfLength, Math.min(roomLength - halfLength, newPosition.z));
        
        // Update the position in the context
        updateFurniturePosition(index, {
          x: newPosition.x,
          z: newPosition.z
        });
      }
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    
    // Check if already selected before allowing drag
    if (!isSelected) {
      onClick();
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    
    // Capture the mouse position
    const x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
    const y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    
    // Calculate the offset between the model position and the intersection point
    if (groupRef.current) {
      const modelPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(modelPosition);
      
      if (raycaster.ray.intersectPlane(dragPlane.current, intersection.current)) {
        offset.current.copy(intersection.current).sub(modelPosition);
      }
    }
    
    // Set capture pointer for drag operations
    gl.domElement.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: any) => {
    setIsDragging(false);
    gl.domElement.releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    // Update raycaster with current mouse position
    const x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
    const y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  };

  if (!model) {
    return null; // Return null while loading
  }

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[0, position.rotation * Math.PI / 180, 0]}
      scale={[position.scale, position.scale, position.scale]}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <primitive object={model.clone()} />
      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial wireframe transparent opacity={0.2} color="#ffffff" />
        </mesh>
      )}
    </group>
  );
};