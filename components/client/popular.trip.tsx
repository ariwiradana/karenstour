import React, { FC } from "react";
import { SwiperSlide } from "swiper/react";
import DestinationCard from "./elements/destination.card";
import Container from "./container";
import Title from "./elements/title";
import CardShimmer from "./elements/card.shimmer";
import Link from "next/link";
import { Destination } from "@/constants/types";
import ButtonText from "./elements/button.text";
import { useDestinationDetailStore } from "@/store/useDestinationDetailStore";

interface PopularTripProps {
  title: string;
  description: string;
  link: string;
  actionTitle?: string;
  exceptionId?: number | null;
  isLoading?: boolean;
  categoryId: number;
  destinations: Destination[];
}
const PopularTrip: FC<PopularTripProps> = (props) => {
  const { setCategoryFilterId } = useDestinationDetailStore();

  return (
    <Container className="flex flex-col divide-y lg:divide-y-0 odd:bg-white even:bg-zinc-50 py-10 md:py-14">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-6">
          <Title
            action={false}
            path={props.link}
            title={props.title}
            description={props.description}
          />
          <Link href={props.link}>
            <ButtonText
              title="Show More"
              onClick={() => setCategoryFilterId(props.categoryId)}
            />
          </Link>
        </div>

        {props.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer className="md:hidden lg:flex" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8 ">
            {props.destinations.map((obj) => {
              return (
                <SwiperSlide key={obj.id}>
                  <DestinationCard data={obj} />
                </SwiperSlide>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

export default PopularTrip;
