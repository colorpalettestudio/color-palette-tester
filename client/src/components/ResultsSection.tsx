import { Download, FileDown, CheckSquare, XCircle } from "lucide-react";
import ColorPairTable, { type ColorPair } from "./ColorPairTable";
import { Button } from "@/components/ui/button";

interface ResultsSectionProps {
  pairs: ColorPair[];
  threshold: number;
  textSize: "small" | "large";
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onSelectAll: () => void;
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
  onSelectAll,
  onClearFavorites,
  wcagLevel,
  onWcagLevelChange,
}: ResultsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Contrast Test Results
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {pairs.length} color pair{pairs.length !== 1 ? 's' : ''} tested
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onExportPNG}
            variant="outline"
            size="sm"
            data-testid="button-export-png"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PNG
          </Button>
          <Button
            onClick={onExportPDF}
            variant="outline"
            size="sm"
            data-testid="button-export-pdf"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <ColorPairTable
        pairs={pairs}
        threshold={threshold}
        textSize={textSize}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onSelectAll={onSelectAll}
        onClearFavorites={onClearFavorites}
        wcagLevel={wcagLevel}
        onWcagLevelChange={onWcagLevelChange}
      />
    </div>
  );
}
