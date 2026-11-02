import { Download } from "lucide-react";
import ColorPairTable, { type ColorPair, type PairFilter } from "./ColorPairTable";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface ResultsSectionProps {
  pairs: ColorPair[];
  threshold: number;
  onThresholdChange: (value: number) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenDownload: () => void;
  onSelectAll: () => void;
  onClearFavorites: () => void;
  displayFilter: PairFilter;
  onDisplayFilterChange: (value: PairFilter) => void;
  previewFontSize: number;
  onPreviewFontSizeChange: (size: number) => void;
}

export default function ResultsSection({
  pairs,
  threshold,
  onThresholdChange,
  favorites,
  onToggleFavorite,
  onOpenDownload,
  onSelectAll,
  onClearFavorites,
  displayFilter,
  onDisplayFilterChange,
  previewFontSize,
  onPreviewFontSizeChange,
}: ResultsSectionProps) {
  return (
    <section aria-labelledby="compare-choose-title" className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Step 2</p>
          <h2 id="compare-choose-title" className="text-2xl font-bold text-foreground">Compare &amp; choose</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pair scores update automatically as your colors change.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onOpenDownload} data-testid="button-export">
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          Download
        </Button>
      </header>
      {pairs.length < 2 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-5 py-8 text-center">
          <p className="font-medium text-foreground">{pairs.length === 0 ? "Add at least two colors to compare pairings." : "Add one more color to see pairings."}</p>
          <p className="mt-1 text-sm text-muted-foreground">Every color is compared against every other color in both directions.</p>
        </div>
      ) : (
        <>
          <ColorPairTable
            pairs={pairs}
            threshold={threshold}
            onThresholdChange={onThresholdChange}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSelectAll={onSelectAll}
            onClearFavorites={onClearFavorites}
            displayFilter={displayFilter}
            onDisplayFilterChange={onDisplayFilterChange}
            previewFontSize={previewFontSize}
            onPreviewFontSizeChange={onPreviewFontSizeChange}
          />
          {pairs.some(pair => pair.ratio < threshold) && (
            <p className="text-xs text-muted-foreground">
              Want help improving the palette?{" "}
              <a
                href="https://thecolorpalettestudio.com/products/color-palette-fixer"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("palette_fixer_cta_clicked", { location: "below_target_inline" })}
                className="font-medium text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore Palette Fixer
              </a>
            </p>
          )}
        </>
      )}
    </section>
  );
}
