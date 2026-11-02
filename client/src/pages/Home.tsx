import { useState, useEffect, useMemo } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PaletteIntroduction } from "@/components/HeroSection";
import ColorPaletteBuilder from "@/components/ColorPaletteBuilder";
import ResultsSection from "@/components/ResultsSection";
import { type ColorPair } from "@/components/ColorPairTable";
import ExportCards from "@/components/ExportCards";
import PaletteDownloads from "@/components/PaletteDownloads";
import { downloadPalettePNG, downloadPaletteText, paletteHexText, createStudioCode, downloadTextFile } from "@/lib/paletteDownload";
import CTACard from "@/components/CTACard";
import HowItWorksSection from "@/components/HowItWorksSection";
import EducationSections from "@/components/EducationSections";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEOContent from "@/components/SEOContent";
import {
  parseColorInput,
  getContrastRatio,
  rgbToHex,
  parseStudioCode,
  type StudioPairing,
} from "@/lib/colorUtils";
import { colorsFromInput, readPaletteDraft, savePaletteDraft, validFavorites } from "@/lib/paletteStorage";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_COLORS = "#f91d71, #fd806a, #ffd025, #74d551, #76c4f4, #7c70ff";

export default function Home() {
  const [initial] = useState(() => readPaletteDraft(SAMPLE_COLORS));
  const [paletteInput, setPaletteInput] = useState(initial.draft.input);
  const colors = useMemo(() => colorsFromInput(paletteInput), [paletteInput]);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [saveFailed, setSaveFailed] = useState(false);
  const [threshold, setThreshold] = useState(4.5);
  const [displayFilter, setDisplayFilter] = useState<"all" | "passing">("all");
  const [pairs, setPairs] = useState<ColorPair[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(initial.draft.favorites));
  const [previewFontSize, setPreviewFontSize] = useState(14);
  const [exportBusy, setExportBusy] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSaveFailed(!savePaletteDraft(paletteInput, favorites));
  }, [paletteInput, favorites]);

  const handleInputChange = (input: string) => {
    setPaletteInput(input);
    const studio = parseStudioCode(input);
    setFavorites(previous => new Set(validFavorites(input, studio
      ? (studio.pairings ?? []).map(pair => `${pair.foreground}-${pair.background}`)
      : previous)));
  };

  const handleResetPalette = () => {
    if (!window.confirm("Clear your palette, unfinished input, and all selected pairings from this browser? This cannot be undone.")) return;
    setPaletteInput("");
    setFavorites(new Set());
    setStorageWarning("");
    // Persist an empty draft, rather than restoring the sample on the next visit.
    setSaveFailed(!savePaletteDraft("", []));
  };

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
  }, [colors, threshold]);


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
    const filteredPairs = displayFilter === "all"
      ? pairs 
      : pairs.filter(pair => pair.ratio >= threshold);
    
    const filteredPairIds = new Set(filteredPairs.map(pair => pair.id));
    setFavorites(filteredPairIds);
    trackEvent("all_pairs_selected", {
      contrast_benchmark: threshold,
      display_filter: displayFilter,
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

  const selectedPairs = pairs.filter(pair => favorites.has(pair.id));
  const selectedPairings: StudioPairing[] = selectedPairs.map(pair => ({
    foreground: rgbToHex(pair.foreground),
    background: rgbToHex(pair.background),
  }));
  const selectedColors = Array.from(new Map(selectedPairs.flatMap(pair => [
    [rgbToHex(pair.foreground), pair.foreground] as const,
    [rgbToHex(pair.background), pair.background] as const,
  ])).values());

  const handleCopy = async (scope: "palette" | "pairings", format: "hex" | "studio_code") => {
    const exportColors = scope === "palette" ? colors : selectedColors;
    if (!exportColors.length || exportBusy) return;
    const text = format === "studio_code"
      ? createStudioCode(exportColors, scope === "pairings" ? selectedPairings : undefined)
      : scope === "palette"
        ? paletteHexText(colors)
        : selectedPairings.map(pair => `Text: ${pair.foreground.toUpperCase()} | Background: ${pair.background.toUpperCase()}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      trackEvent("palette_exported", { format, scope, method: "copy", color_count: exportColors.length, selected_pair_count: scope === "pairings" ? selectedPairs.length : 0 });
      toast({ title: format === "studio_code" ? "Studio Code copied" : "Color codes copied", description: format === "studio_code" ? "Paste this code into the palette input to restore your colors and any selected pairings." : "Ready to paste wherever you need them." });
    } catch {
      toast({ title: "Could not copy", description: "Your browser blocked clipboard access. Use the download option instead.", variant: "destructive" });
      trackEvent("palette_export_failed", { format, scope, method: "copy" });
    }
  };

  const handleDownloadStudio = (scope: "palette" | "pairings") => {
    const exportColors = scope === "palette" ? colors : selectedColors;
    if (!exportColors.length || exportBusy) return;
    try {
      downloadTextFile(createStudioCode(exportColors, scope === "pairings" ? selectedPairings : undefined), `my-${scope}-studio-code.txt`);
      trackEvent("palette_exported", { format: "studio_code", scope, method: "download", color_count: exportColors.length, selected_pair_count: scope === "pairings" ? selectedPairs.length : 0 });
      toast({ title: "Studio Code downloaded", description: "Paste the contents of the text file into the palette input to restore it." });
    } catch {
      toast({ title: "Download failed", description: "Could not save your Studio Code. Please try again.", variant: "destructive" });
    }
  };

  // All summaries and warnings follow the user's selected benchmark.
  const highContrastPairs = pairs.filter(pair => pair.ratio >= threshold);
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
      contrast_benchmark: threshold,
      display_filter: displayFilter,
      pair_count: pairs.length,
      passing_pair_count: pairs.filter(pair => pair.ratio >= threshold).length,
    });
    const resultsElement = document.getElementById("results-section");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleThresholdChange = (value: number) => {
    setThreshold(value);
    trackEvent("contrast_benchmark_changed", { contrast_benchmark: value });
  };

  const handleDisplayFilterChange = (value: "all" | "passing") => {
    setDisplayFilter(value);
    trackEvent("contrast_filter_changed", { display_filter: value, contrast_benchmark: threshold });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden export cards for PNG/PDF generation */}
      <div className="fixed top-0 left-[-9999px]" aria-hidden="true">
        <ExportCards pairs={pairs} favorites={favorites} />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        <PaletteIntroduction />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <ColorPaletteBuilder
              onSampleClick={handleSampleColors}
              colors={colors}
              bulkInput={paletteInput}
              onInputChange={handleInputChange}
              onTestPalette={handleTestPalette}
            />
          </div>
          <aside className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
            <PaletteDownloads
              colors={colors}
              selectedPairs={selectedPairs}
              busy={exportBusy}
              onPalettePNG={() => handlePaletteDownload("png")}
              onPaletteText={() => handlePaletteDownload("txt")}
              onFavoritesPNG={handleExportPNG}
              onFavoritesPDF={handleExportPDF}
              onCopyPaletteHex={() => handleCopy("palette", "hex")}
              onCopyPaletteStudio={() => handleCopy("palette", "studio_code")}
              onDownloadPaletteStudio={() => handleDownloadStudio("palette")}
              onCopyFavoritesHex={() => handleCopy("pairings", "hex")}
              onCopyFavoritesStudio={() => handleCopy("pairings", "studio_code")}
              onDownloadFavoritesStudio={() => handleDownloadStudio("pairings")}
              onRemoveFavorite={handleToggleFavorite}
              onReset={handleResetPalette}
              storageWarning={saveFailed
                ? "Browser storage is unavailable or full. Your current changes are not saved and may be lost when you leave or refresh."
                : storageWarning}
            />
          </aside>
          {pairs.length > 0 && (
          <div id="results-section" className="min-w-0 lg:col-start-1 lg:row-start-2">
            <ResultsSection
              pairs={pairs}
              threshold={threshold}
              onThresholdChange={handleThresholdChange}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onExportPNG={handleExportPNG}
              onExportPDF={handleExportPDF}
              onExportStudioCode={() => handleCopy("pairings", "studio_code")}
              onSelectAll={handleSelectAll}
              onClearFavorites={handleClearFavorites}
              displayFilter={displayFilter}
              onDisplayFilterChange={handleDisplayFilterChange}
              previewFontSize={previewFontSize}
              onPreviewFontSizeChange={setPreviewFontSize}
              hasNoHighContrastPairs={hasNoHighContrastPairs}
              hasLowHighContrastPairs={hasLowHighContrastPairs}
            />
          </div>
          )}
        </div>

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
