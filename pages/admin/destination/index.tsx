import ButtonPrimary from "@/components/admin/elements/button.primary";
import ButtonPrimaryIcon from "@/components/admin/elements/button.primary.icon";
import Input from "@/components/admin/elements/input";
import Layout from "@/components/admin/layout";
import useAdminDestination from "@/hooks/admin/useAdminDestination";
import { currencyIDR } from "@/utils/currencyFormatter";
import { Pagination } from "@mui/material";
import { parse } from "cookie";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

interface PageProps {
  authToken: string;
}

const AdminDestinationPage = (props: PageProps) => {
  const { state, actions } = useAdminDestination(props.authToken as string);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl md:text-3xl mb-6 font-medium text-admin-dark">
          Destination Management
        </h1>
        <div className="mb-4 flex items-end flex-wrap gap-3">
          <Link href="/admin/destination/add">
            <ButtonPrimary
              icon={<BiPlus />}
              title="Add New Destination"
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
        {state.totalRows > 0 && (
          <div className="min-w-full overflow-x-auto">
            <table className="table-auto w-full border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border px-4 py-2 text-sm text-dark">Destination</th>
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
                        <h1 className="font-medium">{destination.title}</h1>
                        <p className="text-darkgray text-sm mt-1">
                          {destination.slug}
                        </p>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark text-base max-w-80">
                      <div>
                        <p className="text-darkgray text-sm">Thumbnail</p>
                        <h1 className="font-medium">
                          {destination.thumbnail_image ? "✅" : "❌"}
                        </h1>
                      </div>
                      <div className="mt-1">
                        <p className="text-darkgray text-sm">Images</p>
                        <h1 className="font-medium">
                          {destination.images.length > 0
                            ? destination.images.length
                            : "-"}
                        </h1>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark capitalize text-sm md:text-base max-w-80">
                      <span className="font-medium">
                        {destination.category_name}
                      </span>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark capitalize text-sm md:text-base max-w-80">
                      <span className="font-medium">
                        {destination.duration}
                      </span>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark capitalize text-sm md:text-base max-w-80">
                      <span className="font-medium">
                        {currencyIDR(destination.price)}
                      </span>
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

export default AdminDestinationPage;
