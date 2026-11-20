import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  { question: "What is SabiGuy?", answer: "SabiGuy is a platform that connects people and businesses with trusted local service providers. Whether you need to send a package, run an errand, or get a task done at home, SabiGuy helps you find someone nearby who can do it quickly and reliably, at a fair price." },
  { question: "How does SabiGuy work?", answer: "Request the service you need and choose a provider, or let SabiGuy find one nearby. You can see the price, track progress and confirm when the job is completed." },
  { question: "What services can I request on SabiGuy?", answer: "Find dispatch and delivery services, everyday errands, beauty and personal care, and services for your home. Available services depend on your location." },
  { question: "Are SabiGuy service providers verified?", answer: "Providers go through a verification process before joining the platform. This may include identity checks and documentation review." },
  { question: "How is pricing determined?", answer: "Pricing depends on the service, location and provider. You’ll see the amount to pay before confirming your booking." },
];

export default function LandingFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 md:grid-cols-[0.8fr_1fr] md:gap-20 lg:px-20">
        <h2 id="faq-heading" className="max-w-[440px] text-3xl font-bold leading-[1.2] text-[#292929] md:text-[42px]">Frequently Asked<br className="hidden md:block" /> Questions</h2>
        <div>
          {faqs.map((faq, index) => <div key={faq.question} className="border-b border-[#E6E6E6]">
            <h3><button type="button" id={`faq-question-${index}`} aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-start justify-between gap-5 py-6 text-left text-base font-medium text-[#333333] hover:text-[#347B54] focus-visible:outline-2 focus-visible:outline-[#347B54]">
              {faq.question}{open === index ? <ChevronUp size={18} className="shrink-0 text-[#777777]" /> : <ChevronDown size={18} className="shrink-0 text-[#777777]" />}
            </button></h3>
            <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={open !== index}><p className="pb-7 text-sm leading-relaxed text-[#777777]">{faq.answer}</p></div>
          </div>)}
        </div>
      </div>
    </section>
  );
}
