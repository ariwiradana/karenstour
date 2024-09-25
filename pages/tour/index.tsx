import Breadcrumb from "@/components/client/breadcrumb";
import Container from "@/components/client/container";
import CardShimmer from "@/components/client/elements/card.shimmer";
import DestinationCard from "@/components/client/elements/destination.card";
import Title from "@/components/client/elements/title";
import Layout from "@/components/client/layout";
import React, { FC } from "react";
import Pagination from "@mui/material/Pagination";
import { montserrat, unbounded } from "@/constants/font";
import useDestination from "@/hooks/client/useDestination";
import CustomSelect from "@/components/client/elements/select";

interface Props {}

const ServiceList: FC<Props> = () => {
  const { ref, state, actions } = useDestination();

  return (
    <Layout
      still
      pageTitle="Discover Bali with Our Travel Packages | Karen's Tour & Travel"
    >
      <Breadcrumb
        title="Tour"
        navigations={[
          { title: "Home", path: "/" },
          { title: "Tour", path: "/tour" },
        ]}
      />
      <Container className={`py-12 lg:py-24 ${unbounded.className}`}>
        <div className="lg:mb-10" ref={ref.topRef}>
          <Title
            title={"Discover Bali with Our Travel Packages"}
            description={`Experience Bali with ease through our ${state.service} services.`}
            action={false}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 py-4 mt-8 mb-3 sticky top-14 lg:top-20 z-20 bg-white">
          <h5
            className={`text-base text-dark font-semibold ${montserrat.className}`}
          >
            Showing {Math.max(state.page * state.limit - state.limit + 1, 1)} -{" "}
            {Math.min(state.page * state.limit, state.totalRows)} of{" "}
            {state.totalRows} results
          </h5>
          <CustomSelect
            id="filter-select"
            value={`${state.sortBy}-${state.sortOrder}`}
            onChange={actions.handleChangeFilter}
            options={[
              {
                key: "Popularity: Most Popular Tours",
                value: "popularity-asc",
              },
              {
                key: "Popularity: Least Popular Tours",
                value: "popularity-desc",
              },
              {
                key: "Price: Low to High",
                value: "price-asc",
              },
              {
                key: "Price: High to Low",
                value: "price-desc",
              },
              {
                key: "Duration: Shortest Tours",
                value: "duration-asc",
              },
              {
                key: "Duration: Longest Tours",
                value: "duration-desc",
              },
            ]}
          />
        </div>
        {state.loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-8">
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-8">
            {state.data.map((obj) => (
              <DestinationCard key={obj.id} data={obj} />
            ))}
          </div>
        )}

        {Math.ceil(state.totalRows / state.limit) > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination
              onChange={actions.handleChangePagination}
              count={Math.ceil(state.totalRows / state.limit)}
              page={state.page}
              shape="rounded"
            />
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default ServiceList;
