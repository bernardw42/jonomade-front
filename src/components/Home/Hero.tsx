"use client";
import { useInView } from "react-intersection-observer";
import one from "../../../public/food/b1.jpg";
import two from "../../../public/food/b2.jpg";
import three from "../../../public/food/b3.jpg";
import four from "../../../public/food/b4.jpg";
import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "../../../public/vercel.svg";

export default function Header() {
  const images = [one, two, three, four];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px",
  });

  useEffect(() => {
    if (titleInView) {
      setShowTitle(true);
    }
  }, [titleInView]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-change slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="bg-[#5569B2] flex justify-center w-full items-center relative">
      {/* Image Carousel */}
      <div className="flex items-center justify-center w-full h-screen bg-fixed opacity-40">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-screen object-cover opacity-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : ""
            }`}
          />
        ))}
        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition"
        ></button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition"
        ></button>
      </div>

      {/* Text Overlay */}
      <div
        ref={titleRef}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white flex flex-col items-center justify-center text-center drop-shadow-2xl px-4 transition-all duration-[1500ms] ${
          showTitle ? "opacity-100" : " opacity-5"
        }`}
      >
        <Image
          src={Logo}
          alt="tes"
          className="w-[60px] max-md:w-[50px] drop-shadow-2xl mb-6"
        />
        <h1 className="font-medium text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px] mb-2">
          Authentic Taste of Bali
        </h1>
        <p className="text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px] font-light">
          JONOMADE
        </p>
      </div>
    </div>
  );
}
