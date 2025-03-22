// ParallaxSection.tsx
import { unbounded } from "@/constants/font";
import React from "react";
import ButtonPrimary from "./elements/button.primary";
import { RiWhatsappLine } from "react-icons/ri";
import Link from "next/link";
import { contact } from "@/constants/data";

const BookNow: React.FC = () => {
  return (
    <div
      className="relative py-16 lg:py-28 bg-fixed bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('/images/hero.webp')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b bg-primary/50 backdrop-blur-sm"></div>
      <div
        className={`relative z-10 flex items-center justify-center h-full ${unbounded.className}`}
      >
        <div className="flex flex-col gap-y-4">
          <div className="px-6 md:px-8 lg:px-0">
            <h1 className="lg:text-3xl text-2xl font-bold text-white text-center">
              Have Any Questions?
            </h1>
            <p className="text-white text-sm lg:text-base font-light max-w-3xl text-center leading-6 my-5">
              Planning a trip can be overwhelming, but we&ldquo;re here to help!
              If you have questions or need booking assistance, feel free to
              reach out. Our team is ready to guide you!
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 px-6 md:px-8 lg:px-0">
            <Link href={contact.whatsapp} target="_blank">
              <ButtonPrimary
                id="button-book-now"
                className="w-auto"
                icon={<RiWhatsappLine className="text-2xl" />}
                title="Chat with Us"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;
