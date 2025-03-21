import { UseDestinationDetail } from "@/hooks/client/useDestinationDetail";
import { FC } from "react";
import CustomInput from "./elements/input";
import CustomTextarea from "./elements/textarea";
import { montserrat } from "@/constants/font";
import moment from "moment";
import { currencyIDR } from "@/utils/currencyFormatter";
import CustomInputNumber from "./elements/input.number";

const FormBooking: FC<UseDestinationDetail> = (props) => {
  const bookingDate = props.state.formData.bookingDate;
  const formattedDate = moment(bookingDate).format("YYYY-MM-DD");

  return (
    <form className="flex flex-col gap-4 md:gap-6">
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6 border-b pb-4 md:pb-6 border-dashed">
        <div>
          <p
            className={`text-sm font-medium text-darkgray ${montserrat.className}`}
          >
            Total Price
          </p>
          <h1
            className={`font-bold text-dark text-2xl md:text-3xl whitespace-nowrap ${montserrat.className}`}
          >
            {currencyIDR(
              props.state.formData.pax * (props.state.data?.price ?? 0)
            )}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <div className="flex gap-x-2">
          <CustomInput
            onChange={(e) => props.actions.handleChange(e.target.value, "name")}
            name="name"
            label="Fullname"
            value={props.state.formData.name}
            error={props.state.errors.name}
          />
        </div>

        <CustomInput
          onChange={(e) => props.actions.handleChange(e.target.value, "email")}
          name="email"
          type="email"
          label="Email"
          value={props.state.formData.email}
          error={props.state.errors.email}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <CustomInput
          onChange={(e) =>
            props.actions.handleChange(e.target.value, "bookingDate")
          }
          type="date"
          name="bookingDate"
          label="Booking Date"
          value={formattedDate}
          error={props.state.errors.bookingDate}
        />

        <CustomInputNumber
          onChange={(e) =>
            props.actions.handleChange(Number(e.target.value), "pax")
          }
          min={props.state.data?.minimum_pax}
          max={10}
          name="pax"
          type="number"
          label="Guest(s)"
          value={props.state.formData.pax}
          error={props.state.errors.pax}
          info={`A minimum of ${props.state.data?.minimum_pax} guest${
            Number(props.state.data?.minimum_pax) > 1 && "s"
          } is required for this tour. Please note that only children aged 4 years and above will be counted as participants`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <CustomTextarea
          rows={3}
          onChange={(e) =>
            props.actions.handleChange(e.target.value, "pickupLocation")
          }
          name="pickupLocation"
          label="Pickup Address"
          value={props.state.formData.pickupLocation}
          error={props.state.errors.pickupLocation}
          info="Please enter the name of your pickup location (e.g., hotel name, address, or landmark)."
        />

        <CustomTextarea
          rows={3}
          name="message"
          label="Message"
          value={props.state.formData.message}
          onChange={(e) =>
            props.actions.handleChange(e.target.value, "message")
          }
          error={props.state.errors.message}
        />
      </div>
    </form>
  );
};

export default FormBooking;
