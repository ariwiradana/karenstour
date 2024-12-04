import { useCallback, useEffect, useState } from "react";
import { z, ZodSchema } from "zod";
import toast from "react-hot-toast";
import { Category, Destination, Options } from "@/constants/types";
import { convertToSlug } from "@/utils/convertToSlug";
import { generateFilename } from "@/utils/generateFilename";
import { useFetch } from "@/lib/useFetch";

interface Form {
  uploaded_images?: string[] | [];
  images: FileList | null;
  thumbnail_image?: string;
  title: string;
  categories: string[];
  pax: number;
  description: string;
  duration: string;
  price: number;
  inclusions: string[];
  inventory: string[];
  video?: File | null;
  uploaded_video?: string;
}

interface UseUpdateDestinationState {
  formData: Form;
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

const initialFormData: Form = {
  uploaded_images: [],
  images: null,
  thumbnail_image: "",
  title: "",
  categories: [],
  pax: 1,
  description: "",
  duration: "",
  price: 0,
  inclusions: [],
  inventory: [],
  video: null,
};

const isFileList = (value: any): value is FileList => {
  return value instanceof window.FileList;
};

const useUpdateDestination = (
  id: string | number,
  authToken: string
): UseUpdateDestination => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [lightbox, setLightbox] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [formData, setFormData] = useState<Form>(initialFormData);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Options[] | []>([]);

  const handleToggleLightbox = (index: number) => {
    console.log(index);
    setLightbox(!lightbox);
    setSlideIndex(index);
  };

  const fetchDestinationBySlug = useCallback(async () => {
    const toastFetch = toast.loading("Load destination...");
    try {
      const response = await useFetch(`/api/destination?id=${id}`, authToken);
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
          inventory: data.inventory,
          duration: data.duration,
          pax: data.minimum_pax,
          price: data.price,
          uploaded_images: data.images,
          uploaded_video: data.video_url,
          categories: data.categories || [],
          thumbnail_image: data.thumbnail_image,
        }));
      } else {
        toast.error(result.message, { id: toastFetch });
      }
      fetchCategoryOptions();
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const fetchCategoryOptions = useCallback(async () => {
    try {
      const categoryResponse = await useFetch(`/api/category`, authToken);
      const categoryResult = await categoryResponse.json();

      if (categoryResult.success) {
        const options: Options[] = categoryResult.data.map(
          (category: Category) => ({
            label: category.name,
            value: category.name,
          })
        );
        setCategoryOptions(options);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchDestinationBySlug();
  }, [fetchDestinationBySlug]);

  const schema: ZodSchema = z.object({
    images: z.any().refine((value) => value === null || isFileList(value), {
      message: "Please select at least one image file.",
    }),
    title: z.string().min(5, "The title must be at least 5 characters long."),
    duration: z.string().min(1, "The duration cannot be empty."),
    pax: z.any().refine((value) => !isNaN(value), {
      message: "The number of participants must be at least 1.",
    }),
    description: z.string().nullable(),
    price: z.any().refine((value) => !isNaN(value), {
      message: "The price must be a valid number.",
    }),
    inclusions: z.array(z.string()).min(1, {
      message: "At least one inclusion must be provided.",
    }),
    inventory: z.array(z.string()).min(1, {
      message: "At least one inventory must be provided.",
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
    if (name === "categories") {
      let newCategories = [...formData.categories];
      if (newCategories.includes(value as string)) {
        newCategories = newCategories.filter((c) => c !== value);
      } else {
        newCategories.push(value as string);
      }
      setFormData((prevState) => ({
        ...prevState,
        categories: newCategories,
      }));
      console.log({ newCategories, value });
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleRemoveImage = async (imageURL: string) => {
    const newImages = formData.uploaded_images?.filter(
      (image) => image !== imageURL
    );
    if ((newImages ?? [])?.length > -1) {
      try {
        setLoading(true);
        const response = await useFetch(
          `/api/destination/delete-file?url=${encodeURIComponent(
            imageURL
          )}&destination_id=${encodeURIComponent(id)}&category=images`,
          authToken,
          "POST"
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
        const response = await useFetch(
          `/api/destination/delete-file?url=${encodeURIComponent(
            videoURL
          )}&destination_id=${encodeURIComponent(id)}&category=video_url`,
          authToken,
          "POST"
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
      const response = await useFetch(
        `/api/destination?id=${id}`,
        authToken,
        "PUT",
        updatedDestination
      );
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

  const clearFileInput = () => {
    const videoInput = document.getElementById("video") as HTMLInputElement;
    const imagesInput = document.getElementById("images") as HTMLInputElement;
    if (videoInput) videoInput.value = "";
    if (imagesInput) imagesInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      schema.parse(formData);

      // Prepare variables for uploads
      let videoURL: string = "";

      // Upload video if it exists
      const video = formData.video;
      if (video) {
        const fileVideo = video instanceof FileList ? video[0] : video;
        const uploadToast = toast.loading(`Video is uploading...`);
        try {
          const fd = new FormData();
          fd.append("file", fileVideo);

          const response = await fetch(`/api/upload-file`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: fd,
          });
          const result = await response.json();
          if (result.success) {
            if (formData.uploaded_video) {
              await useFetch(
                `/api/destination/delete-file?url=${encodeURIComponent(
                  formData.uploaded_video
                )}&destination_id=${encodeURIComponent(id)}&category=video_url`,
                authToken,
                "POST"
              );
            }
            videoURL = result.data.secure_url;
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
      const images = formData.images;
      let allImages: string[] = [];

      if (images && images.length > 0) {
        let i = 0;
        for (const image of Array.from(images)) {
          i++;
          const toastId = toast.loading(
            `Image (${i}) ${image.name} is uploading...`
          ); // Use image.name for informative message
          try {
            const fdImg = new FormData();
            fdImg.append("file", image);

            const response = await fetch(`/api/upload-file`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
              body: fdImg,
            });

            const result = await response.json();
            if (result.success) {
              allImages.push(result.data.secure_url);
              toast.success(
                `Image (${i}) ${image.name} uploaded successfully!`,
                {
                  id: toastId,
                }
              );
            } else {
              console.warn(
                `Image upload failed for ${image.name}: ${result.message}`
              );
              continue;
            }
          } catch (error: any) {
            console.error(`Image upload failed: ${error.message}`);
          } finally {
            toast.dismiss(toastId);
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
          inventory: formData.inventory,
          video_url: videoURL ?? formData.uploaded_video,
          categories: formData.categories,
          thumbnail_image: formData.thumbnail_image,
        };

        const updateDestination = await useFetch(
          `/api/destination?id=${id}`,
          authToken,
          "PUT",
          payload
        );
        const updateDestinationResult = await updateDestination.json();
        if (updateDestinationResult.success) {
          toast.success(updateDestinationResult.message, {
            id: uploadToast,
          });
          clearFileInput();
          fetchDestinationBySlug();
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
