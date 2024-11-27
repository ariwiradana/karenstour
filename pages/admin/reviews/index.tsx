import Input from "@/components/admin/elements/input";
import Layout from "@/components/admin/layout";
import useAdminReview from "@/hooks/admin/useAdminReview";
import { Pagination, Rating } from "@mui/material";
import { parse } from "cookie";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";

interface PageProps {
  authToken: string
}

const AdminReviewPage = (props: PageProps) => {
  const { state, actions } = useAdminReview(props.authToken as string);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl md:text-3xl mb-6 font-medium text-admin-dark">
          Review Management
        </h1>
        <div className="mb-4 flex items-end flex-wrap gap-3">
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
            <table className="table-auto w-full border-collapse min-w-max text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-sm text-dark">Name</th>
                  <th className="border px-4 py-2 text-sm text-dark">Rating</th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Comments
                  </th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.reviews.map((review) => (
                  <tr key={review.id} className="text-left">
                    <td className="border px-4 py-2 text-left text-dark capitalize text-sm md:text-base max-w-80">
                      <span className="font-medium">{review.user_name}</span>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark text-sm md:text-base max-w-96">
                      <Rating
                        size="small"
                        readOnly
                        value={review.rating}
                        icon={<FaStar />}
                        emptyIcon={<FaStar className="text-gray-200" />}
                      />
                    </td>
                    <td className="border px-4 py-2 text-left text-dark capitalize text-sm md:text-base max-w-80">
                      <span className="text-dark text-sm line-clamp-3">
                        {review.comments}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex gap-x-2">
                        <Link href={`/admin/reviews/${review.id}`}>
                          <button className="text-white font-semibold text-sm py-1 px-3 rounded bg-admin-primary">
                            Detail
                          </button>
                        </Link>
                        <button
                          onClick={() => actions.handleDelete(review.id)}
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
    props: {
      authToken
    },
  };
};

export default AdminReviewPage;
