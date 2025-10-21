import { Link } from "wouter";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline" data-testid="link-home">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Information We Collect</h2>
            <p>
              Color Palette Tester is designed to respect your privacy. All color testing and processing 
              happens entirely in your browser. We do not collect, store, or transmit the color values 
              you enter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Cookies and Tracking</h2>
            <p>
              This website uses Google Analytics and Google AdSense, which may set cookies to analyze 
              site traffic and display relevant advertisements. These services collect anonymous usage 
              data to help us improve the tool.
            </p>
            <p>
              You can opt out of Google Analytics tracking by installing the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
            <p>
              You can manage your advertising preferences through{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Ad Settings
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Third-Party Services</h2>
            <p>
              We use third-party services for analytics and advertising. These services have their own 
              privacy policies governing how they collect and process data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Your Privacy Rights</h2>
            <p>
              Since we don't collect personal data beyond what's necessary for analytics, there's minimal 
              data to manage. However, you can always clear your browser cookies and use opt-out tools 
              mentioned above.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact us at{" "}
              <a href="mailto:support@thecolorpalettestudio.com" className="text-primary hover:underline">
                support@thecolorpalettestudio.com
              </a>
              .
            </p>
          </section>

          <p className="text-sm">
            <strong>Last updated:</strong> October 21, 2025
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
