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
        className="flex items-center gap-8 p-8 hover-elevate active-elevate-2"
        data-testid="link-palette-fixer"
      >
        <div className="flex-shrink-0">
          <div className="w-72 h-48 bg-[#6B9FD1] rounded-lg overflow-hidden shadow-md">
            <img 
              src={paletteFixer} 
              alt="Color Palette Fixer" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            Want to fix your color palette next?
          </h3>
          <p className="text-base text-muted-foreground">
            Try <span className="font-semibold">Color Palette Fixer</span> — the only tool that diagnoses your palette and gives one-click fixes in 60 seconds.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-md font-medium">
            Try Palette Fixer
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </a>
    </Card>
  );
}
