import { Download, FileDown, Code, ChevronDown } from "lucide-react";
import ColorPairTable, { type ColorPair } from "./ColorPairTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResultsSectionProps {
  pairs: ColorPair[];
  threshold: number;
  textSize: "small" | "large";
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onExportStudioCode: () => void;
  onSelectAll: () => void;
  onClearFavorites: () => void;
  wcagLevel: string;
  onWcagLevelChange: (value: string) => void;
  previewFontSize: number;
  onPreviewFontSizeChange: (size: number) => void;
}

export default function ResultsSection({
  pairs,
  threshold,
  textSize,
  favorites,
  onToggleFavorite,
  onExportPNG,
  onExportPDF,
  onExportStudioCode,
  onSelectAll,
  onClearFavorites,
  wcagLevel,
  onWcagLevelChange,
  previewFontSize,
  onPreviewFontSizeChange,
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                data-testid="button-export"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExportPNG} data-testid="menu-export-png">
                <Download className="w-4 h-4 mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPDF} data-testid="menu-export-pdf">
                <FileDown className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportStudioCode} data-testid="menu-export-studio-code">
                <Code className="w-4 h-4 mr-2" />
                Export as Studio Code
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        previewFontSize={previewFontSize}
        onPreviewFontSizeChange={onPreviewFontSizeChange}
      />
    </div>
  );
}
