import { unbounded } from "@/constants/font";
import Image from "next/image";
import React, { FC, useState } from "react";
import Container from "./container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import usePopularDestination from "@/hooks/client/usePopularDestination";
import ButtonPrimary from "./elements/button.primary";
import { BsFillPinMapFill } from "react-icons/bs";
import Link from "next/link";

const Hero: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { state } = usePopularDestination();

  if (state.data.length === 0)
    return (
      <div className="w-full min-h-[70vh] md:min-h-[60vh] lg:min-h-[70vh] 2xl:min-h-[45vh] h-[70vh] md:h-[60vh] lg:h-[70vh] 2xl:h-[45vh] shine"></div>
    );

  return (
    <div className="w-full min-h-[70vh] md:min-h-[60vh] lg:min-h-[70vh] 2xl:min-h-[45vh] h-[70vh] md:h-[60vh] lg:h-[70vh] 2xl:h-[45vh] relative">
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
        {state.data.map((data, index) => (
          <SwiperSlide key={`hero-${data.id}`}>
            <div className="relative w-full h-full">
              <Image
                priority
                fill
                src={data.images.length > 2 ? data.images[1] : data.images[0]}
                alt={`hero-${data.id}`}
                className={`w-full h-full object-cover ${
                  activeIndex === index ? "scale" : ""
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#00000048] to-[#000000b3] bg-opacity-30 z-10 h-full"></div>
              <div
                className={`${unbounded.className} absolute inset-0 flex flex-col justify-center items-center h-full z-20`}
              >
                <Container className="w-auto md:w-full mt-6 md:mt-12">
                  <h6 className="text-xl text-white mb-3 font-normal">
                    Welcome to Bali
                  </h6>
                  <h2 className="text-white text-3xl md:text-4xl lg:text-6xl uppercase font-bold mb-4">
                    We Take Care
                    <br />
                    of Your Trip
                  </h2>
                  <div className="max-w-3xl flex items-center gap-x-3 md:gap-x-4">
                    <div className="ml-1 w-[40px] md:w-[120px] h-[1px] bg-white"></div>
                    <span className="text-white text-sm md:text-base lg:text-lg leading-6 lg:leading-8 font-light">
                      {data.title}
                    </span>
                  </div>
                  <div className="md:mt-12 mt-6">
                    <Link href="/tour">
                      <ButtonPrimary
                        icon={<BsFillPinMapFill />}
                        title="Explore Tours"
                      />
                    </Link>
                  </div>
                </Container>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
