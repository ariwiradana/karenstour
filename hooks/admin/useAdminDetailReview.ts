import { Review } from "@/constants/types";
import { customSwal } from "@/lib/sweetalert2";
import { useFetch } from "@/lib/useFetch";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

interface LightboxPhoto {
  isOpen: boolean;
  slide: number;
}

interface UseAdminDetailReview {
  state: {
    review: Review | null;
    lightboxPhoto: LightboxPhoto;
  };
  actions: {
    handleToggleLightbox: (photo: string) => void;
  };
}

const useAdminDetailReview = (
  id: number,
  authToken: string
): UseAdminDetailReview => {
  const [review, setReview] = useState<Review | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<LightboxPhoto>({
    isOpen: false,
    slide: 0,
  });

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

  const handleToggleLightbox = (photo: string) => {
    const slide = review?.photos.findIndex((p) => p === photo);
    setLightboxPhoto((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
      slide: (slide as number) + 1,
    }));
  };

  return {
    state: {
      review,
      lightboxPhoto,
    },
    actions: {
      handleToggleLightbox,
    },
  };
};

export default useAdminDetailReview;
