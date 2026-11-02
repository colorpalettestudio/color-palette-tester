import { useEffect, useState } from "react";
import { ArrowDownToLine, Braces, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaletteExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colorCount: number;
  pairCount: number;
  busy: boolean;
  onDownloadPNG: (includePairings: boolean) => void;
  onCopyHex: (includePairings: boolean) => void;
  onCopyStudio: (includePairings: boolean) => void;
}

export default function PaletteExportDialog({
  open,
  onOpenChange,
  colorCount,
  pairCount,
  busy,
  onDownloadPNG,
  onCopyHex,
  onCopyStudio,
}: PaletteExportDialogProps) {
  const [includePairings, setIncludePairings] = useState(false);
  const hasContent = colorCount > 0;

  useEffect(() => {
    if (open) setIncludePairings(false);
  }, [open]);

  useEffect(() => {
    if (pairCount === 0) setIncludePairings(false);
  }, [pairCount]);

  const closeDialog = (nextOpen: boolean) => {
    if (nextOpen) setIncludePairings(false);
    onOpenChange(nextOpen);
  };

  const scopeSummary = includePairings
    ? `${colorCount} ${colorCount === 1 ? "color" : "colors"} and ${pairCount} ${pairCount === 1 ? "pairing" : "pairings"}`
    : `${colorCount} ${colorCount === 1 ? "color" : "colors"} only`;
  const actionsDisabled = !hasContent || busy;

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto border-border bg-card p-0 sm:max-w-md"
        data-testid="export-dialog"
      >
        <div className="p-5 pb-4 sm:p-6 sm:pb-5">
          <DialogHeader className="pr-7 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Palette export</p>
            <DialogTitle className="text-xl">Download your palette</DialogTitle>
            <DialogDescription>
              What would you like to include?
            </DialogDescription>
          </DialogHeader>

          <fieldset className="mt-5 space-y-2">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Include</legend>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors focus-within:ring-2 focus-within:ring-ring ${
                !includePairings ? "border-primary/60 bg-primary/5" : "border-border bg-background hover:bg-muted/40"
              }`}
            >
              <input
                type="radio"
                name="palette-export-scope"
                value="colors"
                checked={!includePairings}
                onChange={() => setIncludePairings(false)}
                data-testid="export-scope-colors"
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">Colors only</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {colorCount} {colorCount === 1 ? "palette color" : "palette colors"}
                </span>
              </span>
            </label>
            <label
              className={`flex items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                pairCount === 0
                  ? "cursor-not-allowed border-border/60 bg-muted/30 opacity-55"
                  : includePairings
                    ? "cursor-pointer border-primary/60 bg-primary/5 focus-within:ring-2 focus-within:ring-ring"
                    : "cursor-pointer border-border bg-background hover:bg-muted/40 focus-within:ring-2 focus-within:ring-ring"
              }`}
            >
              <input
                type="radio"
                name="palette-export-scope"
                value="combined"
                checked={includePairings}
                onChange={() => setIncludePairings(true)}
                disabled={pairCount === 0}
                data-testid="export-scope-combined"
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">Colors and pairings</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {colorCount} {colorCount === 1 ? "color" : "colors"} · {pairCount} {pairCount === 1 ? "selected pairing" : "selected pairings"}
                </span>
              </span>
            </label>
          </fieldset>

          <p className="mt-3 rounded-md bg-muted/55 px-3 py-2 text-xs text-muted-foreground" aria-live="polite">
            Scope: <span className="font-medium text-foreground">{scopeSummary}</span>
          </p>
        </div>

        <div className="border-t border-border/70 bg-background/55 p-5 sm:p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Available actions
          </p>
          <div className="grid gap-2">
            <Button
              type="button"
              onClick={() => onDownloadPNG(includePairings)}
              disabled={actionsDisabled}
              data-testid="export-download-png"
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" aria-hidden="true" />
              {busy ? "Downloading…" : "Download PNG"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onCopyHex(includePairings)}
              disabled={actionsDisabled}
              data-testid="export-copy-hex"
            >
              <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
              Copy HEX codes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onCopyStudio(includePairings)}
              disabled={actionsDisabled}
              data-testid="export-copy-studio"
            >
              <Braces className="mr-2 h-4 w-4" aria-hidden="true" />
              Copy Studio Code
            </Button>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Studio Code keeps your palette colors and, when included, chosen pairings together for easy import later.
            </p>
          </div>
          <DialogFooter className="mt-3">
            <Button type="button" variant="ghost" onClick={() => closeDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
