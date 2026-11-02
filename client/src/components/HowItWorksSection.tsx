export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Paste your brand colors",
      description: "Enter HEX, RGB, or HSL — separate colors with spaces, line breaks, or commas.",
    },
    {
      number: 2,
      title: 'Click "Test" — we check every pairing',
      description: "Each foreground/background pair gets a score on a 1:1–21:1 scale.",
    },
    {
      number: 3,
      title: "Filter + export your favorites",
      description: "Choose a 3:1, 4.5:1, or 7:1 benchmark, then open Download to save a PNG or copy your HEX codes and Studio Code.",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground text-center">
        How It Works
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
              {step.number}
            </div>
            <h3 className="font-bold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
