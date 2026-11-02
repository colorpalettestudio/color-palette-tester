import ColorPaletteBuilder from "./ColorPaletteBuilder";
import { type RGB } from "@/lib/colorUtils";

interface HeroSectionProps {
  onSampleClick: () => string;
  colors: RGB[];
  bulkInput: string;
  onInputChange: (input: string) => void;
  onTestPalette: () => void;
}

export function PaletteIntroduction() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
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
            A color palette tester scores every foreground/background combination in your palette at once. Choose a numeric contrast benchmark, then see which pairs meet it and which fall short.
          </p>
          
          {/* Problem/Solution Statements */}
          <div className="bg-card/50 border border-card-border rounded-lg p-6 text-left space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">Problem:</p>
              <p className="text-base text-foreground">
                Checking colors one pairing at a time is slow, and low-contrast combinations can be easy to miss.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">Solution:</p>
              <p className="text-base text-foreground">
                Compare every pairing against a 3:1, 4.5:1, or 7:1 score benchmark, filter the results, and download your colors and selected pairings as a PNG.
              </p>
            </div>
          </div>
          
          <p className="text-base text-muted-foreground">
            Paste HEX, RGB, or HSL colors below and click "Test Contrast" to see each pair's score against your selected benchmark.
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground/80">
          Trusted by 2,000+ designers
        </p>
      </div>

    </div>
  );
}

export default function HeroSection({
  onSampleClick,
  colors,
  bulkInput,
  onInputChange,
  onTestPalette,
}: HeroSectionProps) {
  return (
    <div className="space-y-8">
      <PaletteIntroduction />
      <div className="max-w-5xl mx-auto">
        <ColorPaletteBuilder
          colors={colors}
          bulkInput={bulkInput}
          onInputChange={onInputChange}
          onSampleClick={onSampleClick}
          onTestPalette={onTestPalette}
        />
      </div>
    </div>
  );
}
