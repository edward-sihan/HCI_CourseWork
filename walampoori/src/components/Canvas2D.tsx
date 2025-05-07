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
        
        console.log("Initializing canvas with size:", containerWidth, containerHeight);
        
        const canvas = new Canvas(canvasRef.current, {
          width: containerWidth,
          height: containerHeight,
          backgroundColor: "#f0f0f0",
        });
        
        setFabricCanvas(canvas);
        
        // Force a render
        setTimeout(() => {
          canvas.renderAll();
        }, 100);
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
  
  // Draw room - make sure this runs properly when properties change
  useEffect(() => {
    if (!fabricCanvas || !currentRoom) {
      console.log("No canvas or room to draw");
      return;
    }
    
    console.log("Drawing room with colors:", currentRoom.floorColor, currentRoom.wallColor);
    
    try {
      // Clear canvas completely
      fabricCanvas.clear();
      
      // Calculate scale to fit room in canvas
      const canvasWidth = fabricCanvas.getWidth() || 800;
      const canvasHeight = fabricCanvas.getHeight() || 600;
      const roomWidth = currentRoom.width;
      const roomLength = currentRoom.length;
      
      console.log("Canvas dimensions:", canvasWidth, canvasHeight);
      console.log("Room dimensions:", roomWidth, roomLength);
      
      // Use the smallest scale to ensure room fits in canvas
      const scaleX = canvasWidth / roomWidth;
      const scaleY = canvasHeight / roomLength;
      const scale = Math.min(scaleX, scaleY) * 0.8; // 80% of available space
      
      // Create room rectangle
      const scaledWidth = roomWidth * scale;
      const scaledLength = roomLength * scale;
      const roomLeft = (canvasWidth - scaledWidth) / 2;
      const roomTop = (canvasHeight - scaledLength) / 2;
      
      console.log("Room rendering at:", roomLeft, roomTop, scaledWidth, scaledLength);
      
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
      fabricCanvas.set('roomData', { 
        scale, 
        roomLeft, 
        roomTop,
        roomWidth: currentRoom.width,
        roomLength: currentRoom.length
      });
      
      // Force a render
      setTimeout(() => {
        fabricCanvas.renderAll();
      }, 0);
      
    } catch (error) {
      console.error("Error drawing room:", error);
    }
    
  }, [fabricCanvas, currentRoom]);

  // Draw furniture
  useEffect(() => {
    if (!fabricCanvas || !currentRoom) return;
    
    const drawFurniture = () => {
      try {
        // Get room scale info
        const roomData = fabricCanvas.get('roomData') as { 
          scale: number, 
          roomLeft: number, 
          roomTop: number,
          roomWidth: number,
          roomLength: number
        } | undefined;
        
        if (!roomData) {
          console.warn("No room data available for furniture placement");
          return;
        }
        
        const { scale, roomLeft, roomTop, roomWidth, roomLength } = roomData;
        
        console.log("Drawing furniture with scale:", scale);
        
        // Clear previous furniture
        const objects = fabricCanvas.getObjects();
        for (let i = objects.length - 1; i >= 0; i--) {
          const obj = objects[i];
          if (obj !== undefined && obj.get('type') === 'furniture') {
            fabricCanvas.remove(obj);
          }
        }
        
        // Add furniture
        placedFurniture.forEach((item, index) => {
          const furniture = furnitureCatalog.find(f => f.id === item.furnitureId);
          if (!furniture) return;
          
          // Calculate furniture position in canvas coordinates
          const furnitureX = roomLeft + (item.x * scale);
          const furnitureZ = roomTop + (item.z * scale);
          
          // Calculate furniture dimensions in canvas coordinates
          const furnitureWidth = furniture.width * scale * item.scale;
          const furnitureLength = furniture.length * scale * item.scale;
          
          console.log("Drawing furniture at:", furnitureX, furnitureZ, furnitureWidth, furnitureLength);
          
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
          
          // Simple shadow effect
          try {
            rect.set('shadow', new Shadow({
              color: 'rgba(0,0,0,0.3)',
              blur: 10,
              offsetX: 5,
              offsetY: 5
            }));
          } catch (err) {
            console.warn("Could not set shadow:", err);
          }
          
          // Add movement constraints
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
          
          // Update position in state when modified
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
        
        // Force render after adding all furniture
        fabricCanvas.renderAll();
      } catch (error) {
        console.error("Error drawing furniture:", error);
      }
    };
    
    // Draw furniture with a small delay to ensure room is drawn
    setTimeout(drawFurniture, 100);
    
  }, [fabricCanvas, currentRoom, placedFurniture, furnitureCatalog, updateFurniturePosition]);
  
  return (
    <div className="canvas-container w-full h-full" ref={containerRef}>
      <canvas ref={canvasRef} className="border border-border rounded-md"></canvas>
    </div>
  );
};