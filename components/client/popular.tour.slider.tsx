import React, { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid, Navigation } from "swiper/modules";
import DestinationCard from "./elements/destination.card";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Container from "./container";
import Title from "./elements/title";
import usePopularDestination from "@/hooks/client/usePopularDestination";

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
        <div className="flex justify-between items-end mb-6 lg:mb-8">
          <Title
            actionTitle={props.actionTitle}
            action
            path={props.link}
            title={props.title}
            description={props.description}
          />
        </div>

        <div className="relative">
          <Swiper
            className="group"
            navigation={{
              prevEl: ".slidePrev-btn",
              nextEl: ".slideNext-btn",
            }}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
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
            <div className="flex justify-start md:justify-center gap-x-4 mt-6 md:mt-10 lg:mt-0">
              <button
                className={`${
                  state.firstSlide ? "lg:hidden" : "lg:flex"
                } flex slidePrev-btn lg:absolute left-0 rounded-full w-8 h-8 lg:w-auto lg:h-full lg:rounded-r-none lg:rounded-l-xl group-hover:lg:opacity-100 lg:opacity-0 transition-opacity duration-300 ease-in-out lg:px-4 inset-y-0 justify-center items-center z-30 bg-gray-200 lg:bg-white lg:bg-opacity-10 backdrop-blur-sm`}
              >
                <BsChevronLeft className="text-dark lg:text-white lg:text-2xl" />
              </button>
              <button
                className={`${
                  state.lastSlide ? "lg:hidden" : "lg:flex"
                } flex slideNext-btn lg:absolute right-0 rounded-full w-8 h-8 lg:w-auto lg:h-full lg:rounded-l-none lg:rounded-r-xl group-hover:lg:opacity-100 lg:opacity-0 transition-opacity duration-300 ease-in-out lg:px-4 inset-y-0 justify-center items-center z-30 bg-gray-200 lg:bg-white lg:bg-opacity-10 backdrop-blur-sm`}
              >
                <BsChevronRight className="text-dark lg:text-white lg:text-2xl" />
              </button>
            </div>
          </Swiper>
        </div>
      </div>
    </Container>
  );
};

export default PopularTourSlider;
