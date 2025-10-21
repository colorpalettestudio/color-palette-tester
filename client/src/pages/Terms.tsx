import { Link } from "wouter";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline" data-testid="link-home">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Acceptance of Terms</h2>
            <p>
              By accessing and using Color Palette Tester, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use this tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">"As Is" Warranty Disclaimer</h2>
            <p>
              This tool is provided "as is" without warranty of any kind, either express or implied, 
              including but not limited to warranties of merchantability, fitness for a particular purpose, 
              or non-infringement.
            </p>
            <p>
              We make no guarantees about the accuracy, reliability, or availability of the color contrast 
              calculations. While we strive for accuracy, you should verify critical accessibility 
              requirements independently.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Acceptable Use</h2>
            <p>You agree to use this tool only for lawful purposes. You may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Attempt to interfere with the proper functioning of the service</li>
              <li>Use the tool to violate any applicable laws or regulations</li>
              <li>Reverse engineer, decompile, or disassemble any part of the service</li>
              <li>Use automated systems to access the tool in a way that sends more requests than a human could reasonably produce</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Third-Party Services</h2>
            <p>
              This tool may use third-party services such as Google Analytics and Google AdSense. 
              Your use of these services is subject to their respective terms of service and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Limitation of Liability</h2>
            <p>
              In no event shall The Color Palette Studio or its operators be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising out of or related to your 
              use of this tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the tool after 
              changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
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
