import { montserrat } from "@/constants/font";
import React, { memo, ReactNode, useEffect } from "react";
import { BiX } from "react-icons/bi";
import ButtonSecondary from "./button.secondary";
import ButtonPrimary from "./button.primary";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
  isLoading?: boolean;
  title: string;
  buttonApproveTitle: string;
  buttonCancelTitle?: string;
  onClose: () => void;
  onApprove: () => void;
  onCancel: () => void;
}

const Modal = ({
  children,
  isOpen = false,
  onClose,
  onApprove,
  onCancel,
  buttonApproveTitle,
  buttonCancelTitle = "Cancel",
  title,
  isLoading = false,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isOpen]);
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 bg-black/80 flex justify-center items-end md:items-center z-[999] transition-all ease-in-out duration-200 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-t-xl md:rounded-xl bg-white relative transition-all ease-in-out duration-200 delay-200 transform w-full md:w-auto md:min-w-[40vw] ${
          isOpen
            ? "opacity-100 translate-y-0 h-auto"
            : "opacity-0 translate-y-4 -h-8 md:h-auto"
        }`}
      >
        <div className="flex justify-between border-b border-zinc-100 px-6 py-4">
          <h2
            className={`font-semibold text-dark text-lg md:text-xl whitespace-nowrap ${montserrat.className}`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-dark/60 -mr-1 hover:text-dark text-2xl transition-colors ease-in-out duration-200 "
          >
            <BiX />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[70svh] md:max-w-[70vw] lg:max-w-[60vw] hide-scrollbar p-6">
          {children}
        </div>

        <div className="flex justify-end gap-4 border-t border-zinc-100 p-6">
          <ButtonPrimary
            onClick={onApprove}
            className="w-full md:w-auto"
            id={`approve-${title}`}
            isLoading={isLoading}
            title={buttonApproveTitle}
          />
          <ButtonSecondary
            className="w-full md:w-auto"
            type="button"
            id={`cancel-${title}`}
            title={buttonCancelTitle}
            onClick={onCancel}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Modal);
