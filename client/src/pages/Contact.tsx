import { Link } from "wouter";
import { Mail } from "lucide-react";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline" data-testid="link-home">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>

        <div className="space-y-6">
          <p className="text-muted-foreground text-lg">
            Have questions, feedback, or need support? We'd love to hear from you.
          </p>

          <div className="bg-card border border-card-border rounded-md p-8 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Email Support</h2>
            </div>
            
            <p className="text-muted-foreground">
              For all inquiries, please reach out to us at:
            </p>
            
            <a
              href="mailto:support@thecolorpalettestudio.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover-elevate active-elevate-2 border border-primary-border"
              data-testid="button-email"
            >
              <Mail className="w-4 h-4" />
              support@thecolorpalettestudio.com
            </a>
          </div>

          <div className="bg-accent border border-accent-border rounded-md p-6 space-y-3">
            <h3 className="font-bold text-foreground">What to include in your message:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>A clear description of your question or issue</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Screenshots if reporting a bug or visual issue</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Your browser and operating system (if relevant)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Any color values or settings you were using</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-card-border rounded-md p-6 space-y-3">
            <h3 className="font-bold text-foreground">Our Location</h3>
            <p className="text-muted-foreground">
              The Color Palette Studio<br />
              San Francisco, California
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            We typically respond within 24-48 hours during business days.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
