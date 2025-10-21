import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import paletteFixer from "@assets/palette-fixer-product.png";

export default function CTACard() {
  return (
    <Card className="overflow-hidden">
      <a
        href="https://thecolorpalettestudio.com/products/color-palette-fixer"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-6 p-6 hover-elevate active-elevate-2"
        data-testid="link-palette-fixer"
      >
        <div className="flex-shrink-0">
          <div className="w-48 h-32 bg-[#6B9FD1] rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={paletteFixer} 
              alt="Color Palette Fixer" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Want to fix your color palette next?
          </h3>
          <p className="text-muted-foreground">
            Try <span className="font-semibold">Color Palette Fixer</span> — the only tool that diagnoses your palette and gives one-click fixes in 60 seconds.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-md font-medium">
            Try Palette Fixer
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </a>
    </Card>
  );
}
