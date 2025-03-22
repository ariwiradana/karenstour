import React, { useState } from "react";
import ImageShimmer from "./image.shimmer";
import { formatDate } from "@/utils/dateFormatter";
import { getInitials } from "@/utils/getInitials";
import { Rating } from "@mui/material";
import { BiSolidStar, BiStar } from "react-icons/bi";
import { Review } from "@/constants/types";
import { unbounded } from "@/constants/font";
import FsLightbox from "fslightbox-react";

interface ReviewItemProps {
  review: Review;
}

interface LightboxPhoto {
  isOpen: boolean;
  slide: number;
}

const ReviewItem = (review: ReviewItemProps) => {
  const [lightboxPhoto, setLightboxPhoto] = useState<LightboxPhoto>({
    isOpen: false,
    slide: 0,
  });

  const handleToggleLightbox = (photo: string) => {
    const slide = review.review.photos.findIndex((p) => p === photo);
    setLightboxPhoto((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
      slide: slide + 1,
    }));
  };

  return (
    <div
      key={`review-${review.review.id}`}
      className="py-8 flex flex-col md:flex-row gap-4 md:gap-8"
    >
      <FsLightbox
        toggler={lightboxPhoto.isOpen}
        sources={review.review.photos}
        slide={lightboxPhoto.slide}
      />
      <div className="md:border-r md:min-w-28">
        <div
          className={`md:w-20 md:h-20 w-16 h-16 bg-dark/5 rounded-full flex justify-center text-dark items-center text-base ${unbounded.className}`}
        >
          {getInitials(review.review.user_name)}
        </div>
      </div>
      <div>
        <Rating
          icon={<BiSolidStar className="text-amber-400 text-xl" />}
          emptyIcon={<BiStar className="text-gray-300 text-xl" />}
          value={review.review.rating}
          size="medium"
          readOnly
        />
        <h4 className="text-dark font-semibold text-lg">
          {review.review.user_name}
        </h4>
        <p className="text-dark font-semibold text-sm mt-2">
          {review.review.destination_title}
        </p>
        <p className="text-dark mt-3">{review.review.comments}</p>
        {review.review.photos && review.review.photos.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-4">
            {review.review.photos?.map((p, i) => (
              <div
                key={`review-item-${i}`}
                onClick={() => handleToggleLightbox(p)}
                className="md:w-20 w-16 aspect-square bg-dark/5 relative rounded-xl overflow-hidden cursor-pointer"
              >
                <ImageShimmer
                  fill
                  priority
                  className="object-cover rounded-xl"
                  src={p}
                  alt={`photo-${review.review.id}-${i}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
        <p className="text-dark/60 text-xs 2xl:text-sm mt-4 italic">
          Reviewed at {formatDate(review.review.created_at)}
        </p>
      </div>
    </div>
  );
};

export default ReviewItem;
