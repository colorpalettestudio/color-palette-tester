import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import paletteFixer from "@assets/Color Palette FIXER Product Photos (3)_1761170991272.png";

export default function CTACard() {
  return (
    <Card className="overflow-hidden bg-[#cbedfc]">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Left: Visual */}
        <a
          href="https://thecolorpalettestudio.com/products/color-palette-fixer"
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-[#b3e0f7] p-8 flex items-center justify-center min-h-[400px] hover-elevate active-elevate-2 cursor-pointer"
          data-testid="link-palette-fixer-image"
        >
          <div className="w-full max-w-md">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto rounded-lg shadow-2xl"
              poster={paletteFixer}
            >
              <source src="/palette-fixer-demo.mp4" type="video/mp4" />
              <source src="/palette-fixer-demo.webm" type="video/webm" />
              <img 
                src={paletteFixer} 
                alt="Color Palette Fixer in action" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </video>
          </div>
        </a>

        {/* Right: Content */}
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">
            Ready to fix your color palette in 60 seconds?
          </h3>
          
          <p className="text-xl font-semibold text-foreground/90">
            The Color Palette Fixer uses math, not AI.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
              <span className="text-foreground/80">Diagnoses harmony, saturation & contrast issues</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
              <span className="text-foreground/80">One-click fixes in 60 seconds</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
              <span className="text-foreground/80">Export fixed palettes instantly</span>
            </div>
          </div>

          <a
            href="https://thecolorpalettestudio.com/products/color-palette-fixer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-lg font-bold text-lg hover-elevate active-elevate-2 shadow-lg w-fit"
            data-testid="link-palette-fixer"
          >
            Fix Your Color Palette
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </Card>
  );
}
