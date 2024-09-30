import { Review } from "@/constants/types";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { z, ZodSchema } from "zod";

interface FormData {
  user_name: string;
  rating: number;
  comments?: string;
}

export interface UseReviewsReturn {
  state: {
    reviews: Review[] | null;
    formData: FormData;
    errors: Record<string, string>;
    loading: boolean;
    activeIndex: number;
    slidesPerView: number;
  };
  actions: {
    handleChange: (value: string | number, name: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleActiveIndex: (index: number, slidesPerView: number) => void;
  };
}

const initialFormData: FormData = {
  user_name: "",
  rating: 5,
  comments: "",
};

const useReviews = (destinationId?: number): UseReviewsReturn => {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(3);

  const schema: ZodSchema = z.object({
    user_name: z.string().min(2, {
      message:
        "Oops! Your name seems a bit short. Please make sure it's at least 2 characters long.",
    }),
    rating: z
      .number()
      .min(1, {
        message: "Please select a rating between 1 and 5.",
      })
      .max(5, {
        message:
          "Whoa! That's a bit high. Please select a rating between 1 and 5.",
      }),
    comments: z.string().max(1000, {
      message: "Your comment is a bit too long.",
    }),
  });

  const fetchReviews = useCallback(async () => {
    try {
      const url = "/api/reviews";
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

  const handleChange = (value: string | number, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleActiveIndex = (index: number, slidesPerView: number) => {
    setActiveIndex(index);
    setSlidesPerView(slidesPerView);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      schema.parse(formData);
      const toastCreate = toast.loading("Creating review...");
      const newFormData = {
        ...formData,
        destination_id: destinationId,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setFormData(initialFormData);
        toast.success("Review submitted successfully!", {
          id: toastCreate,
        });
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors); // Update state with errors
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      reviews,
      formData,
      errors,
      loading,
      activeIndex,
      slidesPerView,
    },
    actions: {
      handleChange,
      handleSubmit,
      handleActiveIndex,
    },
  };
};

export default useReviews;
