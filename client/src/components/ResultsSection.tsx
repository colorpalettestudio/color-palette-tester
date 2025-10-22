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

      {hasNoHighContrastPairs && (
        <Alert className="border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20" data-testid="alert-no-contrast">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <AlertTitle className="text-lg font-semibold text-orange-900 dark:text-orange-100" data-testid="text-alert-title">
            Uh-oh! No High Contrast Pairs
          </AlertTitle>
          <AlertDescription className="text-orange-800 dark:text-orange-200" data-testid="text-alert-description">
            <p className="mb-3">
              Your palette doesn't have any color pairings that meet the <strong>WCAG AA</strong> standard for text contrast (4.5:1 ratio). You need to fix your palette to ensure readability and accessibility.
            </p>
            <a
              href="https://thecolorpalettestudio.com/products/color-palette-fixer"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-fix-palette"
            >
              <Button className="bg-foreground text-background hover:bg-foreground/90" data-testid="button-fix-palette">
                Fix Your Palette Now
              </Button>
            </a>
          </AlertDescription>
        </Alert>
      )}

      {hasLowHighContrastPairs && (
        <Alert className="border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20" data-testid="alert-low-contrast">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100" data-testid="text-alert-low-title">
            Your Palette Is Good, But Could Be More Accessible
          </AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200" data-testid="text-alert-low-description">
            <p className="mb-3">
              Less than half of your color pairs meet high contrast standards. Fix your color palette for better readability and accessibility with your brand colors.
            </p>
            <a
              href="https://thecolorpalettestudio.com/products/color-palette-fixer"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-improve-palette"
            >
              <Button className="bg-foreground text-background hover:bg-foreground/90" data-testid="button-improve-palette">
                Improve Your Palette
              </Button>
            </a>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
