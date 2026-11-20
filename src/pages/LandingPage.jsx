import { useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  CircleCheckBig,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import LandingHowItWorks from "../components/LandingHowItWorks";
import LandingBenefits from "../components/LandingBenefits";
import LandingWhyChoose from "../components/LandingWhyChoose";
import LandingAudience from "../components/LandingAudience";
import LandingTestimonials from "../components/LandingTestimonials";
import LandingFaq from "../components/LandingFaq";
import LandingJoinSection from "../components/LandingJoinSection";
import LandingFooter from "../components/LandingFooter";
import LandingServices from "../components/LandingServices";
import DownloadAppSection from "../components/DownloadAppSection";
import LandingChatbotWidget from "../components/LandingChatbotWidget";
import {
  fadeInUp,
  staggerContainer,
} from "../utils/animations";

import OptimizedImage from "../components/common/OptimizedImage";
import AccountTypeModal from "../components/AccountTypeModal";


// Animated Counter Component
const AnimatedCounter = ({ from = 0, to, duration = 2, start = true, resetKey = 0 }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!start) {
      setCount(from);
      return undefined;
    }

    let animationFrame;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(from + (to - from) * progress));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration, start, resetKey]);

  return <span>{count}</span>;
};

const LandingPage = () => {
  const hasStartedStatsAnimation = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [statsAnimationKey, setStatsAnimationKey] = useState(0);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  const closeMobileMenu = () => setIsOpen(false);

  const startStatsAnimation = () => {
    if (hasStartedStatsAnimation.current) return;
    hasStartedStatsAnimation.current = true;
    setStatsAnimationKey((key) => key + 1);
  };

  return (
    <div className="bg-white overflow-x-hidden w-full relative pt-16 md:pt-20">
      {/* Navigation */}
      <Motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed left-0 right-0 top-0 z-50 w-full bg-white transition-shadow duration-300 ${
          isScrolled ? "border-b border-gray-100 shadow-md" : "border-b border-gray-100"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
          <Motion.div whileHover={{ scale: 1.03 }} className="flex shrink-0 items-center">
            <Link
              to="/"
              onClick={closeMobileMenu}
              aria-label="Go to SabiGuy home"
              className="flex h-10 w-[118px] items-center overflow-hidden md:h-12 md:w-[136px]"
            >
              <img
                src="/logo.jpg"
                alt="SabiGuy"
                loading="eager"
                className="block"
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "136px",
                  maxHeight: "48px",
                  objectFit: "contain",
                }}
              />
            </Link>
          </Motion.div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-10 md:flex">
            <div className="flex items-center gap-10">
              <Motion.div whileHover={{ color: "#4F8461" }}>
                <Link
                  to="/"
                  className="text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#4F8461]"
                >
                  Home
                </Link>
              </Motion.div>
              <Motion.a
                whileHover={{ color: "#4F8461" }}
                href="#faq"
                className="text-[#1A1A1A] font-medium text-sm transition-colors"
              >
                Support
              </Motion.a>
            </div>

            <div className="flex items-center gap-8 ml-4 border-l border-gray-200 pl-4">
              <Motion.div whileHover={{ color: "#4F8461" }}>
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#4F8461]"
                >
                  Login
                </Link>
              </Motion.div>
              <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/welcome"
                  className="inline-flex items-center justify-center rounded-full bg-[#4F8461] px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3e694d]"
                >
                  Sign up
                </Link>
              </Motion.div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="z-50 -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4F8461] md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <Motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 top-16 z-50 w-full overflow-hidden border-b border-gray-100 bg-white shadow-md md:hidden"
        >
          <div className="flex flex-col items-center gap-2 px-4 py-5">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="w-full rounded py-3 text-center text-sm font-medium text-[#1A1A1A] hover:bg-gray-50"
            >
              Home
            </Link>
            <a
              href="#faq"
              onClick={closeMobileMenu}
              className="w-full rounded py-3 text-center text-sm font-medium text-[#1A1A1A] hover:bg-gray-50"
            >
              Support
            </a>
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="w-full rounded py-3 text-center text-sm font-medium text-[#1A1A1A] hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              to="/welcome"
              onClick={closeMobileMenu}
              className="mt-2 w-full rounded-full bg-[#4F8461] px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#3e694d]"
            >
              Sign up
            </Link>
          </div>
        </Motion.div>
      </Motion.nav>

      {/* Hero Section - Responsive */}
      <section className="relative w-full bg-[#fafffc] pt-8 md:pt-16 pb-0 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full md:w-[50%] z-10 text-center md:text-left"
          >
            <Motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-tight mb-4 md:mb-6"
            >
              Need Something <br className="hidden md:block" />
              Done Quickly? <br />
              <span className="text-[#005823]">Get a SabiGuy.</span>
            </Motion.h1>

            <Motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base lg:text-lg text-[#231F20BF] mb-6 md:mb-8 leading-relaxed"
            >
              Send packages, run errands, and find quick & reliable help near
              you at fair prices.
            </Motion.p>

            <Motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 mb-8 md:mb-10"
            >
              {checkmarks.map((item, index) => (
                <Motion.div
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
                </Motion.div>
              ))}
            </Motion.div>

            <Motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <Motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="bg-[#31784D] text-white px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-[#255d3b] transition-all shadow-lg shadow-green-900/10 inline-block w-full text-center text-sm md:text-base"
                >
                  Book a Service Now
                </Link>
              </Motion.div>
              <Motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  onClick={() => setIsOpenModal(true)}                  className="bg-white text-[#2A3349] border-2 border-gray-100 px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-gray-50 transition-all inline-block w-full text-center text-sm md:text-base"
                >
                  Start Earning Today
                </Link>
              </Motion.div>
            </Motion.div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full md:w-[50%] relative flex justify-center"
          >
            <OptimizedImage
              src="/home/hero.png"
              alt="SabiGuy Service Provider"
              className="w-full max-w-md md:max-w-full object-contain"
              priority={true}
            />

          </Motion.div>
        </div>
      </section>

      {/* Stats Section - Animated Counters */}
      <Motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onViewportEnter={startStatsAnimation}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 md:py-20 bg-white text-center"
      >
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-20">
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-10 md:mb-16"
          >
            {/* <span className="inline-block bg-[#E8F2EC] text-[#005823] text-xs md:text-sm font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
              Our Impact
            </span> */}
            <h2 className="max-w-3xl px-4 text-base font-medium leading-relaxed text-[#555555] md:text-xl">
              Trusted by individuals and businesses across major Nigerian cities.
            </h2>
          </Motion.div>

          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 py-6 md:grid-cols-4 md:py-8">
            {stats.map((stat, index) => (
              <Motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`relative w-full min-w-0 px-3 py-3 md:px-6 md:py-4 ${index % 2 === 0 ? "border-r border-[#E6E6E6]" : ""} ${index === 1 ? "md:border-r md:border-[#E6E6E6]" : ""}`}
              >
                <div
                  className="mb-2 flex items-center justify-center text-3xl font-bold text-[#347B54] md:text-[42px]"
                >
                  <AnimatedCounter
                    from={0}
                    to={parseInt(stat.number)}
                    duration={2}
                    start={statsAnimationKey > 0}
                    resetKey={statsAnimationKey}
                  />
                  {stat.number.includes("+") && (
                    <span className="ml-0.5">+</span>
                  )}
                </div>
                <div className="mt-3 break-words text-[10px] font-medium uppercase leading-relaxed tracking-wide text-[#777777] sm:text-xs md:text-sm">
                  {stat.label}
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </Motion.section>

      <LandingServices />

      <LandingHowItWorks />
      <LandingBenefits />
      <LandingWhyChoose />
      <LandingAudience onJoinProvider={() => setIsOpenModal(true)} />
      <LandingTestimonials />
      <DownloadAppSection />
      <LandingFaq />
      <LandingJoinSection onJoinProvider={() => setIsOpenModal(true)} />
      <LandingFooter variant="landing" />
      <AccountTypeModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      <LandingChatbotWidget />
    </div>
  );
};

export default LandingPage;

const checkmarks = [
  "Trusted providers",
  "Clear pricing",
  "Fast service",
  "Real-time updates",
];

const stats = [
  { number: "500+", label: "ONLINE VENDORS" },
  { number: "200+", label: "RESTAURANTS" },
  { number: "50+", label: "PHARMACIES" },
  { number: "30+", label: "LOCAL BUSINESSES" },
];

