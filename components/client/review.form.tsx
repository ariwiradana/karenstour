import { montserrat, unbounded } from "@/constants/font";
import React, { FC } from "react";
import CustomInput from "./elements/input";
import CustomTextarea from "./elements/textarea";
import { Rating } from "@mui/material";
import { FaStar } from "react-icons/fa6";
import ButtonPrimary from "./elements/button.primary";
import useReviews from "@/hooks/client/useReviews";
import { Destination } from "@/constants/types";
import { BiSolidSend } from "react-icons/bi";

interface Props {
  destination: Destination;
}

const ReviewForm: FC<Props> = (props) => {
  const { state, actions } = useReviews(props.destination.id);

  return (
    <form
      onSubmit={actions.handleSubmit}
      className={`p-6 md:p-10 rounded-xl bg-lightgray flex flex-col gap-6 ${unbounded.className}`}
    >
      <div>
        <h1 className="font-semibold text-dark text-xl">Write a Review</h1>
        <p
          className={`text-sm font-medium text-darkgray mt-3 ${montserrat.className}`}
        >
          How would you rate us?
        </p>
      </div>
      <CustomInput
        value={state.formData.user_name}
        name="user_name"
        label="Name"
        onChange={(e) => actions.handleChange(e.target.value, "user_name")}
        error={state.errors.user_name}
      />
      <div>
        <p
          className={`text-xs mb-1 font-medium text-darkgray ml-2 ${montserrat.className}`}
        >
          Rating
        </p>
        <Rating
          value={state.formData.rating}
          name="rating"
          size="large"
          icon={<FaStar />}
          emptyIcon={<FaStar className="text-gray-200" />}
          onChange={(e, value) => actions.handleChange(Number(value), "rating")}
        />
      </div>
      <CustomTextarea
        value={state.formData.comments}
        name="comments"
        label="Review"
        onChange={(e) => actions.handleChange(e.target.value, "comments")}
        error={state.errors.comments}
      />
      <div className="flex justify-end mt-4">
        <ButtonPrimary
          id="btn-form-review"
          disabled={state.loading}
          type="submit"
          icon={<BiSolidSend />}
          title="Submit"
        />
      </div>
    </form>
  );
};

export default ReviewForm;
