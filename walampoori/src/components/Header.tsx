import { Button } from "@/components/ui/button";
import { useDesign } from "@/contexts/DesignContext";
import { LogOut, LayoutGrid, Layers3 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

export const Header = () => {
  const { viewMode, setViewMode } = useDesign();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-2xl text-primary mr-8">Walampoori</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Editor
            </Link>
            <Link 
              to="/designs" 
              className={`text-sm font-medium transition-colors ${isActive('/designs') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              My Designs
            </Link>
            <Link 
              to="/rooms" 
              className={`text-sm font-medium transition-colors ${isActive('/rooms') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Rooms
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Only show view toggle on editor page */}
          {location.pathname === '/' && (
            <div className="bg-muted rounded-md p-0.5 mr-2">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-md px-3 ${viewMode === 'twoD' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => setViewMode('twoD')}
              >
                <LayoutGrid className="w-4 h-4 mr-1" />
                2D
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-md px-3 ${viewMode === 'threeD' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => setViewMode('threeD')}
              >
                <Layers3 className="w-4 h-4 mr-1" />
                3D
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-red-500 hover:border-red-200"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};