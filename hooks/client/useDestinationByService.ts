import { Destination } from "@/constants/types";
import { useEffect, useState } from "react";

interface UseDestinationByServiceState {
  firstSlide: boolean;
  lastSlide: boolean;
  data: Destination[] | [];
  error: string | null;
  loading: boolean;
}

interface UseDestinationByService {
  state: UseDestinationByServiceState;
  actions: {
    setFirstSlide: (value: boolean) => void;
    setLastSlide: (value: boolean) => void;
  };
}

const useDestinationByService = (id: number): UseDestinationByService => {
  const [firstSlide, setFirstSlide] = useState<boolean>(true);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const [data, setData] = useState<Destination[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinationByService = async () => {
      try {
        const response = await fetch(`/api/client/destination?service=${id}&limit=8`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
          setData(result?.data);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationByService();
  }, []);

  return {
    state: {
      firstSlide,
      lastSlide,
      data,
      error,
      loading,
    },
    actions: {
      setFirstSlide,
      setLastSlide,
    },
  };
};

export default useDestinationByService;
