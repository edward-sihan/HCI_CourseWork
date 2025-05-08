export type FurnitureType = 'chair' | 'table' | 'sofa' | 'bed' | 'cabinet' | 'other';

export interface Room {
  id?: string;
  name: string;
  width: number;  // meters
  length: number; // meters
  height: number; // meters
  wallColor: string; // hex code
  floorColor: string; // hex code
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomDetails {
  width: number;
  length: number;
  height: number;
  wallColor: string;
  floorColor: string;
}

export interface Furniture {
  id?: string;
  name: string;
  type: FurnitureType;
  width: number;  // meters
  length: number; // meters
  height: number; // meters
  color: string;  // hex code
  defaultColor: string; // hex code
  modelUrl: string; // URL to 3D model
  thumbnailUrl: string; // URL to thumbnail image
  modelFormat?: 'glb' | 'obj' | 'box'; // Add this to specify model format
  objModelPath?: string; // Path to OBJ model file
  glbModelPath?: string; // Path to GLB model file (add this)
  createdAt?: Date;
}

export interface FurniturePosition {
  furnitureId: string;
  x: number; // position in room
  y: number; // position in room
  z: number; // position in room
  rotation: number; // degrees
  scale: number; // scaling factor
  color: string; // hex code
  shade: number; // 0-100 for shading intensity
  roughness?: number; // 0-1, higher is rougher
  metalness?: number; // 0-1, higher is more metallic
}

export interface Design {
  id?: string;
  name: string;
  roomId: string;
  userId: string;
  furniture: FurniturePosition[];
  roomDetails?: RoomDetails;
  createdAt?: Date;
  updatedAt?: Date;
}