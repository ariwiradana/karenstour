import { useCallback, useEffect, useState } from "react";
import { z, ZodSchema } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Category, Destination, Options } from "@/constants/types";
import { convertToSlug } from "@/utils/convertToSlug";
import { generateFilename } from "@/utils/generateFilename";
import useAdminCategory from "./useAdminCategory";

interface FormData {
  uploaded_images?: string[] | [];
  images: FileList | null;
  thumbnail_image?: string;
  title: string;
  categoryId: number | null;
  pax: number;
  description: string;
  duration: number;
  price: number;
  inclusions: string[];
  video?: File | null;
  uploaded_video?: string;
}

interface UseUpdateDestinationState {
  formData: FormData;
  errors: Record<string, string>;
  loading: boolean;
  destination: Destination | null;
  categoryOptions: Options[] | [];
  lightbox: boolean;
  slideIndex: number;
}

interface UseUpdateDestination {
  state: UseUpdateDestinationState;
  actions: {
    handleRemoveVideo: (videoURL: string) => void;
    handleRemoveImage: (imageURL: string) => void;
    handleSetThumbnail: (imageURL: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleToggleLightbox: (index: number) => void;
    handleChange: (
      value: string | number | string[] | File | FileList | null,
      name: string
    ) => void;
  };
}

const initialFormData: FormData = {
  uploaded_images: [],
  images: null,
  thumbnail_image: "",
  title: "",
  categoryId: null,
  pax: 1,
  description: "",
  duration: 1,
  price: 0,
  inclusions: [],
  video: null,
};

const isFileList = (value: any): value is FileList => {
  return value instanceof window.FileList;
};

const useUpdateDestination = (id: string | number): UseUpdateDestination => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [lightbox, setLightbox] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Options[] | []>([]);

  const router = useRouter();

  const handleToggleLightbox = (index: number) => {
    console.log(index);
    setLightbox(!lightbox);
    setSlideIndex(index);
  };

  const fetchDestinationBySlug = useCallback(async () => {
    const toastFetch = toast.loading("Load destination...");
    try {
      const response = await fetch(`/api/destination?id=${id}`);
      const result = await response.json();
      if (result.success) {
        const data = result.data[0];
        toast.success(result.message, { id: toastFetch });
        setDestination(data);
        setFormData((prevData) => ({
          ...prevData,
          title: data.title,
          description: data.description,
          inclusions: data.inclusions,
          duration: data.duration,
          pax: data.minimum_pax,
          price: data.price,
          uploaded_images: data.images,
          uploaded_video: data.video_url,
          categoryId: data.category_id,
          thumbnail_image: data.thumbnail_image,
        }));
      } else {
        toast.error(result.message, { id: toastFetch });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    if (formData.categoryId) {
      let url = `/api/category`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        if (result.success) {
          const options: Options[] = result.data.map((category: Category) => ({
            label: category.name,
            value: category.id,
          }));
          setCategoryOptions(options);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  }, [formData]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchDestinationBySlug();
  }, [fetchDestinationBySlug]);

  const schema: ZodSchema = z.object({
    images: z.any().refine((value) => value === null || isFileList(value), {
      message: "Please select at least one image file.",
    }),
    title: z.string().min(5, "The title must be at least 5 characters long."),
    categoryId: z.number(),
    pax: z.any().refine((value) => !isNaN(value), {
      message: "The number of participants must be at least 1.",
    }),
    description: z.string().nullable(),
    duration: z.any().refine((value) => !isNaN(value), {
      message: "The duration must be at least 1 hour.",
    }),
    price: z.any().refine((value) => !isNaN(value), {
      message: "The price must be a valid number.",
    }),
    inclusions: z.array(z.string()).min(1, {
      message: "At least one inclusion must be provided.",
    }),
    video: z
      .any()
      .refine((value) => isFileList(value), {
        message: "Please select video file.",
      })
      .optional()
      .nullable(),
  });

  const handleChange = (
    value: string | number | string[] | File | FileList | null,
    name: string
  ) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRemoveImage = async (imageURL: string) => {
    const newImages = formData.uploaded_images?.filter(
      (image) => image !== imageURL
    );
    if ((newImages ?? [])?.length > -1) {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/destination/delete-file?url=${imageURL}&destination_id=${id}&category=images`,
          {
            method: "POST",
          }
        );
        const result = await response.json();
        if (result.success) {
          setFormData((prevData) => ({
            ...prevData,
            uploaded_images: newImages,
          }));
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Oops! The image cannot be empty");
    }
  };

  const handleRemoveVideo = async (videoURL: string) => {
    if (videoURL) {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/destination/delete-file?url=${videoURL}&destination_id=${id}&category=video_url`,
          {
            method: "POST",
          }
        );
        const result = await response.json();
        if (result.success) {
          setFormData((prevData) => ({
            ...prevData,
            uploaded_video: "",
          }));
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSetThumbnail = async (imageURL: string) => {
    let updatedDestination = { ...destination };
    updatedDestination.thumbnail_image = imageURL;

    try {
      setLoading(true);
      const response = await fetch(`/api/destination?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDestination),
      });
      const result = await response.json();
      if (result.success) {
        setFormData((prevData) => ({
          ...prevData,
          thumbnail_image: imageURL,
        }));
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      schema.parse(formData);

      // Prepare variables for uploads
      const images = formData.images;
      let videoURL: string = "";
      let allImages: string[] = [];

      // Upload video if it exists
      const video = formData.video;
      if (video) {
        const fileVideo = video instanceof FileList ? video[0] : video;
        const filename = generateFilename("video");
        const uploadToast = toast.loading(`Video is uploading...`);
        try {
          const filepath = "destination/videos";
          const response = await fetch(
            `/api/destination/upload-file?filename=${encodeURIComponent(
              filename
            )}&filepath=${encodeURIComponent(
              filepath
            )}&filetype=${fileVideo.type.toLowerCase()}&filesize=${
              fileVideo.size
            }&category=video`,
            {
              method: "POST",
              body: fileVideo,
            }
          );
          const result = await response.json();
          if (result.success) {
            if (formData.uploaded_video) {
              await fetch(
                `/api/destination/delete-file?url=${formData.uploaded_video}&destination_id=${id}&category=video_url`,
                {
                  method: "POST",
                }
              );
            }
            videoURL = result.data.url;
            toast.success(`Video uploaded successfully!`, {
              id: uploadToast,
              duration: 3000,
            });
            setFormData((prevData) => ({
              ...prevData,
              video: null,
            }));
          } else {
            toast.error(result.message, {
              id: uploadToast,
              duration: 3000,
            });
            return;
          }
        } catch (error: any) {
          toast.error(`Video upload failed: ${error.message}`, {
            duration: 3000,
            id: uploadToast,
          });
          return;
        }
      } else {
        videoURL = formData.uploaded_video ?? "";
      }

      // Upload images if they exist
      if (images && images.length > 0) {
        let i = 0;
        for (const image of Array.from(images)) {
          i++;
          const filename = generateFilename("image");
          const uploadToast = toast.loading(
            `Image ${i} of ${images.length} is uploading...`
          );
          try {
            const filepath = "destination/images";
            const response = await fetch(
              `/api/destination/upload-file?filename=${encodeURIComponent(
                filename
              )}&filepath=${encodeURIComponent(
                filepath
              )}&filetype=${image.type.toLowerCase()}&filesize=${
                image.size
              }&category=image`,
              {
                method: "POST",
                body: image,
              }
            );
            const result = await response.json();
            if (result.success) {
              allImages.push(result.data.url);
              toast.success(
                `Image ${i} of ${images.length} uploaded successfully!`,
                {
                  id: uploadToast,
                }
              );
            } else {
              toast.error(result.message, {
                id: uploadToast,
              });
              continue;
            }
          } catch (error: any) {
            toast.error(`Image upload failed: ${error.message}`, {
              id: uploadToast,
            });
            return;
          }
        }
      }

      try {
        const uploadToast = toast.loading("Updating destination...");
        const payload = {
          images: [...(formData.uploaded_images ?? []), ...allImages],
          title: formData.title,
          slug: convertToSlug(formData.title),
          minimum_pax: formData.pax,
          description: formData.description,
          duration: formData.duration,
          price: Number(formData.price),
          inclusions: formData.inclusions,
          video_url: videoURL ?? formData.uploaded_video,
          category_id: formData.categoryId,
          thumbnail_image: formData.thumbnail_image,
        };

        const updateDestination = await fetch(`/api/destination?id=${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const updateDestinationResult = await updateDestination.json();
        if (updateDestinationResult.success) {
          toast.success(updateDestinationResult.message, {
            id: uploadToast,
          });
          setFormData((prevData) => ({
            ...prevData,
            video: null,
            images: null,
            uploaded_images: [],
            uploaded_video: "",
          }));
          router.back();
        } else {
          toast.error(updateDestinationResult.message);
        }
      } catch (error: any) {
        toast.error(`Destination update failed: ${error.message}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      formData,
      errors,
      loading,
      destination,
      categoryOptions,
      lightbox,
      slideIndex,
    },
    actions: {
      handleChange,
      handleSubmit,
      handleRemoveImage,
      handleToggleLightbox,
      handleSetThumbnail,
      handleRemoveVideo,
    },
  };
};

export default useUpdateDestination;
