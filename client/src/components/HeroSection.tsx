import { Badge } from "@/components/ui/badge";
import ColorPaletteBuilder from "./ColorPaletteBuilder";
import { type RGB } from "@/lib/colorUtils";

interface HeroSectionProps {
  onTestClick: () => void;
  onSampleClick: () => void;
  colors: RGB[];
  onColorsChange: (colors: RGB[]) => void;
}

export default function HeroSection({
  onTestClick,
  onSampleClick,
  colors,
  onColorsChange,
}: HeroSectionProps) {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="text-xs" data-testid="badge-hero">
          Free, Instant & No Sign-Up
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
          Test Your{" "}
          <span 
            className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-transparent bg-clip-text"
            data-testid="text-rainbow"
          >
            Color Palette
          </span>{" "}
          for Accessibility
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Paste HEX, RGB, or HSL — test every pairing against WCAG AA/AAA in one click.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <ColorPaletteBuilder
          colors={colors}
          onColorsChange={onColorsChange}
        />

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onTestClick}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover-elevate active-elevate-2 border border-primary-border"
            data-testid="button-test-contrast"
          >
            Test Contrast
          </button>
          <button
            onClick={onSampleClick}
            className="px-6 py-2.5 bg-background text-foreground rounded-md font-medium border border-border hover-elevate active-elevate-2"
            data-testid="button-try-sample"
          >
            Try sample colors
          </button>
        </div>
      </div>
    </div>
  );
}
