import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQSection = () => {
    const faqs = [
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for all unworn items in original condition with tags attached. Refunds will be issued to the original form of payment."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout for faster delivery."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary depending on the destination."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a confirmation email with a tracking number. You can use this number on our website or the carrier's site to track your package."
        },
        {
            question: "What sizes do you offer?",
            answer: "We offer a wide range of sizes from XS to XXL in most of our products. Check the size guide on each product page for specific measurements."
        },
        {
            question: "Are your clothes ethically produced?",
            answer: "Yes, we are committed to ethical production. All our garments are made in facilities that adhere to fair labor practices and environmental standards."
        },
        {
            question: "Do you offer gift wrapping?",
            answer: "Yes, we offer gift wrapping services for a small additional fee. You can select this option during checkout."
        },
        {
            question: "How do I care for my garments?",
            answer: "Care instructions are provided on the label of each garment. Generally, we recommend washing in cold water and hanging to dry for longevity of the clothing."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl bg-white text-gray-900 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-800">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-gray-700 hover:text-gray-900">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
};