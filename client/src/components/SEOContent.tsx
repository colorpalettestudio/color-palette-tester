export default function SEOContent() {
  return (
    <section className="space-y-12 text-left max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          About the Color Palette Tester
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          The Color Palette Tester gives every pairing in a brand or website palette a contrast score. Paste HEX, RGB, or HSL values, choose a 3:1, 4.5:1, or 7:1 numeric benchmark, and quickly compare all foreground and background combinations. Scores are a useful design aid; always review color choices in their intended context.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Why Test Color Contrast?
        </h2>
        <ul className="space-y-2 text-base text-muted-foreground list-disc list-inside">
          <li>Compare color combinations using a consistent, adjustable score target.</li>
          <li>Spot pairs with less brightness separation and review them in context.</li>
          <li>Save time by testing every color pairing at once instead of manually.</li>
          <li>Export results to PNG or PDF for easy sharing with your design team.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          How to Use the Color Palette Tester
        </h2>
        <ol className="space-y-2 text-base text-muted-foreground list-decimal list-inside">
          <li>Paste your brand colors as HEX, RGB, or HSL values — separated by spaces, line breaks, or commas.</li>
          <li>Choose a numeric benchmark: 3:1, 4.5:1, or 7:1.</li>
          <li>Click "Test Contrast" to instantly view all pass/fail results.</li>
          <li>Star your favorite pairs and export them as a PNG or PDF.</li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Who It's For
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          This tool is built for designers, developers, and brand owners who want to understand how their palette colors compare. Whether you're building a website, app, or brand style guide, you can see which combinations meet a chosen numeric target and which fall below it.
        </p>
        <div className="pt-2">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Learn More About Color Accessibility
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            Visit{" "}
            <a 
              href="https://thecolorpalettestudio.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              The Color Palette Studio
            </a>{" "}
            to explore more free tools like the Color Code Converter, Color Harmony Generator, and Color Palette Fixer.
          </p>
        </div>
      </div>
    </section>
  );
}
