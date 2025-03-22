import React, { FC } from "react";
import Hero from "@/components/client/hero";
import Highlights from "@/components/client/highlights";
import Reviews from "@/components/client/reviews";
import Layout from "@/components/client/layout";
import BookNow from "@/components/client/book.now";
import SEO from "@/components/client/seo";
import PopularTrip from "@/components/client/popular.trip";

interface Props {}

const Home: FC<Props> = () => {
  return (
    <>
      <SEO
        keywords=""
        url={typeof window !== "undefined" ? window.location.origin : ""}
        image="/images/logo.png"
        title="Bali Trip Experience | Karens Tour"
        description="Discover Bali's hidden gems with Karen's Tour. Let us guide you through an unforgettable trip in Bali."
      />
      <Layout>
        <Hero />
        <PopularTrip
          actionTitle="All Trip"
          link="/trip"
          title="Our Top Picks for You"
          description="Choose your next great experience from our featured trip"
        />
        <Highlights />
        <Reviews />
        <BookNow />
      </Layout>
    </>
  );
};

export default Home;
