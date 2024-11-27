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
import { useFetch } from "@/lib/useFetch";

interface FormData {
  name: string;
}

interface UseAdminAddCategoryState {
  formData: FormData;
  errors: Record<string, string>;
  loading: boolean;
  options: Options[] | [];
}

interface UseAdminAddCategory {
  state: UseAdminAddCategoryState;
  actions: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (value: string | number, name: string) => void;
  };
}

const initialFormData: FormData = {
  name: "",
};

const useAdminAddCategory = (authToken: string): UseAdminAddCategory => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [options] = useState<Options[] | []>([]);

  const router = useRouter();

  const schema = z.object({
    name: z.string().min(2, {
      message: "The category name must be at least 2 characters long.",
    }),
  });

  const handleChange = (value: string | number, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: capitalizeWords(formData.name),
    };

    try {
      setLoading(true);
      schema.parse(formData);

      const toastCreate = toast.loading("Creating new category...");

      const response = await useFetch(
        "/api/category",
        authToken,
        "POST",
        payload
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Successfully add new booking.", {
          id: toastCreate,
        });
        setFormData(initialFormData);
        router.back();
      } else {
        toast.error(result.message);
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

export default useAdminAddCategory;
