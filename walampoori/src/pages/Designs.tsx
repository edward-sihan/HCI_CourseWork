import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDesign } from "@/contexts/DesignContext";
import { Design } from "@/types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon, Trash2Icon, MoreVertical, PlusIcon, EyeIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Designs = () => {
  const { savedDesigns, setCurrentDesign, setPlacedFurniture, setSavedDesigns, furnitureCatalog } = useDesign();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<Design | null>(null);
  const navigate = useNavigate();

  // Filter designs based on search term
  const filteredDesigns = savedDesigns.filter(design => 
    design.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load design and navigate to editor
  const handleEditDesign = (design: Design) => {
    setCurrentDesign(design);
    // Also restore the furniture placement
    setPlacedFurniture(design.furniture);
    navigate("/");
  };

  // View design in 3D (read-only mode)
  const handleViewDesign = (design: Design) => {
    setCurrentDesign(design);
    setPlacedFurniture(design.furniture);
    navigate(`/view-design/${design.id}`);
  };

  // Delete design confirmation
  const handleDeleteClick = (design: Design) => {
    setDesignToDelete(design);
    setDeleteDialogOpen(true);
  };

  // Confirm design deletion
  const confirmDelete = () => {
    if (designToDelete) {
      const updatedDesigns = savedDesigns.filter(d => d.id !== designToDelete.id);
      setSavedDesigns(updatedDesigns);
      toast.success("Design deleted successfully");
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Designs</h1>
          
          <div className="flex items-center gap-4">
            <Input 
              className="w-60" 
              placeholder="Search designs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button asChild>
              <Link to="/">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Design
              </Link>
            </Button>
          </div>
        </div>
        
        {filteredDesigns.length === 0 ? (
          <div className="border rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium mb-2">
              {searchTerm ? "No designs match your search" : "No designs yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Try searching with different keywords"
                : "Create your first room design to see it here"}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/">Create Design</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <div className="text-3xl font-bold text-muted-foreground">
                    {design.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="absolute top-2 right-2 bg-white/90 text-xs px-2 py-1 rounded font-medium">
                    {design.furniture.length} items
                  </span>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{design.name}</CardTitle>
                      <CardDescription>
                        {design.updatedAt?.toLocaleDateString() || "Unknown date"}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDesign(design)}>
                          <PencilIcon className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDesign(design)}>
                          <EyeIcon className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(design)}
                          className="text-red-600"
                        >
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleEditDesign(design)}>
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button onClick={() => handleViewDesign(design)}>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Design</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{designToDelete?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Walampoori Room Visualizer &copy; 2025
        </div>
      </footer>
    </div>
  );
};

export default Designs;