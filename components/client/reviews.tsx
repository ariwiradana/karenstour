import React, { FC, useState } from "react";
import Container from "./container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Title from "./elements/title";
import { montserrat, unbounded } from "@/constants/font";
import { FaStar } from "react-icons/fa6";
import { t } from "i18next";
import useReviews, { UseReviewsReturn } from "@/hooks/client/useReviews";
import { Review } from "@/constants/types";
import { formatDate } from "@/utils/dateFormatter";

interface ReviewCardProps {
  state: UseReviewsReturn["state"];
  actions: UseReviewsReturn["actions"];
  review: Review;
}

const ReviewCard: FC<ReviewCardProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`p-8 bg-lightgray rounded-3xl transition-all ease-in-out duration-300 ${unbounded.className}`}
    >
      <div className="flex justify-between flex-col md:flex-row gap-6 items-start">
        <div className="flex gap-x-4">
          <div>
            <h1 className="text-base font-semibold text-dark leading-8">
              {props.review.user_name}
            </h1>
            <p
              className={`text-sm font-normal text-darkgray ${montserrat.className}`}
            >
              {formatDate(props.review.created_at)}
            </p>
          </div>
        </div>

        <div className="bg-primary rounded-lg px-2 py-1 h-auto flex items-center gap-x-1">
          <FaStar className="text-white text-sm" />
          <span className="text-white text-xs font-medium">
            {props.review.rating}.0
          </span>
        </div>
      </div>

      <p
        className={`text-base font-normal text-darkgray mt-4 leading-7 ${
          montserrat.className
        } ${isExpanded ? "line-clamp-3" : "line-clamp-none"}`}
      >
        {props.review.comments}
      </p>
      {props.review.comments.length > 130 && (
        <button
          aria-label="btn-expand-desc"
          className="text-darkgray font-light text-sm mt-2 underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Read more" : "Read less"}
        </button>
      )}
    </div>
  );
};

const Reviews: FC = () => {
  const { state, actions } = useReviews();

  if (state.reviews.length > 0)
    return (
      <Container className="md:py-20 py-12">
        <Title
          action={false}
          center
          title={t("home.review.title")}
          description={t("home.review.desc")}
        />

        <div className="mt-4 relative">
          <div className="flex justify-center gap-x-2 mb-8">
            {Array.from(
              {
                length: Math.ceil(
                  (state.reviews ?? []).length + 1 - state.slidesPerView
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
          <Swiper
            autoplay={{
              delay: 2000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            onActiveIndexChange={(swiper) => {
              const activeIndex = swiper.activeIndex;
              const slidesPerView = swiper.params.slidesPerView;
              actions.handleActiveIndex(activeIndex, slidesPerView as number);
            }}
            modules={[Autoplay]}
          >
            {state.reviews?.map((review) => (
              <SwiperSlide key={review.id}>
                <ReviewCard review={review} state={state} actions={actions} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    );
};

export default Reviews;
