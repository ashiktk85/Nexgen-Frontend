import ImageSlider from "../ui/image-slider"

export default function ImageSiderComponent({images}) {

  return (
    <div className=" ">
      <ImageSlider images={images} autoPlayInterval={5000} showDots={true} showArrows={true} />
    </div>
  )
}