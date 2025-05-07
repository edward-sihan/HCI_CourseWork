// src/components/LightingControls.tsx
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

interface LightingControlsProps {
  ambientIntensity: number;
  setAmbientIntensity: (value: number) => void;
  directionalIntensity: number;
  setDirectionalIntensity: (value: number) => void;
  shadowsEnabled: boolean;
  setShadowsEnabled: (enabled: boolean) => void;
  lightColor: string;
  setLightColor: (color: string) => void;
}

export const LightingControls = ({
  ambientIntensity,
  setAmbientIntensity,
  directionalIntensity,
  setDirectionalIntensity,
  shadowsEnabled,
  setShadowsEnabled,
  lightColor,
  setLightColor,
}: LightingControlsProps) => {
  return (
    <div className="p-4 bg-background/80 backdrop-blur-sm rounded-md shadow-md w-64">
      <h3 className="text-sm font-medium mb-4">Lighting Controls</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Ambient Light</Label>
            <span className="text-xs font-mono">
              {(ambientIntensity * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="h-3 w-3 text-muted-foreground" />
            <Slider
              value={[ambientIntensity]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={(value) => setAmbientIntensity(value[0])}
            />
            <Sun className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Direct Light</Label>
            <span className="text-xs font-mono">
              {(directionalIntensity * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="h-3 w-3 text-muted-foreground" />
            <Slider
              value={[directionalIntensity]}
              min={0}
              max={1.5}
              step={0.05}
              onValueChange={(value) => setDirectionalIntensity(value[0])}
            />
            <Sun className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label className="text-xs" htmlFor="shadow-toggle">
            Shadows
          </Label>
          <Switch
            id="shadow-toggle"
            checked={shadowsEnabled}
            onCheckedChange={setShadowsEnabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs">Light Color</Label>
          <div className="flex gap-2">
            {["#ffffff", "#ffe0b0", "#b0e0ff", "#ffe0ff"].map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border ${
                  lightColor === color ? "ring-2 ring-primary" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setLightColor(color)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};