import { type RGB, rgbToHex } from "@/lib/colorUtils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, XCircle, HelpCircle } from "lucide-react";
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
}: ColorPairTableProps) {
  const filterOptions = [
    { value: "all", label: "All Pairs", threshold: 0 },
    { value: "aa-large", label: "WCAG AA Large (3:1+)", threshold: 3.0 },
    { value: "aa-small", label: "WCAG AA Normal (4.5:1+)", threshold: 4.5 },
    { value: "aaa-large", label: "WCAG AAA Normal (7:1+)", threshold: 7.0 },
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
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-start pb-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Pairing Preview</h3>
          
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
                  className="px-6 py-6 rounded-md flex items-center justify-start font-mono text-sm border border-border"
                  style={{ backgroundColor: bgHex, color: fgHex }}
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
