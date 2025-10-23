import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import HeroSection from "@/components/HeroSection";
import ResultsSection from "@/components/ResultsSection";
import { type ColorPair } from "@/components/ColorPairTable";
import ExportCards from "@/components/ExportCards";
import CTACard from "@/components/CTACard";
import HowItWorksSection from "@/components/HowItWorksSection";
import EducationSections from "@/components/EducationSections";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEOContent from "@/components/SEOContent";
import RelatedTools from "@/components/RelatedTools";
import {
  parseColor,
  parseColorInput,
  getContrastRatio,
  type RGB,
  rgbToHex,
} from "@/lib/colorUtils";
import { useToast } from "@/hooks/use-toast";

const WCAG_THRESHOLDS = {
  "aa-small": 4.5,
  "aa-large": 3.0,
  "aaa-small": 7.0,
  "aaa-large": 4.5,
};

const SAMPLE_COLORS = "#ffb2f1, #5602de, #c6b0f5, #b5e5fa";

export default function Home() {
  const [colors, setColors] = useState<RGB[]>([]);
  const [wcagLevel, setWcagLevel] = useState("all");
  const [pairs, setPairs] = useState<ColorPair[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewFontSize, setPreviewFontSize] = useState(14);
  const { toast } = useToast();

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
    return SAMPLE_COLORS;
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
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
    toast({
      title: "All pairs selected",
      description: `${filteredPairs.length} color pair${filteredPairs.length !== 1 ? 's' : ''} have been selected.`,
    });
  };

  const handleClearFavorites = () => {
    setFavorites(new Set());
    toast({
      title: "Favorites cleared",
      description: "All favorite selections have been removed.",
    });
  };

  const handleExportPNG = async () => {
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

    try {
      const canvas = await html2canvas(exportElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "color-palette-results.png";
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Export successful",
        description: "Your color pairs have been exported as PNG.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export to PNG. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async () => {
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

    try {
      const canvas = await html2canvas(exportElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      // Calculate dimensions to fit content on page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Use points as unit (72 points = 1 inch)
      const pdfWidth = imgWidth * 0.75; // Convert pixels to points (assuming 96 DPI)
      const pdfHeight = imgHeight * 0.75;
      
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
        unit: "pt",
        format: [pdfWidth, pdfHeight],
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save("color-palette-results.pdf");

      toast({
        title: "Export successful",
        description: "Your color pairs have been exported as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export to PDF. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "Studio code copied!",
        description: "The studio code URL has been copied to your clipboard.",
      });
    }).catch(() => {
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
    const resultsElement = document.getElementById("results-section");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden export cards for PNG/PDF generation */}
      <div className="fixed top-0 left-[-9999px]">
        <ExportCards pairs={pairs} favorites={favorites} />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        <HeroSection
          onSampleClick={handleSampleColors}
          colors={colors}
          onColorsChange={setColors}
          onTestPalette={handleTestPalette}
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
              onWcagLevelChange={setWcagLevel}
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

        <RelatedTools />
      </main>

      <Footer />
    </div>
  );
}
