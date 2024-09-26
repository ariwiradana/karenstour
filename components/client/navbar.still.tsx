import Link from "next/link";
import React, { FC } from "react";
import {
  RiWhatsappLine,
  RiInstagramLine,
  RiMailLine,
  RiMenu2Line,
} from "react-icons/ri";
import Image from "next/image";
import useNavbar from "@/hooks/client/useNavbar";
import LeftSide from "./leftside";
import Sidebar from "./sidebar";
import { contact } from "@/constants/data";

interface NavbarProps {
  title?: string;
}

type Social = {
  path: string;
  icon: JSX.Element;
};

const socials: Social[] = [
  {
    path: contact.whatsapp,
    icon: <RiWhatsappLine className="text-xl" />,
  },
  {
    path: contact.instagram,
    icon: <RiInstagramLine className="text-xl" />,
  },
  {
    path: contact.email,
    icon: <RiMailLine className="text-xl" />,
  },
];

const NavbarStill: FC<NavbarProps> = () => {
  const { state, actions } = useNavbar();

  return (
    <div className="sticky w-full top-0 lg:m-0 z-50 px-6 md:px-8 lg:px-0 transition-all ease-in-out duration-500 delay-200 bg-white">
      <LeftSide close={actions.handleShowMenu} open={state.isShowMenu}>
        <Sidebar close={actions.handleShowMenu} />
      </LeftSide>
      <nav
        className={`w-full flex justify-between items-center max-w-screen-xl transition-all ease-in-out duration-500 delay-200 mx-auto py-4 lg:py-0`}
      >
        <li className="list-none md:hidden flex items-center">
          <button onClick={actions.handleShowMenu}>
            <RiMenu2Line className="text-xl transition-colors ease-in-out duration-500 delay-20" />
          </button>
        </li>
        <Link href="/">
          <li className="relative hidden md:block transition-all ease-in-out duration-300 delay-75 w-20 h-20">
            <Image
              priority
              src="/images/logo.webp"
              alt="Logo"
              className="object-contain w-full"
              fill
              sizes="100px"
            />
          </li>
        </Link>
        <li className="flex items-center gap-x-8">
          {/* <div>
            <SelectInput
              className="transition-all ease-in-out duration-500 delay-200"
              id="select-locale"
              onChange={(e) => {
                actions.setLocale(e.target.value);
                router.push(router.asPath, router.asPath, {
                  locale: e.target.value,
                });
              }}
              options={[
                { key: "EN", value: "en" },
                { key: "ID", value: "id" },
              ]}
              value={state.locale}
            />
          </div> */}
          <div className="flex gap-x-4 transition-colors ease-in-out duration-500 delay-200 text-primary">
            {socials?.map(({ icon, path }) => {
              return (
                <Link
                  target="_blank"
                  key={`social-${path}`}
                  locale={state.locale}
                  href={path}
                >
                  {icon}
                </Link>
              );
            })}
          </div>
        </li>
      </nav>
    </div>
  );
};

export default NavbarStill;
