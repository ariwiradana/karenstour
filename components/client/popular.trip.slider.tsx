import React, { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid } from "swiper/modules";
import DestinationCard from "./elements/destination.card";
import Container from "./container";
import Title from "./elements/title";
import usePopularDestination from "@/hooks/client/usePopularDestination";
import CardShimmer from "./elements/card.shimmer";
import Link from "next/link";
import ButtonText from "./elements/button.text";
import { Destination } from "@/constants/types";
import { useDestinationDetailStore } from "@/store/useDestinationDetailStore";

interface PopularTripSliderProps {
  title: string;
  description: string;
  link: string;
  actionTitle?: string;
  destinations: Destination[];
  isLoading?: boolean;
  categoryId: number;
}
const PopularTripSlider: FC<PopularTripSliderProps> = (props) => {
  const { state, actions } = usePopularDestination();
  const data = props?.destinations?.slice(0, 6) || [];

  const indicators = Array(Math.ceil(data.length / state.slidesPerView)).fill(
    0
  );
  const { setCategoryFilterId } = useDestinationDetailStore();

  return (
    <Container className="flex flex-col divide-y lg:divide-y-0">
      <div className="md:pt-20 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-6 md:mb-0">
          <Title
            action={false}
            path={props.link}
            title={props.title}
            description={props.description}
          />
          <Link href={props.link}>
            <ButtonText
              title="Show More"
              onClick={() => setCategoryFilterId(props.categoryId)}
            />
          </Link>
        </div>

        {indicators?.length > 1 && (
          <div className="gap-x-2 md:mt-5 flex">
            {indicators.map((_, index) => (
              <div
                key={`${_}-indicator`}
                className={`h-2 md:h-2 rounded-full ${
                  index === state.activeIndex
                    ? "bg-primary w-5"
                    : "w-2 md:w-3 bg-gray-200"
                }`}
              ></div>
            ))}
          </div>
        )}

        <div className="mt-6 md:mt-8">
          {props.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
              <CardShimmer />
              <CardShimmer />
              <CardShimmer />
              <CardShimmer className="md:hidden lg:flex" />
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
                  actions.handleActiveIndex(
                    activeIndex,
                    slidesPerView as number
                  );
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
                modules={[Autoplay, Grid]}
              >
                {data?.map((obj) => {
                  return (
                    <SwiperSlide key={obj.id}>
                      <DestinationCard data={obj} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PopularTripSlider;
