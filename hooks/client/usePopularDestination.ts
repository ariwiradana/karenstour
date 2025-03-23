import { useEffect, useState } from "react";

interface UsePopularDestinationState {
  firstSlide: boolean;
  lastSlide: boolean;
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

const usePopularDestination = (): UsePopularDestination => {
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
      setSlidesPerView(4);
    } else if (width >= 768) {
      setSlidesPerView(3);
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

  return {
    state: {
      activeIndex,
      slidesPerView,
      firstSlide,
      lastSlide,
    },
    actions: {
      setFirstSlide,
      setLastSlide,
      handleActiveIndex,
    },
  };
};

export default usePopularDestination;
