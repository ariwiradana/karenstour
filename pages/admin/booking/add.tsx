import Layout from "@/components/admin/layout";
import Link from "next/link";
import { FC } from "react";
import Input from "@/components/admin/elements/input";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import { HiChevronLeft } from "react-icons/hi2";
import useAdminAddBooking from "@/hooks/admin/useAdminAddBooking";
import moment from "moment";
import SearchableSelect from "@/components/admin/elements/input.searchable";
import { GetServerSideProps } from "next";
import { Env } from "@/constants/types";

interface PageProps extends Env {}

const AddDestinationPage: FC<PageProps> = (props) => {
  const { state, actions } = useAdminAddBooking(
    props.publicKey,
    props.serviceId
  );

  return (
    <Layout>
      <div className="p-2 md:p-6 w-full">
        <h1 className="text-2xl md:text-3xl mb-6">Add New Booking</h1>
        <div className="mb-4 flex items-center gap-2">
          <Link
            href="/admin/booking"
            className="flex items-center text-darkgray transition hover:underline"
          >
            <HiChevronLeft className="mr-2 text-lg" />
            <span>Back</span>
          </Link>
        </div>

        <form
          onSubmit={actions.handleSubmit}
          className="xl:max-w-3xl lg:max-w-2xl max-w-xl flex flex-col gap-4 mt-12"
        >
          <Input
            name="name"
            label="Name"
            onChange={(e) => actions.handleChange(e.target.value, "name")}
            value={state.formData.name}
            error={state.errors.name}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            onChange={(e) => actions.handleChange(e.target.value, "email")}
            value={state.formData.email}
            error={state.errors.email}
          />
          <Input
            name="bookingDate"
            label="BookingDate"
            type="date"
            onChange={(e) =>
              actions.handleChange(
                moment(e.target.value).format("YYYY-MM-DD"),
                "bookingDate"
              )
            }
            value={
              state.formData.bookingDate
                ? moment(state.formData.bookingDate).format("YYYY-MM-DD")
                : ""
            }
            error={state.errors.bookingDate}
          />
          <SearchableSelect
            options={state.options}
            onChange={(e) =>
              actions.handleChange(e.target.value, "destination")
            }
            value={state.formData.destination.toString()}
            label="Destination"
            name="destination"
            error={state.errors.destination}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              full
              type="number"
              name="pax"
              label="Pax"
              onChange={(e) => actions.handleChange(e.target.value, "pax")}
              value={state.formData.pax}
              error={state.errors.pax}
            />
            <Input
              full
              name="pickupLocation"
              label="Pickup Location"
              onChange={(e) =>
                actions.handleChange(e.target.value, "pickupLocation")
              }
              value={state.formData.pickupLocation}
              error={state.errors.pickupLocation}
            />
          </div>

          <div className="flex justify-end">
            <ButtonPrimary
              disabled={state.loading}
              title="Add New Booking"
              type="submit"
            />
          </div>
        </form>
      </div>
    </Layout>
  );
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

export default AddDestinationPage;
