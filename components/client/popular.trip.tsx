import React, { FC } from "react";
import { SwiperSlide } from "swiper/react";
import DestinationCard from "./elements/destination.card";
import Container from "./container";
import Title from "./elements/title";
import usePopularDestination from "@/hooks/client/usePopularDestination";
import CardShimmer from "./elements/card.shimmer";
import Link from "next/link";
import { unbounded } from "@/constants/font";

interface PopularTripProps {
  title: string;
  description: string;
  link?: string;
  actionTitle?: string;
  exceptionId?: number | null;
}
const PopularTrip: FC<PopularTripProps> = (props) => {
  const { state } = usePopularDestination(props.exceptionId);

  return (
    <Container className="flex flex-col divide-y lg:divide-y-0">
      <div className="md:py-14 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-3 my-6">
          <Title
            action={false}
            path={props.link}
            title={props.title}
            description={props.description}
          />
        </div>

        {state.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer className="md:hidden lg:flex" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8 ">
            {state.destinations.map((obj) => {
              return (
                <SwiperSlide key={obj.id}>
                  <DestinationCard data={obj} />
                </SwiperSlide>
              );
            })}
          </div>
        )}

        <Link
          href="/trip"
          className={`mt-8 md:mt-14 flex justify-center text-primary underline underline-offset-4 font-medium ${unbounded.className}`}
        >
          Show More
        </Link>
      </div>
    </Container>
  );
};

export default PopularTrip;
