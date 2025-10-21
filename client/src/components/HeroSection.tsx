import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  onTestClick: () => void;
  onSampleClick: () => void;
  colorInput: string;
  onColorInputChange: (value: string) => void;
  wcagLevel: string;
  onWcagLevelChange: (value: string) => void;
}

export default function HeroSection({
  onTestClick,
  onSampleClick,
  colorInput,
  onColorInputChange,
  wcagLevel,
  onWcagLevelChange,
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
            className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:200%_auto] text-transparent bg-clip-text motion-reduce:bg-gradient-to-r motion-reduce:from-foreground motion-reduce:to-foreground animate-rainbow"
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
        <div>
          <textarea
            className="w-full h-32 px-4 py-3 rounded-md border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="#FF6F61, #FDD66F, #8ED6A9, #6FA8FF, #B76FFF, #111827, #FFFFFF"
            value={colorInput}
            onChange={(e) => onColorInputChange(e.target.value)}
            data-testid="input-colors"
          />
        </div>

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

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">WCAG Level</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { value: "aa-small", label: "AA Small (4.5)", threshold: 4.5 },
              { value: "aa-large", label: "AA Large (3.0)", threshold: 3.0 },
              { value: "aaa-small", label: "AAA Small (7.0)", threshold: 7.0 },
              { value: "aaa-large", label: "AAA Large (4.5)", threshold: 4.5 },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
                data-testid={`label-wcag-${option.value}`}
              >
                <input
                  type="radio"
                  name="wcag-level"
                  value={option.value}
                  checked={wcagLevel === option.value}
                  onChange={(e) => onWcagLevelChange(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                  data-testid={`radio-wcag-${option.value}`}
                />
                <span className="text-sm text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
