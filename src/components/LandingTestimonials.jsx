import { Quote } from "lucide-react";
import OptimizedImage from "./common/OptimizedImage";

const testimonials = [
  { text: "SabiGuy makes sending packages across Ibadan much easier.", name: "Adebayo O.", role: "Customer (Dispatch)", avatar: "/home/adebayo.png" },
  { text: "SabiGuy makes sending packages across Ibadan much easier.", name: "Adebayo O.", role: "Customer", avatar: "/home/adebayo.png" },
  { text: "We use SabiGuy for daily deliveries and it saves us time.", name: "Funke A.", role: "Business Owner", avatar: "/home/funke.png" },
  { text: "Joining SabiGuy helped me get more jobs and earn consistently.", name: "Samuel C.", role: "Barber", avatar: "/home/emeka.png" },
];

export default function LandingTestimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-[linear-gradient(115deg,#F5F9F7,white,#F5F9F7)] py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <h2 id="testimonials-heading" className="landing-section-heading text-center text-[#292929]">Trusted by individuals and businesses.</h2>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => <figure key={item.role} className="flex min-w-0 flex-col rounded-xl border border-[#E2E8E4] bg-white px-5 py-7 lg:min-h-[244px]">
            <Quote size={24} className="fill-[#347B54] text-[#347B54]" aria-hidden="true" />
            <blockquote className="mb-8 mt-5 text-sm leading-relaxed text-[#777777]">{item.text}</blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              <OptimizedImage src={item.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <div><p className="text-sm font-semibold text-[#333333]">{item.name}</p><p className="mt-0.5 text-xs text-[#888888]">{item.role}</p></div>
            </figcaption>
          </figure>)}
        </div>
      </div>
    </section>
  );
}
