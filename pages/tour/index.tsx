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
import { Category } from "@/constants/types";
import { BiCheck } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import CustomSelect from "@/components/client/elements/select";
import SEO from "@/components/client/seo";

interface Props {}

const ServiceList: FC<Props> = () => {
  const { ref, state, actions } = useDestination();

  return (
    <Layout still>
      <SEO
        url={typeof window !== "undefined" ? window.location.origin : ""}
        image="/images/logo.png"
        title="Bali Tour Experience | Karens Tour"
        description="Discover Bali's hidden gems with Karen's Tour. We offer personalized tours, from breathtaking beaches to cultural landmarks. Let us guide you through an unforgettable adventure in Bali."
      />
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
            title={"Discover Bali with Our Tour Packages"}
            description={`Experience Bali with ease through our ${state.service} services.`}
            action={false}
          />
        </div>
        <div className="bg-white mt-8 lg:mt-0">
          <div className="lg:p-8 p-4 bg-lightgray border border-gray-100 rounded-lg mt-8">
            <h1 className="text-xs md:text-sm font-normal mb-3 text-dark md:hidden">
              Filter
            </h1>
            <div
              className={` grid grid-cols-2 md:flex flex-wrap gap-2 lg:gap-6 ${montserrat.className}`}
            >
              <div className="md:flex items-center hidden">
                <BsFilter className="text-2xl text-dark" />
              </div>
              {state.categories.length === 0 ? (
                <>
                  {[0, 1, 2, 3].map((item) => (
                    <div
                      key={`shimmer-${item}`}
                      className={`flex items-center md:min-w-36 lg:min-w-48 justify-start gap-x-1 p-2 h-8 lg:h-9 rounded-lg bg-darkgray shine`}
                    ></div>
                  ))}
                </>
              ) : (
                <>
                  <CustomSelect
                    id="filter-select"
                    value={`${state.sortBy}-${state.sortOrder}`}
                    onChange={actions.handleChangeFilter}
                    options={[
                      {
                        key: "Most Popular",
                        value: "average_rating-asc",
                      },
                      {
                        key: "Least Popular",
                        value: "average_rating-desc",
                      },
                      {
                        key: "Price: Low to High",
                        value: "d.price-asc",
                      },
                      {
                        key: "Price: High to Low",
                        value: "d.price-desc",
                      },
                      {
                        key: "Shortest Duration",
                        value: "d.duration-asc",
                      },
                      {
                        key: "Longest Duration",
                        value: "d.duration-desc",
                      },
                    ]}
                  />
                  {state.categories.map((category: Category) => (
                    <div
                      key={category.name}
                      className={`flex items-center justify-start gap-x-1 p-2 rounded-lg ${
                        (state.categoryFilters as string[]).includes(
                          category.name
                        )
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-dark border-gray-100"
                      }`}
                    >
                      <BiCheck
                        className={`text-xs md:text-sm ${
                          (state.categoryFilters as string[]).includes(
                            category.name
                          )
                            ? "text-white"
                            : "text-darkgray"
                        }`}
                      />
                      <button
                        aria-label="btn-filter-category"
                        onClick={() =>
                          actions.handleChangeFilterCategory(category.name)
                        }
                        className="text-xs md:text-sm lg:text-sm font-medium line-clamp-1 text-left"
                      >
                        {category.name}
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <p
          className={`text-base text-dark font-semibold mt-8 ${montserrat.className}`}
        >
          Showing{" "}
          {state.totalRows > 0
            ? Math.max(state.page * state.limit - state.limit + 1, 1)
            : 0}{" "}
          - {Math.min(state.page * state.limit, state.totalRows ?? 0)} of{" "}
          {state.totalRows} results
        </p>

        <div className="mt-4 md:mt-6">
          {state.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              <CardShimmer />
              <CardShimmer />
              <CardShimmer />
              <CardShimmer />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
              {state.data.map((obj) => (
                <DestinationCard key={obj.id} data={obj} />
              ))}
            </div>
          )}
        </div>

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
