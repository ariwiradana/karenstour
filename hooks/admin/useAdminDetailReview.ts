import { Review } from "@/constants/types";
import { customSwal } from "@/lib/sweetalert2";
import { useFetch } from "@/lib/useFetch";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

interface UseAdminDetailReview {
  state: {
    review: Review | null;
  };
  actions: {};
}

const useAdminDetailReview = (
  id: number,
  authToken: string
): UseAdminDetailReview => {
  const [review, setReview] = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await useFetch(
        `/api/reviews?id=${Number(id)}`,
        authToken
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      if (result.success) {
        setReview(result?.data[0]);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    state: {
      review,
    },
    actions: {},
  };
};

export default useAdminDetailReview;
