import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { z, ZodSchema } from "zod";
import { User } from "@/constants/types";
import toast from "react-hot-toast";

interface UseAdminLoginState {
  formData: User;
  errors: Record<string, string>;
  loading: boolean;
}

interface UseAdminLogin {
  state: UseAdminLoginState;
  actions: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

const initialFormData: User = {
  username: "",
  password: "",
};

const useAdminLogin = (): UseAdminLogin => {
  const [formData, setFormData] = useState<User>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const schema = z.object({
    username: z
      .string()
      .min(5, { message: "The username must be at least 5 characters long." }),
    password: z
      .string()
      .min(5, { message: "The password must be at least 5 characters long." }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      schema.parse(formData);
      const toastLogin = toast.loading("Logged in....");
      const payload: User = {
        username: formData.username,
        password: formData.password,
      };
      const res = await fetch("/api/auth/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) {
        toast.error(result.message, { id: toastLogin });
        return;
      }
      router.push("/admin");
    } catch (error: any) {
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
    },
    actions: {
      handleChange,
      handleSubmit,
    },
  };
};

export default useAdminLogin;
