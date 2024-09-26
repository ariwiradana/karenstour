import { unbounded } from "@/constants/font";
import Link from "next/link";
import React, { FC } from "react";
import { MdHomeFilled } from "react-icons/md";
import Container from "./container";

interface Navigation {
  title: string;
  path: string;
}

interface BreadcrumbProps {
  title: string;
  navigations: Navigation[];
}

const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { navigations } = props;

  return (
    <div
      className="relative py-8 lg:py-8 bg-fixed bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('/images/hero.webp')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#00000044] to-[#81a263d2] bg-opacity-30"></div>
      <Container>
        <div
          className={`relative z-10 flex items-center h-full ${unbounded.className}`}
        >
          <nav
            className="flex items-center gap-x-3 text-xs lg:text-sm capitalize text-white duration-500 transition-colors ease-in-out overflow-hidden whitespace-nowrap overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {navigations.map((navigation, index) => (
              <div key={navigation.path} className="flex items-center gap-x-2">
                {navigation.title === "Home" && (
                  <MdHomeFilled className="text-lg lg:text-xl" />
                )}
                {index < navigations.length - 1 ? (
                  <Link href={navigation.path} className="text-white">
                    {navigation.title}
                  </Link>
                ) : (
                  <span className="text-white">{navigation.title}</span>
                )}
                {index < navigations.length - 1 && (
                  <span className="mx-2 text-white">/</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </Container>
    </div>
  );
};

export default Breadcrumb;
