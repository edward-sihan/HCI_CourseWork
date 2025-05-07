import React, { useEffect, useRef, useState } from "react";
import { useDesign } from "@/contexts/DesignContext";
import { Canvas, Rect, Object as FabricObject, Shadow } from "fabric";

export const Canvas2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const { currentRoom, placedFurniture, furnitureCatalog, updateFurniturePosition } = useDesign();
  
  // Initialize canvas - ensure it renders at the right size
  useEffect(() => {
    const initializeCanvas = () => {
      if (!canvasRef.current || !containerRef.current) return;
      
      try {
        // Clean up any existing canvas to prevent duplicates
        if (fabricCanvas) {
          fabricCanvas.dispose();
        }
        
        const containerWidth = containerRef.current.clientWidth || 800;
        const containerHeight = containerRef.current.clientHeight || 600;
        
        const canvas = new Canvas(canvasRef.current, {
          width: containerWidth,
          height: containerHeight,
          backgroundColor: "#f0f0f0",
        });
        
        setFabricCanvas(canvas);
      } catch (error) {
        console.error("Error initializing fabric canvas:", error);
      }
    };
    
    initializeCanvas();
    
    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !fabricCanvas) return;
      
      const containerWidth = containerRef.current.clientWidth || 800;
      const containerHeight = containerRef.current.clientHeight || 600;
      
      fabricCanvas.setWidth(containerWidth);
      fabricCanvas.setHeight(containerHeight);
      fabricCanvas.renderAll();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, []);
  
  // Draw room
  useEffect(() => {
    if (!fabricCanvas || !currentRoom) return;
    
    // Completely clear the canvas - this will remove ALL objects
    fabricCanvas.clear();
    
    // Calculate scale to fit room in canvas
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    const roomWidth = currentRoom.width;
    const roomLength = currentRoom.length;
    
    // Use the smallest scale to ensure room fits in canvas
    const scaleX = canvasWidth / roomWidth;
    const scaleY = canvasHeight / roomLength;
    const scale = Math.min(scaleX, scaleY) * 0.8; // 80% of available space
    
    // Create room rectangle
    const scaledWidth = roomWidth * scale;
    const scaledLength = roomLength * scale;
    const roomLeft = (canvasWidth - scaledWidth) / 2;
    const roomTop = (canvasHeight - scaledLength) / 2;
    
    const room = new Rect({
      left: roomLeft,
      top: roomTop,
      width: scaledWidth,
      height: scaledLength,
      fill: currentRoom.floorColor,
      stroke: currentRoom.wallColor,
      strokeWidth: 10,
      selectable: false,
    });
    
    fabricCanvas.add(room);
    
    // Store scale and position info for furniture
    fabricCanvas._objects = [room]; // Explicitly ensure only the room is in the canvas
    
    fabricCanvas.set('roomData', { 
      scale, 
      roomLeft, 
      roomTop,
      roomWidth: currentRoom.width,
      roomLength: currentRoom.length
    });
    
    fabricCanvas.renderAll();
    
  }, [fabricCanvas, currentRoom, currentRoom?.floorColor, currentRoom?.wallColor]);

  // Draw furniture - completely redone to prevent cloning
  useEffect(() => {
    if (!fabricCanvas || !currentRoom) return;
    
    const roomData = fabricCanvas.get('roomData') as { 
      scale: number, 
      roomLeft: number, 
      roomTop: number,
      roomWidth: number,
      roomLength: number
    } | undefined;
    
    if (!roomData) return;
    
    const { scale, roomLeft, roomTop, roomWidth, roomLength } = roomData;
    
    // CRITICAL FIX: Remove all existing furniture first by getting all canvas objects
    // and filtering out anything that's not the room
    const objects = fabricCanvas.getObjects();
    for (let i = objects.length - 1; i >= 0; i--) {
      if (objects[i].get('type') === 'furniture') {
        fabricCanvas.remove(objects[i]);
      }
    }
    
    // Now add each furniture piece from scratch
    placedFurniture.forEach((item, index) => {
      const furniture = furnitureCatalog.find(f => f.id === item.furnitureId);
      if (!furniture) return;
      
      // Calculate furniture position in canvas coordinates
      const furnitureX = roomLeft + (item.x * scale);
      const furnitureZ = roomTop + (item.z * scale);
      
      // Calculate furniture dimensions in canvas coordinates
      const furnitureWidth = furniture.width * scale * item.scale;
      const furnitureLength = furniture.length * scale * item.scale;
      
      // Create a new rectangle for the furniture
      const rect = new Rect({
        left: furnitureX,
        top: furnitureZ,
        width: furnitureWidth,
        height: furnitureLength,
        fill: item.color,
        angle: item.rotation,
        originX: 'center',
        originY: 'center',
        hasControls: true,
        hasBorders: true,
        cornerColor: 'rgba(121, 82, 179, 0.7)',
        transparentCorners: false,
        type: 'furniture',
        furnitureIndex: index,
      });
      
      // Add shadow
      rect.set('shadow', new Shadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 10,
        offsetX: 5,
        offsetY: 5
      }));
      
      // CRITICAL FIX: Use a unique id to identify objects
      rect.set('id', `furniture-${index}-${Date.now()}`);
      
      // Add movement constraints - WITH EVENT UNBINDING FIRST
      rect.off('moving'); // Remove any existing event handlers
      rect.off('modified');
      
      rect.on('moving', function(this: FabricObject) {
        const obj = this;
        const roomBounds = {
          left: roomLeft,
          top: roomTop,
          right: roomLeft + (roomWidth * scale),
          bottom: roomTop + (roomLength * scale)
        };
        
        // Keep furniture within room bounds
        if (obj.left! < roomBounds.left) obj.set('left', roomBounds.left);
        if (obj.top! < roomBounds.top) obj.set('top', roomBounds.top);
        if (obj.left! + obj.width! > roomBounds.right) obj.set('left', roomBounds.right - obj.width!);
        if (obj.top! + obj.height! > roomBounds.bottom) obj.set('top', roomBounds.bottom - obj.height!);
      });
      
      rect.on('modified', function(this: FabricObject) {
        const index = this.get('furnitureIndex') as number;
        
        // Convert back to room coordinates
        const updatedX = ((this.left || 0) - roomLeft) / scale;
        const updatedZ = ((this.top || 0) - roomTop) / scale;
        const updatedRotation = this.angle || 0;
        
        updateFurniturePosition(index, { 
          x: updatedX, 
          z: updatedZ, 
          rotation: updatedRotation 
        });
      });
      
      fabricCanvas.add(rect);
    });
    
    fabricCanvas.renderAll();
    
  }, [fabricCanvas, currentRoom, placedFurniture, furnitureCatalog, updateFurniturePosition]);
  
  return (
    <div className="canvas-container w-full h-full" ref={containerRef}>
      <canvas ref={canvasRef} className="border border-border rounded-md"></canvas>
    </div>
  );
};