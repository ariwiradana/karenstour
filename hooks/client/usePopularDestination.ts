import { Destination } from "@/constants/types";
import { useEffect, useState } from "react";

interface UsePopularDestinationState {
  firstSlide: boolean;
  lastSlide: boolean;
  data: Destination[] | [];
  error: string | null;
  loading: boolean;
}

interface UsePopularDestination {
  state: UsePopularDestinationState;
  actions: {
    setFirstSlide: (value: boolean) => void;
    setLastSlide: (value: boolean) => void;
  };
}

const usePopularDestination = (
  exceptionId?: number | null
): UsePopularDestination => {
  const [firstSlide, setFirstSlide] = useState<boolean>(true);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const [data, setData] = useState<Destination[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularDestination = async () => {
      try {
        const response = await fetch(
          "/api/destination?limit=10&sort=average_rating&order=asc"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
          if (exceptionId) {
            const newData = result.data.filter(
              (item: Destination) => item.id !== exceptionId
            );
            setData(newData);
          } else {
            setData(result.data);
          }
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDestination();
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

export default usePopularDestination;
