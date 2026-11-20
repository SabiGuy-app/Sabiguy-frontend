import OptimizedImage from "./common/OptimizedImage";

const steps = [
  { image: "/home/request.png", title: "Request a Service", text: "Book what you need, fast and stress-free." },
  { image: "/home/matched.png", title: "Get Matched Instantly", text: "SabiGuy connects you with a verified provider nearby." },
  { image: "/home/tracked.png", title: "Track the Job", text: "Follow progress in real time." },
  { image: "/home/completed.png", title: "Job Completed", text: "Your task gets done quickly and securely." },
];

export default function LandingHowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="relative overflow-hidden bg-white py-16 text-[#292929] md:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -left-[10%] top-0 h-[450px] w-[120%] rotate-[-8deg] rounded-[50%] border border-[#347B54]/5" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="how-it-works-heading" className="landing-section-heading">How SabiGuy Works</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed md:text-lg">Book the person you trust, or let us find the nearest provider. You see who’s coming,<br className="hidden md:block" /> when they’ll arrive and what you’ll pay.</p>
        </div>
        <ol className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-14">
          {steps.map((step, index) => (
            <li key={step.title} className="relative text-center">
              {index < steps.length - 1 && (
                <span aria-hidden="true" className="absolute left-[calc(50%+76px)] top-14 hidden w-[calc(100%-96px)] -translate-y-1/2 items-center lg:flex">
                  <span className="flex-1 border-t-2 border-dotted border-[#D9DEDB]" />
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#347B54]" />
                  <span className="flex-1 border-t-2 border-dotted border-[#D9DEDB]" />
                </span>
              )}
              <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#347B54] md:h-28 md:w-28">
                <OptimizedImage src={step.image} alt="" className="h-12 w-12 object-contain" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[240px] text-sm leading-relaxed text-[#666666]">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
