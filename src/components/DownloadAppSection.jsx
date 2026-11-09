import OptimizedImage from "./common/OptimizedImage";

function StoreDownloadButton({ store, href, icon, caption, iconClassName = "" }) {
  const className = "inline-flex h-[60px] w-[190px] shrink-0 items-center justify-center gap-3 rounded-full bg-white text-black transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-[72px] sm:w-[228px]";
  const content = (
    <>
      <OptimizedImage src={icon} alt="" width={36} height={40}
        className={`h-9 w-8 object-contain sm:h-10 sm:w-9 ${iconClassName}`} />
      <span className="text-left font-[Arial,sans-serif]">
        <span className="block text-xs leading-none sm:text-sm">{caption}</span>
        <span className="block text-[23px] font-semibold leading-none tracking-[-0.8px] sm:text-[28px]">{store}</span>
      </span>
    </>
  );

  return (
    <a href={href} aria-label={`Download on ${store}`} className={className}>
      {content}
    </a>
  );
}

export default function DownloadAppSection() {
  return (
    <section aria-labelledby="download-app-heading"
      className="relative isolate w-full overflow-hidden bg-[linear-gradient(105deg,#43B274_0%,#1B5235_100%)] text-white">
      <div className="relative mx-auto w-full max-w-[1440px] px-6 pt-12 sm:px-10 lg:min-h-[528px] lg:px-20 lg:pb-24 lg:pt-[120px]">
        <div className="relative z-10 lg:w-[58%]">
          <h2 id="download-app-heading" className="text-[30px] font-semibold leading-[1.2] tracking-[-0.4px] sm:text-4xl lg:text-[42px]">
            Get Things Done Faster<br />
            with the SabiGuy App
          </h2>
          <p className="mt-4 max-w-[600px] text-sm leading-[1.4] text-white/90 sm:text-base">
            From dispatch deliveries to everyday errands, SabiGuy connects you with trusted
            providers nearby. Download the app and book services anytime, anywhere.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 sm:gap-6 lg:mt-[84px]">
            <StoreDownloadButton store="App Store" caption="Download on the"
              icon="/home/apple.png" iconClassName="brightness-0"
              href="https://apps.apple.com/ng/app/sabiguy/id6823533596" />
            <StoreDownloadButton store="Google Play" caption="GET IT ON"
              icon="/home/playstore.png"
              href="https://play.google.com/store/apps/details?id=com.sabiguy.mobile" />
          </div>
        </div>
        <OptimizedImage src="/home/hand.png" alt="A hand holding a phone displaying SabiGuy delivery tracking"
          width={1710} height={1464}
          className="relative ml-auto mt-4 block h-auto w-full max-w-[450px] lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[550px] lg:max-w-[42%]" />
      </div>
    </section>
  );
}
