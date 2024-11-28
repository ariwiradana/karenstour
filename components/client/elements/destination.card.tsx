import { montserrat, unbounded } from "@/constants/font";
import Link from "next/link";
import React, { FC } from "react";
import { Destination } from "@/constants/types";
import ImageShimmer from "./image.shimmer";
import { BiSolidStar, BiSolidTime, BiSolidUser } from "react-icons/bi";
import { currencyIDR } from "@/utils/currencyFormatter";

interface DestinationCardProps {
  data: Destination;
  className?: string;
}

const DestinationCard: FC<DestinationCardProps> = (props) => {
  return (
    <Link href={`/tour/${props.data.slug}`}>
      <div className={`group/item ${props.className ?? ""}`}>
        <div className="relative w-full h-52 lg:h-60 rounded-xl bg-gray-300 overflow-hidden">
          <ImageShimmer
            sizes="(max-width: 640px) 240px, (max-width: 768px) 360px, (max-width: 1024px) 480px, 480px"
            priority
            src={props.data.thumbnail_image ?? props.data.images[0]}
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
        <div className="flex flex-col justify-between">
          <div>
            <h1
              className={`font-medium text-dark text-lg md:text-xl mb-3 line-clamp-2 mt-4 ${unbounded.className}`}
            >
              {props.data.title}
            </h1>
            <div
              className={`flex flex-wrap gap-x-4 gap-y-2 mb-3 ${montserrat.className}`}
            >
              {props.data.minimum_pax > 0 && (
                <h4 className="flex items-start gap-x-2 text-base font-medium text-dark">
                  <BiSolidUser className="text-primary text-2xl min-w-7" />
                  Minimum {props.data.minimum_pax} Guest
                  {props.data.minimum_pax > 1 && "s"}
                </h4>
              )}
              <h4 className="flex items-center gap-x-2 text-base font-medium text-dark">
                <BiSolidTime className="text-primary text-2xl min-w-7" />
                {props.data.duration}
              </h4>
            </div>
          </div>
          <p
            className={`text-sm font-normal text-darkgray mt-1 ${montserrat.className}`}
          >
            Start from
          </p>
          <h2
            className={`text-xl md:text-2xl text-dark font-semibold ${unbounded.className}`}
          >
            {currencyIDR(props.data.price)}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
