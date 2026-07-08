import AdBannerCarousel from "@/components/User/adBanner";

/**
 * Responsive promotional banner — optimized for mobile viewports.
 * Renders below the hero on small screens; hidden on md+ when a separate desktop slot is used.
 */
export default function MobileBanner({ banners, className = "" }) {
  if (!banners?.length) return null;

  return (
    <section
      className={`w-full bg-[#f1f3ff] px-3 py-4 sm:px-4 ${className}`}
      aria-label="Promotional banner"
    >
      <div className="max-w-[1280px] mx-auto rounded-xl overflow-hidden shadow-md border border-[#E2E8F0]">
        <AdBannerCarousel banners={banners} autoSlideInterval={5000} />
      </div>
    </section>
  );
}
