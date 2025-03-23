import Layout from "@/components/admin/layout";
import Link from "next/link";
import { FC } from "react";
import Input from "@/components/admin/elements/input";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import { HiChevronLeft } from "react-icons/hi2";
import { GetServerSideProps } from "next";
import useAdminAddCategory from "@/hooks/admin/useAdminAddCategory";
import { parse } from "cookie";
import { BiCategory } from "react-icons/bi";
import InputTextarea from "@/components/admin/elements/textarea";

interface PageProps {
  authToken?: string;
}

const AdminAddCategoryPage: FC<PageProps> = ({ authToken }) => {
  const { state, actions } = useAdminAddCategory(authToken as string);

  return (
    <Layout>
      <div className="w-full">
        <h1 className="text-2xl md:text-3xl mb-6 font-medium text-admin-dark">
          Add New Category
        </h1>
        <div className="mb-4 flex items-center gap-2">
          <Link
            href="/admin/category"
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
          <div className="grid grid-cols-2 gap-x-4 md:gap-x-6">
            <Input
              name="name"
              label="Category"
              onChange={(e) => actions.handleChange(e.target.value, "name")}
              value={state.formData.name}
              error={state.errors.name}
            />
            <Input
              name="title"
              label="Title Section"
              onChange={(e) => actions.handleChange(e.target.value, "title")}
              value={state.formData.title}
              error={state.errors.title}
            />
          </div>
          <InputTextarea
            name="description"
            label="Description Section"
            onChange={(e) =>
              actions.handleChange(e.target.value, "description")
            }
            value={state.formData.description}
            error={state.errors.description}
          />

          <div className="flex justify-end">
            <ButtonPrimary
              icon={<BiCategory />}
              disabled={state.loading}
              title="Add New Category"
              type="submit"
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
}) => {
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

export default AdminAddCategoryPage;
