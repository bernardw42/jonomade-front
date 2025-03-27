/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { useInView } from "react-intersection-observer";

export default function Footer() {
  const [textRef, textInView] = useInView({
    triggerOnce: true,
    rootMargin: "-50px 0px", // Adjust the root margin as needed
  });

  return (
    <div className="bg-[#5569B2] w-full h-full flex justify-center pt-[150px] pb-[150px] max-sm:pt-[200px] max-sm:pb-[200px]">
      <div
        className={`max-w-7xl w-full flex gap-x-[100px] px-8 max-lg:px-12 max-sm:px-8 max-lg:flex-col transition-all duration-1000 ${
          textInView ? "opacity-100" : "opacity-0"
        }`}
        ref={textRef}
      >
        <div className="flex flex-col max-w-[650px] max-[1100px]:max-w-[600px] max-lg:pb-[30px]">
          <h1 className="text-white text-[40px] font-semibold pb-[20px]">
            Discover Balinese Cuisine
          </h1>
          <p className="text-white font-light">
            Explore the rich flavors of Bali with traditional dishes like Babi
            Guling, Lawar, Sate Lilit, and Nasi Campur. Experience the essence
            of Balinese culture through its food.
          </p>
        </div>
        <div className="flex flex-col pt-[10px]">
          <div className="flex flex-wrap gap-x-[15px] pb-[45px]">
            {/* <Link href="mailto:customer.service@pbl.co.id"  target="_blank" className=" duration-300 flex text-white font-light">
                            LINKEDIN
                        </Link>
                        <p className={`font-medium text-white flex items-center`}>|</p> */}
            <Link
              href="https://www.instagram.com/official_nieu/"
              target="_blank"
              className="flex text-white font-light"
            >
              INSTAGRAM
            </Link>
            <p className={`font-medium text-white flex items-center`}>|</p>
            <Link href="/" className="flex text-white font-light">
              HOME
            </Link>
          </div>
          <p className="text-white">
            JONOMADE. Copyright © 2024{" "}
            <span>
              <br></br>
              PT. JONOMADE. All Rights Reserved.{" "}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
