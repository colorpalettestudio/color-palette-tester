export default function SEOContent() {
  return (
    <section className="space-y-12 text-left max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          About the Color Palette Tester
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          The Color Palette Tester lets you instantly check the accessibility of your brand or website colors. Paste your HEX, RGB, or HSL values and test every possible color pairing for contrast ratio compliance with WCAG 2.1 standards. It's the fastest way to make sure your colors are readable and inclusive.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Why Test Color Contrast?
        </h2>
        <ul className="space-y-2 text-base text-muted-foreground list-disc list-inside">
          <li>Ensure your brand colors meet WCAG AA or AAA accessibility standards.</li>
          <li>Improve readability for users with visual impairments or color blindness.</li>
          <li>Save time by testing every color pairing at once instead of manually.</li>
          <li>Export results to PNG or PDF for easy sharing with your design team.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          How to Use the Color Palette Tester
        </h2>
        <ol className="space-y-2 text-base text-muted-foreground list-decimal list-inside">
          <li>Paste your brand colors as HEX, RGB, or HSL values — one per line.</li>
          <li>Choose your WCAG level (AA/AAA, Small or Large text).</li>
          <li>Click "Test Contrast" to instantly view all pass/fail results.</li>
          <li>Star your favorite pairs and export them as a PNG or PDF.</li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Who It's For
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          This tool is built for designers, developers, and brand owners who want their color palettes to be beautiful <em>and</em> accessible. Whether you're building a website, app, or brand style guide, you'll know which combinations meet accessibility standards.
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
