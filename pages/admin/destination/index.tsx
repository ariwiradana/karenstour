import Layout from "@/components/admin/layout";
import useAdminDestination from "@/hooks/admin/useAdminDestination";
import { convertHoursToReadableFormat } from "@/utils/convertToReadableHours";
import { currencyIDR } from "@/utils/currencyFormatter";
import { Pagination, TextField } from "@mui/material";
import Link from "next/link";

const AdminDestinationPage = () => {
  const { state, actions } = useAdminDestination();

  return (
    <Layout>
      <div>
        <h1 className="text-2xl md:text-3xl mb-6">Destination Management</h1>
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Link href="/admin/destination/add">
            <button className="bg-admin-success text-white font-semibold py-2 px-4 rounded">
              Add New Destination
            </button>
          </Link>

          <TextField
            value={state.search}
            onChange={actions.handleSearch}
            size="small"
            label="Search"
            variant="outlined"
            className="w-64"
          />
        </div>
        {state.totalRows > 0 && (
          <div className="min-w-full overflow-x-auto">
            <table className="table-auto w-full border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border px-4 py-2 text-sm text-dark">Tour</th>
                  <th className="border px-4 py-2 text-sm text-dark">Assets</th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Category
                  </th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Duration
                  </th>
                  <th className="border px-4 py-2 text-sm text-dark">Price</th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((destination) => (
                  <tr key={destination.id} className="align-top">
                    <td className="border px-4 py-2 text-left text-dark text-sm md:text-base max-w-56">
                      <div className="mt-2">
                        <h4 className="font-medium">{destination.title}</h4>
                        <h6 className="text-darkgray text-sm mt-1">
                          {destination.slug}
                        </h6>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark text-base max-w-80">
                      <div>
                        <p className="text-darkgray text-sm">Thumbnail</p>
                        <h4 className="font-medium">
                          {destination.video_url ? "✅" : "❌"}
                        </h4>
                      </div>
                      <div className="mt-1">
                        <p className="text-darkgray text-sm">Images</p>
                        <h4 className="font-medium">
                          {destination.images.length > 0
                            ? destination.images.length
                            : "-"}
                        </h4>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark capitalize text-sm md:text-base max-w-80">
                      <h6 className="font-medium">
                        {destination.category_name}
                      </h6>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark capitalize text-sm md:text-base max-w-80">
                      <h6 className="font-medium">
                        {convertHoursToReadableFormat(destination.duration)}
                      </h6>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark capitalize text-sm md:text-base max-w-80">
                      <h6 className="font-medium">
                        {currencyIDR(destination.price)}
                      </h6>
                    </td>
                    <td className="border px-4 py-2">
                      <Link href={`/admin/destination/${destination.id}`}>
                        <button className="text-white font-semibold text-sm py-1 px-3 rounded bg-admin-primary mr-2">
                          Detail
                        </button>
                      </Link>
                      <button
                        onClick={() => actions.handleDelete(destination.id)}
                        className="text-white font-semibold text-sm py-1 px-3 rounded bg-admin-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

export default AdminDestinationPage;
