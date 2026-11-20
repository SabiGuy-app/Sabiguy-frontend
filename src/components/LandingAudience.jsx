import { useState } from "react";
import { BadgeCheck, CircleCheck, Clock3, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const audiences = {
  providers: {
    heading: "Turn Your Skills Into Opportunities",
    description: "Grow your business, reach more customers and earn by offering your services through the SabiGuy network.",
    perks: ["Flexible work schedule", "More customer reach", "Fast payouts", "More verified customers"],
  },
  users: {
    heading: "Get Things Done, The Easy Way.",
    description: "From booking trusted professionals to getting rides, errands and deliveries sorted, SabiGuy makes everyday life easier.",
    perks: ["Trusted Providers", "Easy Booking", "Everyday Convenience", "Service at your doorstep"],
  },
};

export default function LandingAudience({ onJoinProvider }) {
  const [active, setActive] = useState("providers");
  const content = audiences[active];
  return (
    <section aria-labelledby="landing-audience-heading" className="bg-white pb-20 md:pb-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <h2 id="landing-audience-heading" className="mb-10 text-3xl font-bold text-[#292929] md:text-[42px]">SabiGuy for everyone</h2>
        <div className="relative isolate overflow-hidden rounded-[28px] bg-[#347B54] px-6 py-16 text-center text-white md:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-40 -z-10 h-[360px] w-[560px] rotate-[35deg] rounded-[50%] bg-[linear-gradient(160deg,#2B8E55,transparent_75%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[380px] w-[640px] rotate-[35deg] rounded-[50%] bg-[linear-gradient(160deg,transparent_40%,#2B8E55)]" />
          <div role="tablist" aria-label="Who is SabiGuy for?" className="mx-auto mb-10 flex w-fit rounded-full bg-white/20 p-2"
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? "providers" : event.key === "End" ? "users" : active === "providers" ? "users" : "providers";
              setActive(next);
              document.getElementById(`audience-tab-${next}`).focus();
            }}>
            {[{ id: "providers", label: "For Providers" }, { id: "users", label: "For Users" }].map((tab) => <button key={tab.id} type="button" role="tab" id={`audience-tab-${tab.id}`} aria-controls="audience-panel" aria-selected={active === tab.id} tabIndex={active === tab.id ? 0 : -1} onClick={() => setActive(tab.id)} className={`rounded-full px-5 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${active === tab.id ? "bg-white text-[#347B54]" : "text-white/80 hover:text-white"}`}>{tab.label}</button>)}
          </div>
          <div role="tabpanel" id="audience-panel" aria-labelledby={`audience-tab-${active}`}>
            <h3 className="text-2xl font-bold leading-tight md:text-[38px]">{content.heading}</h3>
            <p className="mx-auto mt-4 max-w-[740px] text-sm leading-relaxed md:text-lg">{content.description}</p>
            <ul className="mx-auto mt-5 flex max-w-[700px] flex-wrap justify-center gap-x-5 gap-y-3 text-xs text-white/80 sm:text-sm">
              {content.perks.map((perk, index) => { const Icon = active === "users" ? CircleCheck : [Clock3, BadgeCheck, Wallet, BadgeCheck][index]; return <li key={perk} className={`inline-flex items-center justify-center gap-1.5 ${active === "users" && index === 3 ? "basis-full" : ""}`}><Icon size={14} />{perk}</li>; })}
            </ul>
            {active === "providers" ? <button type="button" onClick={onJoinProvider} className="mt-8 rounded-lg bg-white px-10 py-3 text-sm font-semibold text-[#333333] transition hover:bg-[#EAF3ED]">Join SabiGuy</button> : <Link to="/signup" className="mt-8 inline-block rounded-lg bg-white px-10 py-3 text-sm font-semibold text-[#333333] transition hover:bg-[#EAF3ED]">Explore Services</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
