// Inclusion.tsx
import { montserrat, unbounded } from "@/constants/font";
import { UseDestinationDetail } from "@/hooks/client/useDestinationDetail";
import React from "react";
import { BiCheck } from "react-icons/bi";

const Inclusion: React.FC<UseDestinationDetail> = (props) => {
  if (!props.state.destination) return <></>;

  return (
    <div>
      <h1
        className={`text-lg md:text-xl uppercase font-bold ${unbounded.className}`}
      >
        Includes
      </h1>
      <ul className={`space-y-2 mt-3 ${montserrat.className}`}>
        {props.state.destination.inclusions?.map((item, index) => (
          <li key={index} className="text-darkgray font-medium flex gap-x-4">
            <BiCheck className="text-primary text-xl md:text-2xl min-w-5" />
            <span> {item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inclusion;
