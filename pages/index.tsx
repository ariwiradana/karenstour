import React, { FC } from "react";
import Hero from "@/components/client/hero";
import Highlights from "@/components/client/highlights";
import Reviews from "@/components/client/reviews";
import Layout from "@/components/client/layout";
import PopularTourSlider from "@/components/client/popular.tour.slider";
import BookNow from "@/components/client/book.now";

interface Props {}

const Home: FC<Props> = () => {
  return (
    <>
      <Layout pageTitle="Karen's Tour & Travel">
        <Hero />
        <PopularTourSlider
          actionTitle="View All Tours"
          link="/tour"
          title="Our Top Picks for You"
          description="Choose your next great experience from our featured tours"
        />
        <Highlights />
        <Reviews />
        <BookNow />
      </Layout>
    </>
  );
};

export default Home;
