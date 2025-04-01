import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "When will the product launch?",
    answer: "We're aiming for a Q2 2023 launch. Everyone on the waitlist will get early access one month before the official launch."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial for all new users. No credit card required to sign up."
  },
  {
    question: "What platforms are supported?",
    answer: "Our product works on all major platforms including Windows, macOS, iOS, and Android. We also offer a web version that works in all modern browsers."
  },
  {
    question: "How much will it cost?",
    answer: "We'll offer multiple pricing tiers starting at $9.99/month. Early access members from the waitlist will receive special pricing and additional perks."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption and follow industry best practices for data security. Your information is never shared with third parties."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know about our product</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-none">
                <AccordionTrigger className="text-lg font-medium text-gray-900 py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
