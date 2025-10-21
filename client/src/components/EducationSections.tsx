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
          in one click and flags which ones pass WCAG guidelines.
        </p>
        
        {/* Contrast Visualization */}
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <div className="p-8 bg-white rounded-lg border-2 border-gray-200 flex flex-col items-center justify-center min-h-[180px]">
            <p 
              className="text-3xl font-bold mb-3" 
              style={{ color: '#595959' }}
              data-testid="text-good-contrast"
            >
              Can You Read This?
            </p>
            <div className="text-center">
              <p className="text-sm font-semibold text-green-600">✓ 6.5:1 Contrast</p>
              <p className="text-xs text-gray-500 mt-1">Passes WCAG AA & AAA</p>
            </div>
          </div>
          
          <div className="p-8 bg-white rounded-lg border-2 border-gray-200 flex flex-col items-center justify-center min-h-[180px]">
            <p 
              className="text-3xl font-bold mb-3" 
              style={{ color: '#c9c9c9' }}
              data-testid="text-poor-contrast"
            >
              Can You Read This?
            </p>
            <div className="text-center">
              <p className="text-sm font-semibold text-red-600">✗ 1.4:1 Contrast</p>
              <p className="text-xs text-gray-500 mt-1">Fails all WCAG standards</p>
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
            <span>Meet accessibility standards (WCAG) with confidence</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary shrink-0">•</span>
            <span>Speed up reviews by seeing all pass/fail results at once</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary shrink-0">•</span>
            <span>Share decisions easily with PNG/PDF exports</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary shrink-0">•</span>
            <span>Keep brand colors consistent across light/dark backgrounds</span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          WCAG Levels Explained
        </h2>
        <p className="text-muted-foreground">
          WCAG defines minimum contrast ratios for legibility:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-card rounded-md border border-card-border">
            <p className="font-bold text-foreground">AA Small Text</p>
            <p className="text-sm text-muted-foreground">4.5:1</p>
          </div>
          <div className="p-4 bg-card rounded-md border border-card-border">
            <p className="font-bold text-foreground">AA Large Text</p>
            <p className="text-sm text-muted-foreground">3.0:1 (≥18pt or ≥14pt bold)</p>
          </div>
          <div className="p-4 bg-card rounded-md border border-card-border">
            <p className="font-bold text-foreground">AAA Small Text</p>
            <p className="text-sm text-muted-foreground">7.0:1</p>
          </div>
          <div className="p-4 bg-card rounded-md border border-card-border">
            <p className="font-bold text-foreground">AAA Large Text</p>
            <p className="text-sm text-muted-foreground">4.5:1</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Use Small for paragraphs and body text. Use Large for headers, buttons, logos, and large UI labels.
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
          Enter one color per line or separate by commas.
        </p>
      </section>
    </div>
  );
}
