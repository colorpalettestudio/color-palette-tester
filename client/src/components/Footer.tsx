import { Palette, ExternalLink, Heart, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-12 px-6 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8 max-w-5xl mx-auto">
          {/* Left Column - Branding */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <span className="font-semibold">Color Palette Studio</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Free tools for designers and developers to work with colors effortlessly.
            </p>
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by{" "}
              <a 
                href="https://thecolorpalettestudio.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:underline font-medium"
                data-testid="link-creator"
              >
                Color Palette Studio
              </a>
            </p>
            <a 
              href="https://thecolorpalettestudio.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              data-testid="button-explore-tools"
            >
              Explore More Tools
              <ArrowRight className="ml-2 h-3 w-3" />
            </a>
          </div>
          
          {/* Middle Column - More Tools */}
          <div>
            <h3 className="font-semibold mb-4">More Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://thecolorpalettestudio.com/products/color-palette-fixer" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  data-testid="link-palette-fixer"
                >
                  Color Palette Fixer
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://thecolorpalettestudio.com/pages/free-color-contrast-checker" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  data-testid="link-contrast-checker"
                >
                  Contrast Checker
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://thecolorcodeconverter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  data-testid="link-converter"
                >
                  Color Code Converter
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Right Column - Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://thecolorpalettestudio.com/pages/live-workshop-how-to-fix-a-color-palette" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  data-testid="link-workshop"
                >
                  Free Workshop
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@color.palette.studio/videos" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  data-testid="link-videos"
                >
                  Videos
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="mailto:sam@thecolorpalettestudio.com" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-contact"
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="https://thecolorpalettestudio.com/pages/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="https://thecolorpalettestudio.com/pages/terms-of-service" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-terms"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Color Palette Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
