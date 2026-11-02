import { Download, FileText, Image, Layers, Minus, Palette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type RGB, rgbToHex } from "@/lib/colorUtils";
import type { ColorPair } from "./ColorPairTable";

interface PaletteDownloadsProps {
  colors: RGB[];
  selectedPairs: ColorPair[];
  busy: boolean;
  onPalettePNG: () => void;
  onPaletteText: () => void;
  onFavoritesPNG: () => void;
  onFavoritesPDF: () => void;
  onCopyPaletteHex: () => void;
  onCopyPaletteStudio: () => void;
  onDownloadPaletteStudio: () => void;
  onCopyFavoritesHex: () => void;
  onCopyFavoritesStudio: () => void;
  onDownloadFavoritesStudio: () => void;
  onRemoveFavorite: (id: string) => void;
}

function hex(color: RGB) {
  return rgbToHex(color).toUpperCase();
}

export default function PaletteDownloads({
  colors,
  selectedPairs,
  busy,
  onPalettePNG,
  onPaletteText,
  onFavoritesPNG,
  onFavoritesPDF,
  onCopyPaletteHex,
  onCopyPaletteStudio,
  onDownloadPaletteStudio,
  onCopyFavoritesHex,
  onCopyFavoritesStudio,
  onDownloadFavoritesStudio,
  onRemoveFavorite,
}: PaletteDownloadsProps) {
  const hasColors = colors.length > 0;
  const hasPairs = selectedPairs.length > 0;
  const paletteDisabled = !hasColors || busy;
  const pairsDisabled = !hasPairs || busy;

  return (
    <section
      aria-labelledby="palette-downloads-title"
      className="overflow-hidden rounded-xl border border-border bg-card"
      data-testid="palette-downloads"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-muted/35 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground">
            <Palette className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Color kit
            </p>
            <h2 id="palette-downloads-title" className="truncate text-base font-semibold text-foreground">
              Your palette
            </h2>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-xs" aria-live="polite" aria-atomic="true">
          <span className="rounded-full bg-background px-2.5 py-1 font-medium text-foreground ring-1 ring-border/80" data-testid="palette-color-count">
            {colors.length} {colors.length === 1 ? "color" : "colors"}
          </span>
          <span className="rounded-full bg-background px-2.5 py-1 font-medium text-muted-foreground ring-1 ring-border/80" data-testid="selected-pair-count">
            {selectedPairs.length} {selectedPairs.length === 1 ? "pair" : "pairs"}
          </span>
        </div>
      </header>

      <div className="space-y-4 p-3.5 sm:p-4">
        <section aria-labelledby="palette-colors-title">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h3 id="palette-colors-title" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Palette colors
            </h3>
            {!hasColors && <span className="text-[11px] text-muted-foreground">Add colors to start a kit</span>}
          </div>
          {hasColors ? (
            <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto">
              {colors.map((color, index) => {
                const colorHex = hex(color);
                return (
                  <div
                    key={`${colorHex}-${index}`}
                    className="flex min-w-0 items-center gap-2 rounded-lg border border-border/70 bg-background p-2"
                    data-testid={`palette-color-${index}`}
                  >
                    <span
                      className="h-8 w-8 shrink-0 rounded-md border border-black/10 shadow-sm"
                      style={{ backgroundColor: colorHex }}
                      aria-hidden="true"
                    />
                    <span className="truncate font-mono text-[11px] font-medium tracking-wide text-foreground" aria-label={`Color ${colorHex}`}>
                      {colorHex}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-background/60 px-3 py-4 text-center">
              <p className="text-xs text-muted-foreground">Your palette colors will appear here.</p>
            </div>
          )}
        </section>

        <section aria-labelledby="selected-pairs-title" className="border-t border-border/70 pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 id="selected-pairs-title" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Chosen pairings
            </h3>
            {hasPairs && <span className="text-[11px] text-muted-foreground">Selected for export</span>}
          </div>
          {hasPairs ? (
            <ul className="max-h-48 space-y-2 overflow-y-auto" data-testid="selected-pair-list">
              {selectedPairs.map((pair, index) => {
                const foreground = hex(pair.foreground);
                const background = hex(pair.background);
                return (
                  <li
                    key={pair.id}
                    className="flex min-w-0 items-stretch overflow-hidden rounded-lg border border-border/70 bg-background"
                    data-testid={`selected-pair-${pair.id}`}
                  >
                    <div
                      className="flex min-h-12 min-w-0 flex-1 items-center justify-between gap-2 px-3 py-2"
                      style={{ backgroundColor: background, color: foreground }}
                      aria-label={`Text ${foreground} on background ${background}`}
                    >
                      <span className="min-w-0 truncate text-xs font-semibold">Aa</span>
                      <span className="shrink-0 font-mono text-[10px] font-medium">{foreground}</span>
                      <span className="h-4 w-px shrink-0 opacity-30" style={{ backgroundColor: foreground }} aria-hidden="true" />
                      <span className="shrink-0 font-mono text-[10px] font-medium">{background}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(pair.id)}
                      disabled={busy}
                      aria-label={`Remove pairing ${index + 1}: ${foreground} text on ${background} background`}
                      data-testid={`remove-favorite-${pair.id}`}
                      className="flex w-10 shrink-0 items-center justify-center border-l border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-background/60 px-3 py-4 text-center">
              <p className="text-xs text-muted-foreground">Select pairings in your results to keep them here.</p>
            </div>
          )}
        </section>

        <div className="grid gap-3 border-t border-border/70 pt-3">
          <section aria-labelledby="full-palette-actions" className="min-w-0">
            <div className="mb-2 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <h3 id="full-palette-actions" className="text-xs font-semibold text-foreground">Full palette</h3>
              <span className="text-[10px] text-muted-foreground">· {colors.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button type="button" size="sm" onClick={onPalettePNG} disabled={paletteDisabled} aria-label="Download full palette as PNG" data-testid="download-palette-png">
                <Image className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> PNG
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={onPaletteText} disabled={paletteDisabled} aria-label="Download full palette as HEX text" data-testid="download-palette-text">
                <FileText className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> HEX text
              </Button>
            </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Button type="button" size="sm" variant="secondary" onClick={onCopyPaletteHex} disabled={paletteDisabled} aria-label="Copy full palette HEX codes" data-testid="copy-palette-hex">
                  Copy HEX codes
                </Button>
                <Button type="button" size="sm" variant="secondary" onClick={onCopyPaletteStudio} disabled={paletteDisabled} aria-label="Copy full palette Studio Code" data-testid="copy-palette-studio">
                  Copy Studio Code
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={onDownloadPaletteStudio} disabled={paletteDisabled} aria-label="Download full palette Studio Code" data-testid="download-palette-studio">
                  <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Download Studio Code
                </Button>
              </div>
          </section>

          <section aria-labelledby="pairing-actions" className="min-w-0 border-t border-border/70 pt-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Minus className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <h3 id="pairing-actions" className="text-xs font-semibold text-foreground">Chosen pairings</h3>
              <span className="text-[10px] text-muted-foreground">· {selectedPairs.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button type="button" size="sm" variant="secondary" onClick={onFavoritesPNG} disabled={pairsDisabled} aria-label="Download selected pairings as PNG" data-testid="download-favorites-png">
                <Image className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> PNG
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={onFavoritesPDF} disabled={pairsDisabled} aria-label="Download selected pairings as PDF" data-testid="download-favorites-pdf">
                <FileText className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> PDF
              </Button>
            </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Button type="button" size="sm" variant="secondary" onClick={onCopyFavoritesHex} disabled={pairsDisabled} aria-label="Copy selected pairings HEX codes" data-testid="copy-favorites-hex">
                  Copy HEX codes
                </Button>
                <Button type="button" size="sm" variant="secondary" onClick={onCopyFavoritesStudio} disabled={pairsDisabled} aria-label="Copy selected pairings Studio Code" data-testid="copy-favorites-studio">
                  Copy Studio Code
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={onDownloadFavoritesStudio} disabled={pairsDisabled} aria-label="Download selected pairings Studio Code" data-testid="download-favorites-studio">
                  <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Download Studio Code
                </Button>
              </div>
          </section>
        </div>
      </div>
    </section>
  );
}
