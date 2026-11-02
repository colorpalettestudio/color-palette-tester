import { Download, AlertCircle } from "lucide-react";
import ColorPairTable, { type ColorPair } from "./ColorPairTable";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { trackEvent } from "@/lib/analytics";

interface ResultsSectionProps {
  pairs: ColorPair[];
  threshold: number;
  onThresholdChange: (value: number) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenDownload: () => void;
  onSelectAll: () => void;
  onClearFavorites: () => void;
  displayFilter: "all" | "passing";
  onDisplayFilterChange: (value: "all" | "passing") => void;
  previewFontSize: number;
  onPreviewFontSizeChange: (size: number) => void;
  hasNoHighContrastPairs?: boolean;
  hasLowHighContrastPairs?: boolean;
}

export default function ResultsSection({
  pairs,
  threshold,
  onThresholdChange,
  favorites,
  onToggleFavorite,
  onOpenDownload,
  onSelectAll,
  onClearFavorites,
  displayFilter,
  onDisplayFilterChange,
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
                  Below benchmark
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
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="button-export"
                  onClick={onOpenDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
          </div>
        </div>

        {hasNoHighContrastPairs && (
          <Alert id="contrast-alert" className="border-red-600/50 bg-red-50 dark:bg-red-950/20" data-testid="alert-no-contrast">
            <AlertCircle className="h-4 w-4 text-red-700 dark:text-red-400" />
            <AlertTitle className="text-base font-semibold text-red-900 dark:text-red-100" data-testid="text-alert-title">
              No color pairs meet your {threshold}:1 contrast benchmark
            </AlertTitle>
            <AlertDescription className="text-sm text-red-800 dark:text-red-200" data-testid="text-alert-description">
              Try adjusting your colors or choosing a different contrast benchmark.{' '}
              <a
                href="https://thecolorpalettestudio.com/products/color-palette-fixer"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("palette_fixer_cta_clicked", {
                    location: "no_contrast_alert",
                  })
                }
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
              <strong>Good start!</strong> Less than half of your colors have a pairing at or above {threshold}:1.{' '}
              <a
                href="https://thecolorpalettestudio.com/products/color-palette-fixer"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("palette_fixer_cta_clicked", {
                    location: "low_contrast_alert",
                  })
                }
                className="font-semibold underline hover:no-underline"
                data-testid="link-improve-palette"
              >
                Improve contrast →
              </a>
            </p>
          </div>
        )}
      </div>

      <ColorPairTable
        pairs={pairs}
        threshold={threshold}
        onThresholdChange={onThresholdChange}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onSelectAll={onSelectAll}
        onClearFavorites={onClearFavorites}
        displayFilter={displayFilter}
        onDisplayFilterChange={onDisplayFilterChange}
        previewFontSize={previewFontSize}
        onPreviewFontSizeChange={onPreviewFontSizeChange}
      />
    </div>
  );
}
