import ColorPaletteBuilder from "./ColorPaletteBuilder";
import { type RGB } from "@/lib/colorUtils";

interface HeroSectionProps {
  onSampleClick: () => string;
  colors: RGB[];
  bulkInput: string;
  onInputChange: (input: string) => void;
}

export function PaletteIntroduction() {
  return (
    <header className="mx-auto max-w-5xl space-y-4 text-center">
      <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
        <span className="text-foreground">Color Palette </span>
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #ff6b35, #ffa500, #ffd025, #55bd63, #43a9df, #8173e8)",
          }}
          data-testid="text-rainbow"
        >
          Tester
        </span>
      </h1>
      <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg" data-testid="text-answer-first">
        Add colors, compare every text-and-background pairing, then keep and download the combinations you want.
      </p>
      <nav aria-label="Palette tester steps" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium">
        <a className="text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="#add-colors">1. Add your colors</a>
        <a className="text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="#results-section">2. Compare &amp; choose</a>
        <a className="text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="#download-palette">3. Download your palette</a>
      </nav>
    </header>
  );
}

export default function HeroSection({
  onSampleClick,
  colors,
  bulkInput,
  onInputChange,
}: HeroSectionProps) {
  return (
    <div className="space-y-5">
      <PaletteIntroduction />
      <ColorPaletteBuilder
        onSampleClick={onSampleClick}
        colors={colors}
        bulkInput={bulkInput}
        onInputChange={onInputChange}
      />
    </div>
  );
}
