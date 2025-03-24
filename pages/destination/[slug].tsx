import Breadcrumb from "@/components/client/breadcrumb";
import Container from "@/components/client/container";
import Accordion from "@/components/client/elements/accordion.button";
import ImageShimmer from "@/components/client/elements/image.shimmer";
import FormBooking from "@/components/client/form.booking";
import Inclusion from "@/components/client/inclusion";
import Layout from "@/components/client/layout";
import { montserrat, unbounded } from "@/constants/font";
import useDestinationDetail from "@/hooks/client/useDestinationDetail";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { FC, memo } from "react";
import { BiCheck, BiSolidTime, BiSolidUser } from "react-icons/bi";
import { currencyIDR } from "@/utils/currencyFormatter";
import ReviewForm from "@/components/client/review.form";
import { contact } from "@/constants/data";
import Lightbox from "@/components/client/elements/lightbox";
import DestinationBrochure from "@/components/client/brochure";
import SEO from "@/components/client/seo";
import NotFound from "@/components/client/not.found";
import { LoaderIcon } from "react-hot-toast";
import Inventory from "@/components/client/inventory";
import { removeHtmlTags } from "@/utils/removeHTMLTag";
import Modal from "@/components/client/elements/modal";
import PopularDestinationSlider from "@/components/client/popular.destination.slider";
import { DestinationIcons } from "@/constants/icons";
import { Destination } from "@/constants/types";

interface PageProps {
  serviceId: string;
  publicKey: string;
  slug: string;
}

const DestinationDetail: FC<PageProps> = (props) => {
  const { state, actions, refs } = useDestinationDetail(
    props.publicKey,
    props.serviceId,
    props.slug
  );

  if (state.isLoadingDestination)
    return (
      <div className="w-dvw h-dvh flex justify-center items-center">
        <LoaderIcon />
      </div>
    );

  return (
    <>
      <SEO
        keywords={state.data?.category_name as string}
        url={
          typeof window !== "undefined"
            ? `${window.location.origin}/destination/${state.data?.slug}`
            : ""
        }
        image="/images/logo.png"
        title={`${
          state.data ? state.data?.title : "Bali Trip Experience"
        } | Karens Tour`}
        description={
          state.data
            ? removeHtmlTags(state.data?.description)
            : `Discover Bali's hidden gems with Karen's Tour. Let us guide you through an unforgettable trip in Bali.`
        }
      />

      <Modal
        buttonApproveTitle="Booking"
        onApprove={actions.handleSubmit}
        isOpen={state.isOpen}
        onClose={actions.handleToggleModal}
        onCancel={actions.handleToggleModal}
        title="Booking Form"
        isLoading={state.isLoadingSubmit}
      >
        <FormBooking state={state} actions={actions} />
      </Modal>

      {state.data ? (
        <Layout still>
          <div ref={refs?.brochureRef} style={{ display: "none" }}>
            <DestinationBrochure destination={state.data ?? undefined} />
          </div>
          <Lightbox
            slideIndex={state.lightboxIndex}
            show={state.lightbox}
            images={state.data?.images}
            video={state.data?.video_url}
          />
          {state.data?.slug && (
            <Breadcrumb
              title="Destination"
              navigations={[
                { title: "Home", path: "/" },
                { title: "Destination", path: "/destination" },
                {
                  title: state.data?.title ?? "",
                  path: `/destination/${state.data?.slug ?? ""}`,
                },
              ]}
            />
          )}
          <Container className="py-10 lg:py-16">
            {state.data && (
              <h1
                className={`text-xl md:text-2xl lg:text-3xl font-bold text-dark ${unbounded.className}`}
              >
                {state.data?.title ?? ""}
              </h1>
            )}

            <GalleryDetail />

            <div className="mt-8 md:mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-5 gap-y-6 md:gap-y-10 lg:gap-10 relative">
              <div className="flex flex-col gap-y-6 md:gap-y-10 lg:gap-10 col-span-1 md:col-span-3">
                <div className={montserrat.className}>
                  <h1
                    className={`text-3xl lg:text-4xl text-dark font-medium ${unbounded.className}`}
                  >
                    {currencyIDR(state.data?.price ?? 0)}{" "}
                    <span
                      className={`text-xs text-darkgray ${montserrat.className}`}
                    >
                      / Pax
                    </span>
                  </h1>
                  <p className="text-sm lg:text-base description text-darkgray mt-1 italic">
                    The price are includes all other relevant costs.
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3 mt-3 md:mt-4">
                    <p className="bg-primary/10 flex items-center gap-x-2 text-sm md:text-base py-1 md:py-2 px-2 md:px-3 text-primary rounded-lg font-medium">
                      {DestinationIcons[state.data.category_slug]}
                      {state.data?.category_name}
                    </p>
                    <p className="bg-primary/10 flex items-center gap-x-2 text-sm md:text-base py-1 md:py-2 px-2 md:px-3 text-primary rounded-lg font-medium">
                      <BiSolidUser />
                      Min. {state.data.minimum_pax} Guest
                      {state.data.minimum_pax > 1 && "s"}
                    </p>
                    <p className="bg-primary/10 flex items-center gap-x-2 text-sm md:text-base py-1 md:py-2 px-2 md:px-3 text-primary rounded-lg font-medium">
                      <BiSolidTime />
                      {state.data?.duration}
                    </p>
                  </div>
                </div>
                <Description />
                <Inclusion state={state} actions={actions} />
                <Inventory state={state} actions={actions} />
              </div>
              <div className="col-span-2 flex flex-col gap-6 md:gap-10 sticky top-20 lg:h-[60vh] z-10">
                <div className="flex flex-col gap-y-2">
                  <Accordion
                    title="Book by Whatsapp"
                    onClick={() => window.open(contact.whatsapp, "_blank")}
                  />
                  <Accordion
                    onClick={actions.handleToggleModal}
                    title="Book by Form"
                  />
                </div>
                <BookingInfo />
              </div>
            </div>
            {state.data && (
              <div className="mt-6 md:mt-8 lg:mt-10">
                <ReviewForm destination={state.data} />
              </div>
            )}
          </Container>
          {state.otherDestinations.length > 0 && (
            <PopularDestinationSlider
              isLoading={state.isLoadingOtherDestination}
              link="/destination"
              exceptionId={state.data.id}
              destinations={state.otherDestinations}
              title="Other Destinations"
              description="Discover Bali with our featured destinations"
            />
          )}
        </Layout>
      ) : (
        <NotFound />
      )}
    </>
  );

  function Description() {
    if (!state.data) return <></>;
    return (
      <div>
        <p
          className={`text-lg md:text-xl uppercase font-bold ${unbounded.className}`}
        >
          Overview
        </p>
        <div className={`flex flex-col items-start ${montserrat.className}`}>
          <p
            dangerouslySetInnerHTML={{ __html: state.data?.description }}
            className={`text-base font-medium mt-3 leading-6 lg:leading-7 text-justify description ${
              state.isExpanded
                ? "line-clamp-none"
                : "line-clamp-[8] md:line-clamp-[12]"
            }`}
          ></p>
          <button
            aria-label="btn-expand-desc"
            className="text-primary underline font-semibold text-base mt-2 md:mt-4 hover:underline"
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
          <BiCheck className="text-primary text-xl md:text-2xl" />
          Best Price Guaranteed
        </li>
        <li className="flex items-center gap-x-2 text-base font-medium text-dark">
          <BiCheck className="text-primary text-xl md:text-2xl" />
          No Booking Fees
        </li>
        <li className="flex items-center gap-x-2 text-base font-medium text-dark">
          <BiCheck className="text-primary text-xl md:text-2xl" />
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
    const { images } = state.data as Destination;
    const mainImage = images[0] as string;
    const childImages = images.slice(1, 5);
    const leftImages = images.slice(5);

    return (
      <div className="grid grid-cols-4 row-span-4 gap-1 my-4 md:my-6 lg:my-8 rounded-xl overflow-hidden">
        <div className="col-span-4 md:col-span-3 lg:col-span-2 row-span-2 md:row-span-4 relative aspect-video md:aspect-[4/3] lg:aspect-[5/3] overflow-hidden">
          <ImageShimmer
            sizes="600px"
            onClick={() => actions.handleToggleLightbox(mainImage)}
            priority
            alt={state.data?.slug ? `image-main-${state.data?.slug}` : ""}
            className="object-cover transform hover:scale-105 transition-transform ease-in-out duration-500"
            fill
            src={mainImage}
          />
        </div>
        {childImages.map((image, index) => (
          <div
            className="relative overflow-hidden aspect-square md:aspect-auto lg:row-span-2"
            key={`image-${index + 1}`}
          >
            <ImageShimmer
              sizes="600px"
              onClick={() => actions.handleToggleLightbox(image)}
              priority
              alt={state.data?.slug ? `image-main-${state.data?.slug}` : ""}
              className="object-cover transform hover:scale-105 transition-transform ease-in-out duration-500"
              fill
              src={image}
            />
            {index === 3 && leftImages.length > 0 ? (
              <div
                onClick={() => actions.handleToggleLightbox(image)}
                className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex justify-center items-center cursor-pointer"
              >
                <div className="text-white text-xs md:text-base font-light p-2 text-center">
                  <p className={unbounded.className}>
                    + {leftImages.length + 1} Photos
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
}) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID ?? "";
  const publicKey = process.env.EMAILJS_PUBLIC_KEY ?? "";
  const slug = (params?.slug as string) || "";

  return {
    props: {
      serviceId,
      publicKey,
      slug,
    },
  };
};

export default memo(DestinationDetail);
