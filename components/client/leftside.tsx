import React, { FC, ReactNode, useEffect } from "react";

interface LeftSideProps {
  open: boolean;
  children?: ReactNode;
  close: () => void;
}

const LeftSide: FC<LeftSideProps> = (props) => {
  useEffect(() => {
    if (props.open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [props.open]);

  return (
    <div
      onClick={props.close}
      className={`fixed bg-black bg-opacity-55 transition-all ease-in-out duration-500 ${
        props.open ? "opacity-100 visible" : "opacity-0 invisible delay-200"
      } inset-0`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-[80%] h-dvh bg-white transition-all duration-500 ease-in-out ${
          props.open ? "translate-x-0 delay-200" : "-translate-x-full"
        }`}
      >
        {props.children}
      </div>
    </div>
  );
};

export default LeftSide;
