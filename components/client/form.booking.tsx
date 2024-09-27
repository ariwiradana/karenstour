import { UseDestinationDetail } from "@/hooks/client/useDestinationDetail";
import { FC } from "react";
import CustomInput from "./elements/input";
import { RiShoppingBag4Fill } from "react-icons/ri";
import CustomTextarea from "./elements/textarea";
import { montserrat } from "@/constants/font";
import moment from "moment";
import ButtonPrimary from "./elements/button.primary";
import { currencyIDR } from "@/utils/currencyFormatter";

const FormBooking: FC<UseDestinationDetail> = (props) => {
  const bookingDate = props.state.formData.bookingDate;
  const formattedDate = moment(bookingDate).format("YYYY-MM-DD");

  return (
    <form
      onSubmit={props.actions.handleSubmit}
      className="flex flex-col gap-6 p-6"
    >
      <div className={montserrat.className}>
        <p className="text-xs mb-1 font-medium text-darkgray">Trip Name</p>
        <h5 className="font-semibold text-dark text-xl">
          {props.state.data?.title}
        </h5>
      </div>
      <div className={montserrat.className}>
        <p className="text-xs mb-1 font-medium text-darkgray">Price</p>
        <h5 className="font-semibold text-dark text-xl">
          {currencyIDR(
            props.state.formData.pax * (props.state.data?.price ?? 0)
          )}
          <span className="text-sm text-darkgray font-normal">
            {" "}
            / {props.state.formData.pax} pax
          </span>
        </h5>
      </div>
      <CustomInput
        onChange={props.actions.handleChange}
        name="name"
        label="Full name"
        value={props.state.formData.name}
        error={props.state.errors.name}
      />
      <CustomInput
        onChange={props.actions.handleChange}
        name="email"
        type="email"
        label="Email"
        value={props.state.formData.email}
        error={props.state.errors.email}
      />

      <CustomInput
        onChange={props.actions.handleChange}
        type="date"
        name="bookingDate"
        label="Booking Date"
        value={formattedDate}
        error={props.state.errors.bookingdate}
      />

      <CustomTextarea
        rows={3}
        onChange={props.actions.handleChange}
        name="pickupLocation"
        label="Pickup Address"
        value={props.state.formData.pickupLocation}
        error={props.state.errors.pickupLocation}
        info="Please enter the name of your pickup location (e.g., hotel name, address, or landmark)."
      />
      <CustomInput
        onChange={props.actions.handleChange}
        min={props.state.data?.minimum_pax}
        max={10}
        name="pax"
        type="number"
        label="Pax"
        value={props.state.formData.pax}
        error={props.state.errors.pax}
        info={`We require a minimum of ${props.state.data?.minimum_pax} participants (pax) for this tour.`}
      />

      <CustomTextarea
        name="message"
        label="Message"
        value={props.state.formData.message}
        onChange={props.actions.handleChange}
        error={props.state.errors.message}
      />

      <div className="flex justify-end">
        <ButtonPrimary
          disabled={props.state.loadingSubmit}
          type="submit"
          icon={<RiShoppingBag4Fill className="text-2xl" />}
          title="Booking"
        />
      </div>
    </form>
  );
};

export default FormBooking;
