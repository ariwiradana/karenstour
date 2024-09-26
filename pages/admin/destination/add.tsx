import Layout from "@/components/admin/layout";
import Link from "next/link";
import { FC } from "react";
import Input from "@/components/admin/elements/input";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import { HiChevronLeft } from "react-icons/hi2";
import InputChip from "@/components/admin/elements/input.chip";
import useAdminAddDestination from "@/hooks/admin/useAdminAddDestination";
import InputTextEditor from "@/components/admin/elements/input.texteditor";
import InputSelect from "@/components/admin/elements/select";

const AddDestinationPage: FC = () => {
  const { state, actions } = useAdminAddDestination();

  return (
    <Layout>
      <div className="p-2 md:p-6 w-full">
        <h1 className="text-2xl md:text-3xl mb-6">Add New Destination</h1>
        <div className="mb-4 flex items-center gap-2">
          <Link
            href="/admin/destination"
            className="flex items-center text-darkgray transition hover:underline"
          >
            <HiChevronLeft className="mr-2 text-lg" />
            <span>Back</span>
          </Link>
        </div>

        <form
          onSubmit={actions.handleSubmit}
          className="max-w-xl flex flex-col gap-4 mt-12"
        >
          <Input
            type="file"
            name="video"
            label="Video"
            onChange={(e) => actions.handleChange(e.target.files, "video")}
            error={state.errors.video}
          />
          <Input
            multiple
            type="file"
            name="images"
            label="Images"
            onChange={(e) => actions.handleChange(e.target.files, "images")}
            error={state.errors.images}
          />
          <Input
            name="title"
            label="Title"
            onChange={(e) => actions.handleChange(e.target.value, "title")}
            value={state.formData.title}
            error={state.errors.title}
          />
          <InputSelect
            label="Category"
            onChange={(e) =>
              actions.handleChange(Number(e.target.value), "categoryId")
            }
            value={state.formData.categoryId?.toString()}
            error={state.errors.categoryId}
            options={state.categoryOptions}
          />
          <InputTextEditor
            label="Description"
            onChange={(value) => actions.handleChange(value, "description")}
            value={state.formData.description}
            error={state.errors.description}
          />
          <InputChip
            label="Inclusion(s)"
            id="inclusions"
            onChange={(value) => actions.handleChange(value, "inclusions")}
            chips={state.formData.inclusions}
            error={state.errors.inclusions}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              full
              type="number"
              name="duration"
              label="Duration (eg. Hour)"
              onChange={(e) => actions.handleChange(e.target.value, "duration")}
              value={state.formData.duration}
              error={state.errors.duration}
            />
            <Input
              full
              type="number"
              name="pax"
              label="Minimum Pax"
              onChange={(e) => actions.handleChange(e.target.value, "pax")}
              value={state.formData.pax}
              error={state.errors.pax}
            />
          </div>
          <Input
            name="price"
            label="Price"
            onChange={(e) => actions.handleChange(e.target.value, "price")}
            value={state.formData.price}
            error={state.errors.price}
          />

          <div className="flex justify-end">
            <ButtonPrimary
              disabled={state.loading}
              title="Add Destination"
              type="submit"
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddDestinationPage;
