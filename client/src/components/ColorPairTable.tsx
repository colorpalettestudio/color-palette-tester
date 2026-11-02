import { type RGB, rgbToHex } from "@/lib/colorUtils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle } from "lucide-react";

export interface ColorPair {
  foreground: RGB;
  background: RGB;
  ratio: number;
  id: string;
}

export type PairFilter = "all" | 3 | 4.5 | 7;

interface ColorPairTableProps {
  pairs: ColorPair[];
  pairFilter: PairFilter;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelectAll: () => void;
  onClearFavorites: () => void;
  onPairFilterChange: (value: PairFilter) => void;
  previewFontSize: number;
  onPreviewFontSizeChange: (size: number) => void;
}

export default function ColorPairTable({
  pairs,
  pairFilter,
  favorites,
  onToggleFavorite,
  onSelectAll,
  onClearFavorites,
  onPairFilterChange,
  previewFontSize,
  onPreviewFontSizeChange,
}: ColorPairTableProps) {
  const filteredPairs = pairs.filter(pair => (
    pairFilter === "all" || pair.ratio >= pairFilter
  ));
  const filters: { id: PairFilter; label: string }[] = [
    { id: "all", label: "All Pairings" },
    { id: 3, label: "Basic" },
    { id: 4.5, label: "AA (Standard)" },
    { id: 7, label: "AAA (Enhanced)" },
  ];

  return (
    <div className="space-y-4">
      <section aria-label="Pairing contrast filter" className="rounded-xl border border-border bg-card/70 p-3 sm:p-4">
        <p className="mb-2 text-sm font-medium text-foreground">Filter pairings by contrast level</p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Minimum contrast score">
          {filters.map(filter => (
            <Button
              key={String(filter.id)}
              type="button"
              variant={pairFilter === filter.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onPairFilterChange(filter.id)}
              title={filter.id === "all" ? "Show every pairing" : `Minimum contrast score: ${filter.id}:1`}
              aria-pressed={pairFilter === filter.id}
              data-testid={`filter-${filter.id}`}
              className="h-8 px-3 text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 border-b border-border pb-3 sm:mx-[13px] sm:grid-cols-[minmax(0,1fr)_120px_200px] sm:items-end sm:gap-4">
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
        <div data-testid="contrast-score-heading" className="text-sm font-semibold text-foreground sm:text-center">Contrast score</div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 sm:justify-end">
          <span className="w-full text-sm font-semibold text-foreground sm:text-right">Add to chosen pairings</span>
          <button type="button" onClick={onSelectAll} disabled={filteredPairs.length === 0} className="rounded px-1.5 py-1 text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" data-testid="button-select-all">Choose all shown</button>
          <button type="button" onClick={onClearFavorites} disabled={favorites.size === 0} className="rounded px-1.5 py-1 text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" data-testid="button-clear-favorites">Clear chosen</button>
        </div>
      </div>

      {filteredPairs.length === 0 ? (
        <div
          role="alert"
          data-testid="no-pairings-alert"
          className="rounded-xl border-2 border-red-600 bg-red-50 px-4 py-8 text-center text-red-950 sm:px-8 sm:py-10"
        >
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-300 bg-red-100 text-red-700 sm:h-16 sm:w-16">
              <AlertTriangle aria-hidden="true" className="h-8 w-8 sm:h-9 sm:w-9" />
            </div>
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
              No pairings meet this contrast level
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-6 text-red-900 sm:text-base">
              Your current minimum contrast filter hides every pairing. Choose a lower level or view all pairings to continue.
            </p>
          <div className="mt-6 flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row">
            <Button type="button" size="sm" variant="outline" onClick={() => onPairFilterChange(3)}>
              Show Basic pairings
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => onPairFilterChange("all")}>
              Show all pairings
            </Button>
          </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPairs.map(pair => {
            const fgHex = rgbToHex(pair.foreground).toUpperCase();
            const bgHex = rgbToHex(pair.background).toUpperCase();
            return (
              <div key={pair.id} className="grid min-w-0 grid-cols-1 items-center gap-2.5 rounded-xl border border-border/80 bg-card/45 p-2.5 sm:grid-cols-[minmax(0,1fr)_120px_200px] sm:gap-4 sm:p-3" data-testid={`row-pair-${pair.id}`}>
                <div
                  className="min-w-0 overflow-hidden rounded-md border border-black/10 px-3 py-4 sm:px-4"
                  style={{ backgroundColor: bgHex, color: fgHex, fontSize: `${previewFontSize}px` }}
                >
                  <span className="break-words font-medium">Text {fgHex} on background {bgHex}</span>
                </div>
                <div className="flex items-center justify-between gap-3 sm:min-w-[120px] sm:justify-center">
                  <span aria-label={`${pair.ratio.toFixed(2)}:1`} className="font-mono text-base font-bold tabular-nums text-foreground">
                    <span data-testid="contrast-score">{pair.ratio.toFixed(2)}</span><span className="ml-0.5 font-sans text-sm font-normal text-muted-foreground">:1</span>
                  </span>
                </div>
                <label className="flex items-center justify-between gap-3 border-t border-border/60 pt-2 text-xs text-muted-foreground sm:min-w-[130px] sm:justify-center sm:border-0 sm:pt-0">
                  <span>{favorites.has(pair.id) ? "Added" : "Add"}</span>
                  <Checkbox
                    checked={favorites.has(pair.id)}
                    onCheckedChange={() => onToggleFavorite(pair.id)}
                    data-testid={`checkbox-favorite-${pair.id}`}
                    className="h-6 w-6"
                    aria-label={`Add ${fgHex} text on ${bgHex} background to chosen pairings`}
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
