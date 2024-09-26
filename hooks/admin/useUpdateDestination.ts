import { useCallback, useEffect, useState } from "react";
import { z, ZodSchema } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Destination, Options } from "@/constants/types";
import { convertToSlug } from "@/utils/convertToSlug";
import { generateFilename } from "@/utils/generateFilename";
import useAdminCategory from "./useAdminCategory";

interface FormData {
  uploaded_images?: string[] | [];
  images: FileList | null;
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
}

interface UseUpdateDestination {
  state: UseUpdateDestinationState;
  actions: {
    handleRemoveImage: (imageURL: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (
      value: string | number | string[] | File | FileList | null,
      name: string
    ) => void;
  };
}

const initialFormData: FormData = {
  uploaded_images: [],
  images: null,
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
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Options[] | []>([]);

  const { state: category } = useAdminCategory();

  const router = useRouter();

  const fetchDestinationBySlug = async () => {
    const response = await fetch(`/api/destination?id=${id}`);
    const result = await response.json();
    if (result.success) {
      const data = result.data[0];
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
      }));
    }
  };

  useEffect(() => {
    fetchDestinationBySlug();
  }, []);

  useEffect(() => {
    if (category.categories.length > 0) {
      const options: Options[] = category.categories.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setCategoryOptions(options);
      setFormData((prevData) => ({
        ...prevData,
        categoryId: formData.categoryId ?? category.categories[0].id,
      }));
    }
  }, [category]);

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
    if ((newImages ?? [])?.length > 0) {
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
    },
    actions: {
      handleChange,
      handleSubmit,
      handleRemoveImage,
    },
  };
};

export default useUpdateDestination;
