import ButtonPrimary from "@/components/admin/elements/button.primary";
import ButtonPrimaryIcon from "@/components/admin/elements/button.primary.icon";
import Input from "@/components/admin/elements/input";
import InputSelect from "@/components/admin/elements/select";
import Layout from "@/components/admin/layout";
import ImageShimmer from "@/components/client/elements/image.shimmer";
import useAdminBooking from "@/hooks/admin/useAdminBooking";
import { currencyIDR } from "@/utils/currencyFormatter";
import { formatDate } from "@/utils/dateFormatter";
import { Pagination } from "@mui/material";
import { parse } from "cookie";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FC } from "react";
import { BiPlus } from "react-icons/bi";
import Swal from "sweetalert2";

interface PageProps {
  serviceId: string;
  publicKey: string;
  authToken?: string;
}

const BookingPage: FC<PageProps> = (props) => {
  const { state, actions } = useAdminBooking(
    props.publicKey,
    props.serviceId,
    props.authToken as string
  );

  return (
    <Layout>
      <div>
        <h1 className="text-2xl md:text-3xl mb-6 font-medium text-admin-dark">
          Booking Management
        </h1>
        <div className="mb-4 flex items-end flex-wrap gap-3">
          <Link href="/admin/booking/add">
            <ButtonPrimary
              icon={<BiPlus />}
              title="Add New Booking"
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
                <tr className="bg-gray-100 text-left border border-gray-200">
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Information
                  </th>
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Booking Date
                  </th>
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Pax(s)
                  </th>
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Subtotal
                  </th>
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Reservation Fee
                  </th>
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Total
                  </th>
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Payment Proof
                  </th>
                  <th className="px-4 py-2 text-xs text-admin-dark font-normal uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="text-center border-b border-b-gray-200"
                  >
                    <td className="px-4 py-2 text-left text-admin-dark max-w-80">
                      <div>
                        <span className="font-medium text-base">
                          {booking.name}
                        </span>
                        <div className="flex">
                          <span className="text-darkgray text-sm">
                            #{booking.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-left text-admin-dark text-sm max-w-80">
                      <span>{formatDate(booking.booking_date)}</span>
                    </td>
                    <td className="px-4 py-2 text-left text-admin-dark text-sm max-w-80">
                      <span>{booking.pax} Pax</span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center gap-x-3">
                        <div
                          style={{
                            backgroundColor:
                              state.statusStyles[booking.status].text,
                          }}
                          className={`w-3 h-3 rounded-full`}
                        ></div>
                        <InputSelect
                          onChange={(e) =>
                            actions.handleBookActions(booking, e.target.value)
                          }
                          disabled={["complete", "canceled"].includes(
                            booking.status
                          )}
                          value={booking.status}
                          inputSize="small"
                          options={[
                            { value: "pending", label: "Pending" },
                            { value: "confirmed", label: "Confirmed" },
                            { value: "paid", label: "Paid" },
                            { value: "ongoing", label: "Ongoing" },
                            { value: "complete", label: "Complete" },
                            { value: "canceled", label: "Canceled" },
                          ]}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 text-left text-admin-dark text-sm max-w-80">
                      <span>{currencyIDR(booking.subtotal)}</span>
                    </td>
                    <td className="px-4 py-2 text-left text-admin-dark text-sm max-w-80">
                      <span>{currencyIDR(booking.tax)}</span>
                    </td>
                    <td className="px-4 py-2 text-left text-admin-dark text-sm max-w-80">
                      <span>{currencyIDR(booking.total)}</span>
                    </td>
                    <td className="px-4 py-2 text-center text-admin-dark text-sm max-w-80">
                      {booking.payment_proof ? (
                        <button
                          onClick={() => {
                            Swal.fire({
                              imageUrl: booking.payment_proof,
                              imageHeight: 300,
                              imageAlt: booking.id.toString(),
                              showConfirmButton: false,
                            });
                          }}
                          className="relative w-full aspect-[4/3] p-4 rounded overflow-hidden"
                        >
                          <ImageShimmer
                            priority
                            src={booking.payment_proof}
                            alt="Booking Image"
                            fill
                            className="object-cover rounded"
                          />
                        </button>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {booking.status === "complete" ? (
                        <button
                          onClick={() =>
                            actions.handleBookActions(booking, "canceled")
                          }
                          className="text-white font-semibold text-sm py-1 px-3 rounded bg-admin-primary"
                        >
                          Print Invoice
                        </button>
                      ) : (
                        "-"
                      )}
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

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
}) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID ?? "";
  const publicKey = process.env.EMAILJS_PUBLIC_KEY ?? "";

  const cookie = req.headers.cookie || "";
  const authToken = parse(cookie).authToken;

  if (!authToken) {
    res.writeHead(302, { Location: "/admin/login" });
    res.end();
    return {
      props: { serviceId, publicKey },
    };
  }

  return {
    props: {
      serviceId,
      publicKey,
      authToken,
    },
  };
};

export default BookingPage;
