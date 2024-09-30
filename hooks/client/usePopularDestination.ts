import { Destination } from "@/constants/types";
import { useEffect, useState } from "react";

interface UsePopularDestinationState {
  firstSlide: boolean;
  lastSlide: boolean;
  data: Destination[] | [];
  error: string | null;
  loading: boolean;
  activeIndex: number;
  slidesPerView: number;
}

interface UsePopularDestination {
  state: UsePopularDestinationState;
  actions: {
    setFirstSlide: (value: boolean) => void;
    setLastSlide: (value: boolean) => void;
    handleActiveIndex: (index: number, slidesPerView: number) => void;
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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(1);

  const handleActiveIndex = (index: number, slidesPerView: number) => {
    setActiveIndex(index);
    setSlidesPerView(slidesPerView);
  };

  const updateSlidesPerView = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setSlidesPerView(4);
    } else if (width >= 768) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(1);
    }
  };

  useEffect(() => {
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => {
      window.removeEventListener("resize", updateSlidesPerView);
    };
  }, []);

  useEffect(() => {
    const fetchPopularDestination = async () => {
      try {
        const response = await fetch(
          "/api/destination?page=1&limit=7&sort=average_rating&order=asc"
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
      activeIndex,
      slidesPerView,
      firstSlide,
      lastSlide,
      data,
      error,
      loading,
    },
    actions: {
      setFirstSlide,
      setLastSlide,
      handleActiveIndex,
    },
  };
};

export default usePopularDestination;
