import { useState, useEffect } from "react";
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
  onSampleClick: () => string;
  onTestPalette: () => void;
}

export default function ColorPaletteBuilder({
  colors,
  onColorsChange,
  onSampleClick,
  onTestPalette,
}: ColorPaletteBuilderProps) {
  const [colorItems, setColorItems] = useState<ColorItem[]>([]);
  const [bulkInput, setBulkInput] = useState("");
  const [previewColors, setPreviewColors] = useState<RGB[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Auto-add colors from textarea in real-time
  useEffect(() => {
    if (!bulkInput.trim()) {
      setColorItems([]);
      onColorsChange([]);
      return;
    }

    const colorStrings = parseColorInput(bulkInput);
    const newItems: ColorItem[] = [];
    
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
    
    setColorItems(newItems);
    onColorsChange(newItems.map(item => item.color));
  }, [bulkInput]);

  // Sync colors with colorItems
  const syncColors = (items: ColorItem[]) => {
    setColorItems(items);
    onColorsChange(items.map(item => item.color));
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
    setBulkInput("");
  };

  const handleSwatchDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleSwatchDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...colorItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setColorItems(newItems);
    setDraggedIndex(index);
  };

  const handleSwatchDragEnd = () => {
    const wasDragging = draggedIndex !== null;
    
    // Clear dragging state immediately to prevent opacity from sticking
    setDraggedIndex(null);
    
    if (wasDragging) {
      // Update the textarea with reordered colors
      const hexColors = colorItems.map(item => rgbToHex(item.color)).join(', ');
      setBulkInput(hexColors);
      onColorsChange(colorItems.map(item => item.color));
    }
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

  const hasColors = colorItems.length >= 2;

  return (
    <div className="space-y-4">
      {/* Palette Swatches - Show colors already in palette */}
      {colorItems.length > 0 && (
        <div className="flex gap-3 flex-wrap" data-testid="palette-swatches">
          {colorItems.map((item, index) => {
            const hexValue = rgbToHex(item.color);
            const isDragging = draggedIndex === index;
            
            // Calculate luminance to determine if we need a contrasting border
            const { r, g, b } = item.color;
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const isLight = luminance > 0.5;
            
            return (
              <div
                key={`${hexValue}-${index}`}
                draggable
                onDragStart={() => handleSwatchDragStart(index)}
                onDragOver={(e) => handleSwatchDragOver(e, index)}
                onDragEnd={handleSwatchDragEnd}
                className={`w-12 h-12 rounded-lg cursor-move transition-all hover:scale-110 ${
                  isDragging ? 'opacity-50 scale-95' : ''
                } ${
                  isLight ? 'border-2 border-gray-300' : 'border-2 border-white/30'
                }`}
                style={{ backgroundColor: hexValue }}
                title={`${hexValue.toUpperCase()} - Drag to reorder`}
                data-testid={`palette-swatch-${index}`}
              />
            );
          })}
        </div>
      )}

      <div className="p-6 rounded-lg border-2 border-border bg-card space-y-4">
        <div className="space-y-2">
          <textarea
            placeholder="Enter colors (one per line or comma-separated)&#10;Examples: #FF6F61, rgb(255, 111, 97), hsl(5, 100%, 69%)&#10;&#10;💡 Tip: You can also paste studio code directly here!"
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            className="w-full min-h-[120px] px-4 py-3 text-sm rounded-lg border-2 border-input bg-background resize-y font-mono focus:border-primary focus:outline-none transition-colors"
            data-testid="input-bulk-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {hasColors && (
            <Button
              onClick={onTestPalette}
              size="lg"
              className="flex-1"
              data-testid="button-test-palette"
            >
              Test Palette
            </Button>
          )}
          
          <Button
            onClick={() => {
              const sampleText = onSampleClick();
              setBulkInput(sampleText);
            }}
            variant="outline"
            size="lg"
            className={hasColors ? "" : "flex-1"}
            data-testid="button-try-sample"
          >
            ✨ Try Sample Palette
          </Button>
          
          {colorItems.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="ghost"
              size="icon"
              className="self-center sm:self-auto"
              data-testid="button-clear-palette"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
