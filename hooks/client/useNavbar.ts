import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface UseNavbar {
  state: {
    locale: string;
    isTop: boolean;
    isShowMenu: boolean;
  };
  actions: {
    setLocale: (value: string) => void;
    setIsTop: (value: boolean) => void;
    handleShowMenu: () => void;
  };
}

const useNavbar = (): UseNavbar => {
  const router = useRouter();
  const [locale, setLocale] = useState<string>(router.locale || "en");
  const [isTop, setIsTop] = useState<boolean>(true);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);

  const handleScroll = () => setIsTop(window.scrollY === 0);
  const handleShowMenu = () => setIsShowMenu(!isShowMenu);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsShowMenu(false);
  }, [router]);

  return {
    state: {
      locale,
      isTop,
      isShowMenu,
    },
    actions: {
      setIsTop,
      setLocale,
      handleShowMenu,
    },
  };
};

export default useNavbar;
