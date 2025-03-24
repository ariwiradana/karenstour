import React, { FC } from "react";
import { SwiperSlide } from "swiper/react";
import DestinationCard from "./elements/destination.card";
import Container from "./container";
import Title from "./elements/title";
import CardShimmer from "./elements/card.shimmer";
import Link from "next/link";
import { Destination } from "@/constants/types";
import ButtonText from "./elements/button.text";

interface PopularDestinationProps {
  title: string;
  description: string;
  link: string;
  actionTitle?: string;
  exceptionId?: number | null;
  isLoading?: boolean;
  destinations: Destination[];
}
const PopularDestination: FC<PopularDestinationProps> = (props) => {
  return (
    <Container className="flex flex-col divide-y lg:divide-y-0 py-12 md:py-20">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
          <Title
            action={false}
            path={props.link}
            title={props.title}
            description={props.description}
          />
          <Link href={props.link} className="hidden md:block">
            <ButtonText title="Show More" />
          </Link>
        </div>

        {props.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
            {props.destinations.map((obj) => {
              return (
                <SwiperSlide key={obj.id}>
                  <DestinationCard data={obj} />
                </SwiperSlide>
              );
            })}
          </div>
        )}
        <Link
          className="mt-12 md:mt-20 flex justify-center md:hidden"
          href={props.link}
        >
          <ButtonText title="Show More" />
        </Link>
      </div>
    </Container>
  );
};

export default PopularDestination;
