import { Destination } from "@/constants/types";
import { fetcher } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface UsePopularDestinationState {
  firstSlide: boolean;
  lastSlide: boolean;
  destinations: Destination[] | [];
  error: string | null;
  isLoading: boolean;
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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(1);

  const handleActiveIndex = (index: number, slidesPerView: number) => {
    setActiveIndex(index);
    setSlidesPerView(slidesPerView);
  };

  const updateSlidesPerView = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setSlidesPerView(3);
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

  const { data, isLoading, error } = useSWR<{ data: Destination[] }>(
    "/api/client/destination?page=1&limit=7&sort=average_rating&order=asc",
    fetcher
  );

  const destinations = data?.data || [];

  return {
    state: {
      activeIndex,
      slidesPerView,
      firstSlide,
      lastSlide,
      destinations,
      error,
      isLoading,
    },
    actions: {
      setFirstSlide,
      setLastSlide,
      handleActiveIndex,
    },
  };
};

export default usePopularDestination;
