import Layout from "@/components/admin/layout";
import Link from "next/link";
import { FC } from "react";
import Input from "@/components/admin/elements/input";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import { HiChevronLeft } from "react-icons/hi2";
import { GetServerSideProps } from "next";
import { Env } from "@/constants/types";
import useAdminAddCategory from "@/hooks/admin/useAdminAddCategory";

interface PageProps extends Env {}

const AdminAddCategoryPage: FC<PageProps> = () => {
  const { state, actions } = useAdminAddCategory();

  return (
    <Layout>
      <div className="p-2 md:p-6 w-full">
        <h1 className="text-2xl md:text-3xl mb-6">Add New Category</h1>
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
          className="max-w-lg flex flex-col gap-4 mt-12"
        >
          <Input
            name="name"
            label="Category"
            onChange={(e) => actions.handleChange(e.target.value, "name")}
            value={state.formData.name}
            error={state.errors.name}
          />

          <div className="flex">
            <ButtonPrimary
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

export default AdminAddCategoryPage;
