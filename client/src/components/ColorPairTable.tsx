import { type RGB, rgbToHex } from "@/lib/colorUtils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export interface ColorPair {
  foreground: RGB;
  background: RGB;
  ratio: number;
  passes: boolean;
  id: string;
}

export type PairFilter = "all" | "meets" | "below";

interface ColorPairTableProps {
  pairs: ColorPair[];
  threshold: number;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelectAll: () => void;
  onClearFavorites: () => void;
  onThresholdChange: (value: number) => void;
  displayFilter: PairFilter;
  onDisplayFilterChange: (value: PairFilter) => void;
  previewFontSize: number;
  onPreviewFontSizeChange: (size: number) => void;
}

export default function ColorPairTable({
  pairs,
  threshold,
  favorites,
  onToggleFavorite,
  onSelectAll,
  onClearFavorites,
  onThresholdChange,
  displayFilter,
  onDisplayFilterChange,
  previewFontSize,
  onPreviewFontSizeChange,
}: ColorPairTableProps) {
  const passCount = pairs.filter(pair => pair.ratio >= threshold).length;
  const failCount = pairs.length - passCount;
  const filteredPairs = pairs.filter(pair => (
    displayFilter === "all" ||
    (displayFilter === "meets" ? pair.ratio >= threshold : pair.ratio < threshold)
  ));
  const filters: { id: PairFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: pairs.length },
    { id: "meets", label: "Meets target", count: passCount },
    { id: "below", label: "Below target", count: failCount },
  ];

  return (
    <div className="space-y-4">
      <section aria-label="Pair score controls and summary" className="rounded-xl border border-border bg-card/70 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Benchmark</span>
          {[3, 4.5, 7].map(value => (
            <Button
              key={value}
              type="button"
              variant={threshold === value ? "default" : "outline"}
              size="sm"
              onClick={() => onThresholdChange(value)}
              aria-pressed={threshold === value}
              data-testid={`benchmark-${value}`}
            >
              {value}:1
            </Button>
          ))}
          <span className="ml-1 text-xs text-muted-foreground">Higher numbers mean stronger contrast.</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter color pairs">
            {filters.map(filter => (
              <Button
                key={filter.id}
                type="button"
                variant={displayFilter === filter.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onDisplayFilterChange(filter.id)}
                aria-pressed={displayFilter === filter.id}
                data-testid={`filter-${filter.id}`}
                className="h-8 px-2.5 text-xs"
              >
                {filter.label} <span className="ml-1.5 font-mono tabular-nums">{filter.count}</span>
              </Button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs" aria-live="polite">
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400"><Check className="h-3.5 w-3.5" aria-hidden="true" />{passCount} meet</span>
            <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-400"><X className="h-3.5 w-3.5" aria-hidden="true" />{failCount} below</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 border-b border-border pb-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end sm:gap-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Pairing preview</h3>
          <div className="flex items-center gap-3">
            <label htmlFor="preview-font-size" className="whitespace-nowrap text-xs text-muted-foreground">Text size: {previewFontSize}px</label>
            <Slider
              id="preview-font-size"
              value={[previewFontSize]}
              onValueChange={values => onPreviewFontSizeChange(values[0])}
              min={10}
              max={32}
              step={1}
              className="w-32"
              data-testid="slider-preview-font-size"
            />
          </div>
        </div>
        <div className="text-sm font-semibold text-foreground sm:text-center">Contrast score</div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-sm font-semibold text-foreground">Keep pairing</span>
          <button type="button" onClick={onSelectAll} disabled={filteredPairs.length === 0} className="rounded px-1.5 py-1 text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" data-testid="button-select-all">Choose all shown</button>
          <button type="button" onClick={onClearFavorites} disabled={favorites.size === 0} className="rounded px-1.5 py-1 text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" data-testid="button-clear-favorites">Clear chosen</button>
        </div>
      </div>

      {filteredPairs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {displayFilter === "below"
            ? "No pairs are below this benchmark. Try All or Meets target."
            : "No pairs meet this benchmark. Try All or Below target."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPairs.map(pair => {
            const fgHex = rgbToHex(pair.foreground).toUpperCase();
            const bgHex = rgbToHex(pair.background).toUpperCase();
            const meets = pair.ratio >= threshold;
            return (
              <div key={pair.id} className="grid min-w-0 grid-cols-1 items-center gap-2.5 rounded-xl border border-border/80 bg-card/45 p-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-4 sm:p-3" data-testid={`row-pair-${pair.id}`}>
                <div
                  className="min-w-0 overflow-hidden rounded-md border border-black/10 px-3 py-4 sm:px-4"
                  style={{ backgroundColor: bgHex, color: fgHex, fontSize: `${previewFontSize}px` }}
                >
                  <span className="break-words font-medium">Text {fgHex} on background {bgHex}</span>
                </div>
                <div className="flex items-center justify-between gap-3 sm:min-w-[120px] sm:justify-center">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${meets ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                    {meets ? <Check className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
                    {meets ? "Meets" : "Below"}
                  </span>
                  <span className="font-mono text-base font-bold tabular-nums text-foreground">{pair.ratio.toFixed(2)}:1</span>
                </div>
                <label className="flex items-center justify-between gap-3 border-t border-border/60 pt-2 text-xs text-muted-foreground sm:min-w-[130px] sm:justify-center sm:border-0 sm:pt-0">
                  <span>{favorites.has(pair.id) ? "Chosen" : "Keep pairing"}</span>
                  <Checkbox
                    checked={favorites.has(pair.id)}
                    onCheckedChange={() => onToggleFavorite(pair.id)}
                    data-testid={`checkbox-favorite-${pair.id}`}
                    className="h-6 w-6"
                    aria-label={`Keep ${fgHex} text on ${bgHex} background`}
                  />
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
