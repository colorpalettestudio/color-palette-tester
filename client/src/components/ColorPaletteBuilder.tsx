import { useState } from "react";
import { Plus, X, Trash2, Palette, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseColor, rgbToHex, type RGB, parseColorInput } from "@/lib/colorUtils";
import { useToast } from "@/hooks/use-toast";

interface ColorItem {
  color: RGB;
  name: string;
}

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
  const [colorItems, setColorItems] = useState<ColorItem[]>([]);
  const [bulkInput, setBulkInput] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Sync colors with colorItems
  const syncColors = (items: ColorItem[]) => {
    setColorItems(items);
    onColorsChange(items.map(item => item.color));
  };

  // Initialize colorItems when colors prop changes externally
  if (colors.length !== colorItems.length || 
      colors.some((c, i) => rgbToHex(c) !== rgbToHex(colorItems[i]?.color))) {
    const newItems = colors.map((color, index) => ({
      color,
      name: colorItems[index]?.name || `Color ${index + 1}`,
    }));
    setColorItems(newItems);
  }

  const handleBulkPaste = () => {
    if (!bulkInput.trim()) return;

    const colorStrings = parseColorInput(bulkInput);
    const newItems = [...colorItems];
    
    colorStrings.forEach(colorStr => {
      const rgb = parseColor(colorStr);
      if (rgb) {
        const hexValue = rgbToHex(rgb);
        const isDuplicate = newItems.some(item => rgbToHex(item.color) === hexValue);
        if (!isDuplicate) {
          newItems.push({
            color: rgb,
            name: `Color ${newItems.length + 1}`,
          });
        }
      }
    });
    
    syncColors(newItems);
    setBulkInput("");
  };

  const handleRemove = (index: number) => {
    const newItems = colorItems.filter((_, i) => i !== index);
    // Renumber remaining colors
    const renumbered = newItems.map((item, i) => ({
      ...item,
      name: `Color ${i + 1}`,
    }));
    syncColors(renumbered);
  };

  const handleClearAll = () => {
    if (colorItems.length === 0) return;
    
    setColorItems([]);
    onColorsChange([]);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...colorItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setColorItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    onColorsChange(colorItems.map(item => item.color));
  };

  const handleUpdateColorHex = (index: number, value: string) => {
    const rgb = parseColor(value);
    if (rgb) {
      const newItems = [...colorItems];
      newItems[index].color = rgb;
      syncColors(newItems);
    }
  };

  const handleUpdateColorName = (index: number, value: string) => {
    const newItems = [...colorItems];
    newItems[index].name = value || `Color ${index + 1}`;
    syncColors(newItems);
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <div className="p-6 rounded-lg border border-border bg-card space-y-4">
        <div className="space-y-2">
          <textarea
            placeholder="Paste your colors here (HEX, RGB, HSL)&#10;e.g., #FF6F61, rgb(142,214,169), hsl(220 30% 11%)&#10;Separate with commas or new lines"
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-y font-mono"
            data-testid="input-bulk-colors"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleBulkPaste}
            disabled={!bulkInput.trim()}
            className="flex-1"
            data-testid="button-import-palette"
          >
            Add Colors
          </Button>
          <Button
            onClick={onSampleClick}
            variant="outline"
            className="flex-1"
            data-testid="button-try-sample"
          >
            Try Sample Palette
          </Button>
          {colorItems.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="ghost"
              size="icon"
              data-testid="button-clear-palette"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Your Palette */}
      {colorItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Your Palette ({colorItems.length} {colorItems.length === 1 ? 'color' : 'colors'})
            </h3>
          </div>

          <div className="space-y-2">
            {colorItems.map((item, index) => {
              const hexValue = rgbToHex(item.color);

              return (
                <div
                  key={`${hexValue}-${index}`}
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover-elevate group"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  data-testid={`color-item-${index}`}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move shrink-0" />
                  
                  <div
                    className="w-12 h-12 rounded-md border border-border shrink-0 shadow-sm"
                    style={{ backgroundColor: hexValue }}
                  />

                  <Input
                    value={item.name}
                    onChange={(e) => handleUpdateColorName(index, e.target.value)}
                    className="w-32 h-8 text-sm"
                    data-testid={`input-color-name-${index}`}
                  />

                  <Input
                    value={hexValue.toUpperCase()}
                    onChange={(e) => handleUpdateColorHex(index, e.target.value)}
                    className="flex-1 h-8 font-mono text-sm"
                    data-testid={`input-color-hex-${index}`}
                  />

                  <Button
                    onClick={() => handleRemove(index)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 shrink-0"
                    data-testid={`button-remove-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
