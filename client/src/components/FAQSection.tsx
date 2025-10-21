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
        'Paste your brand colors as HEX, RGB, or HSL (one per line or comma-separated) and click "Test." We build a matrix that checks every foreground/background combination against WCAG contrast ratios.',
    },
    {
      question: "What WCAG levels are supported?",
      answer:
        "AA and AAA for Small and Large text. Thresholds: AA Small 4.5:1, AA Large 3.0:1, AAA Small 7.0:1, AAA Large 4.5:1.",
    },
    {
      question: "Can I export my favorite pairs?",
      answer:
        "Yes. Star any passing pair and export all favorites as a PNG image or a PDF for quick sharing with your team or clients.",
    },
    {
      question: "Does this work for logos, buttons, and UI?",
      answer:
        'Yes. The preview line simulates body text or larger UI elements. Use "Large" mode for headings, buttons, or logos on brand backgrounds.',
    },
    {
      question: "Is the tool free and private?",
      answer:
        "Yes—free, instant, and no sign-up. Processing happens in your browser for speed and privacy.",
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
