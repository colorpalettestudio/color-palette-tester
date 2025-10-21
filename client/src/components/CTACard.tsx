import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function CTACard() {
  return (
    <Card className="bg-accent border-accent-border">
      <CardHeader>
        <h3 className="text-xl font-bold text-foreground">
          Want to fix your palette next?
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Try Color Palette Fixer — balance hues, saturation, and neutrals in seconds.
        </p>
        <a
          href="https://thecolorpalettestudio.com/fixer"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover-elevate active-elevate-2 border border-primary-border"
          data-testid="button-try-fixer"
        >
          Try Palette Fixer
          <ArrowRight className="w-4 h-4" />
        </a>
      </CardContent>
    </Card>
  );
}
