import React, { useCallback, useEffect, useState } from "react";

interface UseGoTop {
  state: {
    isVisible: boolean;
  };
  actions: {
    handleScrollToTop: () => void;
  };
}

const useGoTop = (): UseGoTop => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleScroll = useCallback(() => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY;
    setIsVisible(scrollY > scrollHeight * 0.9);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    state: {
      isVisible,
    },
    actions: {
      handleScrollToTop,
    },
  };
};

export default useGoTop;
