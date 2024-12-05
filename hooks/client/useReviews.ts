import { Review } from "@/constants/types";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

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

  const handleActiveIndex = (index: number, slidesPerView: number) => {
    setActiveIndex(index);
    setSlidesPerView(slidesPerView);
  };

  const { data } = useSWR<{ data: Review[] }>(
    `/api/client/reviews?page=1&limit=10`,
    fetcher
  );
  const reviews = data?.data || [];

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
