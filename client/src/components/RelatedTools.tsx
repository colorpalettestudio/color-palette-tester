import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function RelatedTools() {
  const tools = [
    {
      name: "Color Code Converter",
      url: "https://thecolorcodeconverter.com/",
      description: "Convert HEX, RGB, and HSL values instantly."
    },
    {
      name: "Color Palette Generator",
      url: "https://colorpalettegenerator.co/",
      description: "Create and shuffle random color palettes."
    },
    {
      name: "Color Palette Fixer",
      url: "https://thecolorpalettestudio.com/products/color-palette-fixer",
      description: "Balance your color palettes in 60 seconds."
    }
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground text-center">
        Explore More Design Tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <a 
            key={tool.name}
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block group"
            data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Card className="p-6 hover-elevate active-elevate-2 h-full transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground">
                {tool.description}
              </p>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
