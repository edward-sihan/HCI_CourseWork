import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDesign } from "@/contexts/DesignContext";
import { useState } from "react";
import { toast } from "sonner";

export const RoomControls = () => {
  const { currentRoom, setCurrentRoom, saveCurrentDesign } = useDesign();
  
  const [roomName, setRoomName] = useState(currentRoom?.name || "New Room");
  const [width, setWidth] = useState(currentRoom?.width.toString() || "5");
  const [length, setLength] = useState(currentRoom?.length.toString() || "5");
  const [height, setHeight] = useState(currentRoom?.height.toString() || "3");
  const [wallColor, setWallColor] = useState(currentRoom?.wallColor || "#FFFFFF");
  const [floorColor, setFloorColor] = useState(currentRoom?.floorColor || "#D2B48C");
  const [designName, setDesignName] = useState("");

  const handleUpdateRoom = () => {
    if (!currentRoom) return;
    
    const updatedRoom = {
      ...currentRoom,
      name: roomName,
      width: parseFloat(width),
      length: parseFloat(length),
      height: parseFloat(height),
      wallColor,
      floorColor,
      updatedAt: new Date(),
    };
    
    setCurrentRoom(updatedRoom);
    toast.success("Room updated successfully!");
  };

  const handleSaveDesign = () => {
    if (!designName.trim()) {
      toast.error("Please enter a design name");
      return;
    }
    
    saveCurrentDesign(designName);
    setDesignName("");
    toast.success("Design saved successfully!");
  };

  if (!currentRoom) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-base">Room Configuration</CardTitle>
          <CardDescription className="text-xs">
            Adjust dimensions and colors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
          <div className="space-y-2">
            <Label htmlFor="roomName" className="text-xs">Room Name</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="h-8 text-xs"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Dimensions (m)</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="width" className="text-xs text-muted-foreground">Width</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  max="20"
                  step="0.1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="h-7 text-xs px-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="length" className="text-xs text-muted-foreground">Length</Label>
                <Input
                  id="length"
                  type="number"
                  min="1"
                  max="20"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="h-7 text-xs px-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="height" className="text-xs text-muted-foreground">Height</Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-7 text-xs px-2"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wallColor" className="text-xs">Wall Color</Label>
            <div className="flex gap-2">
              <Input
                id="wallColor"
                type="color"
                value={wallColor}
                onChange={(e) => setWallColor(e.target.value)}
                className="w-8 h-8 p-1"
              />
              <Input
                value={wallColor}
                onChange={(e) => setWallColor(e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="floorColor" className="text-xs">Floor Color</Label>
            <div className="flex gap-2">
              <Input
                id="floorColor"
                type="color"
                value={floorColor}
                onChange={(e) => setFloorColor(e.target.value)}
                className="w-8 h-8 p-1"
              />
              <Input
                value={floorColor}
                onChange={(e) => setFloorColor(e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
          
          <Button onClick={handleUpdateRoom} className="w-full h-8 text-xs mt-2">
            Update Room
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-base">Save Design</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3">
          <div className="space-y-2">
            <Label htmlFor="designName" className="text-xs">Design Name</Label>
            <Input
              id="designName"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="Enter design name"
              className="h-8 text-xs"
            />
          </div>
          <Button onClick={handleSaveDesign} className="w-full h-8 text-xs">
            Save Current Design
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};