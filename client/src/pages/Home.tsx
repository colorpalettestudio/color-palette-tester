import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import HeroSection from "@/components/HeroSection";
import ResultsSection from "@/components/ResultsSection";
import { type ColorPair } from "@/components/ColorPairTable";
import AdPlaceholder from "@/components/AdPlaceholder";
import CTACard from "@/components/CTACard";
import HowItWorksSection from "@/components/HowItWorksSection";
import EducationSections from "@/components/EducationSections";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
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

const SAMPLE_COLORS = "#FF6F61, #FDD66F, #8ED6A9, #6FA8FF, #B76FFF, #111827, #FFFFFF";

export default function Home() {
  const [colorInput, setColorInput] = useState("");
  const [wcagLevel, setWcagLevel] = useState("aa-small");
  const [pairs, setPairs] = useState<ColorPair[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleTestColors = () => {
    const colorStrings = parseColorInput(colorInput);
    
    if (colorStrings.length === 0) {
      toast({
        title: "No colors entered",
        description: "Please enter at least one color to test.",
        variant: "destructive",
      });
      return;
    }

    const colors: RGB[] = [];
    const invalidColors: string[] = [];

    for (const colorStr of colorStrings) {
      const rgb = parseColor(colorStr);
      if (rgb) {
        colors.push(rgb);
      } else {
        invalidColors.push(colorStr);
      }
    }

    if (invalidColors.length > 0) {
      toast({
        title: "Invalid colors found",
        description: `Could not parse: ${invalidColors.join(", ")}`,
        variant: "destructive",
      });
    }

    if (colors.length < 2) {
      toast({
        title: "Not enough colors",
        description: "Please enter at least 2 valid colors to compare.",
        variant: "destructive",
      });
      return;
    }

    const threshold = WCAG_THRESHOLDS[wcagLevel as keyof typeof WCAG_THRESHOLDS];
    const newPairs: ColorPair[] = [];

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

    newPairs.sort((a, b) => b.ratio - a.ratio);
    setPairs(newPairs);

    toast({
      title: "Testing complete",
      description: `Analyzed ${newPairs.length} color combinations.`,
    });
  };

  const handleSampleColors = () => {
    setColorInput(SAMPLE_COLORS);
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

  const handleExportPNG = async () => {
    if (favorites.size === 0) {
      toast({
        title: "No favorites selected",
        description: "Please star at least one color pair to export.",
        variant: "destructive",
      });
      return;
    }

    const tableElement = document.getElementById("results-table");
    if (!tableElement) return;

    try {
      const canvas = await html2canvas(tableElement);
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
        description: "Please star at least one color pair to export.",
        variant: "destructive",
      });
      return;
    }

    const tableElement = document.getElementById("results-table");
    if (!tableElement) return;

    try {
      const canvas = await html2canvas(tableElement);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
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

  const handleClearFavorites = () => {
    setFavorites(new Set());
    toast({
      title: "Favorites cleared",
      description: "All favorite selections have been removed.",
    });
  };

  const threshold = WCAG_THRESHOLDS[wcagLevel as keyof typeof WCAG_THRESHOLDS];
  const textSize = wcagLevel.includes("large") ? "large" : "small";

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        <HeroSection
          onTestClick={handleTestColors}
          onSampleClick={handleSampleColors}
          colorInput={colorInput}
          onColorInputChange={setColorInput}
          wcagLevel={wcagLevel}
          onWcagLevelChange={setWcagLevel}
        />

        <AdPlaceholder className="my-6" />

        {pairs.length > 0 && (
          <>
            <ResultsSection
              pairs={pairs}
              threshold={threshold}
              textSize={textSize}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onExportPNG={handleExportPNG}
              onExportPDF={handleExportPDF}
              onClearFavorites={handleClearFavorites}
              wcagLevel={wcagLevel}
              onWcagLevelChange={setWcagLevel}
            />

            <AdPlaceholder className="my-6" />

            <CTACard />
          </>
        )}

        <HowItWorksSection />

        <EducationSections />

        <FAQSection />

        <AdPlaceholder className="my-6" />
      </main>

      <Footer />
    </div>
  );
}
