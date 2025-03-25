import React, { FC } from "react";
import Hero from "@/components/client/hero";
import Highlights from "@/components/client/highlights";
import Reviews from "@/components/client/reviews";
import Layout from "@/components/client/layout";
import BookNow from "@/components/client/book.now";
import SEO from "@/components/client/seo";
import useDestination from "@/hooks/client/useDestination";
import { useDestinationStore } from "@/store/useDestinationStore";
import PopularDestination from "@/components/client/popular.destination";

interface Props {}

const Home: FC<Props> = () => {
  const { state } = useDestination();
  const { destinations } = useDestinationStore();
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
        <PopularDestination
          isLoading={state.isLoading}
          destinations={destinations?.slice(0, 8)}
          link="/destination"
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
