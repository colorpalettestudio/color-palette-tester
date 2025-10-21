import { useState } from "react";
import { Plus, X, Trash2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseColor, rgbToHex, type RGB, parseColorInput } from "@/lib/colorUtils";
import { Separator } from "@/components/ui/separator";

interface ColorPaletteBuilderProps {
  colors: RGB[];
  onColorsChange: (colors: RGB[]) => void;
  onSampleClick: () => void;
}

export default function ColorPaletteBuilder({
  colors,
  onColorsChange,
  onSampleClick,
}: ColorPaletteBuilderProps) {
  const [singleColorInput, setSingleColorInput] = useState("");
  const [bulkColorInput, setBulkColorInput] = useState("");
  const [colorPickerValue, setColorPickerValue] = useState("#000000");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddSingleColor = (colorString: string) => {
    if (!colorString.trim()) return;
    
    const rgb = parseColor(colorString.trim());
    if (rgb) {
      const hexValue = rgbToHex(rgb);
      const isDuplicate = colors.some(c => rgbToHex(c) === hexValue);
      
      if (!isDuplicate) {
        onColorsChange([...colors, rgb]);
        setSingleColorInput("");
      }
    }
  };

  const handleBulkPaste = () => {
    if (!bulkColorInput.trim()) return;

    const colorStrings = parseColorInput(bulkColorInput);
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
    setBulkColorInput("");
  };

  const handleRemoveColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    onColorsChange(newColors);
  };

  const handleClearPalette = () => {
    onColorsChange([]);
    setBulkColorInput("");
    setSingleColorInput("");
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexValue = e.target.value;
    setColorPickerValue(hexValue);
    handleAddSingleColor(hexValue);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newColors = [...colors];
    const draggedColor = newColors[draggedIndex];
    newColors.splice(draggedIndex, 1);
    newColors.splice(index, 0, draggedColor);
    
    onColorsChange(newColors);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-8">
      {/* Color Palette Display */}
      {colors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Your Color Palette ({colors.length} {colors.length === 1 ? 'color' : 'colors'})
            </h3>
            <Button
              onClick={handleClearPalette}
              variant="ghost"
              size="sm"
              data-testid="button-clear-palette"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 p-6 bg-card rounded-lg border border-card-border">
            {colors.map((color, index) => {
              const hexValue = rgbToHex(color);
              return (
                <div
                  key={`${hexValue}-${index}`}
                  className="group relative cursor-move"
                  data-testid={`color-chip-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className="w-20 h-20 rounded-lg border-2 border-border hover-elevate transition-all shadow-sm"
                    style={{ backgroundColor: hexValue }}
                    title={`${hexValue} - Drag to reorder`}
                  />
                  <button
                    onClick={() => handleRemoveColor(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover-elevate"
                    data-testid={`button-remove-color-${index}`}
                    aria-label={`Remove color ${hexValue}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground whitespace-nowrap">
                    {hexValue.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Methods */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Method 1: Paste Multiple Colors */}
        <div className="space-y-3 p-6 rounded-lg border-2 border-border bg-card">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
            Paste Multiple Colors
          </h3>
          <p className="text-sm text-muted-foreground">
            Paste your entire palette at once (comma or newline separated)
          </p>
          <textarea
            className="w-full h-24 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="#FF6F61, #FDD66F, #8ED6A9&#10;or paste one per line"
            value={bulkColorInput}
            onChange={(e) => setBulkColorInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleBulkPaste();
              }
            }}
            data-testid="textarea-bulk-colors"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleBulkPaste}
              disabled={!bulkColorInput.trim()}
              className="flex-1"
              data-testid="button-paste-colors"
            >
              Add to Palette
            </Button>
            <Button
              onClick={onSampleClick}
              variant="outline"
              data-testid="button-try-sample"
            >
              Try Sample
            </Button>
          </div>
        </div>

        {/* Method 2: Add One Color */}
        <div className="space-y-3 p-6 rounded-lg border-2 border-border bg-card">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
            Add One Color at a Time
          </h3>
          <p className="text-sm text-muted-foreground">
            Type a color code or use the color picker
          </p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="e.g., #FF6F61 or rgb(255,111,97)"
                value={singleColorInput}
                onChange={(e) => setSingleColorInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSingleColor(singleColorInput);
                  }
                }}
                data-testid="input-add-color"
              />
            </div>
            <label
              htmlFor="color-picker"
              className="shrink-0 w-10 h-10 rounded-md border-2 border-border cursor-pointer hover-elevate transition-all overflow-hidden"
              title="Pick a color"
              style={{ backgroundColor: colorPickerValue }}
            >
              <input
                id="color-picker"
                type="color"
                value={colorPickerValue}
                onChange={handleColorPickerChange}
                className="sr-only"
                data-testid="input-eyedropper"
              />
            </label>
          </div>
          <Button
            onClick={() => handleAddSingleColor(singleColorInput)}
            disabled={!singleColorInput.trim()}
            variant="outline"
            className="w-full"
            data-testid="button-add-single-color"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Palette
          </Button>
        </div>
      </div>

      {colors.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Add at least 2 colors to see contrast results below</p>
        </div>
      )}
    </div>
  );
}
