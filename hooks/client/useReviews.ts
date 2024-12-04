import { Review } from "@/constants/types";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { z, ZodSchema } from "zod";

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(3);

  const handleActiveIndex = (index: number, slidesPerView: number) => {
    setActiveIndex(index);
    setSlidesPerView(slidesPerView);
  };

  const fetchReviews = useCallback(async () => {
    try {
      const url = `/api/client/reviews?page=1&limit=10`;
      const response = await fetch(url);

      if (!response.ok) {
        toast.error(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setReviews(result.data);
      }
    } catch (error: any) {
      toast.error(`Failed to fetch reviews: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

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
