import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "When will Quantum be available?",
    answer: "We're planning to launch in Q3 2023. Waitlist members will get early access starting in Q2 2023."
  },
  {
    question: "How much will Quantum cost?",
    answer: "We'll offer various pricing tiers to accommodate different team sizes and needs. Waitlist members will receive special pricing and discounts."
  },
  {
    question: "Can I integrate Quantum with my existing tools?",
    answer: "Yes! Quantum is designed to work seamlessly with popular tools like Slack, Google Workspace, Microsoft 365, and many more. We also offer a robust API for custom integrations."
  },
  {
    question: "Is Quantum suitable for my industry?",
    answer: "Quantum is designed to be versatile and adaptable to various industries. Whether you're in tech, marketing, finance, healthcare, or education, our platform can be tailored to meet your specific needs."
  },
  {
    question: "How secure is Quantum?",
    answer: "Security is our top priority. We use industry-standard encryption, regular security audits, and comply with GDPR, CCPA, and other relevant regulations. Your data is always safe with us."
  }
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about Quantum.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg px-6 py-2"
              >
                <AccordionTrigger className="text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
