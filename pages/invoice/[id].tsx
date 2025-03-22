import ButtonPrimary from "@/components/client/elements/button.primary";
import InputFile from "@/components/client/elements/input.file";
import Layout from "@/components/client/layout";
import SEO from "@/components/client/seo";
import { montserrat, unbounded } from "@/constants/font";
import useProofPayment from "@/hooks/client/useProofPayment";
import { currencyIDR } from "@/utils/currencyFormatter";
import { formatDate } from "@/utils/dateFormatter";
import { GetServerSideProps } from "next";
import React, { FC } from "react";
import { LoaderIcon } from "react-hot-toast";
import { BiCloudUpload } from "react-icons/bi";

interface PageProps {
  id: string;
}

const UploadPaymentProof: FC<PageProps> = (props) => {
  const { state, actions } = useProofPayment(props.id);

  const paid =
    ["paid", "ongoing"].includes(state.booking?.status ?? "") ?? false;
  const reviewed =
    state.booking?.payment_proof && state.booking.status === "confirmed"
      ? true
      : false;

  console.log(
    state.booking?.status,
    ["completed", "canceled"].includes(state.booking?.status as string)
  );

  return (
    <Layout still>
      <SEO
        keywords=""
        url={
          typeof window !== "undefined"
            ? `${window.location.origin}/${props.id}`
            : ""
        }
        image="/images/logo.png"
        title="Bali Tour Experience | Karens Tour"
        description="Discover Bali's hidden gems with Karen's Tour. We offer personalized tours, from breathtaking beaches to cultural landmarks. Let us guide you through an unforgettable adventure in Bali."
      />
      <div className={`${montserrat.className}`}>
        {state.loading ? (
          <div className="flex justify-center w-full items-center">
            <LoaderIcon />
          </div>
        ) : (
          <div className="min-h-[40vh] md:min-h-[50vh] flex items-center">
            {state.booking?.id === props.id &&
            !["pending", "completed", "canceled"].includes(
              state.booking.status
            ) ? (
              <div className="lg:my-10 p-6 bg-white lg:rounded-xl lg:border border-zinc-200 mx-auto lg:max-w-screen-md">
                <h1
                  className={`text-lg md:text-xl font-semibold mb-1 text-dark ${unbounded.className}`}
                >
                  Invoice
                </h1>
                <h2 className="text-dark/70 font-medium text-base mb-3 md:mb-6 border-b border-b-zinc-200 pb-3">
                  #{props.id}
                </h2>

                {reviewed || paid ? (
                  <div className="my-4 p-4 bg-admin-success/15 border border-admin-success/40 rounded-lg">
                    <h1 className="text-lg font-semibold text-primary mb-1">
                      {paid
                        ? "Payment Already Paid"
                        : "Payment Review in Progress"}
                    </h1>
                    <p className="text-dark">
                      {paid
                        ? "Your payment has already been paid. Thank you for booking your tour with us!"
                        : "Your proof of payment has been uploaded and is currently under review."}
                    </p>
                  </div>
                ) : null}

                <div className={`${montserrat.className}`}>
                  <div className="text-dark text-sm md:text-base">
                    <p>
                      Dear{" "}
                      <span className="font-semibold">
                        {state.booking?.name}
                      </span>
                      ,
                      <br />
                      We hope you&apos;re excited about your upcoming trip!{" "}
                      {!reviewed && !paid ? (
                        <span>
                          To ensure everything is ready, please upload your
                          proof of payment at your earliest convenience.
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <h3 className="text-green-600 font-medium text-base mt-6">
                    Booking Details
                  </h3>
                  <ul className="list-none p-0 text-sm md:text-base">
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">Destination :</span>{" "}
                      {state.booking?.destination_title}
                    </li>
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">Due Date :</span>{" "}
                      {formatDate(state.booking?.booking_date as string)}
                    </li>
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">Duration :</span>{" "}
                      {state.booking?.destination_duration}
                    </li>
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">Guest(s) :</span>{" "}
                      {state.booking?.pax} Pax
                    </li>
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">Inclusions :</span>{" "}
                      {state.booking?.destination_inclusions.join(", ")}
                    </li>
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">Pickup Location :</span>{" "}
                      {state.booking?.pickup_location}
                    </li>
                  </ul>

                  <h3 className="text-green-600 font-medium text-base mt-6">
                    Description
                  </h3>
                  <ul className="list-none p-0 text-sm md:text-base">
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">Price :</span>{" "}
                      {currencyIDR(state.booking?.destination_price || 0)}
                    </li>
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">Subtotal :</span>{" "}
                      {currencyIDR(state.booking?.subtotal || 0)}
                    </li>
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">
                        Tax ({state.booking?.tax_rate}) :
                      </span>{" "}
                      {currencyIDR(state.booking?.tax || 0)}
                    </li>
                    <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <span className="font-semibold">Total :</span>{" "}
                      {currencyIDR(state.booking?.total || 0)}
                    </li>
                  </ul>
                  {!paid && (
                    <>
                      <h3 className="text-green-600 font-medium text-base mt-6">
                        Payment Instructions (Bank Transfer)
                      </h3>

                      <ul className="list-none p-0 text-sm md:text-base">
                        <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                          <span className="font-semibold">Bank Name :</span> BCA
                        </li>
                        <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                          <span className="font-semibold">Account Name :</span>{" "}
                          Karen&apos;s Tour
                        </li>
                        <li className="my-2 md:my-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                          <span className="font-semibold">
                            Account Number :
                          </span>{" "}
                          123928712627
                        </li>
                      </ul>
                    </>
                  )}

                  {!paid && !reviewed ? (
                    <>
                      <h3 className="text-green-600 font-medium text-base mt-6">
                        Proof of Payment
                      </h3>
                      <form onSubmit={actions.handleSubmit} className="mt-1">
                        <InputFile
                          placeholder="Proof of Payment File"
                          onChange={actions.handleFileChange}
                          value={state.file?.name ?? ""}
                        />
                        <p className="text-dark/60 text-xs mt-1 italic">
                          Upload your proof of payment, your booking will be
                          processed once the payment proof is received.
                        </p>
                        <div className="flex justify-end mt-4">
                          <ButtonPrimary
                            disabled={!state.file}
                            isLoading={state.isLoadingSubmit}
                            icon={<BiCloudUpload />}
                            title="Upload"
                            id="btn-upload"
                          />
                        </div>
                      </form>
                    </>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="lg:my-10 p-6 bg-white lg:rounded-xl lg:border border-zinc-200 mx-auto lg:max-w-screen-md">
                <h1 className="text-2xl font-bold mb-1 text-red-700">
                  Booking Not Found
                </h1>
                <p className="text-gray-700 mb-4">
                  We couldn&apos;t find a booking associated with Invoice
                  <span className="font-semibold"> #{props.id}</span>. Please
                  check the invoice number and try again.
                </p>
                <p className="text-gray-600">
                  If you believe this is an error, please contact our support
                  team.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const { id } = context.params as { id: string };

  return {
    props: {
      id,
    },
  };
};

export default UploadPaymentProof;
