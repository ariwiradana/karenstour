import React, { FC } from "react";
import Hero from "@/components/client/hero";
import Highlights from "@/components/client/highlights";
import Reviews from "@/components/client/reviews";
import Layout from "@/components/client/layout";
import BookNow from "@/components/client/book.now";
import SEO from "@/components/client/seo";
import useDestination from "@/hooks/client/useDestination";
import { useDestinationStore } from "@/store/useDestinationStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import PopularTrip from "@/components/client/popular.trip";

interface Props {}

const Home: FC<Props> = () => {
  useDestination();
  const { destinations } = useDestinationStore();
  const { categories } = useCategoryStore();

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
        <div className="flex flex-col">
          {categories.map((category) => (
            <PopularTrip
              categoryId={category.id}
              key={category.slug}
              destinations={destinations.filter(
                (destination) => destination.category_slug === category.slug
              )}
              link="/trip"
              title={category.title}
              description={category.description}
            />
          ))}
        </div>
        <Highlights />
        <Reviews />
        <BookNow />
      </Layout>
    </>
  );
};

export default Home;
