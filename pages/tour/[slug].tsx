import Breadcrumb from "@/components/client/breadcrumb";
import Container from "@/components/client/container";
import Accordion from "@/components/client/elements/accordion.button";
import ImageShimmer from "@/components/client/elements/image.shimmer";
import Title from "@/components/client/elements/title";
import FormBooking from "@/components/client/form.booking";
import Inclusion from "@/components/client/inclusion";
import Layout from "@/components/client/layout";
import { montserrat, unbounded } from "@/constants/font";
import { Env } from "@/constants/types";
import useDestinationDetail from "@/hooks/client/useDestinationDetail";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { FC } from "react";
import {
  BiSolidDollarCircle,
  BiSolidStar,
  BiSolidTime,
  BiSolidUser,
} from "react-icons/bi";
import { HiCheck } from "react-icons/hi2";
import { convertHoursToReadableFormat } from "@/utils/convertToReadableHours";
import PopularTourSlider from "@/components/client/popular.tour.slider";
import VideoPlayer from "@/components/admin/elements/video.player";
import { currencyIDR } from "@/utils/currencyFormatter";
import ReviewForm from "@/components/client/review.form";
import { contact } from "@/constants/data";
import Lightbox from "@/components/client/elements/lightbox";
import generatePDF from "react-to-pdf";
import TourBrochure from "@/components/client/brochure";
interface PageProps extends Env {}

const ServiceDetail: FC<PageProps> = (props) => {
  const { state, actions, refs } = useDestinationDetail(
    props.publicKey,
    props.serviceId
  );

  return (
    <Layout still pageTitle={state.data?.title ?? "Karen's Tour & Travel"}>
      <div ref={refs?.brochureRef} style={{ display: "none" }}>
        <TourBrochure destination={state.data ?? undefined} />
      </div>
      <Lightbox
        slideIndex={state.lightboxIndex}
        show={state.lightbox}
        images={state.data?.images ?? []}
        video={state.data?.video_url}
      />
      {state.data?.slug && (
        <Breadcrumb
          title="Tour"
          navigations={[
            { title: "Home", path: "/" },
            { title: "Tour", path: "/tour" },
            {
              title: state.data?.title ?? "",
              path: `/tour/${state.data?.slug ?? ""}`,
            },
          ]}
        />
      )}
      <Container className="py-10 lg:py-16">
        {state.data && <Title title={state.data?.title ?? ""} action={false} />}
        {state.data?.category_name && (
          <h6
            className={`${montserrat.className} text-lg md:text-xl font-semibold text-primary`}
          >
            {state.data?.category_name}
          </h6>
        )}
        <GalleryDetail />
        <div className="my-8">
          <ServiceDetail />
        </div>

        <div className="mt-8 md:mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-5 gap-y-6 md:gap-y-10 lg:gap-10">
          <div className="flex flex-col gap-y-6 md:gap-y-10 lg:gap-10 col-span-1 md:col-span-3">
            <Description />
            <Inclusion state={state} actions={actions} />
            {state.data && (
              <div className="max-w-xl hidden lg:block">
                <ReviewForm destination={state.data} />
              </div>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-6 md:gap-10">
            <div className="flex flex-col gap-y-2">
              <Accordion
                title="Book by Whatsapp"
                onClick={() => window.open(contact.whatsapp, "_blank")}
              />
              <Accordion
                title="Book by Form"
                content={<FormBooking state={state} actions={actions} />}
              />
              <Accordion
                title="Download Packages"
                onClick={() => {
                  if (refs && refs.brochureRef) {
                    generatePDF(refs.brochureRef, {
                      filename: `${state.data?.title}.pdf`,
                    });
                  }
                }}
              />
            </div>
            <BookingInfo />
          </div>
        </div>
        <div className="mt-8 md:mt-8 lg:mt-10 lg:hidden">
          {state.data && <ReviewForm destination={state.data} />}
        </div>
      </Container>
      {state.data && (
        <PopularTourSlider
          exceptionId={state.data?.id}
          title="Other Popular Tours"
          description="Discover Bali with our featured tours"
        />
      )}
    </Layout>
  );

  function Description() {
    if (!state.data) return <></>;
    return (
      <div>
        <h6
          className={`text-lg md:text-xl uppercase font-bold ${unbounded.className}`}
        >
          Description
        </h6>
        <div className={`flex flex-col items-start ${montserrat.className}`}>
          <p
            dangerouslySetInnerHTML={{ __html: state.data?.description }}
            className={`text-base font-medium mt-3 leading-8 description ${
              state.isExpanded
                ? "line-clamp-none"
                : "line-clamp-4 md:line-clamp-[16]"
            }`}
          ></p>
          <button
            className="text-primary underline font-semibold text-base mt-2 hover:underline"
            onClick={actions.handleToggleExpanded}
          >
            {state.isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>
    );
  }

  function BookingInfo() {
    return (
      <div
        className={`p-6 md:p-10 rounded-xl bg-lightgray flex flex-col gap-6 ${montserrat.className}`}
      >
        <li className="flex items-center gap-x-2 text-base font-medium text-dark">
          <HiCheck className="text-primary text-xl md:text-2xl" />
          Best Price Guaranteed
        </li>
        <li className="flex items-center gap-x-2 text-base font-medium text-dark">
          <HiCheck className="text-primary text-xl md:text-2xl" />
          No Booking Fees
        </li>
        <li className="flex items-center gap-x-2 text-base font-medium text-dark">
          <HiCheck className="text-primary text-xl md:text-2xl" />
          Professional Local Guide
        </li>
        <p className="md:gap-x-2 text-base font-medium text-darkgray md:mt-2 leading-6">
          Need help with booking?{" "}
          <span className="text-primary">
            <Link target="_blank" href={contact.whatsapp}>
              Send us a message
            </Link>
          </span>
        </p>
      </div>
    );
  }

  function GalleryDetail() {
    return (
      <div
        className={`grid grid-rows-2 grid-cols-4 gap-1 my-6 md:my-8 lg:my-10 rounded-xl overflow-hidden relative ${montserrat.className}`}
      >
        {state.data?.average_rating && (
          <div
            className={`absolute top-4 right-4 px-2 py-1 rounded-lg flex justify-center items-center bg-primary gap-1 shadow z-10 ${unbounded.className}`}
          >
            <BiSolidStar className="text-white text-base" />
            <span className="text-white text-sm font-medium">
              {state.data.average_rating}
            </span>
          </div>
        )}
        {state.loading ? (
          <>
            <div className="row-span-2 col-span-4 md:col-span-3 lg:col-span-2 shine w-full h-full aspect-video"></div>
            <div>
              <div className="shine h-full w-full aspect-square md:aspect-video"></div>
            </div>
            <div>
              <div className="shine h-full w-full aspect-square md:aspect-video"></div>
            </div>
            <div className="md:hidden lg:block">
              <div className="shine h-full w-full aspect-square md:aspect-video"></div>
            </div>
            <div className="md:hidden lg:block">
              <div className="shine h-full w-full aspect-square md:aspect-video"></div>
            </div>
          </>
        ) : (
          <>
            {state.hasVideo ? (
              <div className="row-span-2 col-span-4 md:col-span-3 lg:col-span-2 relative">
                <VideoPlayer
                  className="aspect-video h-full"
                  videoUrl={state.data?.video_url ?? ""}
                />
              </div>
            ) : (
              <div className="overflow-hidden relative row-span-2 col-span-4 md:col-span-3 lg:col-span-2 shine h-full aspect-video">
                <ImageShimmer
                  sizes="400px"
                  onClick={() => actions.handleToggleLightbox(1)}
                  priority
                  alt={state.data?.slug ? `image-main-${state.data?.slug}` : ""}
                  className="object-cover transform hover:scale-105 transition-transform ease-in-out duration-500"
                  fill
                  src={state.data?.images[0] ?? ""}
                />
              </div>
            )}
            {state.slicedImages?.map((image, index) => {
              const isLastImage =
                index === (state.slicedImages.length ?? 0) - 1;
              return (
                <div
                  key={index}
                  className="overflow-hidden relative shine aspect-square md:aspect-auto"
                >
                  <ImageShimmer
                    sizes="200px"
                    onClick={() =>
                      actions.handleToggleLightbox(
                        state.data?.video_url ? index + 1 : index + 2
                      )
                    }
                    priority
                    alt={`image-${index + 1}-${state.data?.slug}`}
                    className="object-cover transform hover:scale-105 transition-transform ease-in-out duration-500"
                    fill
                    src={image}
                  />
                  {isLastImage && (
                    <button
                      onClick={() =>
                        actions.handleToggleLightbox(
                          state.data?.video_url
                            ? state.slicedImages.length
                            : state.slicedImages.length + 1
                        )
                      }
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-70 transition-all ease-in-out duration-500 flex items-center justify-center cursor-pointer">
                        <div className="text-white text-xs md:text-base font-light p-2 text-center">
                          <h6 className={unbounded.className}>
                            + {state.remainingImages?.length} Photos
                          </h6>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  }

  function ServiceDetail() {
    if (!state.data) return <></>;
    return (
      <div
        className={`flex flex-wrap gap-y-4 gap-x-8 lg:gap-x-10 capitalize ${montserrat.className}`}
      >
        <div className="flex gap-x-2 items-start">
          <div className="w-5 min-w-5 md:w-6 md:min-w-6">
            <BiSolidTime className="w-full h-full text-primary" />
          </div>
          <div>
            <h4 className="text-darkgray text-base font-medium">Duration</h4>
            <p className="text-base md:text-lg text-dark font-semibold">
              {convertHoursToReadableFormat(state.data.duration)}
            </p>
          </div>
        </div>

        <div className="flex gap-x-2 items-start">
          <div className="w-5 min-w-5 md:w-6 md:min-w-6">
            <BiSolidUser className="w-full h-full text-primary" />
          </div>
          <div>
            <h4 className="text-darkgray text-base font-medium">Minimum Pax</h4>
            <p className="text-base md:text-lg text-dark font-semibold">
              {state.data.minimum_pax} Pax
            </p>
          </div>
        </div>

        <div className="flex gap-x-2 items-start">
          <div className="w-5 min-w-5 md:w-6 md:min-w-6">
            <BiSolidDollarCircle className="w-full h-full text-primary" />
          </div>
          <div>
            <h4 className="text-darkgray text-base font-medium">Price</h4>
            <p className="text-base md:text-lg text-dark font-semibold">
              {currencyIDR(state.data.price)}{" "}
              <span className="text-xs text-darkgray">/ pax</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const serviceId = process.env.EMAILJS_SERVICE_ID ?? "";
  const publicKey = process.env.EMAILJS_PUBLIC_KEY ?? "";

  return {
    props: {
      serviceId,
      publicKey,
    },
  };
};

export default ServiceDetail;
