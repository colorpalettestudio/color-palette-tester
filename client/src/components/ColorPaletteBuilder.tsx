import { useState, useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseColor, rgbToHex, type RGB, parseColorInput, parseStudioCode, type StudioPairing } from "@/lib/colorUtils";

interface ColorItem {
  color: RGB;
  name: string;
}

interface ColorPaletteBuilderProps {
  colors: RGB[];
  onColorsChange: (colors: RGB[]) => void;
  onSampleClick: () => string;
  onTestPalette: () => void;
  onImportPairings?: (pairings: StudioPairing[]) => void;
}

export default function ColorPaletteBuilder({
  colors,
  onColorsChange,
  onSampleClick,
  onTestPalette,
  onImportPairings,
}: ColorPaletteBuilderProps) {
  const [colorItems, setColorItems] = useState<ColorItem[]>([]);
  const [bulkInput, setBulkInput] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [quickAddInput, setQuickAddInput] = useState("");
  const [quickAddError, setQuickAddError] = useState("");
  const [pickerPreview, setPickerPreview] = useState("#000000");
  const quickAddInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Initialize textarea with default colors on mount
  useEffect(() => {
    if (colors.length > 0 && !bulkInput) {
      const hexColors = colors.map(c => rgbToHex(c)).join(', ');
      setBulkInput(hexColors);
    }
  }, []);

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
    const studio = parseStudioCode(bulkInput);
    if (studio) onImportPairings?.(studio.pairings ?? []);
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
    
    // Update textarea to reflect removed color
    const hexColors = renumbered.map(item => rgbToHex(item.color)).join(', ');
    setBulkInput(hexColors);
  };

  const handleClearAll = () => {
    if (colorItems.length === 0) return;
    
    setColorItems([]);
    onColorsChange([]);
    setBulkInput("");
  };

  const addColor = (input: string, source: "text" | "picker") => {
    const rgb = parseColor(input);
    if (!rgb) {
      setQuickAddError("Enter a valid HEX, RGB, or HSL color.");
      return false;
    }

    const hexValue = rgbToHex(rgb);
    const isDuplicate = colorItems.some(item => rgbToHex(item.color) === hexValue);
    
    if (isDuplicate) {
      setQuickAddError(`${hexValue.toUpperCase()} is already in your palette.`);
      return false;
    }

    setBulkInput(current => {
      // Normalize imported Studio Code and mixed input before appending.
      const existing = parseColorInput(current)
        .map(parseColor)
        .filter((color): color is RGB => color !== null)
        .map(rgbToHex);
      return Array.from(new Set([...existing, hexValue])).join(", ");
    });
    setQuickAddError("");
    if (source === "text") {
      setQuickAddInput("");
      requestAnimationFrame(() => quickAddInputRef.current?.focus());
    } else {
      setPickerPreview("#000000");
      if (colorPickerRef.current) colorPickerRef.current.value = "#000000";
    }
    return true;
  };

  // Native color picker: input previews while dragging; only change commits.
  useEffect(() => {
    const picker = colorPickerRef.current;
    if (!picker) return;
    const handleInput = () => setPickerPreview(picker.value);
    const handleChange = () => {
      addColor(picker.value, "picker");
    };
    picker.addEventListener("input", handleInput);
    picker.addEventListener("change", handleChange);
    return () => {
      picker.removeEventListener("input", handleInput);
      picker.removeEventListener("change", handleChange);
    };
  }, [colorItems]);

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
    // Update the textarea with reordered colors
    if (draggedIndex !== null) {
      const hexColors = colorItems.map(item => rgbToHex(item.color)).join(', ');
      setBulkInput(hexColors);
    }
    
    // Use requestAnimationFrame to ensure drag state clears after browser's drag animation
    requestAnimationFrame(() => {
      setDraggedIndex(null);
    });
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
                className="relative group"
              >
                <div
                  draggable
                  onDragStart={() => handleSwatchDragStart(index)}
                  onDragOver={(e) => handleSwatchDragOver(e, index)}
                  onDragEnd={handleSwatchDragEnd}
                  className={`w-12 h-12 rounded-lg cursor-move transition-transform hover:scale-110 outline-none focus:outline-none ${
                    isDragging ? 'scale-90 ring-2 ring-primary/50' : ''
                  } ${
                    isLight ? 'border border-gray-300' : 'border border-white/30'
                  }`}
                  style={{ backgroundColor: hexValue }}
                  title={`${hexValue.toUpperCase()} - Drag to reorder`}
                  data-testid={`palette-swatch-${index}`}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 shadow-md"
                  title="Remove color"
                  data-testid={`button-remove-swatch-${index}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <section
        className="rounded-lg border border-border bg-card/70 px-3 py-3 sm:px-4"
        aria-label="Quick add a color"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="flex min-w-0 flex-1 gap-2">
            <label htmlFor="quick-add-color" className="sr-only">Color value</label>
            <input
              id="quick-add-color"
              ref={quickAddInputRef}
              type="text"
              value={quickAddInput}
              onChange={(event) => {
                setQuickAddInput(event.target.value);
                if (quickAddError) setQuickAddError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addColor(quickAddInput, "text");
                }
              }}
              placeholder="HEX, RGB, or HSL"
              autoComplete="off"
              aria-invalid={Boolean(quickAddError)}
              aria-describedby={quickAddError ? "quick-add-error" : undefined}
              className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 font-mono text-sm outline-none transition-colors placeholder:font-sans placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              data-testid="input-color-hex"
            />
            <Button
              type="button"
              onClick={() => addColor(quickAddInput, "text")}
              onMouseDown={(event) => event.preventDefault()}
              className="h-10 px-4"
              data-testid="button-confirm-add-color"
              aria-label="Add color to palette"
            >
              Add
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="quick-add-picker"
              className="text-xs font-medium text-muted-foreground"
            >
              Pick a color
            </label>
            <input
              id="quick-add-picker"
              ref={colorPickerRef}
              type="color"
              value={pickerPreview}
              onInput={(event) => setPickerPreview(event.currentTarget.value)}
              className="h-9 w-12 cursor-pointer rounded-md border border-input bg-background p-1"
              aria-label="Choose and add a color"
              data-testid="input-color-picker"
            />
            <span className="font-mono text-xs text-muted-foreground" aria-live="polite">
              {pickerPreview.toUpperCase()}
            </span>
          </div>
        </div>
        {quickAddError && (
          <p id="quick-add-error" role="alert" className="mt-2 text-sm text-destructive">
            {quickAddError}
          </p>
        )}
      </section>

      <div className="p-6 rounded-lg border-2 border-border bg-card space-y-4">
        <div className="space-y-2">
          <textarea
            placeholder="Enter colors separated by spaces, line breaks, or commas&#10;Examples: #FF6F61 #000000 #FFFFFF&#10;Also accepts rgb(255, 111, 97), hsl(5, 100%, 69%), and studio code."
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
            Try Sample Palette
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
