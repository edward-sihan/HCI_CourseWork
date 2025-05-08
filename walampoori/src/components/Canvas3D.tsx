import React, { Suspense, useState, useEffect } from "react";
import { useDesign } from "@/contexts/DesignContext";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment,
  ContactShadows,
  SoftShadows,
  useGLTF
} from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

// Import directly from Three.js
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GlbFurnitureModel } from "./GlbFurnitureModel";

interface RoomProps {
  room: {
    width: number;
    length: number;
    height: number;
    wallColor: string;
    floorColor: string;
  };
}

interface FurnitureProps {
  furniture: {
    id?: string;
    width: number;
    length: number;
    height: number;
    objModelPath?: string;
  };
  position: {
    x: number;
    y: number;
    z: number;
    rotation: number;
    scale: number;
    color: string;
  };
}

interface SelectableFurnitureProps extends FurnitureProps {
  isSelected: boolean;
  onClick: () => void;
  readOnly?: boolean;
}

// New component for OBJ model furniture
const ObjFurniture = ({ 
  furniture, 
  position, 
  isSelected, 
  onClick,
  readOnly = false
}: SelectableFurnitureProps) => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  
  // Load the OBJ model
  useEffect(() => {
    if (furniture.objModelPath) {
      const loader = new OBJLoader();
      loader.load(
        furniture.objModelPath,
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
  }, [furniture.objModelPath, position.color, isSelected]);

  if (!model && furniture.objModelPath) {
    // Return placeholder while loading
    return (
      <mesh 
        position={[position.x, position.y + furniture.height * position.scale / 2, position.z]}
        onClick={(e) => {
          if (!readOnly) {
            e.stopPropagation();
            onClick();
          }
        }}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#cccccc" opacity={0.5} transparent />
      </mesh>
    );
  } else if (!model) {
    return null;
  }

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={[0, position.rotation * Math.PI / 180, 0]}
      scale={[position.scale, position.scale, position.scale]}
      onClick={(e) => {
        if (!readOnly) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <primitive object={model.clone()} />
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

export const Canvas3D: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const { currentRoom, placedFurniture, furnitureCatalog, updateFurniturePosition } = useDesign();
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState<number | null>(null);
  
  // Lighting state
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);
  const [directionalIntensity, setDirectionalIntensity] = useState(1.0);
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [lightColor, setLightColor] = useState("#ffffff");
  const [showLightingControls, setShowLightingControls] = useState(false);

  const getFurnitureById = (id: string) => {
    return furnitureCatalog.find(item => item.id === id);
  };

  const rotateLeft = () => {
    if (selectedFurnitureIndex === null || readOnly) return;
    
    const furniture = placedFurniture[selectedFurnitureIndex];
    updateFurniturePosition(selectedFurnitureIndex, { 
      rotation: (furniture.rotation - 15) % 360 
    });
  };
  
  const rotateRight = () => {
    if (selectedFurnitureIndex === null || readOnly) return;
    
    const furniture = placedFurniture[selectedFurnitureIndex];
    updateFurniturePosition(selectedFurnitureIndex, { 
      rotation: (furniture.rotation + 15) % 360 
    });
  };

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <p>No room configuration found.</p>
      </div>
    );
  }

  return (
    <div className="canvas-3d w-full h-full border border-border rounded-md bg-gray-900 relative">
      <Canvas shadows={shadowsEnabled}>
        <color attach="background" args={["#111827"]} />
        <Suspense fallback={null}>
          {/* Improved lighting setup */}
          <ambientLight 
            intensity={ambientIntensity} 
            color={lightColor} 
          />
          <directionalLight 
            position={[5, 10, 5]} 
            castShadow={shadowsEnabled} 
            intensity={directionalIntensity}
            color={lightColor}
            shadow-mapSize={[1024, 1024]}
          >
            {shadowsEnabled && (
              <orthographicCamera 
                attach="shadow-camera"
                args={[-10, 10, 10, -10, 0.1, 50]}
              />
            )}
          </directionalLight>
          
          {/* Subtle point lights for realism */}
          <pointLight 
            position={[currentRoom.width / 2, currentRoom.height - 0.2, currentRoom.length / 2]} 
            intensity={0.5 * directionalIntensity} 
            color={lightColor}
            castShadow={shadowsEnabled}
          />
          
          {/* Shadow setup */}
          {shadowsEnabled && <SoftShadows />}
          
          {/* Room */}
          <Room room={currentRoom} />
          
          {/* Furniture */}
          {placedFurniture.map((item, index) => {
            const furniture = getFurnitureById(item.furnitureId);
            if (!furniture) return null;
            
            // If furniture has a GLB model path, use GlbFurnitureModel component
            if (furniture.glbModelPath) {
              return (
                <GlbFurnitureModel
                  key={`furniture-${index}`}
                  modelPath={furniture.glbModelPath}
                  position={{
                    ...item,
                    y: 0 // Ensure models are placed at floor level
                  }}
                  furniture={furniture}
                  isSelected={index === selectedFurnitureIndex}
                  onClick={() => {
                    if (!readOnly) {
                      setSelectedFurnitureIndex(
                        index === selectedFurnitureIndex ? null : index
                      );
                    }
                  }}
                  readOnly={readOnly}
                />
              );
            }
            
            // If furniture has an OBJ model path, use ObjFurniture component
            else if (furniture.objModelPath) {
              return (
                <ObjFurniture
                  key={`furniture-${index}`}
                  furniture={furniture}
                  position={item}
                  isSelected={index === selectedFurnitureIndex}
                  onClick={() => {
                    if (!readOnly) {
                      setSelectedFurnitureIndex(
                        index === selectedFurnitureIndex ? null : index
                      );
                    }
                  }}
                  readOnly={readOnly}
                />
              );
            }
            
            // Otherwise use the default box representation
            return (
              <SelectableFurniture 
                key={`furniture-${index}`}
                furniture={furniture}
                position={item}
                isSelected={index === selectedFurnitureIndex}
                onClick={() => {
                  if (!readOnly) {
                    setSelectedFurnitureIndex(
                      index === selectedFurnitureIndex ? null : index
                    );
                  }
                }}
                readOnly={readOnly}
              />
            );
          })}
          
          {/* Floor shadow */}
          {shadowsEnabled && (
            <ContactShadows 
              position={[0, 0.01, 0]} 
              opacity={0.4} 
              scale={currentRoom.width + currentRoom.length} 
              blur={2} 
              far={4} 
              resolution={256}
              color="#000000"
            />
          )}
          
          {/* Environment for reflections */}
          <Environment preset="sunset" />
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={!readOnly}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
          <PerspectiveCamera
            makeDefault
            position={[currentRoom.width / 2, currentRoom.height * 1.5, currentRoom.length * 1.5]}
            fov={50}
          />
        </Suspense>
      </Canvas>
      
      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white p-2 rounded">
        <p className="text-xs">Room: {currentRoom.name}</p>
        <p className="text-xs">Dimensions: {currentRoom.width}m x {currentRoom.length}m x {currentRoom.height}m</p>
        <p className="text-xs">Items: {placedFurniture.length}</p>
      </div>
      
      {/* Furniture control overlay - only show in editable mode */}
      {!readOnly && selectedFurnitureIndex !== null && (
        <div className="absolute top-4 right-4 p-4 bg-background/80 backdrop-blur-sm rounded-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">
              {getFurnitureById(placedFurniture[selectedFurnitureIndex].furnitureId)?.name || "Furniture"}
            </h3>
            <button 
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => setSelectedFurnitureIndex(null)}
            >
              Close
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Rotation</span>
                <span className="text-xs font-mono">{placedFurniture[selectedFurnitureIndex].rotation}°</span>
              </div>
              <div className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={rotateLeft}
                  className="flex-1"
                >
                  Rotate Left
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={rotateRight}
                  className="flex-1"
                >
                  Rotate Right
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Lighting control button - only show in editable mode */}
      {!readOnly && (
        <div className="absolute top-4 left-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowLightingControls(!showLightingControls)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Settings className="h-4 w-4 mr-1" />
            Lighting
          </Button>
        </div>
      )}
      
      {/* Lighting controls - only show in editable mode */}
      {!readOnly && showLightingControls && (
        <div className="absolute top-16 left-4 p-4 bg-background/80 backdrop-blur-sm rounded-md shadow-md w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Lighting Settings</h3>
            <button 
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => setShowLightingControls(false)}
            >
              Close
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Ambient Light</span>
                <span className="text-xs font-mono">{(ambientIntensity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={ambientIntensity}
                onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Direct Light</span>
                <span className="text-xs font-mono">{(directionalIntensity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1.5" 
                step="0.05" 
                value={directionalIntensity}
                onChange={(e) => setDirectionalIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs">Shadows</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={shadowsEnabled} 
                  onChange={() => setShadowsEnabled(!shadowsEnabled)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="space-y-2">
              <span className="text-xs">Light Color</span>
              <div className="flex gap-2">
                {["#ffffff", "#ffe0b0", "#b0e0ff", "#ffe0ff"].map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border ${
                      lightColor === color ? "ring-2 ring-primary" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setLightColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Room component with improved materials
const Room = ({ room }: RoomProps) => {
  // Use MeshStandardMaterial for better lighting interaction
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: room.floorColor,
    roughness: 0.8,
    metalness: 0.2,
  });
  
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: room.wallColor,
    roughness: 0.9,
    metalness: 0.1,
  });

  return (
    <group>
      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[room.width / 2, 0, room.length / 2]}
        receiveShadow
      >
        <planeGeometry args={[room.width, room.length]} />
        <primitive object={floorMaterial} />
      </mesh>
      
      {/* Back Wall */}
      <mesh 
        position={[room.width / 2, room.height / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[room.width, room.height]} />
        <primitive object={wallMaterial} />
      </mesh>
      
      {/* Left Wall */}
      <mesh 
        rotation={[0, Math.PI / 2, 0]}
        position={[0, room.height / 2, room.length / 2]}
        receiveShadow
      >
        <planeGeometry args={[room.length, room.height]} />
        <primitive object={wallMaterial} />
      </mesh>
    </group>
  );
};

// SelectableFurniture component with better materials
const SelectableFurniture = ({ 
  furniture, 
  position, 
  isSelected, 
  onClick,
  readOnly = false
}: SelectableFurnitureProps) => {
  // Use MeshStandardMaterial for better lighting
  const material = new THREE.MeshStandardMaterial({ 
    color: position.color,
    roughness: 0.7,
    metalness: 0.3,
    emissive: isSelected ? "#ffffff" : undefined,
    emissiveIntensity: isSelected ? 0.2 : 0,
  });
  
  return (
    <group 
      position={[position.x, position.y + furniture.height * position.scale / 2, position.z]} 
      rotation={[0, position.rotation * Math.PI / 180, 0]}
      scale={position.scale}
      onClick={(e) => {
        if (!readOnly) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[furniture.width, furniture.height, furniture.length]} />
        <primitive object={material} />
      </mesh>
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