import { UseDestinationDetail } from "@/hooks/client/useDestinationDetail";
import { FC } from "react";
import CustomInput from "./elements/input";
import { RiShoppingBag4Fill } from "react-icons/ri";
import CustomTextarea from "./elements/textarea";
import { montserrat, unbounded } from "@/constants/font";
import moment from "moment";
import ButtonPrimary from "./elements/button.primary";
import { currencyIDR } from "@/utils/currencyFormatter";
import CustomInputNumber from "./elements/input.number";
import CustomSelect2 from "./elements/select2";

const FormBooking: FC<UseDestinationDetail> = (props) => {
  const bookingDate = props.state.formData.bookingDate;
  const formattedDate = moment(bookingDate).format("YYYY-MM-DD");

  return (
    <form
      onSubmit={props.actions.handleSubmit}
      className="flex flex-col gap-6 p-6"
    >
      <div className="flex items-start justify-between gap-8 border-b pb-6 border-dashed">
        <h1
          className={`font-semibold text-dark text-2xl ${unbounded.className}`}
        >
          {props.state.data?.title}
        </h1>
        <div className={`${montserrat.className} flex flex-col items-end`}>
          <p className="text-xs font-medium text-darkgray">Total Price</p>
          <h1 className="font-semibold text-dark text-2xl text-right whitespace-nowrap">
            {currencyIDR(
              props.state.formData.pax * (props.state.data?.price ?? 0)
            )}
          </h1>
        </div>
      </div>

      <div className="flex gap-x-2">
        <CustomSelect2
          className="min-h-12 border border-gray-100"
          label="Title"
          name="name"
          value={props.state.formData.nameTitle}
          id="nameTitle"
          onChange={(e) =>
            props.actions.handleChange(e.target.value, "nameTitle")
          }
          options={[
            { key: "Mr", value: "mr" },
            { key: "Mrs", value: "mrs" },
            { key: "Ms", value: "ms" },
          ]}
        />
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

      <CustomInputNumber
        onChange={(e) =>
          props.actions.handleChange(Number(e.target.value), "pax")
        }
        min={props.state.data?.minimum_pax}
        max={10}
        name="pax"
        type="number"
        label="Pax"
        value={props.state.formData.pax}
        error={props.state.errors.pax}
        info={`A minimum of ${props.state.data?.minimum_pax} participants (pax) is required for this tour. Please note that only children aged 4 years and above will be counted as participants`}
      />

      <CustomTextarea
        name="message"
        label="Message"
        value={props.state.formData.message}
        onChange={(e) => props.actions.handleChange(e.target.value, "message")}
        error={props.state.errors.message}
      />

      <div className="flex justify-end">
        <ButtonPrimary
          id="btn-form-booking"
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
