// src/components/MaterialSelector.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MaterialSelectorProps {
  color: string;
  setColor: (color: string) => void;
  roughness: number;
  setRoughness: (value: number) => void;
  metalness: number;
  setMetalness: (value: number) => void;
}

export const MaterialSelector = ({
  color,
  setColor,
  roughness,
  setRoughness,
  metalness,
  setMetalness,
}: MaterialSelectorProps) => {
  const materialPresets = [
    { name: "Wood", roughness: 0.8, metalness: 0.1, colors: ["#A67D5D", "#8B5A2B", "#D2B48C", "#5C4033"] },
    { name: "Metal", roughness: 0.2, metalness: 0.8, colors: ["#C0C0C0", "#A8A8A8", "#D4AF37", "#B87333"] },
    { name: "Plastic", roughness: 0.9, metalness: 0.0, colors: ["#FFFFFF", "#1E90FF", "#FF6347", "#32CD32"] },
    { name: "Fabric", roughness: 1.0, metalness: 0.0, colors: ["#6B8E23", "#4682B4", "#800020", "#2F4F4F"] },
  ];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="presets">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="presets" className="pt-4">
          <div className="space-y-4">
            {materialPresets.map((preset) => (
              <div key={preset.name} className="space-y-2">
                <Label className="text-xs">{preset.name}</Label>
                <div className="flex gap-2">
                  {preset.colors.map((presetColor) => (
                    <button
                      key={presetColor}
                      className={`w-8 h-8 rounded-md ${
                        color === presetColor ? "ring-2 ring-primary" : "border"
                      }`}
                      style={{ backgroundColor: presetColor }}
                      onClick={() => {
                        setColor(presetColor);
                        setRoughness(preset.roughness);
                        setMetalness(preset.metalness);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="pt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-xs">Color</Label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-8 rounded-md cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs">Roughness</Label>
              <span className="text-xs font-mono">
                {roughness.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[roughness]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(value) => setRoughness(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs">Metalness</Label>
              <span className="text-xs font-mono">
                {metalness.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[metalness]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(value) => setMetalness(value[0])}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};