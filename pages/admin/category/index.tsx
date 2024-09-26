import Layout from "@/components/admin/layout";
import useAdminCategory from "@/hooks/admin/useAdminCategory";
import { Pagination, TextField } from "@mui/material";
import Link from "next/link";

const AdminCategoryPage = () => {
  const { state, actions } = useAdminCategory();

  return (
    <Layout>
      <div>
        <h1 className="text-2xl md:text-3xl mb-6">Category Management</h1>
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Link href="/admin/category/add">
            <button className="bg-admin-success text-white font-semibold py-2 px-4 rounded">
              Add New Category
            </button>
          </Link>
          {state.totalRows > 0 && (
            <TextField
              value={state.search}
              onChange={actions.handleSearch}
              size="small"
              label="Search"
              variant="outlined"
              className="w-64"
            />
          )}
        </div>
        <div>
          <div className="min-w-full overflow-x-auto">
            <table className="table-auto w-full border-collapse min-w-max text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-sm text-dark">Name</th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.categories.map((category) => (
                  <tr key={category.id} className="text-left">
                    <td className="border px-4 py-2 text-left text-dark capitalize text-sm md:text-base max-w-80">
                      <h6 className="font-medium">{category.name}</h6>
                    </td>
                    <td className="border px-4 py-2">
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

export default AdminCategoryPage;
