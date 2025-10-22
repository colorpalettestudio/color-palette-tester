import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function CookiePreferences() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("cookiePreferences");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    localStorage.setItem("cookieConsentGiven", "true");
    toast({
      title: "Preferences saved",
      description: "Your cookie preferences have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline" data-testid="link-home">
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-foreground">Cookie Preferences</h1>

        <div className="space-y-6">
          <p className="text-muted-foreground text-lg">
            We use cookies to enhance your experience. Choose which types of cookies you'd like to allow.
          </p>

          <Card className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Necessary Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies are essential for the website to function properly. They cannot be disabled.
                </p>
              </div>
              <Switch
                checked={preferences.necessary}
                disabled
                data-testid="switch-necessary"
              />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by collecting anonymous information. We use Google Analytics to improve our service.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
                data-testid="switch-analytics"
              />
            </div>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} size="lg" data-testid="button-save-preferences">
              Save Preferences
            </Button>
            <Button
              onClick={() => {
                setPreferences({
                  necessary: true,
                  analytics: true,
                });
              }}
              variant="outline"
              size="lg"
              data-testid="button-accept-all"
            >
              Accept All
            </Button>
          </div>

          <div className="pt-4">
            <h2 className="text-2xl font-bold text-foreground mb-3">Additional Information</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                For more information about how we use cookies and protect your privacy, please visit our{" "}
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <p>
                You can also control cookies through your browser settings. Most browsers allow you to refuse 
                cookies or delete cookies that have already been set. Note that disabling cookies may affect 
                the functionality of this and many other websites.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
