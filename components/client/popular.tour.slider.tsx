import React, { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid, Navigation } from "swiper/modules";
import DestinationCard from "./elements/destination.card";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Container from "./container";
import Title from "./elements/title";
import usePopularDestination from "@/hooks/client/usePopularDestination";
import CardShimmer from "./elements/card.shimmer";
import Link from "next/link";
import ButtonText from "./elements/button.text";

interface PopularTourSliderProps {
  title: string;
  description: string;
  link?: string;
  actionTitle?: string;
  exceptionId?: number | null;
}
const PopularTourSlider: FC<PopularTourSliderProps> = (props) => {
  const { state, actions } = usePopularDestination(props.exceptionId);

  return (
    <Container className="flex flex-col divide-y lg:divide-y-0">
      <div className="md:py-14 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-6 md:mb-0">
          <Title
            action={false}
            path={props.link}
            title={props.title}
            description={props.description}
          />
          <Link href={"/tour"}>
            <ButtonText title="All Tours" />
          </Link>
        </div>

        <div className="gap-x-2 hidden md:flex mb-10 mt-5">
          {Array.from(
            {
              length: Math.ceil(state.data.length + 1 - state.slidesPerView),
            },
            (_, index) => index
          ).map((item) => (
            <div
              key={`${item}-indicator`}
              className={`h-1 md:h-2 rounded-full ${
                item === state.activeIndex
                  ? "bg-primary w-4"
                  : "w-1 md:w-2 bg-gray-200"
              }`}
            ></div>
          ))}
        </div>

        {state.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
          </div>
        ) : (
          <div className="relative">
            <Swiper
              autoplay={{
                disableOnInteraction: false,
                delay: 4000,
                pauseOnMouseEnter: true,
              }}
              className="group"
              navigation={{
                prevEl: ".slidePrev-btn",
                nextEl: ".slideNext-btn",
              }}
              slidesPerView={state.slidesPerView}
              breakpoints={{
                0: {
                  spaceBetween: 16,
                },
                640: {
                  spaceBetween: 16,
                },
                768: {
                  spaceBetween: 20,
                },
                1024: {
                  spaceBetween: 24,
                },
              }}
              onActiveIndexChange={(swiper) => {
                const activeIndex = swiper.activeIndex;
                const slidesPerView = swiper.params.slidesPerView;
                actions.handleActiveIndex(activeIndex, slidesPerView as number);
              }}
              onSlideChange={(swiper) => {
                if (swiper.activeIndex === 0) {
                  actions.setFirstSlide(true);
                } else {
                  actions.setFirstSlide(false);
                }

                if (swiper.activeIndex === swiper.slides.length - 3) {
                  actions.setLastSlide(true);
                } else {
                  actions.setLastSlide(false);
                }
              }}
              modules={[Autoplay, Navigation, Grid]}
            >
              {state.data.map((obj) => {
                return (
                  <SwiperSlide key={obj.id}>
                    <DestinationCard data={obj} />
                  </SwiperSlide>
                );
              })}
              <div className="flex justify-between items-center mt-2 md:mt-10 lg:mt-0">
                <div className="flex gap-x-2 md:hidden">
                  {Array.from(
                    {
                      length: Math.ceil(
                        state.data.length + 1 - state.slidesPerView
                      ),
                    },
                    (_, index) => index
                  ).map((item) => (
                    <div
                      key={`${item}-indicator`}
                      className={`h-1 md:h-2 rounded-full ${
                        item === state.activeIndex
                          ? "bg-primary w-4"
                          : "w-1 md:w-2 bg-gray-200"
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-start md:justify-center gap-x-2 lg:gap-x-4">
                  <button
                    aria-label="btn-slide-prev"
                    className={`${
                      state.firstSlide ? "lg:hidden" : "lg:flex"
                    } flex slidePrev-btn lg:absolute left-0 rounded-full w-8 h-8 lg:w-auto lg:h-full lg:rounded-r-none lg:rounded-l-xl group-hover:lg:opacity-100 lg:opacity-0 transition-opacity duration-300 ease-in-out lg:px-4 inset-y-0 justify-center items-center z-30 bg-gray-200 lg:bg-white lg:bg-opacity-10 backdrop-blur-sm`}
                  >
                    <BsChevronLeft className="text-dark lg:text-white lg:text-2xl" />
                  </button>
                  <button
                    aria-label="btn-slide-next"
                    className={`${
                      state.lastSlide ? "lg:hidden" : "lg:flex"
                    } flex slideNext-btn lg:absolute right-0 rounded-full w-8 h-8 lg:w-auto lg:h-full lg:rounded-l-none lg:rounded-r-xl group-hover:lg:opacity-100 lg:opacity-0 transition-opacity duration-300 ease-in-out lg:px-4 inset-y-0 justify-center items-center z-30 bg-gray-200 lg:bg-white lg:bg-opacity-10 backdrop-blur-sm`}
                  >
                    <BsChevronRight className="text-dark lg:text-white lg:text-2xl" />
                  </button>
                </div>
              </div>
            </Swiper>
          </div>
        )}
      </div>
    </Container>
  );
};

export default PopularTourSlider;
