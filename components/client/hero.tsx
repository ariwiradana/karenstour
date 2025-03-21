import { unbounded } from "@/constants/font";
import React, { FC, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import usePopularDestination from "@/hooks/client/usePopularDestination";
import ButtonPrimary from "./elements/button.primary";
import Link from "next/link";
import ImageShimmer from "./elements/image.shimmer";
import { MdArrowOutward } from "react-icons/md";

const Hero: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { state } = usePopularDestination();

  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => {
      setFade(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [activeIndex]);

  if (state.destinations.length === 0)
    return (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] 2xl:h-[800px] shine"></div>
    );

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] 2xl:h-[800px] relative">
      <div
        className={`${unbounded.className} absolute inset-0 flex flex-col justify-center items-left h-full z-20`}
      >
        <div className="w-auto md:w-full mt-6 md:mt-12 px-6 md:px-8 lg:px-4 lg:max-w-screen-xl lg:mx-auto">
          <p className="text-xl text-white mb-3 font-normal">Welcome to Bali</p>
          <h1 className="text-white text-3xl md:text-4xl lg:text-6xl uppercase font-bold mb-4">
            We Take Care
            <br />
            of Your Trip
          </h1>
          <div className="max-w-3xl flex gap-x-3 md:gap-x-4">
            <div className="ml-1 w-[30px] md:w-[120px] h-[1px] bg-white mt-3 lg:mt-4"></div>
            <span
              className={`text-white text-sm md:text-base lg:text-lg leading-6 lg:leading-8 font-light line-clamp-2 transition-all duration-200 ${
                fade ? "opacity-10 translate-y-1" : "opacity-100 translate-y-0"
              }`}
            >
              {!fade && state.destinations[activeIndex].title}
            </span>
          </div>
          <div className="md:mt-12 mt-5">
            <Link href="/tour">
              <ButtonPrimary
                id="button-explore-destination"
                icon={<MdArrowOutward />}
                title="Explore Tours"
              />
            </Link>
          </div>
        </div>
      </div>
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 3000 }}
        effect="fade"
        speed={5000}
        loop={true}
        className="w-full h-full"
        fadeEffect={{ crossFade: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        allowTouchMove={false}
      >
        {state.destinations.map((destination, index) => (
          <SwiperSlide key={`hero-${destination.id}`}>
            <div className="relative w-full h-full">
              <ImageShimmer
                sizes="(max-width: 640px) 320px, (max-width: 768px) 480px, (max-width: 1024px) 720px, 1024px"
                priority
                fill
                src={
                  destination.images.length > 2
                    ? destination.images[1]
                    : destination.images[0]
                }
                alt={`hero-${destination.id}`}
                className={`w-full h-full object-cover ${
                  activeIndex === index ? "scale" : ""
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#00000048] to-[#000000b3] bg-opacity-30 z-10 h-full"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
