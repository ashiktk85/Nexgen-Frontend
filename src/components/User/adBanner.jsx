"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdBannerCarousel({
  banners = [],
  autoSlideInterval = 5000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  const count = banners.length;
  const showNav = count > 1;
  const maxIndex = Math.max(0, count - 1);

  // Auto slide when 2+ banners
  useEffect(() => {
    if (!showNav || count === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [showNav, count, maxIndex, autoSlideInterval]);

  const goToSlide = (index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) goToNext();
    if (distance < -50) goToPrevious();
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (count === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={carouselRef}
        className="relative overflow-hidden w-full aspect-[2.2/1] sm:aspect-[4/1] max-h-[220px] sm:max-h-[300px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="h-full w-full flex-shrink-0 flex items-center justify-center"
              >
                <a
                  href={banner.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img
                    src={banner.imageUrl || "/placeholder.svg"}
                    alt={banner.altText || "Banner"}
                    className="w-full h-full object-cover"
                  />
                </a>
              </div>
            ))}
          </div>

          {showNav && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 transition-all"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 transition-all"
                aria-label="Next banner"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          {showNav && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    currentIndex === index
                      ? "bg-blue-500 w-5"
                      : "bg-white/80 hover:bg-white w-2"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
