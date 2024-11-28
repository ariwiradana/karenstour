import { useCallback, useEffect, useState } from "react";
import { z, ZodSchema } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { convertToSlug } from "@/utils/convertToSlug";
import { generateFilename } from "@/utils/generateFilename";
import { Category, Options } from "@/constants/types";
import { useFetch } from "@/lib/useFetch";

interface FormData {
  images: FileList | null;
  title: string;
  categories: string[];
  pax: number;
  description: string;
  duration: number;
  price: number;
  inclusions: string[];
  inventory: string[];
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
  categories: [],
  pax: 1,
  description: "",
  duration: 1,
  price: 0,
  inclusions: [],
  inventory: [],
  video: null,
};

const isFileList = (value: any): value is FileList => {
  return value instanceof window.FileList;
};

const useAdminAddDestination = (authToken: string): UseAdminAddDestination => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [categoryOptions, setCategoryOptions] = useState<Options[] | []>([]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    let url = `/api/category`;
    try {
      const response = await useFetch(url, authToken);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      if (result.success) {
        const options: Options[] = result.data.map((category: Category) => ({
          label: category.name,
          value: category.name,
        }));
        setCategoryOptions(options);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const router = useRouter();

  const schema: ZodSchema = z.object({
    images: z.any().refine((value) => isFileList(value), {
      message: "Please select at least one image file.",
    }),
    title: z.string().min(5, "The title must be at least 5 characters long."),
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

  console.log({ formData });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({ formData });

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
          const response = await useFetch(
            `/api/destination/upload-file?filename=${encodeURIComponent(
              filename
            )}&filepath=${encodeURIComponent(
              filepath
            )}&filetype=${fileVideo.type.toLowerCase()}&filesize=${
              fileVideo.size
            }&category=video`,
            authToken,
            "POST",
            fileVideo
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
            const response = await useFetch(
              `/api/destination/upload-file?filename=${encodeURIComponent(
                filename
              )}&filepath=${encodeURIComponent(
                filepath
              )}&filetype=${image.type.toLowerCase()}&filesize&${
                image.size
              }&category=image`,
              authToken,
              "POST",
              image
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
            inventory: formData.inventory,
            video_url: videoURL ?? "",
            categories: formData.categories ?? [],
          };

          const createDestination = await useFetch(
            "/api/destination",
            authToken,
            "POST",
            payload
          );
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
