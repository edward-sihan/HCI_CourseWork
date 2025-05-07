// src/pages/ViewDesign.tsx
import { Header } from "@/components/Header";
import { useDesign } from "@/contexts/DesignContext";
import { Button } from "@/components/ui/button";
import { Canvas3D } from "@/components/Canvas3D";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Share2, Download, Edit } from "lucide-react";
import { toast } from "sonner";

const ViewDesign = () => {
  const { savedDesigns, currentDesign, setCurrentDesign, setPlacedFurniture } = useDesign();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the design by ID
    const design = savedDesigns.find(d => d.id === id);
    if (design) {
      setCurrentDesign(design);
      setPlacedFurniture(design.furniture);
      setLoading(false);
    } else {
      toast.error("Design not found");
      navigate("/designs");
    }
  }, [id, savedDesigns, setCurrentDesign, navigate, setPlacedFurniture]);

  const handleEdit = () => {
    navigate("/");
  };

  const handleExport = () => {
    // In a real app, this would generate a PDF or image
    toast.success("Design exported successfully");
  };

  const handleShare = () => {
    // In a real app, this would create a shareable link
    toast.success("Design shared successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-6 flex items-center justify-center">
          <p>Loading design...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/designs")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Designs
            </Button>
            <h1 className="text-2xl font-bold">{currentDesign?.name}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Design
            </Button>
          </div>
        </div>
        
        <div className="bg-white border rounded-md shadow-sm h-[700px] flex items-center justify-center">
          <Canvas3D readOnly={true} />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-medium mb-2">Room Details</h2>
            <p className="text-sm text-muted-foreground">
              {currentDesign?.roomDetails ? (
                `Dimensions: ${currentDesign.roomDetails.width}m x ${currentDesign.roomDetails.length}m x ${currentDesign.roomDetails.height}m`
              ) : (
                "Room details not available"
              )}
            </p>
            <div className="mt-2 flex gap-2">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Wall Color</p>
                <div 
                  className="h-6 rounded border mt-1" 
                  style={{ backgroundColor: currentDesign?.roomDetails?.wallColor || "#FFFFFF" }} 
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Floor Color</p>
                <div 
                  className="h-6 rounded border mt-1" 
                  style={{ backgroundColor: currentDesign?.roomDetails?.floorColor || "#D2B48C" }} 
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4 md:col-span-2">
            <h2 className="text-lg font-medium mb-2">Furniture ({currentDesign?.furniture.length} items)</h2>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left pb-2">Item</th>
                    <th className="text-left pb-2">Color</th>
                    <th className="text-right pb-2">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDesign?.furniture.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2">{item.furnitureId}</td>
                      <td className="py-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                          {item.color}
                        </div>
                      </td>
                      <td className="py-2 text-right">
                        {item.x.toFixed(1)}, {item.z.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default ViewDesign;