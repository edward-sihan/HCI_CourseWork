// src/components/ModelUploader.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDesign } from "@/contexts/DesignContext";
import { Furniture } from "@/types";

export const ModelUploader = () => {
  const { furnitureCatalog, setFurnitureCatalog } = useDesign();
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>, furnitureId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Create a URL for the uploaded file
    const objectUrl = URL.createObjectURL(file);
    
    // Update the furniture catalog with the new model path
    const updatedCatalog = furnitureCatalog.map(item => {
      if (item.id === furnitureId) {
        return {
          ...item,
          objModelPath: objectUrl
        };
      }
      return item;
    });
    
    setFurnitureCatalog(updatedCatalog);
    setSelectedFurniture(null);
    setUploadProgress(0);
  };
  
  // Simulate upload progress (for UI feedback)
  const simulateProgress = (furnitureId: string) => {
    setSelectedFurniture(furnitureId);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };
  
  return (
    <div className="p-4 border rounded-md space-y-4">
      <h3 className="text-lg font-medium">Upload 3D Models</h3>
      <p className="text-sm text-muted-foreground">
        Select a furniture item and upload its 3D model in OBJ format
      </p>
      
      <div className="space-y-4 mt-4">
        {furnitureCatalog.map((furniture) => (
          <div key={furniture.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                <img 
                  src={furniture.thumbnailUrl} 
                  alt={furniture.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="font-medium text-sm">{furniture.name}</p>
                <p className="text-xs text-muted-foreground">{furniture.type}</p>
              </div>
            </div>
            
            <div>
              {selectedFurniture === furniture.id ? (
                <div className="w-24">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${uploadProgress}%` }} 
                    />
                  </div>
                </div>
              ) : furniture.objModelPath ? (
                <div className="text-xs text-green-600">Model uploaded</div>
              ) : (
                <div>
                  <Input
                    id={`model-upload-${furniture.id}`}
                    type="file"
                    accept=".obj"
                    className="hidden"
                    onChange={(e) => {
                      simulateProgress(furniture.id || "");
                      handleModelUpload(e, furniture.id || "");
                    }}
                  />
                  <Label 
                    htmlFor={`model-upload-${furniture.id}`}
                    className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded cursor-pointer hover:bg-primary/90"
                  >
                    Upload Model
                  </Label>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};