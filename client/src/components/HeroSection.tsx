import { Badge } from "@/components/ui/badge";
import ColorPaletteBuilder from "./ColorPaletteBuilder";
import { type RGB } from "@/lib/colorUtils";

interface HeroSectionProps {
  onSampleClick: () => string;
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
        <Badge variant="secondary" className="text-base px-6 py-2" data-testid="badge-hero">
          Free, Instant & No Sign-Up
        </Badge>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <span className="text-foreground">Color Palette </span>
          <span 
            style={{
              color: '#ff6b35',
              backgroundImage: 'linear-gradient(90deg, #ff6b35, #ffa500, #ffd700, #32cd32, #00bfff, #9370db)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            data-testid="text-rainbow"
          >
            Tester
          </span>
        </h1>
        
        {/* Answer-First Content */}
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-lg text-foreground font-medium" data-testid="text-answer-first">
            A color palette tester instantly checks all color combinations in your brand palette for WCAG accessibility compliance. Instead of manually testing pairs one by one, paste your colors and see every foreground/background pairing tested at once.
          </p>
          
          {/* Problem/Solution Statements */}
          <div className="bg-card/50 border border-card-border rounded-lg p-6 text-left space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">Problem:</p>
              <p className="text-base text-foreground">
                Manually testing color contrast takes hours and you might miss critical accessibility issues that affect readability.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">Solution:</p>
              <p className="text-base text-foreground">
                Test all pairings instantly with our free tool. Get WCAG AA/AAA results in seconds, filter by compliance level, and export passing combinations as PNG or PDF.
              </p>
            </div>
          </div>
          
          <p className="text-base text-muted-foreground">
            Paste HEX, RGB, or HSL colors below and click "Test Contrast" to check every pairing against WCAG standards.
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground/80">
          Trusted by 2,000+ designers
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
