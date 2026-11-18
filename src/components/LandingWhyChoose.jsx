import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import OptimizedImage from "./common/OptimizedImage";

const slides = [
  { src: "/home/african-cities-reference.png", title: "Built for African Cities", viewBox: "80 45 1060 588" },
  { src: "/home/slider2.png", title: "Verified Providers" },
  { src: "/home/slider3.png", title: "Transparent Pricing" },
  { src: "/home/slider4.png", title: "Fast Response" },
  { src: "/home/slider5.png", title: "Local Network" },
];

export default function LandingWhyChoose() {
  const track = useRef(null);
  const index = useRef(0);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const goTo = useCallback((next) => {
    const container = track.current;
    const slide = container?.children[next];
    if (!slide) return;
    container.scrollTo({ left: slide.offsetLeft - container.offsetLeft, behavior: reducedMotion ? "instant" : "smooth" });
  }, [reducedMotion]);

  useEffect(() => {
    if (paused || reducedMotion) return undefined;
    const timer = setInterval(() => goTo((index.current + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [goTo, paused, reducedMotion]);

  return (
    <section aria-labelledby="why-choose-heading" className="overflow-hidden bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div className="max-w-[620px]">
            <h2 id="why-choose-heading" className="text-3xl font-bold leading-tight text-[#292929] md:text-[42px]">Why Choose <span className="text-[#005823]">SabiGuy</span></h2>
            <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-[#777777] md:text-lg">SabiGuy is your go-to platform for everything you need done timely, conveniently, and at fair pricing.</p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button type="button" aria-label="Previous slide" onClick={() => goTo((current - 1 + slides.length) % slides.length)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D1D9D4] text-[#347B54] hover:bg-[#F0F7F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#347B54]"><ChevronLeft size={18} /></button>
            <button type="button" aria-label="Next slide" onClick={() => goTo((current + 1) % slides.length)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#347B54] text-white hover:bg-[#286642] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#347B54]"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div ref={track} role="region" aria-label="Why choose SabiGuy slides" aria-roledescription="carousel" tabIndex={0}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
          onScroll={() => {
            const container = track.current;
            const step = container.children[1].offsetLeft - container.children[0].offsetLeft;
            const next = Math.min(slides.length - 1, Math.round(container.scrollLeft / step));
            index.current = next;
            setCurrent(next);
          }}
          className="relative flex w-[calc(100%+1.5rem)] snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-[#347B54] sm:gap-8 lg:w-[calc(100%+5rem)] lg:gap-10 [&::-webkit-scrollbar]:hidden">
          {slides.map((slide, i) => <div key={slide.src} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}: ${slide.title}`} className="relative h-[240px] w-[88%] shrink-0 snap-start overflow-hidden rounded-[20px] sm:aspect-[1.8] sm:h-auto sm:w-[84%] lg:w-[1060px] lg:max-w-[calc(100vw-160px)] lg:rounded-[32px]">
            {slide.viewBox ? (
              // The Figma export includes the next card. Show only the first card,
              // using the original artwork without redrawing or changing its text.
              <svg viewBox={slide.viewBox} preserveAspectRatio="xMinYMid slice" role="img" aria-label={slide.title} className="block h-full w-full">
                <image href={slide.src} width="1440" height="674" />
              </svg>
            ) : (
              <OptimizedImage src={slide.src} alt={slide.title} className="block h-full w-full object-cover object-left sm:object-center" />
            )}
          </div>)}
        </div>
      </div>
    </section>
  );
}
