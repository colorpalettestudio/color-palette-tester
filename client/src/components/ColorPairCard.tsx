import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { type RGB, rgbToHex } from "@/lib/colorUtils";

interface ColorPairCardProps {
  foreground: RGB;
  background: RGB;
  ratio: number;
  threshold: number;
  textSize: "small" | "large";
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ColorPairCard({
  foreground,
  background,
  ratio,
  threshold,
  textSize,
  isFavorite,
  onToggleFavorite,
}: ColorPairCardProps) {
  const fgHex = rgbToHex(foreground);
  const bgHex = rgbToHex(background);
  const passes = ratio >= threshold;

  return (
    <Card className="overflow-hidden" data-testid={`card-pair-${fgHex}-${bgHex}`}>
      <CardContent className="p-0">
        <div
          className="h-32 flex items-center justify-center p-6"
          style={{ backgroundColor: bgHex }}
        >
          <p
            className={`font-medium ${textSize === "large" ? "text-2xl" : "text-base"}`}
            style={{ color: fgHex }}
          >
            Aa Bb The quick brown fox
          </p>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-sm text-foreground">
              {fgHex} on {bgHex}
            </p>
            <Badge
              variant={passes ? "default" : "destructive"}
              className="text-xs shrink-0"
              data-testid={`badge-${passes ? "pass" : "fail"}`}
            >
              {ratio.toFixed(2)}:1 {passes ? "Pass" : "Fail"}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {textSize === "large" ? "Large" : "Small"} · WCAG ≥ {threshold}:1
        </p>
        <button
          onClick={onToggleFavorite}
          className="p-1 hover-elevate rounded"
          data-testid="button-favorite"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={`w-4 h-4 ${isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
          />
        </button>
      </CardFooter>
    </Card>
  );
}
