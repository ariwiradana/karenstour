import Container from "@/components/client/container";
import ButtonPrimary from "@/components/client/elements/button.primary";
import InputFile from "@/components/client/elements/input.file";
import Layout from "@/components/client/layout";
import { montserrat } from "@/constants/font";
import useProofPayment from "@/hooks/client/useProofPayment";
import { GetServerSideProps } from "next";
import React, { FC } from "react";

interface PageProps {
  id: string;
}

const UploadPaymentProof: FC<PageProps> = (props) => {
  const { state, actions } = useProofPayment(props.id);

  const paidStatus = ["paid", "ongoing", "complete"];
  const paid = paidStatus.includes(state.data?.status ?? "") ?? false;
  const uploaded = state.data?.payment_proof;

  return (
    <Layout still pageTitle="Upload Payment Proof">
      <Container
        className={`min-h-[60vh] md:min-h-[50vh] flex items-center ${montserrat.className}`}
      >
        {state.loading ? (
          <div className="flex flex-col gap-y-4 w-full min-h-[60vh]">
            <div className="shine h-5 w-[80%] rounded"></div>
            <div className="shine h-20 w-full rounded"></div>
            <div className="shine h-12 w-[60%] rounded"></div>
          </div>
        ) : (
          <>
            {state.data?.id ?? "" === props.id ? (
              <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl border">
                <h2 className="text-2xl font-bold mb-1 text-gray-700">
                  {!paid && !uploaded
                    ? "Upload Proof of Payment"
                    : "Payment Proof"}
                </h2>
                {!paid && !uploaded ? (
                  <h5 className="text-darkgray font-medium text-base mb-6">
                    Invoice #{props.id}
                  </h5>
                ) : (
                  <></>
                )}

                {paid || uploaded ? (
                  <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-800 mb-1">
                      {paid || uploaded
                        ? `Invoice #${props.id}`
                        : "Payment Already Paid"}
                    </h4>
                    <p className="text-gray-700">
                      {uploaded && !paid
                        ? "Your proof of payment has been uploaded and is currently under review."
                        : "Your payment has already been paid. Thank you for booking your tour with us!"}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={actions.handleSubmit}>
                    <InputFile
                      placeholder="Choose File"
                      onChange={actions.handleFileChange}
                      label="Proof of Payment"
                      value={state.file?.name ?? ""}
                    />

                    <div className="flex justify-end">
                      <ButtonPrimary
                        disabled={state.loading}
                        title="Upload"
                        type="submit"
                      />
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl border">
                <h2 className="text-2xl font-bold mb-1 text-red-700">
                  Booking Not Found
                </h2>
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
          </>
        )}
      </Container>
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
