import { useState } from "react";
import { Plus, X, Pipette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseColor, rgbToHex, type RGB } from "@/lib/colorUtils";

interface ColorPaletteBuilderProps {
  colors: RGB[];
  onColorsChange: (colors: RGB[]) => void;
}

export default function ColorPaletteBuilder({
  colors,
  onColorsChange,
}: ColorPaletteBuilderProps) {
  const [newColorInput, setNewColorInput] = useState("");
  const [colorPickerValue, setColorPickerValue] = useState("#000000");

  const handleAddColor = (colorString: string) => {
    if (!colorString.trim()) return;
    
    const rgb = parseColor(colorString.trim());
    if (rgb) {
      // Check if color already exists
      const hexValue = rgbToHex(rgb);
      const isDuplicate = colors.some(c => rgbToHex(c) === hexValue);
      
      if (!isDuplicate) {
        onColorsChange([...colors, rgb]);
        setNewColorInput("");
      }
    }
  };

  const handleRemoveColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    onColorsChange(newColors);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddColor(newColorInput);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexValue = e.target.value;
    setColorPickerValue(hexValue);
    handleAddColor(hexValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    
    // Try to parse multiple colors (comma or newline separated)
    const colorStrings = pastedText
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    if (colorStrings.length > 1) {
      // Multiple colors pasted
      const newColors = [...colors];
      colorStrings.forEach(colorStr => {
        const rgb = parseColor(colorStr);
        if (rgb) {
          const hexValue = rgbToHex(rgb);
          const isDuplicate = newColors.some(c => rgbToHex(c) === hexValue);
          if (!isDuplicate) {
            newColors.push(rgb);
          }
        }
      });
      onColorsChange(newColors);
      setNewColorInput("");
    } else {
      // Single color pasted
      setNewColorInput(pastedText);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 min-h-[60px] p-4 bg-muted/30 rounded-md border border-border">
        {colors.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No colors added yet. Add colors using the input below.
          </p>
        )}
        
        {colors.map((color, index) => {
          const hexValue = rgbToHex(color);
          return (
            <div
              key={`${hexValue}-${index}`}
              className="group relative"
              data-testid={`color-chip-${index}`}
            >
              <div
                className="w-16 h-16 rounded-md border-2 border-border hover-elevate transition-all"
                style={{ backgroundColor: hexValue }}
                title={hexValue}
              />
              <button
                onClick={() => handleRemoveColor(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover-elevate"
                data-testid={`button-remove-color-${index}`}
                aria-label={`Remove color ${hexValue}`}
              >
                <X className="w-4 h-4" />
              </button>
              <span className="absolute -bottom-6 left-0 text-xs font-mono text-muted-foreground">
                {hexValue}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Enter color (e.g., #FF6F61, rgb(255,111,97), or paste multiple)"
            value={newColorInput}
            onChange={(e) => setNewColorInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
            className="pr-10"
            data-testid="input-add-color"
          />
          <label
            htmlFor="eyedropper-input"
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1 hover-elevate rounded"
            title="Pick color with eyedropper"
          >
            <Pipette className="w-4 h-4 text-muted-foreground" />
            <input
              id="eyedropper-input"
              type="color"
              value={colorPickerValue}
              onChange={handleColorPickerChange}
              className="sr-only"
              data-testid="input-eyedropper"
            />
          </label>
        </div>
        <Button
          onClick={() => handleAddColor(newColorInput)}
          data-testid="button-add-color"
          variant="outline"
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Color
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        💡 Tip: Paste multiple colors at once (comma or newline separated) or use the eyedropper icon to pick a color
      </p>
    </div>
  );
}
