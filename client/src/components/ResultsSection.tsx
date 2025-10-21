import { Download, FileDown, XCircle, CheckSquare } from "lucide-react";
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
  onSelectAll: () => void;
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
  onSelectAll,
  wcagLevel,
  onWcagLevelChange,
}: ResultsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">
          Color Palette Tester
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover-elevate rounded-md flex items-center gap-1.5"
            data-testid="button-select-all"
          >
            <CheckSquare className="w-4 h-4" />
            Select All
          </button>
          <button
            onClick={onClearFavorites}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover-elevate rounded-md flex items-center gap-1.5"
            data-testid="button-clear-favorites"
          >
            <XCircle className="w-4 h-4" />
            Clear
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={onExportPNG}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover-elevate rounded-md flex items-center gap-1.5"
            data-testid="button-export-png"
          >
            <Download className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={onExportPDF}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover-elevate rounded-md flex items-center gap-1.5"
            data-testid="button-export-pdf"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
        </div>
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
