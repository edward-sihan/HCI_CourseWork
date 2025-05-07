import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Design, Furniture, FurniturePosition, Room, RoomDetails } from '../types';

interface DesignContextType {
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
  currentDesign: Design | null;
  setCurrentDesign: (design: Design | null) => void;
  furnitureCatalog: Furniture[];
  setFurnitureCatalog: (catalog: Furniture[]) => void;
  placedFurniture: FurniturePosition[];
  setPlacedFurniture: (furniture: FurniturePosition[]) => void;
  addFurnitureToRoom: (furniture: Furniture) => void;
  updateFurniturePosition: (index: number, position: Partial<FurniturePosition>) => void;
  removeFurnitureFromRoom: (index: number) => void;
  savedDesigns: Design[];
  setSavedDesigns: (designs: Design[]) => void;
  saveCurrentDesign: (name: string) => void;
  deleteDesign: (designId: string) => void;
  viewMode: 'twoD' | 'threeD';
  setViewMode: (mode: 'twoD' | 'threeD') => void;
}

const defaultRoomValues: Room = {
  name: 'New Room',
  width: 5,
  length: 5,
  height: 3,
  wallColor: '#FFFFFF',
  floorColor: '#D2B48C',
  userId: 'user1',
};

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const DesignProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState<Room | null>({ ...defaultRoomValues });
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null);
  const [furnitureCatalog, setFurnitureCatalog] = useState<Furniture[]>([]);
  const [placedFurniture, setPlacedFurniture] = useState<FurniturePosition[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<Design[]>([]);
  const [viewMode, setViewMode] = useState<'twoD' | 'threeD'>('twoD');

  const addFurnitureToRoom = (furniture: Furniture) => {
    if (!currentRoom) return;
    
    const newFurniture: FurniturePosition = {
      furnitureId: furniture.id || '',
      x: currentRoom.width / 2,
      y: 0,
      z: currentRoom.length / 2,
      rotation: 0,
      scale: 1,
      color: furniture.defaultColor,
      shade: 0,
    };
    
    setPlacedFurniture([...placedFurniture, newFurniture]);
  };

  const updateFurniturePosition = (index: number, position: Partial<FurniturePosition>) => {
    if (!currentRoom) return;
    
    const updatedFurniture = [...placedFurniture];
    const updatedItem = { ...updatedFurniture[index], ...position };
    
    // Allow furniture to be placed anywhere within room boundaries
    if (position.x !== undefined) {
      updatedItem.x = Math.max(0, Math.min(currentRoom.width, updatedItem.x));
    }
    
    if (position.z !== undefined) {
      updatedItem.z = Math.max(0, Math.min(currentRoom.length, updatedItem.z));
    }
    
    updatedFurniture[index] = updatedItem;
    setPlacedFurniture(updatedFurniture);
  };

  const removeFurnitureFromRoom = (index: number) => {
    const updatedFurniture = placedFurniture.filter((_, i) => i !== index);
    setPlacedFurniture(updatedFurniture);
  };

  const saveCurrentDesign = (name: string) => {
    if (!currentRoom) return;
    
    // Create a unique ID for the design if it doesn't exist
    const id = currentDesign?.id || `design-${Date.now()}`;
    
    const newDesign: Design = {
      id,
      name,
      roomId: currentRoom.id || 'temp-room-id',
      userId: currentRoom.userId,
      furniture: [...placedFurniture],
      roomDetails: {
        width: currentRoom.width,
        length: currentRoom.length,
        height: currentRoom.height,
        wallColor: currentRoom.wallColor,
        floorColor: currentRoom.floorColor,
      },
      createdAt: currentDesign?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    // Update the design if it exists, otherwise add a new one
    if (currentDesign?.id) {
      // Update existing design
      setSavedDesigns(savedDesigns.map(design => 
        design.id === currentDesign.id ? newDesign : design
      ));
    } else {
      // Add new design
      setSavedDesigns([...savedDesigns, newDesign]);
    }
    
    setCurrentDesign(newDesign);
  };

  const deleteDesign = (designId: string) => {
    setSavedDesigns(savedDesigns.filter(design => design.id !== designId));
    
    // If the current design is the one being deleted, clear it
    if (currentDesign?.id === designId) {
      setCurrentDesign(null);
    }
  };

  return (
    <DesignContext.Provider
      value={{
        currentRoom,
        setCurrentRoom,
        currentDesign,
        setCurrentDesign,
        furnitureCatalog,
        setFurnitureCatalog,
        placedFurniture,
        setPlacedFurniture,
        addFurnitureToRoom,
        updateFurniturePosition,
        removeFurnitureFromRoom,
        savedDesigns,
        setSavedDesigns,
        saveCurrentDesign,
        deleteDesign,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = (): DesignContextType => {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};