export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Add your colors",
      description: "Enter HEX, RGB, or HSL — separate colors with spaces, line breaks, or commas.",
    },
    {
      number: 2,
      title: "Compare & choose",
      description: "Scores update automatically. Show All Pairings or filter by Basic, AA (Standard), or AAA (Enhanced), then keep the pairings you like.",
    },
    {
      number: 3,
      title: "Download your palette",
      description: "Open Download to save colors only or colors and chosen pairings as a PNG, or copy HEX codes and Studio Code.",
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
