import { useCallback, useEffect, useState } from "react";
import { z, ZodSchema } from "zod";
import moment, { Moment } from "moment";
import toast from "react-hot-toast";
import { Destination, Options } from "@/constants/types";
import { generateIds } from "@/utils/generateIds";
import { calculateTotalPrice } from "@/utils/calculateTotalPrice";
import { parseTaxRate } from "@/utils/parseRates";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { convertHoursToReadableFormat } from "@/utils/convertToReadableHours";
import { formatDate } from "@/utils/dateFormatter";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/router";

interface FormData {
  name: string;
  email: string;
  bookingDate: string;
  destination: string;
  pax: number;
  pickupLocation: string;
}

interface UseAdminAddBookingState {
  formData: FormData;
  errors: Record<string, string>;
  loading: boolean;
  options: Options[] | [];
}

interface UseAdminAddBooking {
  state: UseAdminAddBookingState;
  actions: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (value: string | number, name: string) => void;
  };
}

const initialFormData: FormData = {
  name: "",
  email: "",
  bookingDate: moment().format("YYYY-MM-DD"),
  destination: "",
  pax: 1,
  pickupLocation: "",
};

const useAdminAddBooking = (
  publicKey: string,
  serviceId: string
): UseAdminAddBooking => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [options, setOptions] = useState<Options[] | []>([]);

  const router = useRouter();

  const schema = z.object({
    name: z
      .string()
      .min(5, { message: "The name must be at least 5 characters long." }),
    email: z.string().email({ message: "Must be a valid email address." }),
    bookingDate: z.string().min(1, { message: "Booking date is required" }),
    destination: z.string().min(1, { message: "Destination is required." }),
    pax: z
      .number()
      .min(1, { message: "The number of participants must be at least 1." }),
    pickupLocation: z.string().min(1, {
      message: "Pickup location is required",
    }),
  });

  const fetchDestinations = useCallback(async () => {
    try {
      let url = `/api/destination`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.success) {
        const optionData: Options[] = result.data.map((item: Destination) => ({
          label: item.title,
          value: `${item.id}-${item.title}-${item.price}-${item.duration}`,
        }));
        setOptions(optionData);
      }
    } catch (error: any) {
      toast.error("Failed to load destinations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleChange = (value: string | number, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subtotal =
      (Number(formData.destination.split("-")[2]) ?? 0) * Number(formData.pax);
    const taxrate = 0.05;
    const { grandTotal, tax } = calculateTotalPrice(subtotal, taxrate);

    const payload = {
      id: generateIds("BKG"),
      destination_id: Number(formData.destination.split("-")[0]),
      name: formData.name,
      email: formData.email,
      booking_date: formData.bookingDate,
      status: "pending",
      pax: formData.pax,
      pickup_location: formData.pickupLocation,
      subtotal,
      tax,
      tax_rate: parseTaxRate(taxrate),
      total: grandTotal,
      created_at: moment().format("YYYY-MM-DD"),
      updated_at: moment().format("YYYY-MM-DD"),
    };

    const emailPayload = {
      customer_name: capitalizeWords(formData.name),
      customer_email: formData.email,
      destination: formData.destination.split("-")[1],
      duration: convertHoursToReadableFormat(
        Number(formData.destination.split("-")[3])
      ),
      pax: formData.pax,
      booking_date: formData.bookingDate,
      pickup_location: capitalizeWords(formData.pickupLocation),
      message: "-",
    };

    try {
      setLoading(true);
      schema.parse(formData);

      const toastId = toast.loading("Creating new booking...");
      const templateId = "template_jtoz9nl";

      if (serviceId && publicKey) {
        const createBooking = await fetch("/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
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
          toast.success("Successfully add new booking.", {
            id: toastId,
          });
          setFormData(initialFormData);
          router.back();
        } else {
          toast.error(bookingResponse.message);
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
      options,
      formData,
      errors,
      loading,
    },
    actions: {
      handleChange,
      handleSubmit,
    },
  };
};

export default useAdminAddBooking;
