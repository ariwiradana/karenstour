import React, { FC } from "react";
import Hero from "@/components/client/hero";
import Highlights from "@/components/client/highlights";
import Reviews from "@/components/client/reviews";
import Layout from "@/components/client/layout";
import PopularTourSlider from "@/components/client/popular.tour.slider";
import BookNow from "@/components/client/book.now";
import SEO from "@/components/client/seo";

interface Props {}

const Home: FC<Props> = () => {
  return (
    <>
      <SEO
        url={typeof window !== "undefined" ? window.location.origin : ""}
        image="/images/logo.png"
        title="Bali Tour Experience | Karens Tour"
        description="Discover Bali's hidden gems with Karen's Tour. We offer personalized tours, from breathtaking beaches to cultural landmarks. Let us guide you through an unforgettable adventure in Bali."
      />
      <Layout>
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
