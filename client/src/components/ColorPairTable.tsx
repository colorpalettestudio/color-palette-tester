import { type RGB, rgbToHex } from "@/lib/colorUtils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, XCircle, HelpCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ColorPair {
  foreground: RGB;
  background: RGB;
  ratio: number;
  passes: boolean;
  id: string;
}

interface ColorPairTableProps {
  pairs: ColorPair[];
  threshold: number;
  textSize: "small" | "large";
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelectAll: () => void;
  onClearFavorites: () => void;
  wcagLevel: string;
  onWcagLevelChange: (value: string) => void;
  previewFontSize: number;
  onPreviewFontSizeChange: (size: number) => void;
  previewFont: string;
  onPreviewFontChange: (font: string) => void;
}

export default function ColorPairTable({
  pairs,
  threshold,
  textSize,
  favorites,
  onToggleFavorite,
  onSelectAll,
  onClearFavorites,
  wcagLevel,
  onWcagLevelChange,
  previewFontSize,
  onPreviewFontSizeChange,
  previewFont,
  onPreviewFontChange,
}: ColorPairTableProps) {
  const filterOptions = [
    { value: "all", label: "All Pairs", threshold: 0 },
    { value: "aa-large", label: "WCAG AA Large (3:1+)", threshold: 3.0 },
    { value: "aa-small", label: "WCAG AA Normal (4.5:1+)", threshold: 4.5 },
    { value: "aaa-large", label: "WCAG AAA Normal (7:1+)", threshold: 7.0 },
  ];

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Lato", label: "Lato" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Poppins", label: "Poppins" },
    { value: "Source Sans 3", label: "Source Sans 3" },
    { value: "Raleway", label: "Raleway" },
  ];

  const getFilteredPairs = (filterValue: string) => {
    const option = filterOptions.find(opt => opt.value === filterValue);
    if (!option || option.value === "all") return pairs;
    return pairs.filter(pair => pair.ratio >= option.threshold);
  };

  const filteredPairs = getFilteredPairs(wcagLevel);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {filterOptions.map((option) => {
          const count = option.value === "all" 
            ? pairs.length 
            : pairs.filter(pair => pair.ratio >= option.threshold).length;
          const isActive = wcagLevel === option.value;
          
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              onClick={() => onWcagLevelChange(option.value)}
              data-testid={`button-filter-${option.value}`}
              className="font-medium"
            >
              {option.label} <span className="ml-2">{count}</span>
            </Button>
          );
        })}
      </div>

      <div id="results-table" className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-start pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">Pairing Preview</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground whitespace-nowrap">
                    Text Size: {previewFontSize}px
                  </label>
                  <Slider
                    value={[previewFontSize]}
                    onValueChange={(values) => onPreviewFontSizeChange(values[0])}
                    min={10}
                    max={32}
                    step={1}
                    className="w-32"
                    data-testid="slider-preview-font-size"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground whitespace-nowrap">
                    Font:
                  </label>
                  <Select value={previewFont} onValueChange={onPreviewFontChange}>
                    <SelectTrigger className="w-40" data-testid="select-preview-font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center min-w-[120px]">
              <h3 className="text-sm font-bold text-foreground text-center">Contrast Score</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="mt-1 p-1 text-muted-foreground hover:text-foreground hover-elevate rounded"
                    data-testid="button-contrast-help"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">What is a Contrast Score?</h4>
                    <p className="text-sm text-muted-foreground">
                      The contrast ratio measures the difference in brightness between text and background colors, ranging from 1:1 (no contrast) to 21:1 (maximum contrast).
                    </p>
                    <div className="space-y-1 text-xs">
                      <p><strong>WCAG AA Large:</strong> Requires 3:1 for large text (18pt+)</p>
                      <p><strong>WCAG AA Normal:</strong> Requires 4.5:1 for normal text</p>
                      <p><strong>WCAG AAA:</strong> Requires 7:1 for enhanced accessibility</p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex flex-col items-center min-w-[140px]">
              <h3 className="text-sm font-bold text-foreground text-center">Approved Pair?</h3>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={onSelectAll}
                  className="p-1 text-muted-foreground hover:text-foreground hover-elevate rounded"
                  data-testid="button-select-all"
                  title="Select All"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClearFavorites}
                  className="p-1 text-muted-foreground hover:text-foreground hover-elevate rounded"
                  data-testid="button-clear-favorites"
                  title="Clear All"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredPairs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No color pairs match the selected filter.</p>
          </div>
        )}

        <div className="space-y-3">
          {filteredPairs.map((pair) => {
            const fgHex = rgbToHex(pair.foreground);
            const bgHex = rgbToHex(pair.background);
            
            return (
              <div 
                key={pair.id} 
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center"
                data-testid={`row-pair-${pair.id}`}
              >
                <div
                  className="px-6 py-6 rounded-md flex items-center justify-start border border-border"
                  style={{ 
                    backgroundColor: bgHex, 
                    color: fgHex,
                    fontFamily: previewFont,
                    fontSize: `${previewFontSize}px`
                  }}
                >
                  <span className="font-medium">
                    TEXT {fgHex.toUpperCase()} ON BACKGROUND {bgHex.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-center min-w-[120px]">
                  <span className="text-lg font-bold text-foreground">
                    {pair.ratio.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-center min-w-[140px]">
                  <Checkbox
                    checked={favorites.has(pair.id)}
                    onCheckedChange={() => onToggleFavorite(pair.id)}
                    data-testid={`checkbox-favorite-${pair.id}`}
                    className="h-8 w-8 border-2"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
