import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    label: "INDEPENDENT PROVIDERS", title: "Work for yourself",
    description: "Barbers, stylists, therapists, nail techs and riders who want steady jobs on their own terms.",
    features: ["Your profile visible to customers", "Set your own prices, hours and travel distance", "Keep 90% of every booking, plus all tips", "Wallet with withdrawals to your bank"],
    cta: "Join as a provider", href: "/service-provider/signup",
  },
  {
    label: "BUSINESS OWNERS", title: "Run your shop from one dashboard",
    description: "Take bookings for walk-ins and home visits, and send the right person every time.",
    features: ["Add your staff and set what each can do", "Accept requests and assign available staff", "See staff on live map"],
    cta: "Register your business", href: "/business-provider/signup", featured: true,
  },
  {
    label: "FLEET OWNERS", title: "Put your bikes and riders to work",
    description: "For dispatch companies and anyone with vehicles on the road.",
    features: ["Add riders and vehicles under one account", "Track every delivery as it happens", "Earnings per rider and per bike, every day"],
    cta: "Register your fleet", href: "/business-provider/signup",
  },
];

function StaffPreview() {
  const staff = [
    { name: "Tunde Adeyemi", avatar: "/home/adebayo.png" },
    { name: "Phil Crook", avatar: "/home/funke.png" },
    { name: "Samuel Okafor", avatar: "/home/emeka.png", unavailable: true },
  ];
  return (
    <div aria-hidden="true" className="absolute bottom-2 right-0 z-10 w-[53%] max-w-[210px] rounded-md border border-[#E5E3DC] bg-[#FFFCF5] p-2 text-[7px] text-[#444444] shadow-lg">
      <p className="font-semibold">Assign haircut</p>
      <p className="mt-0.5 text-[6px] text-[#888888]">Daniel Okon ? Tomorrow, 1:00 pm ? Addo Rd, Ajah</p>
      <div className="mt-2 space-y-1.5">
        {staff.map((person) => <div key={person.name} className="flex items-center gap-1 rounded border border-[#E8E6E0] p-1">
          <img src={person.avatar} alt="" className="h-4 w-4 rounded-full object-cover" />
          <span className="min-w-0 flex-1 truncate">{person.name}</span>
          <span className={`rounded-sm px-1 py-0.5 text-[5px] ${person.unavailable ? "bg-[#EEEDE9] text-[#C5C4C0]" : "bg-[#347B54] text-white"}`}>Assign</span>
        </div>)}
      </div>
    </div>
  );
}

function BenefitCard({ item }) {
  const independent = item.label === "INDEPENDENT PROVIDERS";
  const fleet = item.label === "FLEET OWNERS";
  return (
    <article className={`flex min-w-0 flex-col overflow-hidden rounded-[18px] border px-5 pb-5 pt-6 shadow-[0_4px_24px_#00000008] lg:min-h-[520px] ${item.featured ? "border-[#172B21] bg-[#172B21] text-white" : "border-[#DDDDDD] bg-white text-[#292929]"}`}>
      <p className={`text-xs font-semibold ${item.featured ? "text-[#F5AC50]" : "text-[#347B54]"}`}>{item.label}</p>
      <h3 className="mt-5 text-2xl font-semibold leading-[1.35]">{item.title}</h3>
      <p className={`mt-4 text-base leading-[1.4] ${item.featured ? "text-white/85" : "text-[#777777]"}`}>{item.description}</p>
      <div className={`relative mb-7 min-h-[205px] ${item.featured ? "mt-4 flex-1" : "mt-10"}`}>
        <ul className="space-y-2">
          {item.features.map((feature, index) => (
            <li key={feature} style={independent ? { marginLeft: `${index * 8 - 8}px`, width: "calc(100% + 44px)", borderColor: `rgb(52 123 84 / ${0.8 - index * 0.2})` } : item.featured ? { marginLeft: `${[6, -14, -4][index]}px` } : undefined}
              className={`flex min-h-10 items-center gap-2 rounded-lg border px-4 py-2 text-sm leading-relaxed lg:text-base ${item.featured ? `${index === 0 ? "border-[#347B54]" : "border-white/75"} text-white/75` : "border-[#E4E2DF] text-[#444444]"}`}>
              {fleet && <Check size={18} className="shrink-0 text-[#246B60]" />}
              <span>{feature}{independent && index === 0 && <span className="ml-2 inline-block rounded-full bg-[#DCEEE9] px-2.5 py-1 align-middle text-[10px] font-semibold text-[#246B60]">Verified</span>}</span>
            </li>
          ))}
        </ul>
        {item.featured && <StaffPreview />}
        {independent && <div aria-hidden="true" className="pointer-events-none absolute -bottom-7 -left-5 -right-5 h-16 overflow-hidden border-y border-[#EDF1EF] bg-white/85 px-2 pt-3 text-sm text-[#C9D1CC] backdrop-blur-[2px]"><span className="blur-[2px]">Wallet with withdrawals to your bank</span></div>}
      </div>
      <Link to={item.href} className={`relative mt-auto flex min-h-[52px] items-center justify-center rounded-lg px-3 py-3 text-center text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#347B54] ${item.featured ? "bg-[#F7931E] text-[#172B21] hover:bg-[#E88512]" : "bg-[#347B54] text-white hover:bg-[#286642]"}`}>{item.cta}</Link>
    </article>
  );
}

export default function LandingBenefits() {
  return (
    <section aria-labelledby="landing-benefits-heading" className="bg-[#F7FAF8] py-16 md:py-24 lg:pt-[98px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="flex w-full max-w-[730px] flex-col gap-5 lg:h-[207px]">
          <p className="text-sm font-semibold tracking-wide text-[#347B54]">WHY SABIGUY</p>
          <h2 id="landing-benefits-heading" className="text-3xl font-bold leading-[1.2] tracking-tight text-[#292929] md:text-[46px]">More convenience, less stress.<br />Whether you work alone or run a team.</h2>
        </div>
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-10">
          {benefits.map((item) => <BenefitCard key={item.label} item={item} />)}
        </div>
      </div>
    </section>
  );
}
