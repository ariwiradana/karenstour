import { montserrat, unbounded } from "@/constants/font";
import React, { FC } from "react";
import CustomInput from "./elements/input";
import CustomTextarea from "./elements/textarea";
import { Pagination, Rating } from "@mui/material";
import ButtonPrimary from "./elements/button.primary";
import { Destination } from "@/constants/types";
import { BiSolidStar, BiStar } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import ButtonSecondary from "./elements/button.secondary";
import Modal from "./elements/modal";
import ImageShimmer from "./elements/image.shimmer";
import FsLightbox from "fslightbox-react";
import ReviewItem from "./elements/review.item";
import useDestinationReviews from "@/hooks/client/useDestinationReviews";
import InputFileCustom from "./elements/input.file.custom";

interface Props {
  destination: Destination;
}

const ReviewForm: FC<Props> = (props) => {
  const { state, actions } = useDestinationReviews(props.destination.id);

  return (
    <>
      <FsLightbox
        toggler={state.lightboxPhoto.isOpen}
        sources={state.allReviewPhotos}
        slide={state.lightboxPhoto.slide}
      />
      <Modal isOpen={state.isOpenForm} onClose={actions.handleToggleForm}>
        <form
          onSubmit={actions.handleSubmit}
          className={`flex flex-col gap-6 ${unbounded.className}`}
        >
          <h1 className="font-semibold text-dark text-xl">Write a Review</h1>
          <InputFileCustom
            photos={state.formData.photos}
            name="photos"
            multiple
            label="Add Photos"
            onFileSelected={actions.handleFileSelection}
          />
          <CustomInput
            value={state.formData.user_name}
            name="user_name"
            label="Name"
            onChange={(e) => actions.handleChange(e.target.value, "user_name")}
            error={state.errors.user_name}
          />
          <div>
            <p
              className={`text-sm mb-1 font-medium text-darkgray ml-1 ${montserrat.className}`}
            >
              What would you rate this tour?
            </p>
            <Rating
              icon={<BiSolidStar className="text-amber-400 text-3xl" />}
              emptyIcon={<BiStar className="text-gray-300 text-3xl" />}
              value={state.formData.rating}
              name="rating"
              size="large"
              onChange={(e, value) =>
                actions.handleChange(Number(value), "rating")
              }
            />
          </div>
          <CustomTextarea
            value={state.formData.comments}
            name="comments"
            label="Tell us your feedback about the tour?"
            onChange={(e) => actions.handleChange(e.target.value, "comments")}
            error={state.errors.comments}
          />
          <div className="flex gap-2 justify-end mt-4">
            <ButtonSecondary
              className="w-full md:w-auto"
              disabled={state.loading}
              type="button"
              id="btn-cancel-review"
              title="Cancel"
              onClick={actions.handleToggleForm}
            />
            <ButtonPrimary
              className="w-full md:w-auto"
              id="btn-submit-review"
              disabled={state.loading}
              type="submit"
              title="Submit"
            />
          </div>
        </form>
      </Modal>
      <div
        className={`${montserrat.className} pt-6 md:pt-10 rounded-xl flex flex-col divide-y`}
      >
        <div className="flex flex-wrap gap-4 justify-between items-center pb-8">
          {state.reviews.length > 0 && (
            <div>
              <div className="flex items-center gap-x-2">
                <h4 className="text-dark text-2xl font-semibold">
                  {props.destination.average_rating}
                </h4>
                <BiSolidStar className="text-amber-400 text-xl" />
              </div>
              <p className="text-dark font-medium">
                Based on {state.reviews.length} reviews.
              </p>
            </div>
          )}
          <ButtonPrimary
            id="btn-open-form"
            onClick={actions.handleToggleForm}
            title="Write Review"
          />
        </div>

        {state.reviews?.length > 0 && (
          <div className="pt-8">
            {state.allReviewPhotos.length > 0 && (
              <Swiper
                spaceBetween={8}
                breakpoints={{
                  0: {
                    slidesPerView: 4,
                  },
                  640: {
                    slidesPerView: 4,
                  },
                  768: {
                    slidesPerView: 6,
                  },
                  1024: {
                    slidesPerView: 12,
                  },
                }}
              >
                {state.allReviewPhotos.map((p, i) => {
                  return (
                    <SwiperSlide key={p}>
                      <div
                        onClick={() => actions.handleToggleLightbox(p)}
                        className="w-full aspect-square bg-dark/5 relative rounded-xl overflow-hidden cursor-pointer"
                      >
                        <ImageShimmer
                          fill
                          priority
                          className="object-cover rounded-xl"
                          src={p}
                          alt={`all-photo-${i}`}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}

            <div className="divide-y mt-8 border-t">
              {state.reviews.map((r) => (
                <ReviewItem key={`review-${r.id}`} review={r} />
              ))}
            </div>

            {Math.ceil(state.totalRows / state.limit) > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  sx={{
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#317039",
                    },
                  }}
                  shape="rounded"
                  count={Math.ceil(state.totalRows / state.limit)}
                  page={state.page}
                  onChange={(event, page) =>
                    actions.handleChangePagination(page)
                  }
                  color="primary"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewForm;
