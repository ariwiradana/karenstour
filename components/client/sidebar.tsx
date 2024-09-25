import { montserrat, unbounded } from "@/constants/font";
import useDestination from "@/hooks/client/useDestination";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface SidebarProps {
  close: () => void;
}

const Sidebar: FC<SidebarProps> = (props) => {
  const { state } = useDestination();

  return (
    <div className={`p-6 ${unbounded.className} relative`}>
      <div className="relative transition-all ease-in-out duration-500 delay-200 w-24 h-24">
        <Image
          src="/images/logo.webp"
          alt="Logo"
          className="object-contain w-full"
          fill
        />
      </div>
      <ul className="flex flex-col gap-4 mt-4">
        <SidebarItem onClose={props.close} title="Home" path="/" />
        <SidebarItem onClose={props.close} hasChild title="Tour" path="/tour">
          {state.data.map((item) => (
            <Link
              key={`nav-child-${item.slug}`}
              href={`/tour/${item.slug}`}
              className={`text-darkgray hover:underline text-xs ${montserrat.className}`}
            >
              {item.title}
            </Link>
          ))}
        </SidebarItem>
      </ul>
    </div>
  );
};

interface SidebarItemProps {
  title: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  hasChild?: boolean;
  onClose: () => void;
}

const SidebarItem: FC<SidebarItemProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <li>
      <div
        className={`text-sm font-normal ${
          props.active ? "text-primary" : "text-dark"
        }`}
      >
        <div className="w-full text-left flex items-center justify-between hover:underline">
          <Link href={props.path}>
            <h6>{props.title}</h6>
          </Link>
          {props.hasChild && (
            <button
              onClick={handleToggle}
              className="w-full flex justify-end py-1"
            >
              <FaChevronDown
                className={`transform transition-transform ease-in-out text-[10px] duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          )}
        </div>
      </div>
      {isOpen && props.children && (
        <ul className="pl-2 flex flex-col gap-2 mt-3">{props.children}</ul>
      )}
    </li>
  );
};

export default Sidebar;
