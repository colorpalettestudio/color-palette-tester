import ColorPairTable, { type ColorPair, type PairFilter } from "./ColorPairTable";
import { trackEvent } from "@/lib/analytics";

interface ResultsSectionProps {
  pairs: ColorPair[];
  pairFilter: PairFilter;
  onPairFilterChange: (value: PairFilter) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelectAll: () => void;
  onClearFavorites: () => void;
  previewFontSize: number;
  onPreviewFontSizeChange: (size: number) => void;
}

export default function ResultsSection({
  pairs,
  pairFilter,
  onPairFilterChange,
  favorites,
  onToggleFavorite,
  onSelectAll,
  onClearFavorites,
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
            pairFilter={pairFilter}
            onPairFilterChange={onPairFilterChange}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSelectAll={onSelectAll}
            onClearFavorites={onClearFavorites}
            previewFontSize={previewFontSize}
            onPreviewFontSizeChange={onPreviewFontSizeChange}
          />
          {pairFilter !== "all" && pairs.some(pair => pair.ratio < pairFilter) && (
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
