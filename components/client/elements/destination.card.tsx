import { montserrat, unbounded } from "@/constants/font";
import Link from "next/link";
import React, { FC } from "react";
import { Destination } from "@/constants/types";
import ImageShimmer from "./image.shimmer";
import { BiSolidStar, BiSolidTime } from "react-icons/bi";
import { currencyIDR } from "@/utils/currencyFormatter";
import { DestinationIcons } from "@/constants/icons";

interface DestinationCardProps {
  data: Destination;
  className?: string;
}

const DestinationCard: FC<DestinationCardProps> = (props) => {
  return (
    <Link href={`/destination/${props.data.slug}`}>
      <div className={`group/item ${props.className ?? ""}`}>
        <div className="relative w-full h-52 lg:h-60 rounded-xl bg-gray-300 overflow-hidden">
          <ImageShimmer
            sizes="(max-width: 640px) 240px, (max-width: 768px) 360px, (max-width: 1024px) 480px, 480px"
            priority
            src={props.data.thumbnail_image || props.data.images[0]}
            className="object-cover group-hover/item:scale-110 transition-transform ease-in-out duration-700"
            fill
            alt={props.data.slug}
          />
          {props.data.average_rating && (
            <div
              className={`absolute top-4 right-4 px-2 py-1 rounded-lg flex justify-center items-center bg-primary gap-1 shadow ${unbounded.className}`}
            >
              <BiSolidStar className="text-white text-base" />
              <span className="text-white text-xs font-medium">
                {props.data.average_rating}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between mt-3">
          <div>
            <h1
              className={`font-medium text-dark text-lg 2xl:text-xl line-clamp-2 ${unbounded.className}`}
            >
              {props.data.title}
            </h1>
            <div
              className={`flex flex-wrap gap-x-4 gap-y-1 my-2 text-sm md:text-base text-primary font-medium ${montserrat.className}`}
            >
              <p className="flex items-center gap-x-2">
                <div className="text-base md:text-lg">
                  {DestinationIcons[props.data.category_slug]}
                </div>
                {props.data?.category_name}
              </p>
              <p className="flex items-center gap-x-2">
                <BiSolidTime className="text-base md:text-lg" />
                {props.data?.duration}
              </p>
            </div>
          </div>
          <p
            className={`text-sm font-normal text-darkgray mt-1 ${montserrat.className}`}
          >
            Start from
          </p>
          <h2
            className={`text-lg md:text-xl text-dark font-semibold ${unbounded.className}`}
          >
            {currencyIDR(props.data.price)}{" "}
            <span className={`${montserrat.className} text-xs font-normal`}>
              / Pax
            </span>
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
