import React from "react";
import { useDesign } from "@/contexts/DesignContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RotateCw, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FurnitureControlsProps {
  selectedFurnitureIndex: number | null;
  setSelectedFurnitureIndex: (index: number | null) => void;
}

export const FurnitureControls = ({ 
  selectedFurnitureIndex, 
  setSelectedFurnitureIndex 
}: FurnitureControlsProps) => {
  const { placedFurniture, updateFurniturePosition, furnitureCatalog } = useDesign();
  
  if (selectedFurnitureIndex === null) {
    return (
      <div className="p-4 bg-background/80 backdrop-blur-sm rounded-md shadow-md">
        <p className="text-sm text-center text-muted-foreground">
          Select a furniture item to edit
        </p>
      </div>
    );
  }
  
  const furniture = placedFurniture[selectedFurnitureIndex];
  const furnitureDetails = furnitureCatalog.find(f => f.id === furniture.furnitureId);
  
  const rotateLeft = () => {
    updateFurniturePosition(selectedFurnitureIndex, { 
      rotation: (furniture.rotation - 15) % 360 
    });
  };
  
  const rotateRight = () => {
    updateFurniturePosition(selectedFurnitureIndex, { 
      rotation: (furniture.rotation + 15) % 360 
    });
  };
  
  const handleScaleChange = (value: number[]) => {
    updateFurniturePosition(selectedFurnitureIndex, { scale: value[0] });
  };
  
  const handleColorChange = (color: string) => {
    updateFurniturePosition(selectedFurnitureIndex, { color });
  };
  
  return (
    <div className="p-4 bg-background/80 backdrop-blur-sm rounded-md shadow-md">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">
            {furnitureDetails?.name || "Furniture"}
          </h3>
          <button 
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => setSelectedFurnitureIndex(null)}
          >
            Close
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Rotation</Label>
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={rotateLeft}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <span className="text-xs font-mono">{furniture.rotation}°</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={rotateRight}
              className="h-8 w-8 p-0"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Scale</Label>
            <span className="text-xs font-mono">{furniture.scale.toFixed(1)}x</span>
          </div>
          <div className="flex items-center gap-2">
            <ZoomOut className="h-3 w-3 text-muted-foreground" />
            <Slider
              value={[furniture.scale]}
              min={0.1}
              max={2}
              step={0.1}
              onValueChange={handleScaleChange}
            />
            <ZoomIn className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs">Color</Label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={furniture.color} 
              onChange={e => handleColorChange(e.target.value)}
              className="w-10 h-8 p-1"
            />
            <Input 
              value={furniture.color} 
              onChange={e => handleColorChange(e.target.value)}
              className="flex-1 h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};