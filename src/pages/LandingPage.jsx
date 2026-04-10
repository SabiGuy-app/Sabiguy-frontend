import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "../components/LandingFooter";

const LandingPage = () => {
  const [active, setActive] = useState("providers");
  const content = tabs[active];
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const goTo = (index) => {
    setCurrent((index + slides.length) % slides.length);
  };

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  useEffect(() => {
    timerRef.current = setInterval(next, AUTOSLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const AUTOSLIDE_INTERVAL = 4000;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <nav className="w-full bg-white h-20 flex items-center border-b border-gray-50 sticky top-0 z-50 shadow-md">
        <div className="max-w-[90%] mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex-shrink-0">
            <img src="/logo.jpg" alt="SabiGuy" className="h-9 w-auto" />
          </div>

          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-10">
              <a
                href="/welcome"
                className="text-[#1A1A1A] font-medium hover:text-[#4F8461] transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-[#1A1A1A] font-medium hover:text-[#4F8461] transition-colors"
              >
                Support
              </a>
            </div>

            <div className="flex items-center gap-8 ml-4">
              <a
                href="/login"
                className="text-[#1A1A1A] font-medium hover:text-[#4F8461] transition-colors"
              >
                Login
              </a>
              <a
                href="/welcome"
                className="bg-[#4F8461] text-white px-8 py-2.5 rounded-full font-medium hover:bg-[#3e694d] transition-all shadow-sm"
              >
                Sign up
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <div
          className={`absolute top-20 left-0 w-full bg-white border-b shadow-md md:hidden transition-all duration-300 overflow-hidden ${isOpen ? "max-h-64 py-8" : "max-h-0"}`}
        >
          <div className="flex flex-col items-center gap-6">
            <a
              href="/welcome"
              className="font-medium text-[#1A1A1A]"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href="#"
              className="font-medium text-[#1A1A1A]"
              onClick={() => setIsOpen(false)}
            >
              Support
            </a>
            <a
              href="/login"
              className="font-medium text-[#1A1A1A]"
              onClick={() => setIsOpen(false)}
            >
              Login
            </a>
            <a
              href="/welcome"
              className="bg-[#4F8461] text-white px-10 py-2.5 rounded-full font-medium"
            >
              Sign up
            </a>
          </div>
        </div>
      </nav>

      {/* hero section  */}
      <section className="relative w-full bg-[#fafffc] pt-12 md:pt-20 pb-0 overflow-hidden">
        <div className="w-[90%] mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-[40%] z-10 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-3xl md:text-[65px] font-bold tracking-tight text-[#1A1A1A] leading-[1.1] mb-6">
              Need Something <br />
              Done Quickly? <br />
              <span className="text-[#005823]">Get a SabiGuy.</span>
            </h1>

            <p className="text-[#231F20BF] text-lg md:text-[20px] mb-8 leading-relaxed">
              Send packages, run errands, and find quick & reliable help near
              you at fair prices.
            </p>

            <div className="grid grid-cols-3 gap-y-4 gap-x-2 mb-10 md:mx-0">
              {checkmarks.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-[#2A3349] font-medium"
                >
                  <CircleCheckBig
                    className="w-5 h-5 text-[#31784D]"
                    strokeWidth={3}
                  />
                  <span className="text-sm md:text-[16px] text-[#231F20]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to={"/welcome"}
                className="bg-[#31784D] text-[20px] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#255d3b] transition-all shadow-lg shadow-green-900/10"
              >
                Request a SabiGuy
              </Link>
              <Link
                to={"/signup"}
                className="bg-white text-[20px] text-[#2A3349] border-2 border-gray-100 px-10 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Become a SabiGuy
              </Link>
            </div>
          </div>

          <div className="w-full md:w-[40%] relative flex justify-center items-end self-end">
            <img
              src="/home/hero.png"
              alt="SabiGuy Service Provider"
              className="relative z-10 w-full max-w-lg object-contain"
            />
          </div>
        </div>
      </section>

      <section className="py-12 bg-white text-center font-sans">
        <h2 className="text-[20px] md:text-xl mb-12 px-4">
          Trusted by individuals and businesses across major Nigerian cities.
        </h2>

        <div className="flex flex-wrap justify-center items-center max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex-1 min-w-[200px] px-6 py-4 
              ${index !== stats.length - 1 ? "border-r border-[#00000066]/40" : ""} 
              max-sm:border-r-0 max-sm:border-b max-sm:last:border-b-0`}
            >
              <div className="text-[40px] font-medium text-black mb-2">
                {stat.number}
              </div>
              <div className="text-[18px] font-semibold tracking-wider text-black uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="md:w-[90%] mx-auto px-10">
          <div className="text-center mb-16 w-[90%] md:w-[55%] m-auto">
            <h2 className="text-[35px] md:text-[42px] font-bold text-gray-900 mb-3">
              What People Can Do With{" "}
              <span className="text-[#005823]">SabiGuy</span>
            </h2>
            <p className="md:text-[20px] text-[#231F20BF]/[.75] leading-relaxed">
              SabiGuy offers everything you need to get work done in one place.
              Get connected to reliable professionals near you.
            </p>
          </div>

          <div className="space-y-10">
            {services.map((service, index) => (
              <div
                key={index}
                className={`md:flex items-center gap-16 space-y-10 ${
                  service.imgSide === "left" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="flex-1">
                  <h3 className="text-[36px] font-bold text-[#231F20] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[16px] text-[#231F20BF]/70 leading-relaxed mb-1">
                    {service.desc}
                  </p>

                  <p className="text-[16px] text-[#231F20BF]/70 leading-relaxed mb-6">
                    {service.desc2}
                  </p>

                  <ul className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8">
                    {service.checks.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-[#231F20]"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#32784E] flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 12 12"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button className="bg-[#005823CC] hover:bg-green-700 text-white text-[20px] font-bold px-5 py-3 rounded-[5px] transition-colors">
                    {service.cta}
                  </button>
                </div>

                <div className="flex-1">
                  <img
                    src={service.imgSrc}
                    alt={service.title}
                    className="w-full h-[544px] object-cover rounded-[26px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{ backgroundImage: `url("/home/works.png")` }}
        className="bg-white py-20"
      >
        <div className="w-[90%] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[42px] font-bold text-[#231F20]">
              How SabiGuy Works
            </h2>
            <p className="text-[20px] text-[#231F20BF]/[.75]">
              Get started in simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden">
            {steps.map((step, index) => {
              return (
                <div
                  key={index}
                  className="p-8 border-3 border-[#2A334933]/20 rounded-[12px] hover:bg-[#F0FDF4]"
                >
                  <div className="w-8 h-8 bg-[#31784D] rounded-[5px] flex items-center justify-center mb-5">
                    <img src={step.image} className="w-5 h-5 text-white" />
                  </div>

                  <h4 className="text-[20px] font-bold text-[#2A3349] mb-2 leading-snug">
                    {step.title}
                  </h4>

                  <p className="text-[13px] text-[#2A3349BF]/[.75] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* why choose sabiguy  */}
      <section className="py-16 bg-white">
        <div className="max-w-[90%] mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div className="lg:w-[40%]">
              <h2 className="text-[42px] font-bold text-[#231F20]">
                Why Choose <span className="text-[#005823CC]">SabiGuy</span>
              </h2>
              <p className="text-[20px] text-[#231F20BF] mt-1 leading-relaxed">
                SabiGuy is your go-to platform for everything you need done
                timely, conveniently, and at fair pricing.
              </p>
            </div>

            <div className="lg:flex items-center gap-2 mt-1 hidden">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition-colors text-gray-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition-colors text-gray-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${current * 85}% - ${current * 16}px))`,
              }}
            >
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    width: "90%",
                    height: "600px",
                    // marginRight: "16px",
                  }}
                  onClick={() => goTo(i)}
                >
                  <img
                    src={slide.imgSrc}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-green-600" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* sabiguy for everyone  */}
      <section className="py-16 bg-white">
        <div className="w-[90%] mx-auto">
          <div className="lg:flex items-center justify-between mb-6">
            <h2 className="text-[35px] font-bold text-gray-900">
              SabiGuy for everyone
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-2 rounded-[20px] border border-green-600 overflow-hidden text-sm font-semibold">
              <button
                onClick={() => setActive("providers")}
                className={`w-full px-5 py-3 transition-colors ${
                  active === "providers"
                    ? "bg-[#005823CC] text-white"
                    : "bg-white text-gray-700 hover:bg-green-50"
                }`}
              >
                For Service Providers
              </button>

              <button
                onClick={() => setActive("businesses")}
                className={`w-full px-5 py-3 transition-colors ${
                  active === "businesses"
                    ? "bg-[#005823CC] text-white"
                    : "bg-white text-gray-700 hover:bg-green-50"
                }`}
              >
                For Businesses
              </button>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[32px] px-10 py-20 text-center text-white bg-cover bg-center"
            style={{
              backgroundImage: `url('/home/providers.png')`,
            }}
          >
            <div className="relative z-10 lg:w-[60%] m-auto">
              <h3 className="text-[60px] font-bold mb-3">{content.heading}</h3>
              <p className="text-green-100 text-[20px] leading-relaxed mb-8">
                {content.subheading}
              </p>
            </div>

            <div className="relative z-10 lg:w-[40%] m-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mb-8">
              {content.perks.map((perk, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 text-sm text-green-100"
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {perk}
                </span>
              ))}
            </div>

            <Link
              to={"/welcome"}
              className="relative z-10 inline-block bg-white text-[#231F20CC] font-bold text-[20px] px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              {content.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* trusted  */}
      <section className="py-16 bg-white">
        <div className="w-[90%] mx-auto">
          <h2 className="text-[28px] lg:text-[42px] font-bold text-gray-900 text-center mb-10">
            Trusted by individuals and businesses.
          </h2>

          <div className="grid lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="border border-[#231F2040]/[.25] rounded-[16px] py-6 px-8"
              >
                <span className="text-green-600 text-3xl font-black leading-none block mb-3">
                  "
                </span>

                <p className="text-[16px] text-[#231F20BF]/[.75] leading-relaxed mb-6">
                  {t.text}
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-600 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs font-bold">
                        {t.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-[#231F20]">
                      {t.name}
                    </p>
                    <p className="text-[14px] text-[#231F20BF]/[.75]">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App  */}
      <section className="bg-[#23703a] overflow-hidden my-10 ">
        <div className="w-[90%] m-auto flex flex-col justify-between md:flex-row">
          <div className="lg:w-[40%] text-white z-10 py-16">
            <h2 className="text-[30px] md:text-[42px] font-bold mb-2 leading-tight">
              Get Things Done Faster with the SabiGuy App
            </h2>
            <p className="text-[16px] opacity-90 max-w-xl mb-20 leading-relaxed">
              From dispatch deliveries to everyday errands, SabiGuy connects you
              with trusted providers nearby. Download the app and book services
              anytime, anywhere.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black p-3 lg:px-6 lg:py-3 rounded-full flex items-center gap-3 hover:bg-gray-100 transition-all"
              >
                <img
                  src="/home/apple.png"
                  alt="Apple Store logo"
                  className="w-6 h-6"
                />
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase">Download on the</div>
                  <div className="text-xl font-bold">App Store</div>
                </div>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black p-3 lg:px-6 lg:py-3 rounded-full flex items-center gap-3 hover:bg-gray-100 transition-all"
              >
                <img
                  src="/home/playstore.png"
                  alt="Play Store logo"
                  className="w-6 h-6"
                />
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase">GET IT ON</div>
                  <div className="text-xl font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          <div className="md:w-2/5 mt-12 md:mt-0 flex justify-end">
            <img
              src="/home/hand.png"
              alt="SabiGuy App on Phone"
              className="w-full max-w-md object-contain transform md:translate-y-12"
            />
          </div>
        </div>
      </section>

      {/* faq  */}
      <section className="w-[90%] m-auto lg:flex justify-between my-20">
        <h2 className=" text-[28px] lg:text-[35px] text-[#231F20] font-bold w-[70%] lg:w-[30%]">
          Frequently Asked Questions
        </h2>
        <div className="md:w-[60%]">
          <div className="border-t border-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center py-6 text-left focus:outline-none group"
                >
                  <span className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-500" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{ backgroundImage: `url("/home/network.png")` }}
        className="relative h-[500px] flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      >
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h2 className="text-xl md:text-[42px] font-bold text-white mb-8 leading-snug">
            Join the growing network of people and businesses using SabiGuy to
            get things done every day.
          </h2>

          <div className="grid grid-cols-2 justify-center gap-4">
            <Link
              to={"/service-provider/signup"}
              className="bg-[#23703a] text-[14px] lg:text-[20px] text-white py-4 lg:px-8 lg:py-4 rounded-lg font-semibold hover:bg-[#1b562d] transition-all"
            >
              Request a SabiGuy
            </Link>
            <Link
              to={"/signup"}
              className="bg-white text-[14px] lg:text-[20px] text-gray-800 border border-gray-200 py-4 lg:px-8 lg:py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
              Become a SabiGuy
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;

const slides = [
  {
    imgSrc: "/home/slider1.png",
  },
  {
    imgSrc: "/home/slider2.png",
  },
  {
    imgSrc: "/home/slider3.png",
  },
  {
    imgSrc: "/home/slider4.png",
  },
  {
    imgSrc: "/home/slider5.png",
  },
];

const services = [
  {
    title: "Dispatch & Logistics",
    desc: "Send packages within and outside your city with trusted dispatch riders.",
    desc2: "This is perfect for:",
    checks: [
      "Same-Day Delivery",
      "Business logistics",
      "Sending and receiving documents",
      "Personal package delivery",
    ],
    cta: "Send a Package Now",
    imgSide: "right",
    imgSrc: "/home/logistics.png",
  },
  {
    title: "Quick Errands",
    desc: "Let a SabiGuy handle your everyday tasks.",
    desc2: "This is perfect for:",
    checks: [
      "Grocery pickups",
      "Instant cooking gas refills ",
      "Quick store runs",
      "Document drop-offs",
      "Personal errands",
    ],
    cta: "Send a SabiGuy on Errand",
    imgSide: "left",
    imgSrc: "/home/errand.png",
  },
  {
    title: "Home Services",
    desc: "Find skilled professionals to help with tasks around your home.",
    desc2: "This is perfect for services like:",
    checks: [
      "Plumbing",
      "Laundry & cleaning",
      "Electrical repairs",
      "Appliance fixes",
      "Fumigation",
    ],
    cta: "Find a SabiGuy Now",
    imgSide: "right",
    imgSrc: "/home/home.png",
  },
  {
    title: "Business Deliveries",
    desc: "Running a business? Manage deliveries without stress or dispatch rider headaches.",
    desc2: "This is perfect for:",
    checks: [
      "Bulk Deliveries",
      "Medication and food delivery",
      "Parcel pick-up and drop-off",
      "E-commerce product delivery",
    ],
    cta: "Get a SabiGuy",
    imgSide: "left",
    imgSrc: "/home/business.png",
  },
];

const checkmarks = [
  "Trusted providers",
  "Clear pricing",
  "Fast service",
  "Real-time updates",
];

const steps = [
  {
    image: "/home/request.png",
    title: "Request a Service",
    desc: "Visit the SabiGuy website, choose what you need, and submit a request.",
  },
  {
    image: "/home/matched.png",
    title: "Guaranteed Matching",
    desc: "SabiGuy connects you with a verified provider nearby.",
  },
  {
    image: "/home/tracked.png",
    title: "Track the Job",
    desc: "Follow progress in real time.",
  },
  {
    image: "/home/completed.png",
    title: "Job Completed",
    desc: "Your task gets done quickly and securely.",
  },
];

const stats = [
  { number: "500+", label: "OF ONLINE VENDORS" },
  { number: "200+", label: "RESTAURANTS" },
  { number: "50+", label: "PHARMACIES" },
  { number: "30+", label: "LOCAL BUSINESSES" },
];

const testimonials = [
  {
    text: "SabiGuy makes sending packages across Ibadan much easier.",
    name: "Adebayo O.",
    role: "Contractor",
    avatar: "/home/adebayo.png",
  },
  {
    text: "We use SabiGuy for daily deliveries and it saves us time.",
    name: "Toyin A.",
    role: "Business Owner",
    avatar: "/home/funke.png",
  },
  {
    text: "Joining SabiGuy helped me get more jobs and earn consistently.",
    name: "Emeka C.",
    role: "Service Provider",
    avatar: "/home/emeka.png",
  },
];

const tabs = {
  providers: {
    label: "For Service Providers",
    heading: "For Service Providers",
    subheading:
      "Turn Your Skills into Money. Join the SabiGUY network and access more job opportunities in your city.",
    perks: [
      "Flexible work schedule",
      "Fair earnings",
      "Fast payouts",
      "We handle verified customers",
    ],
    cta: "Become a SabiGuy",
  },
  businesses: {
    label: "For Businesses",
    heading: "For Businesses",
    subheading:
      "Reliable Dispatch Service for Growing Businesses. SabiGUY helps business owners save time and cost with quick and affordable delivery services.",
    perks: [
      "Instagram vendors",
      "Restaurants",
      "Retail stores",
      "Pharmacies",
      "E-commerce merchants",
    ],
    cta: "Partner with SabiGuy",
  },
};

const faqs = [
  {
    question: "What is SabiGuy?",
    answer:
      "SabiGuy is a platform that connects people and businesses with trusted local service providers. Whether you need to send a package, run an errand, or get a task done at home, SabiGuy helps you find someone nearby who can do it quickly and reliably at a fair price.",
  },
  {
    question: "How does SabiGuy work?",
    answer:
      "Simply open the SabiGuy website, request the service you need, and the platform will match you with a verified provider nearby. You'll see the estimated price, track the provider in real time, and receive confirmation when the job is completed.",
  },
  {
    question: "What services can I request on SabiGuy?",
    answer:
      "SabiGuy currently focuses on logistics and dispatch services, helping individuals and businesses move items quickly within Ibadan and its environs. The platform will expand to include errands, home services, and other everyday tasks soon.",
  },
  {
    question: "Are SabiGuy service providers verified?",
    answer:
      "Yes. Every provider on SabiGuy goes through a verification process before joining the platform. This may include identity checks, documentation review, and performance monitoring to ensure reliability and accountability.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Pricing is calculated based on factors like distance, service type, and task requirements. The estimated price is shown before the job starts, so you know what to expect. SabiGuy focuses on fair and transparent pricing with no hidden charges.",
  },
];
