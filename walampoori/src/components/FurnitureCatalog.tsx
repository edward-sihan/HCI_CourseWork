import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDesign } from "@/contexts/DesignContext";
import { Furniture } from "@/types";
import { Plus } from "lucide-react";

export const FurnitureCatalog = () => {
  const { furnitureCatalog, addFurnitureToRoom } = useDesign();

  const FurnitureItem = ({ item }: { item: Furniture }) => {
    return (
      <div
        className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer furniture-item"
        onClick={() => addFurnitureToRoom(item)}
      >
        <div className="flex-shrink-0 w-9 h-9 bg-muted rounded overflow-hidden">
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.type}</p>
        </div>
        <div
          className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
          title="Add to room"
        >
          <Plus size={14} />
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base">Furniture Catalog</CardTitle>
        <CardDescription className="text-xs">Add furniture to your room</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[650px] pr-2">
          <div className="space-y-1">
            {furnitureCatalog.map((item) => (
              <FurnitureItem key={item.id} item={item} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};