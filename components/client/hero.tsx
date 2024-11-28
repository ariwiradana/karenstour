import { unbounded } from "@/constants/font";
import React, { FC, useState } from "react";
import Container from "./container";
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

  if (state.data.length === 0)
    return (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] 2xl:h-[800px] shine"></div>
    );

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] 2xl:h-[800px] relative">
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
              <ImageShimmer
                sizes="(max-width: 640px) 320px, (max-width: 768px) 480px, (max-width: 1024px) 720px, 1024px"
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
                  <p className="text-xl text-white mb-3 font-normal">
                    Welcome to Bali
                  </p>
                  <h1 className="text-white text-3xl md:text-4xl lg:text-6xl uppercase font-bold mb-4">
                    We Take Care
                    <br />
                    of Your Trip
                  </h1>
                  <div className="max-w-3xl flex gap-x-3 md:gap-x-4">
                    <div className="ml-1 w-[40px] md:w-[120px] h-[1px] bg-white mt-3 lg:mt-4"></div>
                    <span className="text-white text-sm md:text-base lg:text-lg leading-6 lg:leading-8 font-light">
                      {data.title}
                    </span>
                  </div>
                  <div className="md:mt-12 mt-6">
                    <Link href="/tour">
                      <ButtonPrimary
                        id="button-explore-destination"
                        icon={<MdArrowOutward />}
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
