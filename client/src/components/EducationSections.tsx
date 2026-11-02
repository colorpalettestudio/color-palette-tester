export default function EducationSections() {
  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          What Is a Color Palette Tester?
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A color palette tester lets you evaluate the readability and accessibility of your brand colors. 
          Instead of checking one combination at a time, this tool tests every foreground/background pairing 
          in one click and shows each pair's contrast score against a numeric benchmark you choose.
        </p>
        
        {/* Contrast Visualization */}
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <div className="space-y-3">
            <div 
              className="p-8 rounded-lg border-2 flex items-center justify-center min-h-[180px]"
              style={{ backgroundColor: '#1858B8', borderColor: '#1858B8' }}
            >
              <p 
                className="text-3xl font-bold" 
                style={{ color: '#FFFFFF' }}
                data-testid="text-good-contrast"
              >
                Can You Read This?
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-green-600">6.7:1 contrast score</p>
              <p className="text-xs text-muted-foreground">Above the AA (Standard) minimum score</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div 
              className="p-8 rounded-lg border-2 flex items-center justify-center min-h-[180px]"
              style={{ backgroundColor: '#1858B8', borderColor: '#1858B8' }}
            >
              <p 
                className="text-3xl font-bold" 
                style={{ color: '#4473B8' }}
                data-testid="text-poor-contrast"
              >
                Can You Read This?
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-red-600">1.4:1 contrast score</p>
              <p className="text-xs text-muted-foreground">Below the AA (Standard) minimum score</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Why Test Color Contrast?
        </h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary shrink-0">•</span>
            <span>Improve readability across web, app, and print</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary shrink-0">•</span>
            <span>Compare combinations with consistent, adjustable numeric targets</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary shrink-0">•</span>
            <span>Speed up reviews by seeing all pass/fail results at once</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary shrink-0">•</span>
            <span>Share colors and chosen pairings as a PNG, HEX codes, or Studio Code</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary shrink-0">•</span>
            <span>Keep brand colors consistent across light/dark backgrounds</span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Reading Contrast Scores
        </h2>
        <p className="text-muted-foreground">
          Ratios describe the brightness difference between foreground and background colors. Pick a target that fits your design review, then inspect the actual text in context.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-card rounded-md border border-card-border">
            <p className="font-bold text-foreground">Basic · 3:1</p>
            <p className="text-sm text-muted-foreground">A lower score target for comparing larger, bolder display text.</p>
          </div>
          <div className="p-4 bg-card rounded-md border border-card-border">
            <p className="font-bold text-foreground">AA (Standard) · 4.5:1</p>
            <p className="text-sm text-muted-foreground">A practical target for comparing general-purpose text pairs.</p>
          </div>
          <div className="p-4 bg-card rounded-md border border-card-border">
            <p className="font-bold text-foreground">AAA (Enhanced) · 7:1</p>
            <p className="text-sm text-muted-foreground">A higher target that helps identify pairs with stronger separation.</p>
          </div>
          <div className="p-4 bg-card rounded-md border border-card-border">
            <p className="font-bold text-foreground">1:1–21:1 scale</p>
            <p className="text-sm text-muted-foreground">Scores range from the least to the greatest brightness separation.</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          A score is a useful comparison, not a guarantee of readability or certification. Font size, weight, spacing, and viewing conditions all matter.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Supported Color Inputs
        </h2>
        <p className="text-muted-foreground">Paste colors as:</p>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-bold text-foreground shrink-0">HEX</span>
            <span>#RRGGBB</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-foreground shrink-0">RGB</span>
            <span>rgb(255, 111, 97)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-foreground shrink-0">HSL</span>
            <span>hsl(5, 100%, 69%)</span>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Separate colors with spaces, line breaks, or commas.
        </p>
      </section>
    </div>
  );
}
