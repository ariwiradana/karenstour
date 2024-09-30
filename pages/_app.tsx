import i18n from "@/i18n";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Toaster } from "react-hot-toast";
import NextNProgress from "nextjs-progressbar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if (router.locale) {
    i18n.changeLanguage(router.locale);
  }

  return (
    <>
      <NextNProgress color="#317039" />
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
