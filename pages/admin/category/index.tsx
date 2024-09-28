import ButtonPrimary from "@/components/admin/elements/button.primary";
import ButtonPrimaryIcon from "@/components/admin/elements/button.primary.icon";
import Input from "@/components/admin/elements/input";
import Layout from "@/components/admin/layout";
import useAdminCategory from "@/hooks/admin/useAdminCategory";
import { Pagination } from "@mui/material";
import { parse } from "cookie";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

const AdminCategoryPage = () => {
  const { state, actions } = useAdminCategory();

  return (
    <Layout>
      <div>
        <h1 className="text-2xl md:text-3xl mb-6 font-medium text-admin-dark">
          Category Management
        </h1>
        <div className="mb-4 flex items-end flex-wrap gap-3">
          <Link href="/admin/category/add">
            <ButtonPrimary
              icon={<BiPlus />}
              title="Add New Category"
              className="hidden md:flex"
            />
            <ButtonPrimaryIcon className="md:hidden" icon={<BiPlus />} />
          </Link>
          {state.totalRows > 0 && (
            <Input
              inputSize="medium"
              placeholder="Search"
              value={state.search}
              onChange={actions.handleSearch}
              id="search"
            />
          )}
        </div>
        <div>
          <div className="min-w-full overflow-x-auto">
            <table className="table-auto w-full border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-100 text-left border border-gray-200">
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Category
                  </th>
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.categories.map((category) => (
                  <tr
                    key={category.id}
                    className="text-left border-b border-b-gray-200"
                  >
                    <td className="px-4 py-2 text-left text-admin-dark text-sm max-w-80">
                      <h6>{category.name}</h6>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-x-2">
                        <button
                          onClick={() => actions.handleDelete(category.id)}
                          className="text-white font-semibold text-sm py-1 px-3 rounded bg-admin-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {Math.ceil(state.totalRows / state.limit) > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              shape="rounded"
              count={Math.ceil(state.totalRows / state.limit)}
              page={state.page}
              onChange={(event, page) => actions.setPage(page)}
              color="primary"
            />
          </div>
        )}
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
    props: {},
  };
};

export default AdminCategoryPage;
