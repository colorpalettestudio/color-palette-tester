import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Check } from "lucide-react";
import paletteFixer from "@assets/palette-fixer-product.png";

export default function CTACard() {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-[#C89670] to-[#9B7355]">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Left: Visual */}
        <div className="relative bg-[#B88563] p-8 flex items-center justify-center min-h-[400px]">
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
        </div>

        {/* Right: Content */}
        <div className="p-8 md:p-12 flex flex-col justify-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full w-fit text-sm font-medium">
            <Zap className="w-4 h-4" />
            Powered by AI
          </div>

          <h3 className="text-3xl md:text-4xl font-bold leading-tight">
            Found colors that don't pass?
          </h3>
          
          <p className="text-xl font-semibold text-white/95">
            Try fixing your palette automatically
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-white/90">Diagnoses harmony, saturation & contrast issues</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-white/90">One-click fixes in 60 seconds</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-white/90">Export fixed palettes instantly</span>
            </div>
          </div>

          <a
            href="https://thecolorpalettestudio.com/products/color-palette-fixer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#8B6F47] rounded-lg font-bold text-lg hover-elevate active-elevate-2 shadow-lg w-fit"
            data-testid="link-palette-fixer"
          >
            Try Palette Fixer
            <ArrowRight className="w-5 h-5" />
          </a>

          <p className="text-sm text-white/70">
            Free trial • No credit card required
          </p>
        </div>
      </div>
    </Card>
  );
}
