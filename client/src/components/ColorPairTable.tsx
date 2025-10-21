import { type RGB, rgbToHex } from "@/lib/colorUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  wcagLevel: string;
  onWcagLevelChange: (value: string) => void;
}

export default function ColorPairTable({
  pairs,
  threshold,
  textSize,
  favorites,
  onToggleFavorite,
  wcagLevel,
  onWcagLevelChange,
}: ColorPairTableProps) {
  const filterOptions = [
    { value: "all", label: "All", threshold: 0 },
    { value: "aa-large", label: "AA Large (3:1+)", threshold: 3.0 },
    { value: "aa-small", label: "AA (4.5:1+)", threshold: 4.5 },
    { value: "aaa-large", label: "AAA (7:1+)", threshold: 7.0 },
  ];

  const getFilteredPairs = (filterValue: string) => {
    const option = filterOptions.find(opt => opt.value === filterValue);
    if (!option || option.value === "all") return pairs;
    return pairs.filter(pair => pair.ratio >= option.threshold);
  };

  const filteredPairs = getFilteredPairs(wcagLevel);

  const getStatusBadge = (ratio: number) => {
    if (ratio >= 7.0) return { label: "AAA", variant: "default" as const };
    if (ratio >= 4.5) return { label: "AA", variant: "default" as const };
    if (ratio >= 3.0) return { label: "AA Large", variant: "secondary" as const };
    return { label: "Fail", variant: "destructive" as const };
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {filterOptions.map((option) => {
          const count = option.value === "all" 
            ? pairs.length 
            : pairs.filter(pair => pair.ratio >= option.threshold).length;
          const isActive = wcagLevel === option.value;
          
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onWcagLevelChange(option.value)}
              data-testid={`button-filter-${option.value}`}
            >
              {option.label}
              <Badge variant="secondary" className="ml-2 font-normal">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Results Grid */}
      <div id="results-table" className="space-y-3">
        {filteredPairs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
            <p className="text-sm">No color pairs match this filter level</p>
          </div>
        )}

        {filteredPairs.map((pair) => {
          const fgHex = rgbToHex(pair.foreground);
          const bgHex = rgbToHex(pair.background);
          const status = getStatusBadge(pair.ratio);
          
          return (
            <div 
              key={pair.id} 
              className="p-4 rounded-lg border border-border bg-card hover-elevate transition-all"
              data-testid={`row-pair-${pair.id}`}
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={status.variant} className="font-semibold">
                    {status.label}
                  </Badge>
                  <span className="text-lg font-bold text-foreground">
                    {pair.ratio.toFixed(2)}:1
                  </span>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Foreground</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border shrink-0"
                      style={{ backgroundColor: fgHex }}
                    />
                    <span className="text-sm font-mono text-foreground">{fgHex.toUpperCase()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Background</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border shrink-0"
                      style={{ backgroundColor: bgHex }}
                    />
                    <span className="text-sm font-mono text-foreground">{bgHex.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div 
                className="mt-3 px-4 py-3 rounded-md text-sm font-medium"
                style={{ backgroundColor: bgHex, color: fgHex }}
              >
                Sample text in these colors
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
