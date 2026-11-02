import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import HeroSection from "@/components/HeroSection";
import ResultsSection from "@/components/ResultsSection";
import { type ColorPair } from "@/components/ColorPairTable";
import ExportCards from "@/components/ExportCards";
import PaletteDownloads from "@/components/PaletteDownloads";
import { downloadPalettePNG, downloadPaletteText } from "@/lib/paletteDownload";
import CTACard from "@/components/CTACard";
import HowItWorksSection from "@/components/HowItWorksSection";
import EducationSections from "@/components/EducationSections";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEOContent from "@/components/SEOContent";
import {
  parseColor,
  parseColorInput,
  getContrastRatio,
  type RGB,
  rgbToHex,
} from "@/lib/colorUtils";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";

const WCAG_THRESHOLDS = {
  "all": 4.5,
  "aa-small": 4.5,
  "aa-large": 3.0,
  "aaa-small": 7.0,
  "aaa-large": 7.0,
};

const SAMPLE_COLORS = "#f91d71, #fd806a, #ffd025, #74d551, #76c4f4, #7c70ff";

// Parse default colors on page load
const parseDefaultColors = () => {
  const colorStrings = parseColorInput(SAMPLE_COLORS);
  return colorStrings.map(str => parseColor(str)).filter((c): c is RGB => c !== null);
};

export default function Home() {
  const [colors, setColors] = useState<RGB[]>(parseDefaultColors());
  const [wcagLevel, setWcagLevel] = useState("all");
  const [pairs, setPairs] = useState<ColorPair[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewFontSize, setPreviewFontSize] = useState(14);
  const [exportBusy, setExportBusy] = useState(false);
  const { toast } = useToast();

  // Removed colors should never leave invisible pairings selected for download.
  useEffect(() => {
    const hexes = new Set(colors.map(rgbToHex));
    setFavorites(previous => {
      const next = new Set(Array.from(previous).filter(id => {
        const [foreground, background] = id.split("-");
        return hexes.has(foreground) && hexes.has(background);
      }));
      return next.size === previous.size ? previous : next;
    });
  }, [colors]);

  const handlePaletteDownload = (format: "png" | "txt") => {
    if (!colors.length || exportBusy) return;
    try {
      if (format === "png") downloadPalettePNG(colors);
      else downloadPaletteText(colors);
      trackEvent("palette_exported", { format, scope: "full_palette", color_count: colors.length });
      toast({ title: "Palette downloaded", description: format === "png" ? "Saved your swatches with HEX codes as a PNG." : "Saved your HEX codes as a text file." });
    } catch {
      trackEvent("palette_export_failed", { format, scope: "full_palette" });
      toast({ title: "Download failed", description: "Could not download your palette. Please try again.", variant: "destructive" });
    }
  };

  // Automatically test colors whenever the palette changes
  useEffect(() => {
    if (colors.length < 2) {
      setPairs([]);
      return;
    }

    const threshold = WCAG_THRESHOLDS[wcagLevel as keyof typeof WCAG_THRESHOLDS];
    const newPairs: ColorPair[] = [];

    // Create a map of color hex to original index
    const colorIndexMap = new Map<string, number>();
    colors.forEach((color, index) => {
      colorIndexMap.set(rgbToHex(color), index);
    });

    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < colors.length; j++) {
        if (i !== j) {
          const fg = colors[i];
          const bg = colors[j];
          const ratio = getContrastRatio(fg, bg);
          const passes = ratio >= threshold;
          const id = `${rgbToHex(fg)}-${rgbToHex(bg)}`;
          
          newPairs.push({
            id,
            foreground: fg,
            background: bg,
            ratio,
            passes,
          });
        }
      }
    }

    // Sort by background color's original index first, then foreground color's original index
    newPairs.sort((a, b) => {
      const bgIndexA = colorIndexMap.get(rgbToHex(a.background)) ?? 0;
      const bgIndexB = colorIndexMap.get(rgbToHex(b.background)) ?? 0;
      if (bgIndexA !== bgIndexB) {
        return bgIndexA - bgIndexB;
      }
      const fgIndexA = colorIndexMap.get(rgbToHex(a.foreground)) ?? 0;
      const fgIndexB = colorIndexMap.get(rgbToHex(b.foreground)) ?? 0;
      return fgIndexA - fgIndexB;
    });
    setPairs(newPairs);
  }, [colors, wcagLevel]);


  const handleSampleColors = () => {
    trackEvent("sample_palette_loaded", {
      source: "built_in",
      color_count: parseColorInput(SAMPLE_COLORS).length,
    });
    return SAMPLE_COLORS;
  };

  const handleToggleFavorite = (id: string) => {
    const wasFavorite = favorites.has(id);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    trackEvent("favorite_pair_toggled", {
      action: wasFavorite ? "removed" : "added",
      favorite_count: favorites.size + (wasFavorite ? -1 : 1),
    });
  };

  const handleSelectAll = () => {
    // Filter pairs based on current wcagLevel
    const filterThresholds: Record<string, number> = {
      "all": 0,
      "aa-large": 3.0,
      "aa-small": 4.5,
      "aaa-large": 7.0,
    };
    
    const threshold = filterThresholds[wcagLevel] ?? 0;
    const filteredPairs = wcagLevel === "all" 
      ? pairs 
      : pairs.filter(pair => pair.ratio >= threshold);
    
    const filteredPairIds = new Set(filteredPairs.map(pair => pair.id));
    setFavorites(filteredPairIds);
    trackEvent("all_pairs_selected", {
      wcag_level: wcagLevel,
      selected_pair_count: filteredPairs.length,
    });
    toast({
      title: "All pairs selected",
      description: `${filteredPairs.length} color pair${filteredPairs.length !== 1 ? 's' : ''} have been selected.`,
    });
  };

  const handleClearFavorites = () => {
    const clearedPairCount = favorites.size;
    setFavorites(new Set());
    trackEvent("favorites_cleared", {
      cleared_pair_count: clearedPairCount,
    });
    toast({
      title: "Favorites cleared",
      description: "All favorite selections have been removed.",
    });
  };

  const handleExportPNG = async () => {
    if (exportBusy) return;
    if (favorites.size === 0) {
      toast({
        title: "No favorites selected",
        description: "Please check at least one color pair to export.",
        variant: "destructive",
      });
      return;
    }

    const exportElement = document.getElementById("export-cards");
    if (!exportElement) return;

    setExportBusy(true);
    try {
      const canvas = await html2canvas(exportElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "color-palette-results.png";
      link.href = canvas.toDataURL();
      link.click();
      trackEvent("palette_exported", {
        format: "png",
        selected_pair_count: favorites.size,
      });

      toast({
        title: "Export successful",
        description: "Your color pairs have been exported as PNG.",
      });
    } catch (error) {
      trackEvent("palette_export_failed", { format: "png" });
      toast({
        title: "Export failed",
        description: "Could not export to PNG. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportBusy(false);
    }
  };

  const handleExportPDF = async () => {
    if (exportBusy) return;
    if (favorites.size === 0) {
      toast({
        title: "No favorites selected",
        description: "Please check at least one color pair to export.",
        variant: "destructive",
      });
      return;
    }

    const exportElement = document.getElementById("export-cards");
    if (!exportElement) return;

    setExportBusy(true);
    try {
      const canvas = await html2canvas(exportElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 28;
      const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
      const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;
      // Slice into printable A4 pages instead of producing a single oversized PDF.
      const sliceHeight = Math.floor(pageHeight * canvas.width / pageWidth);
      for (let offset = 0; offset < canvas.height; offset += sliceHeight) {
        if (offset > 0) pdf.addPage();
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = Math.min(sliceHeight, canvas.height - offset);
        const context = slice.getContext("2d");
        if (!context) throw new Error("Canvas is unavailable");
        context.drawImage(canvas, 0, offset, canvas.width, slice.height, 0, 0, slice.width, slice.height);
        pdf.addImage(slice.toDataURL("image/png"), "PNG", margin, margin, pageWidth, slice.height * pageWidth / canvas.width, undefined, "FAST");
      }
      pdf.save("color-palette-results.pdf");
      trackEvent("palette_exported", {
        format: "pdf",
        selected_pair_count: favorites.size,
      });

      toast({
        title: "Export successful",
        description: "Your color pairs have been exported as PDF.",
      });
    } catch (error) {
      trackEvent("palette_export_failed", { format: "pdf" });
      toast({
        title: "Export failed",
        description: "Could not export to PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportBusy(false);
    }
  };

  const handleExportStudioCode = () => {
    if (favorites.size === 0) {
      toast({
        title: "No favorites selected",
        description: "Please check at least one color pair to export.",
        variant: "destructive",
      });
      return;
    }

    // Get unique colors from favorited pairs
    const favoritePairs = pairs.filter(pair => favorites.has(pair.id));
    const uniqueColors = new Map<string, RGB>();
    
    favoritePairs.forEach(pair => {
      const fgHex = rgbToHex(pair.foreground);
      const bgHex = rgbToHex(pair.background);
      uniqueColors.set(fgHex, pair.foreground);
      uniqueColors.set(bgHex, pair.background);
    });

    // Build studio code format
    const colorNames = Array.from(uniqueColors.keys()).map((hex, index) => `Color ${index + 1}`);
    const colorValues = Array.from(uniqueColors.keys());
    
    const studioCodeData = {
      colorNames,
      colors: colorValues
    };
    
    const studioCodeUrl = `https://thecolorpalettestudio.com/studiocode?${encodeURIComponent(JSON.stringify(studioCodeData))}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(studioCodeUrl).then(() => {
      trackEvent("palette_exported", {
        format: "studio_code",
        selected_pair_count: favorites.size,
      });
      toast({
        title: "Studio code copied!",
        description: "The studio code URL has been copied to your clipboard.",
      });
    }).catch(() => {
      trackEvent("palette_export_failed", { format: "studio_code" });
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    });
  };


  const threshold = WCAG_THRESHOLDS[wcagLevel as keyof typeof WCAG_THRESHOLDS];
  const textSize = wcagLevel.includes("large") ? "large" : "small";
  
  // Check high contrast pair percentage (AA Small threshold - 4.5:1)
  const highContrastPairs = pairs.filter(pair => pair.ratio >= 4.5);
  const hasNoHighContrastPairs = pairs.length > 0 && highContrastPairs.length === 0;
  
  // Check how many colors have at least one high contrast pair
  const colorsWithHighContrast = new Set<string>();
  highContrastPairs.forEach(pair => {
    colorsWithHighContrast.add(rgbToHex(pair.foreground));
    colorsWithHighContrast.add(rgbToHex(pair.background));
  });
  const colorsWithHighContrastCount = colorsWithHighContrast.size;
  const totalColors = colors.length;
  const colorHighContrastPercentage = totalColors > 0 ? (colorsWithHighContrastCount / totalColors) * 100 : 100;
  const hasLowHighContrastPairs = totalColors > 0 && colorsWithHighContrastCount > 0 && colorHighContrastPercentage < 50;

  const handleTestPalette = () => {
    trackEvent("palette_tested", {
      color_count: colors.length,
      wcag_level: wcagLevel,
      pair_count: pairs.length,
      passing_pair_count: pairs.filter(pair => pair.ratio >= threshold).length,
    });
    const resultsElement = document.getElementById("results-section");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleWcagLevelChange = (value: string) => {
    setWcagLevel(value);
    trackEvent("wcag_level_changed", { wcag_level: value });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden export cards for PNG/PDF generation */}
      <div className="fixed top-0 left-[-9999px]" aria-hidden="true">
        <ExportCards pairs={pairs} favorites={favorites} />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        <HeroSection
          onSampleClick={handleSampleColors}
          colors={colors}
          onColorsChange={setColors}
          onTestPalette={handleTestPalette}
        />

        <PaletteDownloads
          colorCount={colors.length}
          favoriteCount={pairs.filter(pair => favorites.has(pair.id)).length}
          busy={exportBusy}
          onPalettePNG={() => handlePaletteDownload("png")}
          onPaletteText={() => handlePaletteDownload("txt")}
          onFavoritesPNG={handleExportPNG}
          onFavoritesPDF={handleExportPDF}
        />

        {pairs.length > 0 && (
          <div id="results-section">
            <ResultsSection
              pairs={pairs}
              threshold={threshold}
              textSize={textSize}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onExportPNG={handleExportPNG}
              onExportPDF={handleExportPDF}
              onExportStudioCode={handleExportStudioCode}
              onSelectAll={handleSelectAll}
              onClearFavorites={handleClearFavorites}
              wcagLevel={wcagLevel}
              onWcagLevelChange={handleWcagLevelChange}
              previewFontSize={previewFontSize}
              onPreviewFontSizeChange={setPreviewFontSize}
              hasNoHighContrastPairs={hasNoHighContrastPairs}
              hasLowHighContrastPairs={hasLowHighContrastPairs}
            />
          </div>
        )}

        <HowItWorksSection />

        <EducationSections />

        <CTACard />

        <FAQSection />

        <SEOContent />
      </main>

      <Footer />
    </div>
  );
}
