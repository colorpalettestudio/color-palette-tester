import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsentGiven");
    if (!consentGiven) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    const preferences = {
      necessary: true,
      analytics: true,
    };
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    localStorage.setItem("cookieConsentGiven", "true");
    setShow(false);
  };

  const handleReject = () => {
    const preferences = {
      necessary: true,
      analytics: false,
    };
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    localStorage.setItem("cookieConsentGiven", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6" data-testid="cookie-consent-banner">
      <Card className="max-w-5xl mx-auto p-6 shadow-2xl border-2">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  We Value Your Privacy
                </h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your experience and analyze site traffic. 
                  By clicking "Accept All," you consent to our use of cookies for analytics purposes.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReject}
                className="flex-shrink-0"
                data-testid="button-close-banner"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAccept} data-testid="button-accept-cookies">
                Accept All
              </Button>
              <Button onClick={handleReject} variant="outline" data-testid="button-reject-cookies">
                Reject Non-Essential
              </Button>
              <Link href="/cookie-preferences">
                <Button variant="outline" data-testid="button-manage-cookies">
                  Manage Preferences
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              Learn more in our{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              {" "}and{" "}
              <Link href="/cookie-preferences" className="text-primary hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
