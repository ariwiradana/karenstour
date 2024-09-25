import { montserrat, unbounded } from "@/constants/font";
import Link from "next/link";
import React, { FC } from "react";
import { Destination } from "@/constants/types";
import ImageShimmer from "./image.shimmer";
import { BiSolidTime, BiSolidUser } from "react-icons/bi";
import { convertHoursToReadableFormat } from "@/utils/convertToReadableHours";
import { currencyIDR } from "@/utils/currencyFormatter";
import { FaStar } from "react-icons/fa6";

interface DestinationCardProps {
  data: Destination;
  className?: string;
}

const DestinationCard: FC<DestinationCardProps> = (props) => {
  console.log(props);
  return (
    <Link href={`/tour/${props.data.slug}`}>
      <div className={`group/item ${props.className ?? ""}`}>
        <div className="relative w-full h-32 md:h-52 lg:h-60 rounded-xl bg-gray-300 overflow-hidden">
          <ImageShimmer
            priority
            src={props.data.images[0]}
            className="object-cover group-hover/item:scale-110 transition-transform ease-in-out duration-700"
            fill
            alt={props.data.slug}
          />
          {props.data.average_rating && (
            <div
              className={`px-2 py-1 absolute top-4 right-4 rounded-lg flex justify-center items-center z-10 bg-primary gap-1 shadow ${unbounded.className}`}
            >
              <FaStar className="text-white text-[12px]" />
              <span className="text-white text-[12px] font-medium">
                {props.data.average_rating}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div className={unbounded.className}>
            <h3 className="font-medium text-dark text-base md:text-xl mt-4 mb-3 line-clamp-2">
              {props.data.title}
            </h3>
            <div
              className={`flex md:items-center flex-col md:flex-row my-2 gap-y-1 gap-x-3 md:gap-x-4 ${montserrat.className}`}
            >
              <div className="flex gap-x-2 items-center">
                <BiSolidTime className="text-lg md:text-xl text-primary" />
                <p className="text-sm md:text-base text-primary font-medium">
                  {convertHoursToReadableFormat(props.data.duration)}
                </p>
              </div>

              <div className="flex gap-x-2 items-center">
                <BiSolidUser className="text-lg md:text-xl text-primary" />
                <p className="text-sm md:text-base text-primary font-medium">
                  {props.data.minimum_pax} pax
                </p>
              </div>
            </div>
          </div>
          <p
            className={`text-sm font-normal text-darkgray mt-1 ${montserrat.className}`}
          >
            Start from
          </p>
          <h2
            className={`text-[17px] md:text-2xl text-dark font-semibold ${unbounded.className}`}
          >
            {currencyIDR(props.data.price)}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
