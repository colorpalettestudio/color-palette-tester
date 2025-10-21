import { useState } from "react";
import { Plus, X, Trash2, Palette, GripVertical, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseColor, rgbToHex, type RGB, parseColorInput } from "@/lib/colorUtils";

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
  const [singleInput, setSingleInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const handleAddSingle = () => {
    if (!singleInput.trim()) return;
    
    const rgb = parseColor(singleInput.trim());
    if (rgb) {
      const hexValue = rgbToHex(rgb);
      const isDuplicate = colorItems.some(item => rgbToHex(item.color) === hexValue);
      
      if (!isDuplicate) {
        const newItems = [...colorItems, {
          color: rgb,
          name: `Color ${colorItems.length + 1}`,
        }];
        syncColors(newItems);
        setSingleInput("");
      }
    }
  };

  const handleRemove = (index: number) => {
    const newItems = colorItems.filter((_, i) => i !== index);
    syncColors(newItems);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditName(colorItems[index].name);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editName.trim()) {
      const newItems = [...colorItems];
      newItems[editingIndex].name = editName.trim();
      syncColors(newItems);
    }
    setEditingIndex(null);
    setEditName("");
  };

  const handleClearAll = () => {
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

  return (
    <div className="space-y-6">
      {/* Add Colors Section */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Paste Multiple Colors Card */}
        <div className="p-6 rounded-lg border border-border bg-card space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Paste Multiple Colors</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Paste your entire palette at once (comma or newline separated)
              </p>
            </div>
          </div>
          
          <textarea
            placeholder="#FF6F61, #FDD66F, #8ED6A9&#10;or paste one per line"
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-none font-mono"
            data-testid="input-bulk-colors"
          />
          
          <Button
            onClick={handleBulkPaste}
            disabled={!bulkInput.trim()}
            className="w-full"
            data-testid="button-add-bulk"
          >
            Add to Palette
          </Button>
          
          <Button
            onClick={onSampleClick}
            variant="outline"
            size="sm"
            className="w-full"
            data-testid="button-try-sample"
          >
            Try Sample
          </Button>
        </div>

        {/* Add One Color Card */}
        <div className="p-6 rounded-lg border border-border bg-card space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Add One Color at a Time</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Type a color code or use the color picker
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="color"
              value={singleInput.startsWith('#') && singleInput.length === 7 ? singleInput : '#000000'}
              onChange={(e) => setSingleInput(e.target.value)}
              className="h-10 w-16 rounded-md border border-input cursor-pointer"
              data-testid="input-color-picker"
            />
            <Input
              placeholder="e.g., #FF6F61 or rgb(255,111,97)"
              value={singleInput}
              onChange={(e) => setSingleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSingle();
              }}
              className="flex-1"
              data-testid="input-single-color"
            />
          </div>
          
          <Button
            onClick={handleAddSingle}
            disabled={!singleInput.trim()}
            className="w-full"
            data-testid="button-add-single"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Palette
          </Button>

          {colorItems.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              className="w-full"
              data-testid="button-clear-palette"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Colors
            </Button>
          )}
        </div>
      </div>

      {/* Color Swatches */}
      {colorItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Your Palette ({colorItems.length} {colorItems.length === 1 ? 'color' : 'colors'})
          </h3>

          <div className="space-y-2">
            {colorItems.map((item, index) => {
              const hexValue = rgbToHex(item.color);
              const isEditing = editingIndex === index;

              return (
                <div
                  key={`${hexValue}-${index}`}
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-card-border hover-elevate group"
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

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') setEditingIndex(null);
                        }}
                        onBlur={handleSaveEdit}
                        className="h-8 text-sm"
                        autoFocus
                        data-testid={`input-edit-name-${index}`}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground text-sm">{item.name}</p>
                        <button
                          onClick={() => handleStartEdit(index)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover-elevate rounded"
                          data-testid={`button-edit-name-${index}`}
                        >
                          <Edit2 className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    )}
                    <p className="text-xs font-mono text-muted-foreground">{hexValue.toUpperCase()}</p>
                  </div>

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

      {colorItems.length === 0 && (
        <div className="text-center py-6 text-sm text-muted-foreground">
          Add at least 2 colors to see contrast results
        </div>
      )}
    </div>
  );
}
