import { Review } from "@/constants/types";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { z, ZodSchema } from "zod";

interface Form {
  user_name: string;
  rating: number;
  comments?: string;
  photos?: FileList | null;
}

interface LightboxPhoto {
  isOpen: boolean;
  slide: number;
}

export interface UseDestinationReviewsReturn {
  state: {
    reviews: Review[];
    formData: Form;
    errors: Record<string, string>;
    loading: boolean;
    activeIndex: number;
    slidesPerView: number;
    isOpenForm: boolean;
    allReviewPhotos: string[];
    lightboxPhoto: LightboxPhoto;
    page: number;
    limit: number;
    totalRows: number;
  };
  actions: {
    handleChange: (value: string | number, name: string) => void;
    handleSubmit: () => Promise<void>;
    handleActiveIndex: (index: number, slidesPerView: number) => void;
    handleToggleForm: () => void;
    handleToggleLightbox: (photo: string) => void;
    handleFileSelection: (photos: FileList | null) => void;
    handleChangePagination: (page: number) => void;
  };
}

const initialFormData: Form = {
  user_name: "",
  rating: 5,
  comments: "",
  photos: null,
};

const useDestinationReviews = (
  destinationId?: number
): UseDestinationReviewsReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviewPhotos, setAllReviewPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState<Form>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(3);
  const [lightboxPhoto, setLightboxPhoto] = useState<LightboxPhoto>({
    isOpen: false,
    slide: 0,
  });
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);

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
      const url = `/api/client/reviews?destination_id=${destinationId}&page=${page}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        toast.error(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setReviews(result.data);
        setTotalRows(result.totalRows);
      }
    } catch (error: any) {
      toast.error(`Failed to fetch reviews: ${error.message}`);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const fetchReviewPhotos = useCallback(async () => {
    try {
      const url = `/api/client/reviews/photos?destination_id=${destinationId}`;
      const response = await fetch(url);

      if (!response.ok) {
        toast.error(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const result = await response.json();

      if (result.success) {
        const photos = result.data.flatMap((r: Review) =>
          r.photos ? r.photos.filter((photo) => photo) : []
        );
        setAllReviewPhotos(photos);
      }
    } catch (error: any) {
      toast.error(`Failed to fetch reviews: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    fetchReviewPhotos();
  }, [fetchReviewPhotos]);

  const handleFileSelection = (photos: FileList | null) => {
    if (photos && photos.length > 0) {
      setFormData((prevState) => ({ ...prevState, photos }));
    }
  };

  const handleChange = (value: string | number | FileList, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleActiveIndex = (index: number, slidesPerView: number) => {
    setActiveIndex(index);
    setSlidesPerView(slidesPerView);
  };

  const handleUploadPhotos = async () => {
    const photoURLs: string[] = [];
    let i = 0;
    if (formData.photos && formData.photos.length > 0) {
      for (const photo of Array.from(formData.photos)) {
        i++;
        const toastId = toast.loading(`Photo (${i}) is uploading...`);
        try {
          const fd = new FormData();
          fd.append("file", photo);

          const response = await fetch(`/api/upload-file`, {
            method: "POST",
            body: fd,
          });
          const result = await response.json();
          if (result.success) {
            photoURLs.push(result.data.secure_url);
            toast.success(`Photo (${i}) uploaded successfully!`, {
              id: toastId,
            });
          } else {
            console.error(`Photo (${i}) failed to upload`);
            continue;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return photoURLs;
  };

  const handleSubmit = async () => {
    setErrors({});
    setLoading(true);

    try {
      schema.parse(formData);
      const newPhotoURLs = await handleUploadPhotos();
      const toastCreate = toast.loading("Creating review...");
      const newFormData = {
        ...formData,
        destination_id: destinationId,
        photos: newPhotoURLs,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      const response = await fetch("/api/client/reviews", {
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
        fetchReviews();
        setIsOpenForm(false);
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

  const handleToggleForm = () => {
    setIsOpenForm(!isOpenForm);
  };

  const handleToggleLightbox = (photo: string) => {
    const slide = allReviewPhotos.findIndex((p) => p === photo);
    setLightboxPhoto((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
      slide: slide + 1,
    }));
  };

  const handleChangePagination = (page: number) => {
    setPage(page);
  };

  return {
    state: {
      reviews,
      formData,
      errors,
      loading,
      activeIndex,
      slidesPerView,
      isOpenForm,
      allReviewPhotos,
      lightboxPhoto,
      page,
      limit,
      totalRows,
    },
    actions: {
      handleChange,
      handleSubmit,
      handleActiveIndex,
      handleToggleForm,
      handleFileSelection,
      handleToggleLightbox,
      handleChangePagination,
    },
  };
};

export default useDestinationReviews;
