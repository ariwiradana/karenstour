import Breadcrumb from "@/components/client/breadcrumb";
import Container from "@/components/client/container";
import Accordion from "@/components/client/elements/accordion.button";
import ImageShimmer from "@/components/client/elements/image.shimmer";
import Title from "@/components/client/elements/title";
import FormBooking from "@/components/client/form.booking";
import Inclusion from "@/components/client/inclusion";
import Layout from "@/components/client/layout";
import { montserrat, unbounded } from "@/constants/font";
import useDestinationDetail from "@/hooks/client/useDestinationDetail";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { FC, memo } from "react";
import { BiCheck, BiSolidMap, BiSolidTime, BiSolidUser } from "react-icons/bi";
import PopularTourSlider from "@/components/client/popular.tour.slider";
import VideoPlayer from "@/components/admin/elements/video.player";
import { currencyIDR } from "@/utils/currencyFormatter";
import ReviewForm from "@/components/client/review.form";
import { contact } from "@/constants/data";
import Lightbox from "@/components/client/elements/lightbox";
import TourBrochure from "@/components/client/brochure";
import SEO from "@/components/client/seo";
import NotFound from "@/components/client/not.found";
import { LoaderIcon } from "react-hot-toast";
import Inventory from "@/components/client/inventory";
import { removeHtmlTags } from "@/utils/removeHTMLTag";
import Modal from "@/components/client/elements/modal";

interface PageProps {
  serviceId: string;
  publicKey: string;
  slug: string;
}

const ServiceDetail: FC<PageProps> = (props) => {
  const { state, actions, refs } = useDestinationDetail(
    props.publicKey,
    props.serviceId,
    props.slug
  );

  if (state.loading)
    return (
      <div className="w-dvw h-dvh flex justify-center items-center">
        <LoaderIcon />
      </div>
    );

  return (
    <>
      <SEO
        keywords={state.data ? state.data?.categories.join(", ") : ""}
        url={
          typeof window !== "undefined"
            ? `${window.location.origin}/tour/${state.data?.slug}`
            : ""
        }
        image="/images/logo.png"
        title={`${
          state.data ? state.data?.title : "Bali Tour Experience"
        } | Karens Tour`}
        description={
          state.data
            ? removeHtmlTags(state.data?.description)
            : `Discover Bali's hidden gems with Karen's Tour. We offer personalized tours, from breathtaking beaches to cultural landmarks. Let us guide you through an unforgettable adventure in Bali.`
        }
      />

      <Modal
        buttonApproveTitle="Booking"
        onApprove={actions.handleSubmit}
        isOpen={state.isOpen}
        onClose={actions.handleToggleModal}
        onCancel={actions.handleToggleModal}
        title="Booking Form"
        isLoading={state.loadingSubmit}
      >
        <FormBooking state={state} actions={actions} />
      </Modal>

      {state.data ? (
        <Layout still>
          <div ref={refs?.brochureRef} style={{ display: "none" }}>
            <TourBrochure destination={state.data ?? undefined} />
          </div>
          <Lightbox
            slideIndex={state.lightboxIndex}
            show={state.lightbox}
            images={state.data?.images}
            video={state.data?.video_url}
          />
          {state.data?.slug && (
            <Breadcrumb
              title="Tours"
              navigations={[
                { title: "Home", path: "/" },
                { title: "Tours", path: "/tour" },
                {
                  title: state.data?.title ?? "",
                  path: `/tour/${state.data?.slug ?? ""}`,
                },
              ]}
            />
          )}
          <Container className="py-10 lg:py-16">
            {state.data && (
              <Title title={state.data?.title ?? ""} action={false} />
            )}

            <GalleryDetail />

            <div className="mt-8 md:mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-5 gap-y-6 md:gap-y-10 lg:gap-10 relative">
              <div className="flex flex-col gap-y-6 md:gap-y-10 lg:gap-10 col-span-1 md:col-span-3">
                <div className={montserrat.className}>
                  <div className={`flex gap-4 mb-3 ${montserrat.className}`}>
                    {state.data.minimum_pax > 0 && (
                      <h4 className="flex items-center gap-x-2 text-base md:text-lg font-medium text-dark">
                        <BiSolidUser className="text-primary text-2xl" />
                        {state.data.minimum_pax} Guest
                        {state.data.minimum_pax > 1 && "s"}
                      </h4>
                    )}
                    <h4 className="flex items-center gap-x-2 text-base md:text-lg font-medium text-dark">
                      <BiSolidTime className="text-primary text-2xl" />
                      {state.data.duration}
                    </h4>
                  </div>
                  <h1
                    className={`text-3xl lg:text-4xl text-dark font-medium ${unbounded.className}`}
                  >
                    {currencyIDR(state.data?.price ?? 0)}{" "}
                    <span
                      className={`text-xs text-darkgray ${montserrat.className}`}
                    >
                      / person
                    </span>
                  </h1>
                  <p className="text-sm lg:text-base description text-darkgray mt-1 italic">
                    The price are includes transportation, admission fees, and
                    all other relevant costs.
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3 mt-3 md:mt-4">
                    {state.data?.categories?.map((c) => (
                      <div
                        key={c}
                        className={`text-sm ${montserrat.className}`}
                      >
                        <p className="bg-primary/10 py-1 px-2 text-primary rounded-lg font-medium">
                          {c}
                        </p>
                      </div>
                    ))}
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
          {state.data && (
            <PopularTourSlider
              exceptionId={state.data?.id}
              title="Other Popular Tours"
              description="Discover Bali with our featured tours"
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
          Description
        </p>
        <div className={`flex flex-col items-start ${montserrat.className}`}>
          <p
            dangerouslySetInnerHTML={{ __html: state.data?.description }}
            className={`text-base font-medium mt-3 leading-8 description ${
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
    return (
      <div
        className={`grid grid-rows-2 grid-cols-4 gap-1 my-6 md:my-8 lg:my-10 rounded-xl overflow-hidden relative ${montserrat.className}`}
      >
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
                <div className="absolute bottom-4 left-4 z-10">
                  <button
                    aria-label="btn-open-map"
                    className="flex gap-x-2 items-center backdrop-blur-md px-3 py-2 rounded-lg transition-all ease-in-out duration-500 hover:scale-[1.02] transform"
                  >
                    <BiSolidMap className="text-base text-white" />
                    <div className="text-left">
                      <Link
                        target="_blank"
                        href={`https://www.google.com/maps/search/?api=1&query=${
                          state.data?.title ?? state.data?.location
                        }`}
                      >
                        <p className="text-xs text-white font-medium">
                          Show on Map
                        </p>
                      </Link>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden relative row-span-2 col-span-4 md:col-span-3 lg:col-span-2 h-full aspect-video">
                <ImageShimmer
                  sizes="600px"
                  onClick={() =>
                    actions.handleToggleLightbox(
                      state.data?.thumbnail_image ??
                        (state.data?.images[0] as string)
                    )
                  }
                  priority
                  alt={state.data?.slug ? `image-main-${state.data?.slug}` : ""}
                  className="object-cover transform hover:scale-105 transition-transform ease-in-out duration-500"
                  fill
                  src={
                    state.data?.thumbnail_image ??
                    (state.data?.images[0] as string)
                  }
                />
              </div>
            )}
            {state.slicedImages?.map((image, index) => {
              const isLastImage =
                index === (state.slicedImages.length ?? 0) - 1;
              return (
                <div
                  key={index}
                  className="overflow-hidden relative aspect-square md:aspect-auto"
                >
                  <ImageShimmer
                    sizes="400px"
                    onClick={() => actions.handleToggleLightbox(image)}
                    priority
                    alt={`image-${index + 1}-${state.data?.slug}`}
                    className="object-cover transform hover:scale-105 transition-transform ease-in-out duration-500"
                    fill
                    src={image}
                  />
                  {isLastImage && (
                    <button
                      aria-label="btn-toggle-lightbox"
                      onClick={() => actions.handleToggleLightbox(image)}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-70 transition-all ease-in-out duration-500 flex items-center justify-center cursor-pointer">
                        <div className="text-white text-xs md:text-base font-light p-2 text-center">
                          <p className={unbounded.className}>
                            +{" "}
                            {(state.data?.images as string[]).length -
                              state.slicedImages.length -
                              (state.data?.thumbnail_image &&
                              !state.data.video_url
                                ? 1
                                : 0)}{" "}
                            Photos
                          </p>
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

export default memo(ServiceDetail);
