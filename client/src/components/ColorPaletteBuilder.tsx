import { useState, useEffect, useRef, type DragEvent } from "react";
import { X, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseColor, parseStudioCode, rgbToHex, type RGB } from "@/lib/colorUtils";

interface ColorItem {
  color: RGB;
}

interface ColorPaletteBuilderProps {
  colors: RGB[];
  bulkInput: string;
  onInputChange: (input: string) => void;
  onSampleClick: () => string;
}

export default function ColorPaletteBuilder({
  colors,
  bulkInput,
  onInputChange: setBulkInput,
  onSampleClick,
}: ColorPaletteBuilderProps) {
  const [colorItems, setColorItems] = useState<ColorItem[]>(() =>
    colors.map(color => ({ color })));
  const [quickAddInput, setQuickAddInput] = useState("");
  const [quickAddError, setQuickAddError] = useState("");
  const [pickerPreview, setPickerPreview] = useState("#000000");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const quickAddInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // The parent owns the input and parsed colors, including restored drafts.
  useEffect(() => {
    setColorItems(colors.map(color => ({ color })));
  }, [colors]);

  const handleRemove = (index: number) => {
    const newItems = colorItems.filter((_, i) => i !== index);
    // Update textarea to reflect removed color
    const hexColors = newItems.map(item => rgbToHex(item.color)).join(", ");
    setBulkInput(hexColors);
  };

  const handleEditColor = (index: number, value: string) => {
    const next = [...colorItems];
    const color = parseColor(value);
    if (!color) return;
    next[index] = { ...next[index], color };
    setBulkInput(next.map(item => rgbToHex(item.color)).join(", "));
  };

  const handleSwatchDragOver = (event: DragEvent, index: number) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const reordered = [...colorItems];
    const [moving] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, moving);
    setColorItems(reordered);
    setDraggedIndex(index);
  };

  const handleSwatchDragEnd = () => {
    if (draggedIndex !== null) {
      setBulkInput(colorItems.map(item => rgbToHex(item.color)).join(", "));
    }
    setDraggedIndex(null);
  };

  const handleClearAll = () => {
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

    // Studio Code is structured data, not an editable list: normalize it before
    // appending, while preserving ordinary unfinished input drafts as written.
    const existing = parseStudioCode(bulkInput)
      ? colors.map(rgbToHex).join(" ")
      : bulkInput.trim();
    setBulkInput(existing ? `${existing} ${hexValue}` : hexValue);
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
  }, [colorItems, bulkInput]);

  return (
    <div className="space-y-4">
      {bulkInput === "#f91d71, #fd806a, #ffd025, #74d551, #76c4f4, #7c70ff" && (
        <p className="text-xs text-muted-foreground">These are sample colors. Edit or replace them with your own.</p>
      )}
      {/* Palette Swatches - Show colors already in palette */}
      {colorItems.length > 0 && (
      <div className="flex flex-wrap gap-3" data-testid="palette-swatches">
          {colorItems.map((item, index) => {
            const hexValue = rgbToHex(item.color);
            // Calculate luminance to determine if we need a contrasting border
            const { r, g, b } = item.color;
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const isLight = luminance > 0.5;
            
            return (
              <div
                key={index}
                className="relative group"
                onDragOver={event => handleSwatchDragOver(event, index)}
                onDragEnd={handleSwatchDragEnd}
              >
                <label
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  className={`relative block h-12 w-12 cursor-grab overflow-hidden rounded-lg transition-transform hover:scale-105 active:cursor-grabbing focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${draggedIndex === index ? "scale-90" : ""} ${isLight ? "border border-black/20" : "border border-white/30"}`}
                  style={{ backgroundColor: hexValue }}
                  title={`${hexValue.toUpperCase()} — click to edit, drag to reorder`}
                  data-testid={`palette-swatch-${index}`}
                >
                  <span className="sr-only">Edit color {index + 1}, {hexValue}</span>
                  <input
                    type="color"
                    value={hexValue}
                    onChange={(event) => handleEditColor(index, event.currentTarget.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label={`Edit color ${index + 1}, ${hexValue}`}
                    data-testid={`edit-color-${index}`}
                  />
                </label>
                <span className="mt-1 block text-center font-mono text-[10px] text-muted-foreground">
                  {hexValue.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Remove color ${index + 1}, ${hexValue}`}
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
        <p className="mt-2 text-xs text-muted-foreground">Enter a color value, then press Enter to keep adding.</p>
        {quickAddError && (
          <p id="quick-add-error" role="alert" className="mt-2 text-sm text-destructive">
            {quickAddError}
          </p>
        )}
      </section>

      <div className="space-y-3">
        <details className="group rounded-lg border border-border bg-card/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span>Paste colors or Studio Code</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-3 border-t border-border px-3 py-3">
          <textarea
            placeholder="Enter colors separated by spaces, line breaks, or commas&#10;Examples: #FF6F61 #000000 #FFFFFF&#10;Also accepts rgb(255, 111, 97), hsl(5, 100%, 69%), and studio code."
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            aria-label="Paste palette colors or Studio Code"
            className="min-h-[88px] w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            data-testid="input-bulk-colors"
          />
          <p className="text-xs text-muted-foreground">Accepts HEX, RGB, HSL, mixed whitespace, and Studio Code pairings.</p>
          </div>
        </details>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            onClick={() => setBulkInput(onSampleClick())}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground"
            data-testid="button-try-sample"
          >
            Load sample palette
          </Button>
          {bulkInput.length > 0 && (
            <Button type="button" onClick={handleClearAll} variant="ghost" size="sm" className="h-8 px-2 text-xs" data-testid="button-clear-palette">
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Clear palette
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
