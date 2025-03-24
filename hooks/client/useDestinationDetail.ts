import { Destination } from "@/constants/types";
import { formatDate } from "@/utils/dateFormatter";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { z, ZodSchema } from "zod";
import { parseTaxRate } from "@/utils/parseRates";
import toast from "react-hot-toast";
import { generateIds } from "@/utils/generateIds";
import { capitalizeWords } from "@/utils/capitalizeWords";
import moment from "moment";
import { calculateTotalPrice } from "@/utils/calculateTotalPrice";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface FormData {
  nameTitle: string;
  title: string;
  name: string;
  email: string;
  bookingDate: string;
  pickupLocation: string;
  pax: number;
  message?: string;
}

export interface UseDestinationDetail {
  state: {
    data: Destination | null;
    slug: string;
    isExpanded: boolean;
    gridNumberImage: number;
    slicedImages: string[];
    remainingImages: string[];
    hasVideo: boolean;
    isLoadingOtherDestination: boolean;
    isLoadingDestination: boolean;
    isLoadingSubmit: boolean;
    formData: FormData;
    errors: Record<string, string>;
    images: string[];
    lightbox: boolean;
    lightboxIndex: number;
    isOpen: boolean;
    otherDestinations: Destination[];
  };
  refs?: {
    brochureRef: React.MutableRefObject<HTMLDivElement | null>;
  };
  actions: {
    handleToggleExpanded: () => void;
    handleToggleLightbox: (image: string) => void;
    handleSubmit: () => void;
    handleChange: (value: number | string, name: string) => void;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    handleToggleModal: () => void;
  };
}

const initialFormData = {
  title: "",
  nameTitle: "mr",
  name: "",
  email: "",
  bookingDate: moment().format("YYYY-MM-DD HH:mm:ss"),
  pickupLocation: "",
  pax: 1,
  message: "",
};

const useDestinationDetail = (
  publicKey: string,
  serviceId: string,
  slug: string
): UseDestinationDetail => {
  const [data, setData] = useState<Destination | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [gridNumberImage, setGridNumberImage] = useState<number>(5);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lightbox, setLightbox] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const brochureRef = useRef<HTMLDivElement | null>(null);

  const handleToggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleLightbox = (image: string) => {
    const imageIndex = data?.images.findIndex((img) => img === image) as number;
    setLightboxIndex(imageIndex + 1);
    setLightbox(!lightbox);
  };

  const schema: ZodSchema = z.object({
    title: z.string().min(1, "Destination name is required"),
    name: z
      .string()
      .min(1, "The full name is required")
      .max(
        100,
        "The full name cannot exceed 100 characters. Please shorten your entry"
      ),
    email: z
      .string()
      .email("Please provide a valid email address (e.g., name@example.com).")
      .min(1, "The email is required")
      .max(
        255,
        "The email address cannot exceed 254 characters. Please provide a valid email."
      ),
    bookingDate: z
      .string()
      .min(1, "The booking date is required")
      .refine(
        (date) => {
          const bookDate = moment(date, "YYYY-MM-DD");
          return !bookDate.isBefore(moment().startOf("day"));
        },
        {
          message:
            "The booking date cannot be in the past. Please select a valid date.",
        }
      ),
    pickupLocation: z
      .string()
      .min(1, "The pickup location is required")
      .max(
        255,
        "The pickup location cannot exceed 255 characters. Please revise your entry"
      ),
    pax: z.number().min(data?.minimum_pax ?? 1),
    message: z.string().optional(),
  });

  const handleChange = (value: number | string, name: string) => {
    console.log(value);
    const updatedValue =
      name === "bookingDate"
        ? moment(value).format("YYYY-MM-DD") + " " + moment().format("HH:mm:ss")
        : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: updatedValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    const subtotal = (data?.price ?? 0) * Number(formData.pax);
    const taxrate = 0.05;
    const { grandTotal, tax } = calculateTotalPrice(subtotal, taxrate);
    const bookingId = generateIds("BKG");

    const emailPayload = {
      customer_name: capitalizeWords(`${formData.nameTitle}. ${formData.name}`),
      customer_email: formData.email,
      destination: formData.title,
      duration: data?.duration ?? "",
      pax: formData.pax,
      booking_date: formatDate(formData.bookingDate),
      pickup_location: capitalizeWords(formData.pickupLocation),
      message: formData.message ?? "-",
    };

    const bookingPayload = {
      id: bookingId,
      destination_id: data?.id,
      name: capitalizeWords(`${formData.nameTitle}. ${formData.name}`),
      email: formData.email,
      booking_date: formData.bookingDate,
      status: "pending",
      pax: formData.pax,
      tax,
      tax_rate: parseTaxRate(taxrate),
      subtotal,
      total: grandTotal,
      pickup_location: capitalizeWords(formData.pickupLocation),
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    const toastId = toast.loading("Creating your booking...");
    setIsLoadingSubmit(true);
    try {
      schema.parse(formData);
      const templateId = "template_jtoz9nl";
      if (serviceId && publicKey) {
        const createBooking = await fetch("/api/client/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        });

        const emailResponse = await emailjs.send(
          "service_r0xd3fi",
          templateId,
          emailPayload,
          {
            publicKey: "fvGCXf4WbE1tRZUcz",
          }
        );

        const bookingResponse = await createBooking.json();

        if (bookingResponse.success && emailResponse.status === 200) {
          toast.success(
            "Thank you for your booking! We will notify you shortly with further details.",
            {
              id: toastId,
              duration: 7000,
            }
          );

          let initData = { ...initialFormData };
          initData["title"] = data?.title ?? "";
          initData["pax"] = data?.minimum_pax ?? 2;
          setFormData(initData);
          setErrors({});
          handleToggleModal();
        } else {
          toast.error(bookingResponse.message, { id: toastId });
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
        setIsLoadingSubmit(false);
        toast.dismiss(toastId);
      } else {
        console.error("Error sending email:", error);
        toast.error("There was an unexpected error. Please try again later.", {
          id: toastId,
        });
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const updateGridNumberImage = () => {
    const width = window.innerWidth;

    if (width < 640) {
      setGridNumberImage(4);
    } else if (width >= 640 && width < 768) {
      setGridNumberImage(2);
    } else if (width >= 768 && width < 1024) {
      setGridNumberImage(2);
    } else {
      setGridNumberImage(4);
    }
  };

  useEffect(() => {
    updateGridNumberImage(); // Set initial value
    const handleResize = () => {
      updateGridNumberImage();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  const {
    data: otherDestinationResponse,
    isLoading: isLoadingOtherDestination,
  } = useSWR<{
    data: Destination[];
    totalRows: number;
  }>(
    `/api/client/destination?page=1&limit=8&sort=average_rating&order=asc`,
    fetcher
  );
  const otherDestinations: Destination[] = otherDestinationResponse?.data || [];

  const {
    data: destinationResponse,
    isLoading: isLoadingDestination,
    error,
  } = useSWR<{
    data: Destination[];
    totalRows: number;
  }>(slug ? `/api/client/destination?slug=${slug}` : undefined, fetcher);

  const destination: Destination | null =
    destinationResponse?.data && destinationResponse.data?.length !== 0
      ? destinationResponse.data[0]
      : null;

  useEffect(() => {
    if (destination) {
      setData(destination);
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: destination?.title,
        pax: destination?.minimum_pax,
      }));
    }
  }, [destination]);

  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const hasVideo = data?.video_url ? true : false;
  const images = hasVideo
    ? data?.images ?? []
    : data?.thumbnail_image
    ? data?.images?.filter((img) => img !== data.thumbnail_image) ?? []
    : data?.images.slice(1) ?? [];

  const slicedImages =
    images.length > gridNumberImage ? images?.slice(0, gridNumberImage) : [];

  const remainingImages =
    images.length > gridNumberImage ? images?.slice(gridNumberImage) : [];

  return {
    state: {
      errors,
      formData,
      isLoadingDestination,
      isLoadingOtherDestination,
      gridNumberImage,
      data,
      slug,
      isExpanded,
      slicedImages,
      remainingImages,
      hasVideo,
      isLoadingSubmit,
      images,
      lightbox,
      lightboxIndex,
      isOpen,
      otherDestinations,
    },
    refs: {
      brochureRef,
    },
    actions: {
      handleToggleExpanded,
      handleSubmit,
      handleChange,
      setFormData,
      handleToggleLightbox,
      handleToggleModal,
    },
  };
};

export default useDestinationDetail;
