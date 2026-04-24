import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "../components/LandingFooter";
import {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  slideIn,
  float,
  pulse,
} from "../utils/animations";

// Animated Counter Component
const AnimatedCounter = ({ from = 0, to, duration = 2 }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(from + (to - from) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [from, to, duration]);

  return <span>{count}</span>;
};

// Hook for detecting device type
const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setDeviceType("mobile");
      else if (width < 1024) setDeviceType("tablet");
      else setDeviceType("desktop");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType;
};

const LandingPage = () => {
  const [active, setActive] = useState("providers");
  const content = tabs[active];
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const deviceType = useDeviceType();

  const goTo = (index) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length);
  };

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  useEffect(() => {
    timerRef.current = setInterval(next, AUTOSLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [current]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const AUTOSLIDE_INTERVAL = 4000;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full h-16 md:h-20 flex items-center sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white border-b border-gray-50 shadow-md"
            : "bg-white border-b border-gray-50"
        }`}
      >
        <div className="w-full px-4 md:px-6 flex items-center justify-between max-w-7xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <img src="/logo.jpg" alt="SabiGuy" className="h-8 md:h-9 w-auto" />
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-10">
              <motion.a
                whileHover={{ color: "#4F8461" }}
                href="/"
                className="text-[#1A1A1A] font-medium text-sm transition-colors"
              >
                Home
              </motion.a>
              <motion.a
                whileHover={{ color: "#4F8461" }}
                href="#"
                className="text-[#1A1A1A] font-medium text-sm transition-colors"
              >
                Support
              </motion.a>
            </div>

            <div className="flex items-center gap-8 ml-4 border-l border-gray-200 pl-4">
              <motion.a
                whileHover={{ color: "#4F8461" }}
               href="/login"
                className="text-[#1A1A1A] font-medium text-sm transition-colors"
              >
                Login
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/welcome"
                className="bg-[#4F8461] text-white px-6 md:px-8 py-2.5 rounded-full font-medium hover:bg-[#3e694d] transition-all shadow-sm text-sm"
              >
                Sign up
              </motion.a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 p-2 -mr-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 w-full bg-white border-b shadow-md md:hidden overflow-hidden"
        >
          <div className="flex flex-col items-center gap-4 py-6 px-4">
            <a href="/" className="font-medium text-[#1A1A1A] text-sm">
              Home
            </a>
            <a href="#" className="font-medium text-[#1A1A1A] text-sm">
              Support
            </a>
            <a href="/login" className="font-medium text-[#1A1A1A] text-sm">
              Login
            </a>
            <motion.a
              whileTap={{ scale: 0.95 }}
              href="/welcome"
             className="bg-[#4F8461] text-white w-full px-6 py-2.5 rounded-full font-medium text-sm flex items-center justify-center"
            >
              Sign up
            </motion.a>
          </div>
        </motion.div>
      </motion.nav>

      {/* Hero Section - Responsive */}
      <section className="relative w-full bg-[#fafffc] pt-8 md:pt-16 pb-0 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full md:w-[50%] z-10 text-center md:text-left"
          >
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-tight mb-4 md:mb-6"
            >
              Need Something <br />
              Done Quickly? <br />
              <span className="text-[#005823]">Get a SabiGuy.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base lg:text-lg text-[#231F20BF] mb-6 md:mb-8 leading-relaxed"
            >
              Send packages, run errands, and find quick & reliable help near
              you at fair prices.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 mb-8 md:mb-10"
            >
              {checkmarks.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-center gap-2"
                >
                  <CircleCheckBig
                    className="w-4 h-4 md:w-5 md:h-5 text-[#31784D] flex-shrink-0"
                    strokeWidth={3}
                  />
                  <span className="text-xs md:text-sm text-[#231F20]">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/welcome"
                  className="bg-[#31784D] text-white px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-[#255d3b] transition-all shadow-lg shadow-green-900/10 inline-block w-full text-center text-sm md:text-base"
                >
                  Request a SabiGuy
                </Link>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/service-provider/signup"
                  className="bg-white text-[#2A3349] border-2 border-gray-100 px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-gray-50 transition-all inline-block w-full text-center text-sm md:text-base"
                >
                  Become a SabiGuy
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full md:w-[50%] relative flex justify-center"
          >
            <img
              src="/home/hero.png"
              alt="SabiGuy Service Provider"
              className="w-full max-w-md md:max-w-full object-contain"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Animated Counters */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-8 md:py-12 bg-white text-center"
      >
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-base md:text-lg mb-8 md:mb-12 px-4"
        >
          Trusted by individuals and businesses across major Nigerian cities.
        </motion.h2>

        <div className="flex flex-wrap justify-center items-center max-w-6xl mx-auto px-4 md:px-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`flex-1 min-w-[150px] md:min-w-[200px] px-4 md:px-6 py-4 
              ${index !== stats.length - 1 ? "border-r border-gray-200" : ""} 
              max-sm:border-r-0 max-sm:border-b max-sm:last:border-b-0`}
            >
              <motion.div
                whileInView={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-1 md:mb-2"
              >
                <AnimatedCounter from={0} to={parseInt(stat.number)} duration={2} />
              </motion.div>
              <div className="text-xs md:text-sm lg:text-base font-semibold tracking-wide text-black uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Services Section - Responsive Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16 w-full md:w-[70%] mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
              What People Can Do With{" "}
              <span className="text-[#005823]">SabiGuy</span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-[#231F20BF] leading-relaxed">
              SabiGuy offers everything you need to get work done in one place.
              Get connected to reliable professionals near you.
            </p>
          </motion.div>

          <motion.div
            className="space-y-8 md:space-y-10"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-50px" }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center ${
                  service.imgSide === "left" ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
                }`}
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    x: service.imgSide === "left" ? 50 : -50,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#231F20] mb-2 md:mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#231F20BF] leading-relaxed mb-1">
                    {service.desc}
                  </p>
                  <p className="text-sm md:text-base text-[#231F20BF] leading-relaxed mb-4 md:mb-6">
                    {service.desc2}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
                    {service.checks.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 text-xs md:text-sm text-[#231F20]"
                      >
                        <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#32784E] flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-2 h-2 md:w-2.5 md:h-2.5 text-white"
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
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#005823CC] hover:bg-green-700 text-white text-sm md:text-base font-bold px-4 md:px-5 py-2 md:py-3 rounded transition-colors w-full sm:w-auto"
                  >
                    {service.cta}
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{
                    opacity: 0,
                    x: service.imgSide === "left" ? -50 : 50,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <img
                    src={service.imgSrc}
                    alt={service.title}
                    className="w-full h-auto md:h-80 lg:h-96 object-cover rounded-lg md:rounded-2xl"
                    loading="lazy"
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works - Responsive Grid */}
      <section className="bg-white py-12 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-14"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-[#231F20] mb-1 md:mb-2">
              How SabiGuy Works
            </h2>
            <p className="text-sm md:text-lg text-[#231F20BF]">
              Get started in simple steps
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="p-4 md:p-6 border-2 border-gray-200 rounded-lg md:rounded-xl hover:bg-[#F0FDF4] transition-colors"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#31784D] rounded flex items-center justify-center mb-3 md:mb-5">
                  <img src={step.image} className="w-3.5 h-3.5 md:w-5 md:h-5" />
                </div>

                <h4 className="text-base md:text-lg font-bold text-[#2A3349] mb-1 md:mb-2 leading-snug">
                  {step.title}
                </h4>

                <p className="text-xs md:text-sm text-[#2A3349BF] leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Carousel Section - Responsive */}
      <section className="py-12 md:py-16 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#231F20] mb-2 md:mb-3">
                Why Choose <span className="text-[#005823CC]">SabiGuy</span>
              </h2>
              <p className="text-sm md:text-base text-[#231F20BF] leading-relaxed">
                SabiGuy is your go-to platform for everything you need done
                timely, conveniently, and at fair pricing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center justify-end gap-2 hidden md:flex"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prev}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={next}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>

          <div className="overflow-hidden rounded-lg md:rounded-2xl">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${current * 100}%))`,
              }}
            >
              {slides.map((slide, i) => (
                <motion.div
                  key={i}
                  className="relative flex-shrink-0 w-full"
                  style={{ minHeight: deviceType === "mobile" ? "300px" : "400px" }}
                  whileHover={deviceType !== "mobile" ? { scale: 1.02 } : {}}
                >
                  <img
                    src={slide.imgSrc}
                    alt={`Slide ${i}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 mt-4 md:mt-5"
          >
            {slides.map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2 }}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-green-600" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Rest of the sections follow similar responsive patterns... */}
      {/* Keeping the existing FAQ and other sections with responsive updates */}

      {/* FAQ Section - Responsive */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 my-12 md:my-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl text-[#231F20] font-bold"
          >
            Frequently Asked <br /> Questions
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="border-t border-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200">
                  <motion.button
                    whileHover={{ backgroundColor: "#f9f9f9" }}
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center py-4 md:py-6 text-left focus:outline-none group"
                  >
                    <span className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors pr-4">
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                      )}
                    </motion.span>
                  </motion.button>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: openIndex === index ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed pb-4 md:pb-6">
                      {faq.answer}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;

// ...existing data arrays...
const slides = [
  { imgSrc: "/home/slider1.png" },
  { imgSrc: "/home/slider2.png" },
  { imgSrc: "/home/slider3.png" },
  { imgSrc: "/home/slider4.png" },
  { imgSrc: "/home/slider5.png" },
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
      "Instant cooking gas refills",
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