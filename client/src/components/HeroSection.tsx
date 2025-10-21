import { Badge } from "@/components/ui/badge";
import ColorPaletteBuilder from "./ColorPaletteBuilder";
import { type RGB } from "@/lib/colorUtils";

interface HeroSectionProps {
  onSampleClick: () => void;
  colors: RGB[];
  onColorsChange: (colors: RGB[]) => void;
  onTestPalette: () => void;
}

export default function HeroSection({
  onSampleClick,
  colors,
  onColorsChange,
  onTestPalette,
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

      <div className="max-w-5xl mx-auto">
        <ColorPaletteBuilder
          colors={colors}
          onColorsChange={onColorsChange}
          onSampleClick={onSampleClick}
          onTestPalette={onTestPalette}
        />
      </div>
    </div>
  );
}
