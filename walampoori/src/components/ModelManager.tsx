// src/components/ModelManager.tsx
import React, { useState } from "react";
import { useDesign } from "@/contexts/DesignContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export const ModelManager = () => {
  const { furnitureCatalog, setFurnitureCatalog } = useDesign();
  const [isUploading, setIsUploading] = useState(false);
  
  // Function to handle model upload
  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>, furnitureId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Create a URL for the uploaded file
      const objectUrl = URL.createObjectURL(file);
      
      // Store the uploaded model path in local storage for persistence
      const storedModels = JSON.parse(localStorage.getItem('walampoori-models') || '{}');
      storedModels[furnitureId] = {
        path: objectUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      };
      localStorage.setItem('walampoori-models', JSON.stringify(storedModels));
      
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
      toast.success(`Model "${file.name}" uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading model:', error);
      toast.error('Failed to upload model. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Load previously uploaded models on component mount
  React.useEffect(() => {
    try {
      const storedModels = JSON.parse(localStorage.getItem('walampoori-models') || '{}');
      
      if (Object.keys(storedModels).length > 0) {
        const updatedCatalog = furnitureCatalog.map(item => {
          if (storedModels[item.id]) {
            return {
              ...item,
              objModelPath: storedModels[item.id].path
            };
          }
          return item;
        });
        
        setFurnitureCatalog(updatedCatalog);
      }
    } catch (error) {
      console.error('Error loading stored models:', error);
    }
  }, []);
  
  return (
    <Card className="h-full">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base">3D Models</CardTitle>
        <CardDescription className="text-xs">
          Upload custom 3D models
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[650px] pr-2">
          <div className="space-y-2">
            {furnitureCatalog.map((furniture) => {
              // Check if this furniture has a stored model
              const storedModels = JSON.parse(localStorage.getItem('walampoori-models') || '{}');
              const hasModel = !!storedModels[furniture.id];
              
              return (
                <div key={furniture.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-muted rounded overflow-hidden">
                      <img 
                        src={furniture.thumbnailUrl} 
                        alt={furniture.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{furniture.name}</p>
                      {hasModel && (
                        <p className="text-xs text-green-600">
                          Model loaded
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <input
                      id={`model-upload-${furniture.id}`}
                      type="file"
                      accept=".obj,.mtl,.gltf,.glb"
                      className="hidden"
                      onChange={(e) => handleModelUpload(e, furniture.id || '')}
                      disabled={isUploading}
                    />
                    <label 
                      htmlFor={`model-upload-${furniture.id}`}
                      className="cursor-pointer px-2 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 disabled:opacity-50"
                    >
                      {hasModel ? 'Change' : 'Upload'}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};