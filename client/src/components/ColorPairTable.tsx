import { type RGB, rgbToHex } from "@/lib/colorUtils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, CheckSquare, X, XCircle, HelpCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
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
  const passCount = pairs.filter((pair) => pair.ratio >= threshold).length;
  const failCount = pairs.length - passCount;
  const activeFilter = filterOptions.find((option) => option.value === wcagLevel);
  const benchmarkLabel = wcagLevel === "all"
    ? `WCAG AA Normal · ${threshold}:1`
    : activeFilter?.label.replace(/\s*\([^)]*\)/, "") ?? "Selected WCAG benchmark";

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

      <section
        className="rounded-lg border border-border bg-muted/35 px-4 py-3"
        aria-label="Contrast results summary"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Pass / fail summary
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Benchmark: {benchmarkLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
              <Check aria-hidden="true" className="h-4 w-4" />
              {passCount} Pass
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-red-700 dark:text-red-400">
              <X aria-hidden="true" className="h-4 w-4" />
              {failCount} Fail
            </span>
          </div>
        </div>
        {wcagLevel !== "all" && (
          <p className="mt-2 text-xs text-muted-foreground">
            Showing {filteredPairs.length} passing {filteredPairs.length === 1 ? "pair" : "pairs"} only. Summary counts all {pairs.length} pairs.
          </p>
        )}
      </section>

      <div id="results-table" className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 items-start pb-3 border-b border-border sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-4">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">Pairing Preview</h3>
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
            </div>
            
            <div className="flex flex-row items-center justify-between sm:flex-col sm:justify-start sm:min-w-[120px]">
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
            
            <div className="flex flex-row items-center justify-between sm:flex-col sm:justify-start sm:min-w-[140px]">
              <h3 className="text-sm font-bold text-foreground text-center">Selected for export</h3>
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={onSelectAll}
                  className="p-1 text-muted-foreground hover:text-foreground hover-elevate rounded"
                  data-testid="button-select-all"
                  title="Select all pairs for export"
                  aria-label="Select all pairs for export"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClearFavorites}
                  className="p-1 text-muted-foreground hover:text-foreground hover-elevate rounded"
                  data-testid="button-clear-favorites"
                  title="Clear all export selections"
                  aria-label="Clear all export selections"
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
                className="grid grid-cols-1 gap-3 items-center sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-4"
                data-testid={`row-pair-${pair.id}`}
              >
                <div
                  className="min-w-0 overflow-hidden px-4 py-5 rounded-md flex items-center justify-start border border-border sm:px-6 sm:py-6"
                  style={{ 
                    backgroundColor: bgHex, 
                    color: fgHex,
                    fontSize: `${previewFontSize}px`
                  }}
                >
                  <span className="break-words font-medium">
                    TEXT {fgHex.toUpperCase()} ON BACKGROUND {bgHex.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-3 sm:min-w-[120px] sm:justify-center">
                  <span className="text-xs font-medium text-muted-foreground sm:hidden">Contrast</span>
                  <span className="inline-flex items-center gap-1.5">
                    {pair.ratio >= threshold ? (
                      <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      <X aria-hidden="true" className="h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />
                    )}
                    <span className={`text-sm font-semibold ${pair.ratio >= threshold ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                      {pair.ratio >= threshold ? "Pass" : "Fail"}
                    </span>
                  </span>
                  <span className="text-lg font-bold text-foreground">{pair.ratio.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-2 sm:min-w-[140px] sm:justify-center sm:border-0 sm:pt-0">
                  <span className="text-xs font-medium text-muted-foreground sm:hidden">Selected for export</span>
                  <Checkbox
                    checked={favorites.has(pair.id)}
                    onCheckedChange={() => onToggleFavorite(pair.id)}
                    data-testid={`checkbox-favorite-${pair.id}`}
                    className="h-8 w-8 border-2"
                    aria-label={`Select ${fgHex.toUpperCase()} text on ${bgHex.toUpperCase()} background for export`}
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
