import { Download, FileDown, Code, ChevronDown, AlertCircle } from "lucide-react";
import ColorPairTable, { type ColorPair } from "./ColorPairTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  hasNoHighContrastPairs?: boolean;
  hasLowHighContrastPairs?: boolean;
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
  hasNoHighContrastPairs = false,
  hasLowHighContrastPairs = false,
}: ResultsSectionProps) {
  const showAlert = hasNoHighContrastPairs || hasLowHighContrastPairs;
  
  const scrollToAlert = () => {
    const alertElement = document.getElementById("contrast-alert");
    if (alertElement) {
      alertElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">
                Contrast Test Results
              </h2>
              {hasNoHighContrastPairs && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 border border-red-600/50 text-red-900 dark:text-red-100 text-sm font-semibold" data-testid="badge-no-contrast">
                  <AlertCircle className="h-4 w-4" />
                  Critical Issue
                </span>
              )}
              {hasLowHighContrastPairs && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 border border-blue-500/50 text-blue-900 dark:text-blue-100 text-sm font-semibold" data-testid="badge-low-contrast">
                  <AlertCircle className="h-4 w-4" />
                  Needs Improvement
                </span>
              )}
            </div>
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

        {hasNoHighContrastPairs && (
          <Alert id="contrast-alert" className="border-red-600/50 bg-red-50 dark:bg-red-950/20" data-testid="alert-no-contrast">
            <AlertCircle className="h-4 w-4 text-red-700 dark:text-red-400" />
            <AlertTitle className="text-base font-semibold text-red-900 dark:text-red-100" data-testid="text-alert-title">
              No color pairs meet WCAG AA standards (4.5:1 ratio)
            </AlertTitle>
            <AlertDescription className="text-sm text-red-800 dark:text-red-200" data-testid="text-alert-description">
              Your palette needs accessible color combinations for text readability.{' '}
              <a
                href="https://thecolorpalettestudio.com/products/color-palette-fixer"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:no-underline"
                data-testid="link-fix-palette"
              >
                Fix your palette now →
              </a>
            </AlertDescription>
          </Alert>
        )}

        {hasLowHighContrastPairs && (
          <div id="contrast-alert" className="px-4 py-3 rounded-lg border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/10" data-testid="alert-low-contrast">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Good start!</strong> Less than half of your colors have high-contrast pairs.{' '}
              <a
                href="https://thecolorpalettestudio.com/products/color-palette-fixer"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:no-underline"
                data-testid="link-improve-palette"
              >
                Improve accessibility →
              </a>
            </p>
          </div>
        )}
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
