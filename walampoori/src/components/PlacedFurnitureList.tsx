import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDesign } from "@/contexts/DesignContext";
import { Furniture } from "@/types";
import { Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export const PlacedFurnitureList = () => {
  const { placedFurniture, furnitureCatalog, updateFurniturePosition, removeFurnitureFromRoom } = useDesign();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const getFurnitureById = (id: string): Furniture | undefined => {
    return furnitureCatalog.find(item => item.id === id);
  };
  
  const handleColorChange = (index: number, color: string) => {
    updateFurniturePosition(index, { color });
  };
  
  const handleRotationChange = (index: number, rotation: number) => {
    updateFurniturePosition(index, { rotation });
  };
  
  const handleScaleChange = (index: number, scale: number) => {
    updateFurniturePosition(index, { scale });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base">Placed Furniture</CardTitle>
        <CardDescription className="text-xs">Modify or remove furniture items</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[650px] pr-2">
          {placedFurniture.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              No furniture placed yet. Add furniture from the catalog.
            </div>
          ) : (
            <div className="space-y-2">
              {placedFurniture.map((item, index) => {
                const furniture = getFurnitureById(item.furnitureId);
                if (!furniture) return null;
                
                return (
                  <div key={index} className="border rounded-md p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-muted rounded overflow-hidden">
                          <img src={furniture.thumbnailUrl} alt={furniture.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-medium">{furniture.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{furniture.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeFurnitureFromRoom(index)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    {editingIndex === index && (
                      <div className="mt-2 pt-2 border-t space-y-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Color</label>
                          <div className="flex gap-1">
                            <Input 
                              type="color" 
                              value={item.color} 
                              onChange={e => handleColorChange(index, e.target.value)}
                              className="w-8 h-7 p-1"
                            />
                            <Input 
                              value={item.color} 
                              onChange={e => handleColorChange(index, e.target.value)}
                              className="flex-1 h-7 text-xs"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1">
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Rotation (°)</label>
                            <Input 
                              type="number" 
                              min="0" 
                              max="360" 
                              value={item.rotation} 
                              onChange={e => handleRotationChange(index, parseFloat(e.target.value))}
                              className="h-7 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Scale</label>
                            <Input 
                              type="number" 
                              min="0.1" 
                              max="3" 
                              step="0.1" 
                              value={item.scale} 
                              onChange={e => handleScaleChange(index, parseFloat(e.target.value))}
                              className="h-7 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};