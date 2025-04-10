import { useState, useEffect, useCallback, useMemo } from "react";
import { Booking } from "@/constants/types";
import { useDebounce } from "use-debounce";
import { bookingSteps, contact } from "@/constants/data";
import { customSwal } from "@/lib/sweetalert2";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dateFormatter";
import emailjs from "@emailjs/browser";
import moment from "moment";
import { convertHoursToReadableFormat } from "@/utils/convertToReadableHours";
import { currencyIDR } from "@/utils/currencyFormatter";
import { useFetch } from "@/lib/useFetch";
import { capitalizeWords } from "@/utils/capitalizeWords";

type StatusStyle = {
  background: string;
  text: string;
};

interface UseAdminBookingReturn {
  state: {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
    page: number;
    limit: number;
    totalRows: number;
    search: string;
    statusStyles: Record<string, StatusStyle>;
    buttonStatusTitle: Record<string, string>;
    paymentImage: {
      isOpen: boolean;
      image: string;
    };
  };
  actions: {
    setPage: (page: number) => void;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBookActions: (data: Booking, status: string) => void;
    getButtonClass: (status: string) => string;
    handleTogglePaymentImage: (image: string) => void;
  };
}

const useAdminBooking = (
  publicKey: string,
  serviceId: string,
  authToken: string
): UseAdminBookingReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [query] = useDebounce(search, 500);

  const [paymentImage, setPaymentImage] = useState({
    isOpen: false,
    image: "",
  });

  const getButtonClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-green-500 hover:bg-green-400";
      case "confirmed":
        return "bg-blue-500 hover:bg-blue-400";
      case "paid":
        return "bg-amber-500 hover:bg-amber-400";
      case "ongoing":
        return "bg-indigo-500 hover:bg-indigo-400";
      case "canceled":
        return "bg-red-500 hover:bg-red-400";
      default:
        return "bg-gray-500 hover:bg-gray-400";
    }
  };

  const buttonStatusTitle: Record<string, string> = {
    pending: "Confirm Booking",
    confirmed: "Mark as Paid",
    paid: "Begin Trip",
    ongoing: "Complete Trip",
    canceled: "Cancel Booking",
  };

  const statusStyles: Record<string, StatusStyle> = {
    pending: { background: "#FFF9C4", text: "#FFB300" }, // Light Yellow (background), Dark Yellow (text)
    confirmed: { background: "#C8E6C9", text: "#388E3C" }, // Light Green (background), Dark Green (text)
    paid: { background: "#BBDEFB", text: "#1976D2" }, // Light Blue (background), Dark Blue (text)
    ongoing: { background: "#FFE0B2", text: "#FB8C00" }, // Light Orange (background), Dark Orange (text)
    complete: { background: "#E1BEE7", text: "#8E24AA" }, // Light Purple (background), Dark Purple (text)
    canceled: { background: "#FFEBEE", text: "#D32F2F" }, // Light Red (background), Dark Red (text)
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const toastFetch = toast.loading("Load data...");
    try {
      let url = `/api/booking?page=${page}&limit=${limit}`;
      if (query.trim()) {
        url += `&search=${encodeURIComponent(query)}`;
      }

      const response = await useFetch(url, authToken);
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
      duration: bookingData.destination_duration,
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
      link: `${window.location.hostname === "localhost" ? "http" : "https"}://${
        window.location.host
      }/invoice/${encodeURIComponent(bookingData.id)}`,
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
    customSwal
      .fire({
        title: `Are you sure change status to ${capitalizeWords(status)}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Change Status",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const bookActionToast = toast.loading("Loading...");

          if (status === "confirmed") {
            handleGenerateInvoice(bookingData);
          }
          if (status === "paid") {
            handleInfoPaid(bookingData);
          }

          useFetch(`/api/booking?id=${bookingData.id}`, authToken, "PATCH", {
            updates: {
              status,
              updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
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
              toast.success(`Succesfully updating status to ${status}`, {
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

  const handleTogglePaymentImage = (image: string) => {
    if (image) {
      setPaymentImage((state) => {
        return { ...state, isOpen: !state.isOpen, image };
      });
    }
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
      statusStyles,
      buttonStatusTitle,
      paymentImage,
    },
    actions: {
      setPage,
      handleSearch,
      handleBookActions,
      getButtonClass,
      handleTogglePaymentImage,
    },
  };
};

export default useAdminBooking;
