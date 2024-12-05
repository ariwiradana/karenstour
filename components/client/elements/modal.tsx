import React, { ReactNode } from "react";
import { BiX } from "react-icons/bi";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ children, isOpen = false, onClose }: ModalProps) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 bg-black/80 flex justify-center items-end md:items-center z-[999] transition-all ease-in-out duration-500 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-t-xl md:rounded-xl bg-white relative transition-all ease-in-out duration-500 delay-200 transform w-full md:w-auto md:min-w-[40vw] ${
          isOpen
            ? "opacity-100 translate-y-0 h-auto"
            : "opacity-0 translate-y-4 -h-8 md:h-auto"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-dark/60 hover:text-dark text-2xl transition-colors ease-in-out duration-300"
        >
          <BiX />
        </button>
        <div className="overflow-y-auto max-h-[80svh] md:min-w-[70vw] lg:min-w-max md:max-w-[80vw] lg:max-w-[60vw] hide-scrollbar md:p-12 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
