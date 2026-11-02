import { Download, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaletteDownloadsProps {
  colorCount: number;
  favoriteCount: number;
  busy: boolean;
  onPalettePNG: () => void;
  onPaletteText: () => void;
  onFavoritesPNG: () => void;
  onFavoritesPDF: () => void;
}

export default function PaletteDownloads({
  colorCount,
  favoriteCount,
  busy,
  onPalettePNG,
  onPaletteText,
  onFavoritesPNG,
  onFavoritesPDF,
}: PaletteDownloadsProps) {
  const hasColors = colorCount > 0;
  const hasFavorites = favoriteCount > 0;
  const paletteDisabled = !hasColors || busy;
  const favoritesDisabled = !hasFavorites || busy;

  return (
    <section
      aria-labelledby="palette-downloads-title"
      className="rounded-xl border border-border bg-card p-4 sm:p-5"
      data-testid="palette-downloads"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Take it with you
          </p>
          <h2 id="palette-downloads-title" className="mt-1 text-lg font-semibold text-foreground">
            Downloads
          </h2>
        </div>
        <span
          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
          data-testid="selected-pair-count"
        >
          {favoriteCount} selected {favoriteCount === 1 ? "pair" : "pairs"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="min-w-0 rounded-lg border border-border/80 bg-background/70 p-3">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Full palette</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Export all {colorCount} {colorCount === 1 ? "color" : "colors"} in your palette.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onPalettePNG}
              disabled={paletteDisabled}
              aria-label="Download full palette as PNG"
              data-testid="download-palette-png"
            >
              <Image className="mr-2 h-4 w-4" aria-hidden="true" />
              PNG
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onPaletteText}
              disabled={paletteDisabled}
              aria-label="Download full palette as HEX text"
              data-testid="download-palette-text"
            >
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              HEX text
            </Button>
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-border/80 bg-background/70 p-3">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Selected pairings</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {hasFavorites
                ? `${favoriteCount} selected ${favoriteCount === 1 ? "pair" : "pairs"} from your results.`
                : "Select pair checkboxes in the results below to prepare an export."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onFavoritesPNG}
              disabled={favoritesDisabled}
              aria-label="Download selected pairings as PNG"
              data-testid="download-favorites-png"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              PNG
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onFavoritesPDF}
              disabled={favoritesDisabled}
              aria-label="Download selected pairings as PDF"
              data-testid="download-favorites-pdf"
            >
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              PDF
            </Button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Selection is for exporting only; it does not indicate accessibility approval.
          </p>
        </div>
      </div>
    </section>
  );
}
