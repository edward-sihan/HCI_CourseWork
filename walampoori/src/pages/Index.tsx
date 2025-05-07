// src/pages/Index.tsx
import { Header } from "@/components/Header";
import { useDesign } from "@/contexts/DesignContext";
import { useEffect } from "react";
import { Canvas2D } from "@/components/Canvas2D";
import { Canvas3D } from "@/components/Canvas3D";
import { RoomControls } from "@/components/RoomControls";
import { FurnitureCatalog } from "@/components/FurnitureCatalog";
import { PlacedFurnitureList } from "@/components/PlacedFurnitureList";
import { ModelManager } from "@/components/ModelManager";
import { mockFurniture } from "@/data/mockData";
import { ViewModeSelector } from "@/components/ViewModeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { viewMode, setFurnitureCatalog } = useDesign();
  
  // Load mock data on component mount
  useEffect(() => {
    setFurnitureCatalog(mockFurniture);
  }, [setFurnitureCatalog]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-[1600px] py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Room Visualizer</h1>
          <ViewModeSelector />
        </div>
        
        <div className="grid grid-cols-12 gap-4">
          {/* Left sidebar - make it narrower */}
          <div className="col-span-2">
            <RoomControls />
          </div>
          
          {/* Main canvas area - make it wider */}
          <div className="col-span-8 flex flex-col">
            <div className="bg-white border rounded-md shadow-sm h-[700px] flex items-center justify-center">
              {viewMode === 'twoD' ? <Canvas2D /> : <Canvas3D />}
            </div>
          </div>
          
          {/* Right sidebar - make it narrower */}
          <div className="col-span-2">
            <Tabs defaultValue="catalog">
              <TabsList className="w-full">
                <TabsTrigger value="catalog">Furniture</TabsTrigger>
                <TabsTrigger value="placed">Items</TabsTrigger>
                <TabsTrigger value="models">Models</TabsTrigger>
              </TabsList>
              
              <TabsContent value="catalog">
                <FurnitureCatalog />
              </TabsContent>
              
              <TabsContent value="placed">
                <PlacedFurnitureList />
              </TabsContent>
              
              <TabsContent value="models">
                <ModelManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Walampoori Room Visualizer &copy; 2025
        </div>
      </footer>
    </div>
  );
};

export default Index;