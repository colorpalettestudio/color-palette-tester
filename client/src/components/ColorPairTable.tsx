import { Star } from "lucide-react";
import { type RGB, rgbToHex } from "@/lib/colorUtils";
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
  const passingPairs = pairs.filter(p => p.passes);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground" data-testid="text-passing-count">
            {passingPairs.length} of {pairs.length} pairs passing
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {[
            { value: "aa-small", label: "AA Small (4.5)", threshold: 4.5 },
            { value: "aa-large", label: "AA Large (3.0)", threshold: 3.0 },
            { value: "aaa-small", label: "AAA Small (7.0)", threshold: 7.0 },
            { value: "aaa-large", label: "AAA Large (4.5)", threshold: 4.5 },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
              data-testid={`label-filter-${option.value}`}
            >
              <input
                type="radio"
                name="wcag-filter"
                value={option.value}
                checked={wcagLevel === option.value}
                onChange={(e) => onWcagLevelChange(e.target.value)}
                className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                data-testid={`radio-filter-${option.value}`}
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-md overflow-hidden" id="results-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Preview</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Foreground</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Background</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Ratio</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Favorite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pairs.map((pair) => {
                const fgHex = rgbToHex(pair.foreground);
                const bgHex = rgbToHex(pair.background);
                
                return (
                  <tr 
                    key={pair.id} 
                    className="hover-elevate"
                    data-testid={`row-pair-${pair.id}`}
                  >
                    <td className="px-4 py-3">
                      <div
                        className="h-12 w-32 rounded flex items-center justify-center text-sm font-medium"
                        style={{ backgroundColor: bgHex, color: fgHex }}
                      >
                        Aa Bb 123
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-border shrink-0"
                          style={{ backgroundColor: fgHex }}
                        />
                        <span className="text-sm font-mono text-foreground">{fgHex}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-border shrink-0"
                          style={{ backgroundColor: bgHex }}
                        />
                        <span className="text-sm font-mono text-foreground">{bgHex}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-foreground">
                        {pair.ratio.toFixed(2)}:1
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={pair.passes ? "default" : "destructive"}
                        className="text-xs"
                        data-testid={`badge-${pair.passes ? "pass" : "fail"}-${pair.id}`}
                      >
                        {pair.passes ? "Pass" : "Fail"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onToggleFavorite(pair.id)}
                        className="p-1 hover-elevate rounded"
                        data-testid={`button-favorite-${pair.id}`}
                        aria-label={favorites.has(pair.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star
                          className={`w-5 h-5 ${favorites.has(pair.id) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {pairs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No color pairs to display. Enter colors above and click "Test Contrast".</p>
        </div>
      )}
    </div>
  );
}
