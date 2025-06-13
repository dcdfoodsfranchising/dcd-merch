import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const featuredItems = [
  {
    img: "/assets/images/hat-no-bg.png",
    alt: "Hat",
    title: "DCD Hat",
    description: "Stay stylish and cool with our exclusive DCD Hat. Perfect for any occasion.",
    link: "/shop?product=hat",
    bg: "bg-gradient-to-r from-black via-gray-900 to-red-700",
  },
  {
    img: "/assets/images/mug.jpg",
    alt: "Mug",
    title: "DCD Mug",
    description: "Enjoy your favorite drinks in our premium DCD Mug. Durable and unique.",
    link: "/shop?product=mug",
    bg: "bg-gradient-to-r from-black via-gray-900 to-red-700",
  },
  {
    img: "/assets/images/pen.jpg",
    alt: "Pen",
    title: "DCD Pen",
    description: "Write with style using the smooth and elegant DCD Pen.",
    link: "/shop?product=pen",
    bg: "bg-gradient-to-r from-black via-gray-900 to-red-700",
  },
];

export default function Featured() {
  return (
    <div className="w-full py-12 flex flex-col items-center overflow-x-hidden">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Featured Products</h2>
      <div className="w-full max-w-screen-xl px-2 sm:px-4 overflow-x-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          centeredSlides={false}
          loop={false}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{ el: ".swiper-pagination-custom", clickable: true }}
        >
          {featuredItems.map((item) => (
            <SwiperSlide key={item.alt} className="!w-full">
              <a
                href={item.link}
                className={`rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 flex flex-col md:flex-row items-center cursor-pointer group ${item.bg} w-full h-full`}
                style={{ minHeight: 320 }}
              >
                <div className="flex-1 p-6 md:pl-12 md:pr-6 md:py-10 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">{item.title}</h3>
                  <p className="text-white text-base md:text-lg">{item.description}</p>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto flex items-center justify-center p-6 md:pr-12">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="object-contain h-40 w-40 md:h-72 md:w-72 drop-shadow-xl"
                  />
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Arrows and pagination below */}
        <div className="flex justify-center items-center gap-8 mt-6">
          <button className="swiper-button-prev-custom text-black hover:text-red-700 text-3xl">&#8592;</button>
          <div className="swiper-pagination-custom flex gap-2" />
          <button className="swiper-button-next-custom text-black hover:text-red-700 text-3xl">&#8594;</button>
        </div>
      </div>
    </div>
  );
}
