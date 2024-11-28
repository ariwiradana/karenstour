import Layout from "@/components/admin/layout";
import Link from "next/link";
import Input from "@/components/admin/elements/input";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import { HiChevronLeft } from "react-icons/hi2";
import InputChip from "@/components/admin/elements/input.chip";
import useAdminAddDestination from "@/hooks/admin/useAdminAddDestination";
import InputTextEditor from "@/components/admin/elements/input.texteditor";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { BiMap } from "react-icons/bi";
import InputCheckbox from "@/components/admin/elements/input.checkbox";
import { montserrat } from "@/constants/font";

interface PageProps {
  authToken: string;
}
const AddDestinationPage = (props: PageProps) => {
  const { state, actions } = useAdminAddDestination(props.authToken as string);

  return (
    <Layout>
      <div className="w-full">
        <h1 className="text-2xl md:text-3xl mb-6 font-medium text-admin-dark">
          Add New Destination
        </h1>
        <div className="mb-4 flex items-center gap-2">
          <Link href="/admin/destination">
            <button className="flex items-center text-darkgray transition hover:underline">
              <HiChevronLeft className="mr-2 text-lg" />
              <span>Back</span>
            </button>
          </Link>
        </div>

        <form
          onSubmit={actions.handleSubmit}
          className="xl:max-w-3xl lg:max-w-2xl max-w-xl flex flex-col gap-4 mt-12"
        >
          <Input
            accept="video/*"
            type="file"
            name="video"
            label="Video"
            onChange={(e) => actions.handleChange(e.target.files, "video")}
            error={state.errors.video}
          />
          <Input
            accept="image/*"
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
          <div>
            <p
              className={`block text-gray-700 mb-1 text-sm ${montserrat.className}`}
            >
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {state.categoryOptions.map((category) => {
                const categoryChecked = state.formData.categories.includes(
                  category.value
                );
                return (
                  <InputCheckbox
                    checked={categoryChecked}
                    id={`category-${category.value}`}
                    key={`category-${category.value}`}
                    onChange={(e) =>
                      actions.handleChange(e.target.value, "categories")
                    }
                    label={category.label}
                    value={category.value}
                  />
                );
              })}
            </div>
          </div>
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
          <InputChip
            label="What to Bring?"
            id="inventory"
            onChange={(value) => actions.handleChange(value, "inventory")}
            chips={state.formData.inventory}
            error={state.errors.inventory}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              full
              name="duration"
              label="Duration"
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
              icon={<BiMap />}
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookie = req.headers.cookie || "";
  const authToken = parse(cookie).authToken;

  if (!authToken) {
    res.writeHead(302, { Location: "/admin/login" });
    res.end();
    return {
      props: {},
    };
  }

  return {
    props: {
      authToken,
    },
  };
};

export default AddDestinationPage;
