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
import { useDestinationStore } from "@/store/useDestinationStore";
import { useDestinationDetailStore } from "@/store/useDestinationDetailStore";
import useCategories from "@/hooks/client/useCategories";
import { DestinationIcons } from "@/constants/icons";

interface Props {
  category: string;
}

const DestinationList: FC<Props> = () => {
  const { ref, state, actions } = useDestination();
  const { destinations, totalRows } = useDestinationStore();
  const { categories } = useCategories();
  const { categoryFilterId } = useDestinationDetailStore();

  return (
    <Layout still>
      <SEO
        keywords={destinations.length > 0 ? destinations[0].category_name : ""}
        url={
          typeof window !== "undefined"
            ? `${window.location.origin}/destination`
            : ""
        }
        image="/images/logo.png"
        title="Bali Tour Experience | Karens Tour"
        description="Discover Bali's hidden gems with Karen's Tour. Let us guide you through an unforgettable trip in Bali."
      />
      <Breadcrumb
        title="Destination"
        navigations={[
          { title: "Home", path: "/" },
          { title: "Destination", path: "/destination" },
        ]}
      />
      <Container className={`py-12 lg:py-24 ${unbounded.className}`}>
        <div className="lg:mb-10" ref={ref.topRef}>
          <Title
            title={"Discover Bali with Our Trip Destinations"}
            action={false}
          />
        </div>
        <div className="bg-white mt-8 lg:mt-0">
          <div className="lg:p-8 p-4 bg-lightgray border border-gray-100 rounded-lg mt-8">
            <h1 className="text-xs md:text-sm font-normal mb-3 text-dark md:hidden">
              Filter
            </h1>
            <div
              className={`grid grid-cols-2 md:flex flex-wrap gap-2 lg:gap-6 ${montserrat.className}`}
            >
              <div className="md:flex items-center hidden">
                <BsFilter className="text-2xl text-dark" />
              </div>
              {categories.length === 0 ? (
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
                  {/* <div className="relative bg-white hover:border-gray-200 rounded-lg overflow-hidden">
                    <input
                      value={state.search}
                      onChange={(e) =>
                        actions.handleChangeSearch(e.target.value)
                      }
                      placeholder="Example : Rafting"
                      type="text"
                      className="outline-none text-xs pl-3 pr-8 h-full md:text-sm lg:text-sm font-medium max-w-44 placeholder:font-normal placeholder:text-sm"
                    />
                    {state.search === "" ? (
                      <BiSearchAlt className="absolute right-2 text-darkgray text-base top-1/2 transform -translate-y-1/2" />
                    ) : (
                      <BiX
                        onClick={() => actions.handleChangeSearch("")}
                        className="absolute cursor-pointer right-2 text-darkgray text-base top-1/2 transform -translate-y-1/2"
                      />
                    )}
                  </div> */}
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
                    ]}
                  />
                  {categories.map((category: Category) => (
                    <button
                      aria-label="btn-filter-category"
                      onClick={() =>
                        actions.handleChangeFilterCategory(
                          category.id,
                          category.slug
                        )
                      }
                      key={category.name}
                      className={`flex items-center justify-start gap-x-1 py-2 px-3 rounded-lg ${
                        categoryFilterId === category.id
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-dark border-gray-100"
                      }`}
                    >
                      <div
                        className={`text-xs md:text-sm ${
                          categoryFilterId === category.id
                            ? "text-white"
                            : "text-darkgray"
                        }`}
                      >
                        {DestinationIcons[category.slug] || <BiCheck />}
                      </div>
                      <p className="text-xs md:text-sm lg:text-sm font-medium line-clamp-1 text-left">
                        {category.name}
                      </p>
                    </button>
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
          {totalRows > 0
            ? Math.max(state.page * state.limit - state.limit + 1, 1)
            : 0}{" "}
          - {Math.min(state.page * state.limit, totalRows ?? 0)} of {totalRows}{" "}
          results
        </p>

        <div className="mt-4 md:mt-6">
          {state.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
              <CardShimmer />
              <CardShimmer />
              <CardShimmer />
              <CardShimmer />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
              {destinations.map((obj) => (
                <DestinationCard key={obj.id} data={obj} />
              ))}
            </div>
          )}
        </div>

        {Math.ceil(totalRows / state.limit) > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination
              onChange={actions.handleChangePagination}
              count={Math.ceil(totalRows / state.limit)}
              page={state.page}
              shape="rounded"
            />
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default DestinationList;
