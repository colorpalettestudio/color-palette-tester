import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I test all color pairings?",
      answer:
        "Paste your brand colors as HEX, RGB, or HSL, separated by spaces, line breaks, or commas. Contrast scores update automatically for every text-and-background combination.",
    },
    {
      question: "What do the numeric benchmarks mean?",
      answer:
        "Choose 3:1, 4.5:1, or 7:1 as a comparison target. A pair is marked passing when its score is equal to or above the selected number. This helps compare colors, but is not a certification or a guarantee of readability.",
    },
    {
      question: "Can I export my favorite pairs?",
      answer:
        "Yes. Select the pairings you want to keep, then open Download. Choose colors only or colors and pairings, download a PNG, or copy the HEX codes or Studio Code.",
    },
    {
      question: "Does this work for logos, buttons, and UI?",
      answer:
        "Yes. Use the preview to compare foreground and background colors, and adjust the text size to better reflect your design. Evaluate the finished component in its real context.",
    },
    {
      question: "Does my palette stay private?",
      answer:
        "Color palette processing happens in your browser. The color values you enter are not sent to our servers.",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground text-center">
        Frequently Asked Questions
      </h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="bg-card border border-card-border rounded-md px-6"
          >
            <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
