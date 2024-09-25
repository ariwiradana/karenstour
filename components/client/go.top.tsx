import useGoTop from "@/hooks/client/useGoTop";
import React from "react";
import { FaArrowUp } from "react-icons/fa6";

const GoTop = () => {
  const { state, actions } = useGoTop();
  return (
    <div
      className={`fixed right-8 bottom-8 z-50 transition-all duration-500 ease-in-out transform ${
        state.isVisible
          ? "translate-y-0 opacity-100"
          : "invisible opacity-0 translate-y-10"
      }`}
    >
      <button
        className="border border-primary flex justify-between items-center rounded p-2 bg-white"
        onClick={actions.handleScrollToTop}
      >
        <FaArrowUp className="text-primary" />
      </button>
    </div>
  );
};

export default GoTop;
