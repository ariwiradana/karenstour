import { montserrat } from "@/constants/font";
import React, { ReactNode, useState } from "react";

interface AccordionProps {
  title: string;
  content?: ReactNode;
  onClick?: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ title, content, onClick }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClickButton = () => {
    if (content) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`bg-lightgray rounded-xl overflow-hidden border border-dashed ${
        montserrat.className
      } ${isOpen ? "border-primary/10" : "border-transparent"}`}
    >
      <button
        aria-label={`btn-${title.replace(" ", "-").toLowerCase()}`}
        onClick={handleClickButton}
        className={`w-full text-center text-white font-medium text-sm md:text-base py-4 px-6 flex justify-center items-center focus:outline-none bg-primary border border-dashed ${
          isOpen ? "border-primary" : "border-transparent"
        }`}
      >
        {title}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[200vh]" : "max-h-0"
        }`}
      >
        {content ? <div>{content}</div> : <></>}
      </div>
    </div>
  );
};

export default Accordion;
