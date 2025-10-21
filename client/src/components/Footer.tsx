import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by{" "}
            <a
              href="https://thecolorpalettestudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
              data-testid="link-creator"
            >
              The Color Palette Studio
            </a>
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground" data-testid="link-privacy">
              Privacy
            </Link>
            <span className="text-border">·</span>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground" data-testid="link-terms">
              Terms
            </Link>
            <span className="text-border">·</span>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground" data-testid="link-contact">
              Contact
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Explore more free tools →
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <a
              href="https://thecolorcodeconverter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
              data-testid="link-converter"
            >
              Color Code Converter
            </a>
            <span className="text-border">·</span>
            <span className="text-muted-foreground">Contrast Checker</span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground">Harmony Generator</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
