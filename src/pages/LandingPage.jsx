/* eslint-disable no-unused-vars */
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
  Play,
  Pause,
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
import { useNavigate } from "react-router-dom";
import OptimizedImage from "../components/common/OptimizedImage";


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
  const AUTOSLIDE_INTERVAL = 5000;
  const [active, setActive] = useState("providers");
  const content = tabs[active];
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const deviceType = useDeviceType();
  const navigate = useNavigate();
  const touchStartX = useRef(null);

  const goTo = (index) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length);
  };

  const prev = () => {
    setCurrent((value) => ((value - 1 + slides.length) % slides.length));
  };

  const next = () => {
    setCurrent((value) => ((value + 1) % slides.length));
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;
    const swipeThreshold = 40;

    if (Math.abs(distance) > swipeThreshold) {
      if (distance > 0) next();
      else prev();
    }

    touchStartX.current = null;
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrent((value) => ((value + 1) % slides.length));
      }, AUTOSLIDE_INTERVAL);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#31784D";
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <div className="bg-white overflow-x-hidden w-full relative pt-16 md:pt-20">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed left-0 right-0 top-0 z-50 w-full bg-white transition-shadow duration-300 ${
          isScrolled ? "border-b border-gray-100 shadow-md" : "border-b border-gray-100"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
          <motion.div whileHover={{ scale: 1.03 }} className="flex shrink-0 items-center">
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
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-10 md:flex">
            <div className="flex items-center gap-10">
              <motion.div whileHover={{ color: "#4F8461" }}>
                <Link
                  to="/"
                  className="text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#4F8461]"
                >
                  Home
                </Link>
              </motion.div>
              <motion.a
                whileHover={{ color: "#4F8461" }}
                href="#faq"
                className="text-[#1A1A1A] font-medium text-sm transition-colors"
              >
                Support
              </motion.a>
            </div>

            <div className="flex items-center gap-8 ml-4 border-l border-gray-200 pl-4">
              <motion.div whileHover={{ color: "#4F8461" }}>
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#1A1A1A] transition-colors hover:text-[#4F8461]"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/welcome"
                  className="inline-flex items-center justify-center rounded-full bg-[#4F8461] px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3e694d]"
                >
                  Sign up
                </Link>
              </motion.div>
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
        <motion.div
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
              className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-tight mb-4 md:mb-6"
            >
              Need Something <br className="hidden md:block" />
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
                  to="/signup"
                  className="bg-[#31784D] text-white px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-[#255d3b] transition-all shadow-lg shadow-green-900/10 inline-block w-full text-center text-sm md:text-base"
                >
                  Book a Service Now
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
                  Start Earning Today
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
            <OptimizedImage
              src="/home/hero.png"
              alt="SabiGuy Service Provider"
              className="w-full max-w-md md:max-w-full object-contain"
              priority={true}
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
        className="py-12 md:py-20 bg-white text-center"
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-10 md:mb-16"
          >
            {/* <span className="inline-block bg-[#E8F2EC] text-[#005823] text-xs md:text-sm font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
              Our Impact
            </span> */}
            <h2 className="text-xl md:text-2xl font-bold text-[#2A3349] max-w-2xl px-4 leading-snug">
              Trusted by individuals and businesses across major Nigerian cities.
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto bg-gradient-to-b from-white to-[#F9FBF9] border border-gray-100 rounded-2xl md:rounded-3xl shadow-xl shadow-green-900/5 px-4 md:px-6 py-8 md:py-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.03 }}
                className={`w-full px-4 md:px-6 py-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300 relative group
                ${index !== stats.length - 1 ? "lg:border-r border-gray-100" : ""}`}
              >
                <div
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#005823] mb-1 md:mb-2 flex items-center justify-center"
                >
                  <AnimatedCounter
                    from={0}
                    to={parseInt(stat.number)}
                    duration={2}
                  />
                  {stat.number.includes("+") && (
                    <span className="text-[#005823] ml-0.5 group-hover:scale-110 transition-transform duration-300">+</span>
                  )}
                </div>
                <div className="text-xs md:text-sm font-bold tracking-wider text-gray-500 uppercase mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
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
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center ${service.imgSide === "left"
                  ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
                  : ""
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

                  <ul className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
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
                    onClick={() => navigate(service.link)}
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
                  <OptimizedImage
                    src={service.imgSrc}
                    alt={service.title}
                    className="w-full h-auto md:h-80 lg:h-96 object-cover rounded-lg md:rounded-2xl"
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
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 auto-rows-fr"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-full p-4 md:p-6 bg-gradient-to-br from-[#31784D] to-[#255d3b] border border-[#255d3b] rounded-lg md:rounded-2xl shadow-md shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 relative group flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-lg flex items-center justify-center mb-3 md:mb-6 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                  <OptimizedImage src={step.image} className="w-5 h-5 md:w-6 md:h-6" />
                </div>

                <h4 className="text-base md:text-lg font-bold text-white mb-2 leading-snug">
                  {step.title}
                </h4>

                <p className="text-xs md:text-sm text-green-100/80 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Carousel Section - Responsive */}
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl text-center md:text-left"
            >
              <h2 className="mb-2 text-2xl font-bold leading-tight text-[#231F20] sm:text-3xl lg:text-4xl">
                Why Choose <span className="text-[#005823CC]">SabiGuy</span>
              </h2>
              <p className="text-sm leading-relaxed text-[#231F20BF] md:text-base">
                SabiGuy is your go-to platform for everything you need done
                timely, conveniently, and at fair pricing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="hidden items-center gap-2 md:flex"
            >
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:border-[#31784D] hover:text-[#31784D] focus:outline-none focus:ring-2 focus:ring-[#31784D]/30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:border-[#31784D] hover:text-[#31784D] focus:outline-none focus:ring-2 focus:ring-[#31784D]/30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          </div>

          <div className="relative">
            <div
              className="group relative min-h-[240px] overflow-hidden rounded-xl bg-gray-100 shadow-lg shadow-green-900/5 sm:min-h-0 md:rounded-2xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative h-[240px] w-full sm:h-auto sm:aspect-video lg:aspect-[1.81]">
                <motion.div
                  className="flex h-full transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${current * 100}%)`,
                  }}
                >
                  {slides.map((slide, i) => (
                    <div
                      key={slide.imgSrc}
                      className="relative h-full w-full flex-shrink-0 overflow-hidden"
                      aria-hidden={i !== current}
                    >
                      <motion.div
                        className="h-full w-full"
                        whileHover={deviceType !== "mobile" ? { scale: 1.015 } : {}}
                        transition={{ duration: 0.35 }}
                      >
                        <OptimizedImage
                          src={slide.imgSrc}
                          alt={`SabiGuy carousel slide ${i + 1}`}
                          className="h-full w-full"
                          priority={i === 0}
                        />
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-white shadow-none transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#31784D]/30 z-20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-white shadow-none transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#31784D]/30 z-20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute left-1/2 bottom-3 -translate-x-1/2 z-30">
                <div className="flex min-w-0 items-center gap-3 px-2 py-1">
                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === current}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === current ? "w-7 bg-[#31784D]" : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Responsive */}
      <section id="faq" className="w-full max-w-4xl mx-auto px-4 md:px-6 my-12 md:my-20 scroll-mt-24">
        <div className="text-center mb-8 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl text-[#231F20] font-bold"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full"
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
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;

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
    link: "/service-provider/signup",
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
    link: "/signup",
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
    link: "/signup",
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
    link: "/signup",
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
  { number: "500+", label: "ONLINE VENDORS" },
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
