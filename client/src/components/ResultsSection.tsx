import { Download, FileDown, XCircle } from "lucide-react";
import ColorPairTable, { type ColorPair } from "./ColorPairTable";

interface ResultsSectionProps {
  pairs: ColorPair[];
  threshold: number;
  textSize: "small" | "large";
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onClearFavorites: () => void;
  wcagLevel: string;
  onWcagLevelChange: (value: string) => void;
}

export default function ResultsSection({
  pairs,
  threshold,
  textSize,
  favorites,
  onToggleFavorite,
  onExportPNG,
  onExportPDF,
  onClearFavorites,
  wcagLevel,
  onWcagLevelChange,
}: ResultsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground text-center">
        WCAG Contrast Results
      </h2>

      <div className="flex flex-wrap items-center justify-end gap-2 p-4 bg-card rounded-md border border-card-border">
        <button
          onClick={onExportPNG}
          className="px-4 py-2 bg-background text-foreground text-sm font-medium rounded-md border border-border hover-elevate active-elevate-2 flex items-center gap-2"
          data-testid="button-export-png"
        >
          <Download className="w-4 h-4" />
          Export PNG
        </button>
        <button
          onClick={onExportPDF}
          className="px-4 py-2 bg-background text-foreground text-sm font-medium rounded-md border border-border hover-elevate active-elevate-2 flex items-center gap-2"
          data-testid="button-export-pdf"
        >
          <FileDown className="w-4 h-4" />
          Export PDF
        </button>
        <button
          onClick={onClearFavorites}
          className="px-4 py-2 bg-background text-foreground text-sm font-medium rounded-md border border-border hover-elevate active-elevate-2 flex items-center gap-2"
          data-testid="button-clear-favorites"
        >
          <XCircle className="w-4 h-4" />
          Clear Favorites
        </button>
      </div>

      <ColorPairTable
        pairs={pairs}
        threshold={threshold}
        textSize={textSize}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        wcagLevel={wcagLevel}
        onWcagLevelChange={onWcagLevelChange}
      />
    </div>
  );
}
