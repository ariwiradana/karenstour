import React, { FC } from "react";

interface Props {
  className?: string | "";
}
const CardShimmer: FC<Props> = (props) => {
  return (
    <div className={`flex flex-col gap-6 ${props.className}`}>
      <div className="bg-gray-300 w-full h-52 lg:h-60 rounded-xl shine"></div>
      <div className="bg-gray-300 w-[80%] h-4 rounded shine"></div>
      <div className="bg-gray-300 w-[40%] h-4 rounded shine"></div>
      <div className="bg-gray-300 w-[30%] h-4 rounded shine"></div>
      <div className="bg-gray-300 w-[70%] h-4 rounded shine"></div>
    </div>
  );
};

export default CardShimmer;
