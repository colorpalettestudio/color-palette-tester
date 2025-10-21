import { Download, FileDown, XCircle } from "lucide-react";
import ColorPairCard from "./ColorPairCard";
import { type RGB } from "@/lib/colorUtils";

export interface ColorPair {
  foreground: RGB;
  background: RGB;
  ratio: number;
  passes: boolean;
  id: string;
}

interface ResultsSectionProps {
  pairs: ColorPair[];
  threshold: number;
  textSize: "small" | "large";
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onClearFavorites: () => void;
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
}: ResultsSectionProps) {
  const passingPairs = pairs.filter(p => p.passes);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground text-center">
        WCAG Contrast Results
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card rounded-md border border-card-border">
        <p className="text-sm font-medium text-foreground" data-testid="text-passing-count">
          {passingPairs.length} passing pairs
        </p>
        
        <div className="flex flex-wrap gap-2">
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
      </div>

      <div 
        id="results-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-testid="results-grid"
      >
        {pairs.map((pair) => (
          <ColorPairCard
            key={pair.id}
            foreground={pair.foreground}
            background={pair.background}
            ratio={pair.ratio}
            threshold={threshold}
            textSize={textSize}
            isFavorite={favorites.has(pair.id)}
            onToggleFavorite={() => onToggleFavorite(pair.id)}
          />
        ))}
      </div>
    </div>
  );
}
