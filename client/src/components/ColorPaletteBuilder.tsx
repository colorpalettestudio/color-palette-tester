import { useState } from "react";
import { Plus, X, Trash2, Palette, GripVertical, Pipette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [singleInput, setSingleInput] = useState("");
  const [invalidTokens, setInvalidTokens] = useState<string[]>([]);
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
    const failed: string[] = [];
    
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
      } else {
        failed.push(colorStr);
      }
    });
    
    syncColors(newItems);
    setBulkInput("");
    setInvalidTokens(failed);
    
    if (failed.length > 0) {
      toast({
        title: "Some colors were skipped",
        description: `${failed.length} invalid color ${failed.length === 1 ? 'code' : 'codes'}. See details below.`,
        variant: "destructive",
      });
    }
  };

  const handleAddSingle = () => {
    if (!singleInput.trim()) return;
    
    const rgb = parseColor(singleInput.trim());
    if (rgb) {
      const hexValue = rgbToHex(rgb);
      const isDuplicate = colorItems.some(item => rgbToHex(item.color) === hexValue);
      
      if (isDuplicate) {
        toast({
          title: "That color is already in your palette.",
          variant: "destructive",
        });
        return;
      }

      const newItems = [...colorItems, {
        color: rgb,
        name: `Color ${colorItems.length + 1}`,
      }];
      syncColors(newItems);
      setSingleInput("");
    } else {
      toast({
        title: "Invalid color code",
        description: "Please enter a valid HEX, RGB, or HSL color.",
        variant: "destructive",
      });
    }
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
    setInvalidTokens([]);
    toast({
      title: "Palette cleared",
      description: "All colors have been removed.",
    });
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

  const canTest = colorItems.length >= 2;

  return (
    <div className="space-y-6">
      {/* Palette Import Card */}
      <div className="rounded-2xl border border-border bg-card shadow-lg relative">
        <Tabs defaultValue="import" className="w-full">
          <div className="border-b border-border px-6 pt-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="import" className="flex-1 sm:flex-initial" data-testid="tab-import">
                Import
              </TabsTrigger>
              <TabsTrigger value="add" className="flex-1 sm:flex-initial" data-testid="tab-add-color">
                Add Color
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="import" className="p-6 pb-24 space-y-4 mt-0">
            <div className="space-y-2">
              <textarea
                placeholder="Paste colors like #FF6F61, rgb(142,214,169), or CPS[#111827,#FFFFFF,…]"
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-y font-mono"
                data-testid="input-bulk-colors"
              />
              <p className="text-xs text-muted-foreground">
                Separate with commas, spaces, or new lines. We'll convert everything to HEX.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleBulkPaste}
                disabled={!bulkInput.trim()}
                className="flex-1"
                data-testid="button-import-palette"
              >
                Import Palette
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

            {invalidTokens.length > 0 && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-semibold text-destructive mb-2">
                  We skipped these because they aren't valid colors:
                </p>
                <ul className="text-xs text-destructive/80 space-y-1">
                  {invalidTokens.map((token, i) => (
                    <li key={i} className="font-mono">{token}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="p-6 pb-24 space-y-4 mt-0">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={singleInput.startsWith('#') && singleInput.length === 7 ? singleInput : '#000000'}
                  onChange={(e) => setSingleInput(e.target.value)}
                  className="h-10 w-16 rounded-md border border-input cursor-pointer shrink-0"
                  data-testid="input-color-picker"
                />
                <Input
                  placeholder="#111827 or rgb(17,24,39) or hsl(220 30% 11%)"
                  value={singleInput}
                  onChange={(e) => setSingleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSingle();
                  }}
                  className="flex-1"
                  data-testid="input-single-color"
                />
              </div>
            </div>

            <Button
              onClick={handleAddSingle}
              disabled={!singleInput.trim()}
              className="w-full"
              data-testid="button-add-color"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Color
            </Button>
          </TabsContent>
        </Tabs>

        {/* Sticky Action Bar - Inside Card */}
        <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 rounded-b-2xl">
          <Button
            onClick={onTestPalette}
            disabled={!canTest}
            size="lg"
            className="w-full"
            data-testid="button-test-palette"
          >
            Test Palette
          </Button>
          {!canTest && colorItems.length === 1 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Add one more color to start testing pairings.
            </p>
          )}
          {canTest && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              We'll test every foreground/background pairing below.
            </p>
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
            {colorItems.length > 12 && (
              <p className="text-xs text-muted-foreground">
                Large palettes may take longer. Consider testing subsets.
              </p>
            )}
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

          <p className="text-xs text-muted-foreground text-center">
            Up to 12 colors recommended for fast testing.
          </p>
        </div>
      )}
    </div>
  );
}
