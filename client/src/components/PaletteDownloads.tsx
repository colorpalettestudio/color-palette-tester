import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type RGB, rgbToHex } from "@/lib/colorUtils";
import type { ColorPair } from "./ColorPairTable";

interface PaletteDownloadsProps {
  colors: RGB[];
  selectedPairs: ColorPair[];
  busy: boolean;
  onOpenDownload: () => void;
  onRemoveFavorite: (id: string) => void;
  onReset: () => void;
  storageWarning: string;
}

function hex(color: RGB) {
  return rgbToHex(color).toUpperCase();
}

export default function PaletteDownloads({
  colors,
  selectedPairs,
  busy,
  onOpenDownload,
  onRemoveFavorite,
  onReset,
  storageWarning,
}: PaletteDownloadsProps) {
  const hasColors = colors.length > 0;
  const hasPairs = selectedPairs.length > 0;

  return (
    <section
      aria-labelledby="palette-downloads-title"
      className="overflow-hidden rounded-xl border border-border bg-card"
      data-testid="palette-downloads"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-muted/35 px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Step 3</p>
          <h2 id="palette-downloads-title" className="text-xl font-bold text-foreground">Download your palette</h2>
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

      <div className="space-y-3.5 p-3.5 sm:p-4">
        <div
          role="group"
          aria-label="Palette color preview"
          data-testid="download-palette-preview"
          className="flex h-[120px] w-full overflow-hidden rounded-lg border border-border bg-muted/30"
        >
          {hasColors ? (
            colors.map((color, index) => {
              const colorHex = hex(color);
              return (
                <div
                  key={`${colorHex}-${index}`}
                  title={`Color ${index + 1} ${colorHex}`}
                  aria-label={`Color ${index + 1} ${colorHex}`}
                  data-testid={`download-palette-bar-${index}`}
                  className="min-w-0 flex-1 basis-0 border-r border-white/70 last:border-r-0"
                  style={{ backgroundColor: colorHex }}
                />
              );
            })
          ) : (
            <div className="flex w-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
              Your palette preview will appear here.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background/70 px-3 py-2">
          <p className="min-w-0 text-[11px] leading-relaxed text-muted-foreground">
            Saved on this browser only. Clearing browser data removes your work.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0 px-2.5 text-xs"
            onClick={onReset}
            disabled={busy}
            data-testid="reset-saved-palette"
          >
            Reset
          </Button>
        </div>
        {storageWarning && (
          <p role="alert" className="text-xs text-destructive" data-testid="palette-storage-warning">
            {storageWarning}
          </p>
        )}

        {hasColors && (
          <p className="break-words font-mono text-[11px] leading-relaxed text-muted-foreground">
            {colors.map(hex).join(" · ")}
          </p>
        )}

        <section aria-labelledby="selected-pairs-title" className="border-t border-border/70 pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 id="selected-pairs-title" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Chosen pairings
            </h3>
            {hasPairs && <span className="text-[11px] text-muted-foreground">Kept for export</span>}
          </div>
          {hasPairs ? (
            <ul className="space-y-2" data-testid="selected-pair-list">
              {selectedPairs.map((pair, index) => {
                const foreground = hex(pair.foreground);
                const background = hex(pair.background);
                return (
                  <li
                    key={pair.id}
                    className="flex min-w-0 items-stretch overflow-hidden rounded-lg border border-border/70 bg-background"
                    data-testid={`selected-pair-${pair.id}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        className="min-h-12 min-w-0 px-3 py-2 text-[11px] font-medium leading-snug"
                        style={{ backgroundColor: background, color: foreground }}
                        aria-label={`Text ${foreground} on background ${background}`}
                      >
                        <span className="break-words">
                          Text {foreground} on background {background}
                        </span>
                      </div>
                      <div
                        className="flex min-w-0 items-center justify-between gap-2 border-t border-border/70 px-3 py-1.5 text-[11px]"
                        data-testid={`selected-pair-score-${pair.id}`}
                      >
                        <span className="min-w-0 truncate text-muted-foreground">Contrast score</span>
                        <span className="shrink-0 font-mono font-medium tabular-nums text-foreground">
                          {pair.ratio.toFixed(2)}:1
                        </span>
                      </div>
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

        <Button
          type="button"
          className="w-full"
          onClick={onOpenDownload}
          data-testid="open-download"
        >
          Download
        </Button>
      </div>
    </section>
  );
}
