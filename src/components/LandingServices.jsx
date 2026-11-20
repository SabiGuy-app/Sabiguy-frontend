import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import OptimizedImage from "./common/OptimizedImage";

const services = [
  {
    title: "Dispatch & Logistics",
    description: "Send packages within and outside your city with trusted dispatch riders. This is perfect for:",
    features: ["Same-day deliveries", "Business logistics", "Sending and receiving documents", "Personal package delivery"],
    image: "/home/logistics.png", cta: "Send a Package Now",
  },
  {
    title: "Business Deliveries",
    description: "Running a business? Manage deliveries without stress or dispatch rider headaches. This is perfect for:",
    features: ["Bulk delivery", "Medication and food delivery", "Parcel pick-up and drop-off", "E-commerce product delivery"],
    image: "/home/business.png", cta: "Get a SabiGuy",
  },
  {
    title: "Home Services",
    description: "Find skilled professionals to help with tasks around your home. This is perfect for services like:",
    features: ["Plumbing", "Laundry & cleaning", "Electrical repairs", "Appliance fixes", "Fumigation"],
    image: "/home/home.png", cta: "Find a SabiGuy Now",
  },
  {
    title: "Beauty & Personal Care",
    description: "Enjoy professional beauty and grooming services that help you look good and feel your best.",
    features: ["Barbing", "Hair dressing", "Makeup artist", "Manicure & pedicure"],
    image: "/home/beauty-personal-care.png", cta: "Request a SabiGuy",
  },
];

function ServiceRow({ service, imageOnLeft }) {
  return (
    <article className="grid min-w-0 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
      <div className={`min-w-0 ${imageOnLeft ? "md:order-2" : ""}`}>
        <h3 className="text-2xl font-bold leading-tight text-[#292929] lg:text-[36px]">{service.title}</h3>
        <p className="mt-4 max-w-[550px] text-sm leading-relaxed text-[#777777] md:text-base">{service.description}</p>
        <ul className="mt-6 grid grid-cols-1 gap-x-5 gap-y-3 min-[380px]:grid-cols-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex min-w-0 items-start gap-2 text-sm leading-relaxed text-[#555555]">
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#347B54]"><Check size={11} strokeWidth={3} className="text-white" /></span>
              {feature}
            </li>
          ))}
        </ul>
        <Link to="/signup" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-[#347B54] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#286642] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#347B54]">{service.cta}</Link>
      </div>
      <div className={`min-w-0 ${imageOnLeft ? "md:order-1" : ""}`}>
        <OptimizedImage src={service.image} alt={service.title} width={626} height={550} className="aspect-[626/550] w-full rounded-[20px] object-cover" />
      </div>
    </article>
  );
}

export default function LandingServices() {
  return (
    <section aria-labelledby="landing-services-heading" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="mb-12 max-w-[730px] md:mb-20">
          <p className="text-xs font-semibold tracking-wide text-[#347B54]">ONE APP. MANY HANDS.</p>
          <h2 id="landing-services-heading" className="mt-5 text-3xl font-bold leading-[1.1] tracking-normal text-[#292929] md:text-[42px]">Everything <span className="text-[#347B54]">SabiGuy</span><br />can do for you</h2>
          <p className="mt-5 max-w-[650px] text-sm leading-relaxed text-[#777777] md:text-base">From citywide deliveries to convenient home services, SabiGuy makes everyday life easier.</p>
        </div>
        <div className="space-y-14 md:space-y-20">
          {services.map((service, index) => <ServiceRow key={service.title} service={service} imageOnLeft={index % 2 === 1} />)}
        </div>
        <p className="mt-10 font-['Segoe_UI',sans-serif] text-center text-[24px] font-semibold not-italic leading-none tracking-normal text-[#347B54] md:mt-14">+ many more</p>
      </div>
    </section>
  );
}
