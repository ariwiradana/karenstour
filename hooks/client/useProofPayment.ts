import { Booking, PaymentProof } from "@/constants/types";
import { getFileExtension } from "@/utils/getFileExtention";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProofPaymentReturn {
  state: {
    file: File | null;
    data: Booking | null;
    loading: boolean;
  };
  actions: {
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  };
}

const useProofPayment = (id: string): ProofPaymentReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Booking | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkBooking = useCallback(async () => {
    const existResponse = await fetch(`/api/client/booking/check?id=${id}`);
    const result = await existResponse.json();

    console.log({ result });

    const uploadedResponse = await fetch(
      `/api/client/booking?id=${encodeURIComponent(id)}`
    );
    const response = await uploadedResponse.json();
    const res = response.data;
    if (res) {
      setBooking(res);
    }

    if (result?.data) {
      setData(result.data);
    }
    try {
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkBooking();
  }, [checkBooking]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (file) {
      try {
        const toastUpload = toast.loading("Uploading...");

        const response = await fetch(
          `/api/client/booking/payment-proof?id=${id}&filetype=${file.type}`,
          {
            method: "POST",
            body: file,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData);
          toast.error(errorData.message, {
            id: toastUpload,
          });
        } else {
          const result = await response.json();
          toast.success(result.message, {
            id: toastUpload,
          });
          checkBooking();
          setFile(null);
        }
      } catch (error: any) {
        console.error("Fetch error:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    state: {
      loading,
      file,
      data,
    },
    actions: {
      handleFileChange,
      handleSubmit,
    },
  };
};

export default useProofPayment;
