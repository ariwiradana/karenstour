import { useState, useEffect, useCallback, useMemo } from "react";
import { Booking } from "@/constants/types";
import { useDebounce } from "use-debounce";
import { bookingSteps, contact } from "@/constants/data";
import { customSwal } from "@/lib/sweetalert2";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dateFormatter";
import emailjs from "@emailjs/browser";
import moment from "moment";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { convertHoursToReadableFormat } from "@/utils/convertToReadableHours";
import { currencyIDR } from "@/utils/currencyFormatter";

interface UseAdminBookingReturn {
  state: {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    statusColors: Record<string, string>;
    buttonStatusTitle: Record<string, string>;
  };
  actions: {
    setPage: (page: number) => void;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBookActions: (data: Booking, status: string) => void;
  };
}

const useAdminBooking = (
  publicKey: string,
  serviceId: string
): UseAdminBookingReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [query] = useDebounce(search, 500);

  const buttonStatusTitle: Record<string, string> = {
    pending: "Confirm Booking",
    confirmed: "Mark as Paid",
    paid: "Begin Tour",
    ongoing: "Complete Tour",
    canceled: "Cancel Booking",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500",
    confirmed: "bg-green-500",
    paid: "bg-blue-500",
    ongoing: "bg-amber-500",
    complete: "bg-indigo-500",
    canceled: "bg-red-500",
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const toastFetch = toast.loading("Load data...");
    try {
      let url = `/api/booking?page=${page}&limit=${limit}`;
      if (query.trim()) {
        url += `&search=${encodeURIComponent(query)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setBookings(result.data);
        setTotalRows(result.totalRows);
        setError(null);
        toast.dismiss(toastFetch);
      }
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error(error.message, {
        id: toastFetch,
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, query]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
  };

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = bookingSteps.indexOf(currentStatus);

    if (currentIndex === -1) {
      throw new Error("Invalid status");
    }
    return currentIndex === bookingSteps.length - 1
      ? "complete"
      : bookingSteps[currentIndex + 1];
  };

  const handleGenerateInvoice = async (bookingData: Booking) => {
    const emailPayload = {
      to_email: bookingData.email,
      booking_id: bookingData.id,
      name: bookingData.name,
      destination: bookingData.destination_title,
      booking_date: formatDate(bookingData.booking_date),
      duration: convertHoursToReadableFormat(bookingData.destination_duration),
      pax: bookingData.pax,
      inclusions: bookingData?.destination_inclusions.join(", "),
      pickup_location: bookingData.pickup_location,
      price: currencyIDR(bookingData?.destination_price ?? 0),
      subtotal: currencyIDR(bookingData.subtotal),
      tax: currencyIDR(bookingData.tax),
      total: currencyIDR(bookingData.total),
      bank_name: "BCA",
      account_name: contact.company,
      account_number: 123928712627,
      company: contact.company,
      upload_transfer_link: `${
        window.location.hostname === "localhost" ? "http" : "https"
      }://${window.location.host}/upload-payment-proof/${encodeURIComponent(
        bookingData.id
      )}`,
    };

    if (publicKey && serviceId) {
      const templateId = "template_rvzavrm";
      try {
        await emailjs.send(serviceId, templateId, emailPayload, {
          publicKey,
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed send invoice to email");
      }
    }
  };

  const handleInfoPaid = async (bookingData: Booking) => {
    const emailPayload = {
      to_email: bookingData.email,
      destination: bookingData.destination_title,
      booking_date: formatDate(bookingData.booking_date),
      pax: bookingData.pax,
      booking_time: "1 PM",
      pickup_location: bookingData.pickup_location,
    };

    if (publicKey && serviceId) {
      const templateId = "template_xa9wzdf";
      try {
        await emailjs.send(serviceId, templateId, emailPayload, {
          publicKey,
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed send invoice to email");
      }
    }
  };

  const handleBookActions = async (bookingData: Booking, status: string) => {
    const nextStatus = getNextStatus(bookingData.status);

    customSwal
      .fire({
        title: `Are you sure you want to ${
          status !== "canceled"
            ? `change the status to ${nextStatus}`
            : "cancel this booking"
        }?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: buttonStatusTitle[status],
      })
      .then((result) => {
        if (result.isConfirmed) {
          const bookActionToast = toast.loading("Loading...");

          if (nextStatus === "confirmed") {
            handleGenerateInvoice(bookingData);
          }

          if (nextStatus === "paid") {
            handleInfoPaid(bookingData);
          }

          fetch(`/api/booking?id=${bookingData.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              updates: {
                status: status !== "canceled" ? nextStatus : "canceled",
                updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            }),
          })
            .then((response) => {
              if (!response.ok) {
                toast.error("Failed to update status");
                throw new Error("Failed to update status");
              }

              response.json();
            })
            .then(() => {
              fetchBookings();
              toast.success(`Succesfully updating status to ${nextStatus}`, {
                id: bookActionToast,
              });
            })
            .catch((error) => {
              toast.error("Error updating status");
              console.error("Error updating status:", error);
            });
        }
      });
  };

  return {
    state: {
      bookings,
      search,
      loading,
      error,
      limit,
      page,
      totalRows,
      statusColors,
      buttonStatusTitle,
    },
    actions: {
      setPage,
      handleSearch,
      handleBookActions,
    },
  };
};

export default useAdminBooking;
