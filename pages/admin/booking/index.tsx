import ButtonPrimary from "@/components/admin/elements/button.primary";
import Input from "@/components/admin/elements/input";
import Layout from "@/components/admin/layout";
import { Env } from "@/constants/types";
import useAdminBooking from "@/hooks/admin/useAdminBooking";
import { currencyIDR } from "@/utils/currencyFormatter";
import { formatDate } from "@/utils/dateFormatter";
import { Pagination } from "@mui/material";
import { parse } from "cookie";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { BiPlus } from "react-icons/bi";
import Swal from "sweetalert2";

interface PageProps extends Env {
  authToken?: string;
}

const BookingPage: FC<PageProps> = (props) => {
  const { state, actions } = useAdminBooking(props.publicKey, props.serviceId);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl md:text-3xl mb-6 font-medium text-admin-dark">
          Booking Management
        </h1>
        <div className="mb-4 flex items-end flex-wrap gap-3">
          <Link href="/admin/booking/add">
            <ButtonPrimary icon={<BiPlus />} title="Add New Booking" />
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
                  <th className="border px-4 py-2 text-sm text-dark">
                    Information
                  </th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Booking Date
                  </th>
                  <th className="border px-4 py-2 text-sm text-dark">Pax(s)</th>
                  <th className="border px-4 py-2 text-sm text-dark">Status</th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Subtotal
                  </th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Reservation Fee
                  </th>
                  <th className="border px-4 py-2 text-sm text-dark">Total</th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Payment Proof
                  </th>
                  <th className="border px-4 py-2 text-sm text-dark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.bookings.map((booking) => (
                  <tr key={booking.id} className="text-center">
                    <td className="border px-4 py-2 text-left text-dark text-sm md:text-base max-w-80">
                      <div>
                        <h4 className="font-medium">{booking.name}</h4>
                        <h6 className="text-darkgray text-sm">
                          {booking.email}
                        </h6>
                        <div className="flex">
                          <h6 className="border border-admin-primary px-2 py-1 text-admin-primary rounded font-medium text-xs mt-2">
                            #{booking.id}
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark text-sm md:text-base max-w-80">
                      <h6 className="font-medium">
                        {formatDate(booking.booking_date)}
                      </h6>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark text-sm md:text-base max-w-80">
                      <h6 className="font-medium">{booking.pax} Pax</h6>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <div
                        className={`inline-flex items-center capitalize px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          state.statusColors[booking.status]
                        }`}
                      >
                        {booking.status}
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark text-sm md:text-base max-w-80">
                      <h6 className="font-medium">
                        {currencyIDR(booking.subtotal)}
                      </h6>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark text-sm md:text-base max-w-80">
                      <h6 className="font-medium">
                        {currencyIDR(booking.tax)}
                      </h6>
                    </td>
                    <td className="border px-4 py-2 text-left text-dark text-sm md:text-base max-w-80">
                      <h6 className="font-medium">
                        {currencyIDR(booking.total)}
                      </h6>
                    </td>
                    <td className="border px-4 py-2 text-center text-dark text-sm md:text-base max-w-80">
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
                          className="relative w-full aspect-video p-4 rounded overflow-hidden"
                        >
                          <Image
                            src={booking.payment_proof}
                            alt="Booking Image"
                            layout="fill"
                            objectFit="cover"
                          />
                        </button>
                      ) : (
                        <h6 className="font-medium">-</h6>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col gap-y-2">
                        {!["complete", "canceled"].includes(booking.status) && (
                          <button
                            onClick={() =>
                              actions.handleBookActions(booking, booking.status)
                            }
                            className={`text-white font-semibold text-sm py-1 px-3 rounded ${
                              booking.status === "pending"
                                ? "bg-green-500"
                                : booking.status === "confirmed"
                                ? "bg-blue-500"
                                : booking.status === "paid"
                                ? "bg-amber-500"
                                : booking.status === "ongoing"
                                ? "bg-indigo-500"
                                : "bg-red-500"
                            }`}
                          >
                            {state.buttonStatusTitle[booking.status]}
                          </button>
                        )}
                        {!["ongoing", "complete", "canceled"].includes(
                          booking.status
                        ) && (
                          <button
                            onClick={() =>
                              actions.handleBookActions(booking, "canceled")
                            }
                            className="text-white font-semibold text-sm py-1 px-3 rounded bg-admin-danger"
                          >
                            Cancel
                          </button>
                        )}
                        {!["pending", "confirmed", "canceled"].includes(
                          booking.status
                        ) && (
                          <button
                            onClick={() =>
                              actions.handleBookActions(booking, "canceled")
                            }
                            className="text-white font-semibold text-sm py-1 px-3 rounded bg-admin-primary"
                          >
                            Print Invoice
                          </button>
                        )}
                      </div>
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
    },
  };
};

export default BookingPage;
