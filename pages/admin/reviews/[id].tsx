import Layout from "@/components/admin/layout";
import Link from "next/link";
import { FC } from "react";
import { HiChevronLeft } from "react-icons/hi2";
import { GetServerSideProps } from "next";
import useAdminDetailReview from "@/hooks/admin/useAdminDetailReview";
import { Rating } from "@mui/material";
import { formatDate } from "@/utils/dateFormatter";
import { montserrat } from "@/constants/font";
import { FaStar } from "react-icons/fa6";
import { parse } from "cookie";

interface PageProps {
  id: string;
}

const DetailReviewPage: FC<PageProps> = (props) => {
  const { state } = useAdminDetailReview(Number(props.id));

  if (!state.review) return <></>;
  return (
    <Layout>
      <div className="w-full">
        <h1 className="text-2xl md:text-3xl mb-6 font-medium text-admin-dark">
          Review Detail
        </h1>
        <div className="mb-4 flex items-center gap-2">
          <Link
            href="/admin/reviews"
            className="flex items-center text-darkgray transition hover:underline"
          >
            <HiChevronLeft className="mr-2 text-lg" />
            <span>Back</span>
          </Link>
        </div>
        <div
          className={`border border-gray-100 p-4 rounded-lg bg-lightgray mt-8 ${montserrat.className}`}
        >
          <div className="flex items-center mb-2">
            <h1 className="text-lg font-semibold text-dark">
              {state.review?.user_name}
            </h1>
            <span className="ml-2 text-darkgray text-sm">
              {formatDate(state.review.created_at)}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <Rating
              emptyIcon={<FaStar className="text-gray-200" />}
              icon={<FaStar />}
              readOnly
              value={state.review.rating}
            />
          </div>
          <p className="text-dark mt-4 leading-7">{state.review?.comments}</p>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
  params,
}) => {
  const { id } = params as { id: string };
  const cookie = req.headers.cookie || "";
  const authToken = parse(cookie).authToken;

  if (!authToken) {
    res.writeHead(302, { Location: "/admin/login" });
    res.end();
    return {
      props: {
        id,
      },
    };
  }

  return {
    props: {
      id,
    },
  };
};

export default DetailReviewPage;
