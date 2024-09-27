// Inclusion.tsx
import { montserrat, unbounded } from "@/constants/font";
import { UseDestinationDetail } from "@/hooks/client/useDestinationDetail";
import React from "react";
import { BiCheck } from "react-icons/bi";

const Inclusion: React.FC<UseDestinationDetail> = (props) => {
  if (!props.state.data) return <></>;

  return (
    <div>
      <h6
        className={`text-lg md:text-xl uppercase font-bold ${unbounded.className}`}
      >
        Inclusions
      </h6>
      <ul className={`space-y-2 mt-3 ${montserrat.className}`}>
        {props.state.data.inclusions?.map((item, index) => (
          <li
            key={index}
            className="text-darkgray font-medium flex items-center gap-x-4"
          >
            <BiCheck className="text-primary text-xl md:text-2xl" />
            <span> {item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inclusion;
