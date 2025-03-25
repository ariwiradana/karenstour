import { Review } from "@/constants/types";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/router";

export interface UseReviewsReturn {
  state: {
    reviews: Review[];
    activeIndex: number;
    slidesPerView: number;
  };
  actions: {
    handleActiveIndex: (index: number, slidesPerView: number) => void;
  };
}

const useReviews = (): UseReviewsReturn => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(3);
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleActiveIndex = (index: number, slidesPerView: number) => {
    setActiveIndex(index);
    setSlidesPerView(slidesPerView);
  };

  useSWR<{ data: Review[] }>(`/api/client/reviews?page=1&limit=10`, fetcher, {
    onSuccess: (data) => setReviews(data?.data || []),
  });
  return {
    state: {
      reviews,
      activeIndex,
      slidesPerView,
    },
    actions: {
      handleActiveIndex,
    },
  };
};

export default useReviews;
