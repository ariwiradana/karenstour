import React, { FC } from "react";

interface SVGProps {
  fill?: string;
  className?: string | "";
  d: string;
}

const SVG: FC<SVGProps> = (props) => {
  return (
    <div className={props.className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill={props.fill} d={props.d} />
      </svg>
    </div>
  );
};

export default SVG;
