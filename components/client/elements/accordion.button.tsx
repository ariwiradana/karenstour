import { unbounded } from "@/constants/font";
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
      className={`bg-lightgray rounded-lg overflow-hidden ${unbounded.className}`}
    >
      <button
        aria-label={`btn-${title.replace(" ", "-").toLowerCase()}`}
        onClick={handleClickButton}
        className={`w-full text-center text-white font-normal text-sm py-4 px-6 flex justify-center items-center focus:outline-none bg-primary border border-dashed ${
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
