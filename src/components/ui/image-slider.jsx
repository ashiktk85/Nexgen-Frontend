import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"


// interface ImageSliderProps {
//   images: {
//     url: string
//     alt: string
//   }[]
//   autoPlayInterval?: number
//   showDots?: boolean
//   showArrows?: boolean
// }

export default function ImageSlider({
  images,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [images.length, autoPlayInterval])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden ">
      {/* Images */}
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        <div className="flex h-full">
          {images.map((image, index) => (
            <div key={index} className=" relative w-full h-full flex-shrink-0">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover w-full "
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrevious}
            className="relative left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="relative right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

