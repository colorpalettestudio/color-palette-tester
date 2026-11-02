import { useState, useEffect, useMemo, useRef } from "react";
import { PaletteIntroduction } from "@/components/HeroSection";
import ColorPaletteBuilder from "@/components/ColorPaletteBuilder";
import ResultsSection from "@/components/ResultsSection";
import { type ColorPair, type PairFilter } from "@/components/ColorPairTable";
import PaletteDownloads from "@/components/PaletteDownloads";
import PaletteExportDialog from "@/components/PaletteExportDialog";
import { downloadPalettePNG, paletteHexText, createStudioCode } from "@/lib/paletteDownload";
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
  const [displayFilter, setDisplayFilter] = useState<PairFilter>("all");
  const [pairs, setPairs] = useState<ColorPair[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(initial.draft.favorites));
  const [previewFontSize, setPreviewFontSize] = useState(14);
  const [exportBusy, setExportBusy] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const downloadTriggerRef = useRef<HTMLElement | null>(null);
  const { toast } = useToast();

  const openDownload = () => {
    downloadTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDownloadOpen(true);
  };

  const handleDownloadOpenChange = (open: boolean) => {
    setDownloadOpen(open);
    if (!open) requestAnimationFrame(() => downloadTriggerRef.current?.focus());
  };

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

  // Automatically test colors whenever the palette changes
  useEffect(() => {
    if (colors.length < 2) {
      setPairs([]);
      trackEvent("palette_tested", {
        color_count: colors.length,
        contrast_benchmark: threshold,
        display_filter: displayFilter,
        pair_count: 0,
        passing_pair_count: 0,
      });
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
    trackEvent("palette_tested", {
      color_count: colors.length,
      contrast_benchmark: threshold,
      display_filter: displayFilter,
      pair_count: newPairs.length,
      passing_pair_count: newPairs.filter(pair => pair.ratio >= threshold).length,
    });
  }, [colors, threshold, displayFilter]);


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
      : pairs.filter(pair => displayFilter === "meets"
        ? pair.ratio >= threshold
        : pair.ratio < threshold);
    
    setFavorites(previous => new Set([...Array.from(previous), ...filteredPairs.map(pair => pair.id)]));
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

  const selectedPairs = pairs.filter(pair => favorites.has(pair.id));
  const selectedPairings: StudioPairing[] = selectedPairs.map(pair => ({
    foreground: rgbToHex(pair.foreground),
    background: rgbToHex(pair.background),
  }));
  const handleExportPNG = async (includePairings: boolean) => {
    if (!colors.length || exportBusy || (includePairings && !selectedPairs.length)) return;
    setExportBusy(true);
    const scope = includePairings ? "colors_and_pairings" : "colors";
    try {
      // Yield so the dialog can display its progress state before rendering.
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      downloadPalettePNG(colors, includePairings ? selectedPairs : []);
      trackEvent("palette_exported", { format: "png", scope, color_count: colors.length, selected_pair_count: includePairings ? selectedPairs.length : 0 });
      toast({ title: "PNG downloaded", description: includePairings ? "Your colors and selected pairings are included." : "Your palette colors are included." });
    } catch {
      trackEvent("palette_export_failed", { format: "png", scope });
      toast({ title: "Download failed", description: "Could not create your PNG. Try exporting fewer pairings.", variant: "destructive" });
    } finally {
      setExportBusy(false);
    }
  };

  const handleCopy = async (includePairings: boolean, format: "hex" | "studio_code") => {
    if (!colors.length || exportBusy || (includePairings && !selectedPairs.length)) return;
    const scope = includePairings ? "colors_and_pairings" : "colors";
    const text = format === "studio_code"
      ? createStudioCode(colors, includePairings ? selectedPairings : undefined)
      : paletteHexText(colors) + (includePairings
        ? "\nSelected pairings\n" + selectedPairings.map(pair => `Text: ${pair.foreground.toUpperCase()} | Background: ${pair.background.toUpperCase()}`).join("\n")
        : "");
    try {
      await navigator.clipboard.writeText(text);
      trackEvent("palette_exported", { format, scope, method: "copy", color_count: colors.length, selected_pair_count: includePairings ? selectedPairs.length : 0 });
      toast({ title: format === "studio_code" ? "Studio Code copied" : "Color codes copied", description: format === "studio_code" ? "Paste this code into the palette input to restore your colors and any selected pairings." : "Ready to paste wherever you need them." });
    } catch {
      toast({ title: "Could not copy", description: "Your browser blocked clipboard access. Allow clipboard access and try again.", variant: "destructive" });
      trackEvent("palette_export_failed", { format, scope, method: "copy" });
    }
  };

  const handleThresholdChange = (value: number) => {
    setThreshold(value);
    trackEvent("contrast_benchmark_changed", { contrast_benchmark: value });
  };

  const handleDisplayFilterChange = (value: PairFilter) => {
    setDisplayFilter(value);
    trackEvent("contrast_filter_changed", { display_filter: value, contrast_benchmark: threshold });
  };

  return (
    <div className="min-h-screen bg-background">
      <PaletteExportDialog
        open={downloadOpen}
        onOpenChange={handleDownloadOpenChange}
        colorCount={colors.length}
        pairCount={selectedPairs.length}
        busy={exportBusy}
        onDownloadPNG={handleExportPNG}
        onCopyHex={includePairings => handleCopy(includePairings, "hex")}
        onCopyStudio={includePairings => handleCopy(includePairings, "studio_code")}
      />

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 sm:py-10">
        <PaletteIntroduction />
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
          <section id="add-colors" aria-labelledby="add-colors-title" className="min-w-0 scroll-mt-6 lg:col-start-1 lg:row-start-1">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Step 1</p>
              <h2 id="add-colors-title" className="text-2xl font-bold text-foreground">Add your colors</h2>
            </div>
            <ColorPaletteBuilder
              onSampleClick={handleSampleColors}
              colors={colors}
              bulkInput={paletteInput}
              onInputChange={handleInputChange}
            />
          </section>
          <div id="results-section" className="min-w-0 scroll-mt-6 lg:col-start-1 lg:row-start-2">
            <ResultsSection
              pairs={pairs}
              threshold={threshold}
              onThresholdChange={handleThresholdChange}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onOpenDownload={openDownload}
              onSelectAll={handleSelectAll}
              onClearFavorites={handleClearFavorites}
              displayFilter={displayFilter}
              onDisplayFilterChange={handleDisplayFilterChange}
              previewFontSize={previewFontSize}
              onPreviewFontSizeChange={setPreviewFontSize}
            />
          </div>
          <aside id="download-palette" className="min-w-0 scroll-mt-6 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <PaletteDownloads
              colors={colors}
              selectedPairs={selectedPairs}
              busy={exportBusy}
              onOpenDownload={openDownload}
              onRemoveFavorite={handleToggleFavorite}
              onReset={handleResetPalette}
              storageWarning={saveFailed
                ? "Browser storage is unavailable or full. Your current changes are not saved and may be lost when you leave or refresh."
                : storageWarning}
            />
          </aside>
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
