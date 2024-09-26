import { useEffect, useState } from "react";
import { z, ZodSchema } from "zod";
import { upload } from "@vercel/blob/client";
import toast from "react-hot-toast";
import { PutBlobResult } from "@vercel/blob";
import { useRouter } from "next/router";
import { generateIds } from "@/utils/generateIds";
import { convertToSlug } from "@/utils/convertToSlug";
import { generateFilename } from "@/utils/generateFilename";
import { Options } from "@/constants/types";
import useAdminCategory from "./useAdminCategory";

interface FormData {
  images: FileList | null;
  title: string;
  categoryId: number | null;
  pax: number;
  description: string;
  duration: number;
  price: number;
  inclusions: string[];
  video?: File | null;
}

interface UseAdminAddDestinationState {
  formData: FormData;
  errors: Record<string, string>;
  loading: boolean;
  categoryOptions: Options[] | [];
}

interface UseAdminAddDestination {
  state: UseAdminAddDestinationState;
  actions: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (
      value: string | number | string[] | File | FileList | null,
      name: string
    ) => void;
  };
}

const initialFormData: FormData = {
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

const useAdminAddDestination = (): UseAdminAddDestination => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [categoryOptions, setCategoryOptions] = useState<Options[] | []>([]);

  const { state: category } = useAdminCategory();

  const router = useRouter();

  const schema: ZodSchema = z.object({
    images: z.any().refine((value) => isFileList(value), {
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

  const handleChange = (
    value: string | number | string[] | File | FileList | null,
    name: string
  ) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
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
            videoURL = result.data.url;
            toast.success(`Video uploaded successfully!`, {
              id: uploadToast,
              duration: 3000,
            });
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
            const filepath = `destination/images`;
            const response = await fetch(
              `/api/destination/upload-file?filename=${encodeURIComponent(
                filename
              )}&filepath=${encodeURIComponent(
                filepath
              )}&filetype=${image.type.toLowerCase()}&filesize&${
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
                  duration: 3000,
                }
              );
            } else {
              toast.error(result.message, {
                id: uploadToast,
                duration: 3000,
              });
              continue;
            }
          } catch (error: any) {
            toast.error(`Image upload failed: ${error.message}`, {
              duration: 3000,
              id: uploadToast,
            });
            return;
          }
        }
      }

      if (allImages.length > 0 || videoURL) {
        const uploadToast = toast.loading("Adding new destination...");
        try {
          const payload = {
            images: allImages,
            title: formData.title,
            slug: convertToSlug(formData.title),
            minimum_pax: formData.pax,
            description: formData.description,
            duration: formData.duration,
            price: Number(formData.price),
            inclusions: formData.inclusions,
            video_url: videoURL ?? "",
            category_id: formData.categoryId ?? "",
          };

          const createDestination = await fetch("/api/destination", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const createDestinationResult = await createDestination.json();
          if (createDestinationResult.success) {
            toast.success(createDestinationResult.message, {
              id: uploadToast,
              duration: 3000,
            });
            router.back();
          } else {
            toast.error(createDestinationResult.message, {
              id: uploadToast,
              duration: 3000,
            });
          }
        } catch (error: any) {
          toast.error(`Destination creation failed: ${error.message}`, {
            duration: 3000,
            id: uploadToast,
          });
        }
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
      categoryOptions,
    },
    actions: {
      handleChange,
      handleSubmit,
    },
  };
};

export default useAdminAddDestination;
