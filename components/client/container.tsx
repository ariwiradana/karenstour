import React, { FC, ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode;
  className?: string | "";
}

const Container: FC<ContainerProps> = (props) => {
  return (
    <div
      className={`${
        props.className ?? ""
      } max-w-screen-xl mx-auto px-6 md:px-10 lg:px-4 relative`}
    >
      {props.children}
    </div>
  );
};

export default Container;
