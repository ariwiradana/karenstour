import React, { FC, ReactNode } from "react";
import Container from "./container";
import { unbounded } from "@/constants/font";
import Link from "next/link";
import { RiInstagramFill, RiMailFill, RiWhatsappFill } from "react-icons/ri";
import Image from "next/image";
import { t } from "i18next";
import { contact } from "@/constants/data";

type Social = {
  path: string;
  icon: ReactNode;
};

const socials: Social[] = [
  {
    path: contact.whatsapp,
    icon: <RiWhatsappFill className="text-primary text-2xl" />,
  },
  {
    path: contact.instagram,
    icon: <RiInstagramFill className="text-primary text-2xl" />,
  },
  {
    path: contact.email,
    icon: <RiMailFill className="text-primary text-2xl" />,
  },
];

const Footer: FC = () => {
  return (
    <div className="bg-lightgray py-16 lg:py-20">
      <Container className={unbounded.className}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <FooterLeft />
          <FooterRight />
        </div>
      </Container>
    </div>
  );

  function FooterRight() {
    return (
      <div className="flex flex-col items-center md:items-end">
        <Image
          src="/images/logo.webp"
          alt="Logo"
          className="hidden md:block"
          width={160}
          height={50}
        />
        <p className="text-darkgray font-light text-sm text-right hidden md:block">
          {t("footer.caption")}
        </p>
        <p className="text-dark text-center md:text-right font-light text-sm mt-4">
         {contact.copyright}
        </p>
      </div>
    );
  }

  function FooterLeft() {
    return (
      <div>
        <h2 className="lg:text-3xl text-2xl uppercase font-bold text-dark mb-2">
          {t("footer.title")}
        </h2>
        <div className="mt-8 w-auto">
          <p className="text-darkgray font-light text-xs">{t("footer.call")}</p>
          <Link target="_blank" href="tel:+6281246768627">
            <h4 className="text-dark font-medium text-base lg:text-xl hover:text-primary transition-colors ease-in-out duration-200">
              {contact.phone}
            </h4>
          </Link>
        </div>
        <div className="mt-6">
          <p className="text-darkgray font-light text-xs">
            {t("footer.address")}
          </p>
          <h4 className="text-dark font-medium text-base lg:text-xl">
            {contact.address}
          </h4>
        </div>
        <div className="mt-6">
          <p className="text-darkgray font-light text-xs">
            {t("footer.social")}
          </p>
          <div className="flex gap-x-4 mt-2">
            {socials?.map(({ icon, path }) => {
              return (
                <Link target="_blank" key={`social-${path}`} href={path}>
                  <div className="h-12 w-12 bg-[#81a26328] rounded-lg flex justify-center items-center transform hover:scale-110 transition-transform duration-500 ease-in-out">
                    {icon}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

export default Footer;
