// Inclusion.tsx
import { montserrat, unbounded } from "@/constants/font";
import { UseDestinationDetail } from "@/hooks/client/useDestinationDetail";
import React from "react";

const Inclusion: React.FC<UseDestinationDetail> = (props) => {
  if (!props.state.data) return <></>;

  return (
    <div>
      <h6
        className={`text-lg md:text-xl uppercase font-bold ${unbounded.className}`}
      >
        Inclusions
      </h6>
      <ul className={`list-disc space-y-2 mt-3 ml-8 ${montserrat.className}`}>
        {props.state.data.inclusions?.map((item, index) => (
          <li key={index} className="text-darkgray font-medium">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inclusion;
