import { Review } from "@/constants/types";
import { customSwal } from "@/lib/sweetalert2";
import { useFetch } from "@/lib/useFetch";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

interface UseAdminReview {
  state: {
    reviews: Review[] | [];
    error: string | null;
    loading: boolean;
    totalRows: number;
    page: number;
    limit: number;
    search: string;
  };
  actions: {
    handleDelete: (id: number) => void;
    handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
    setPage: (page: number) => void;
  };
}

const useAdminReview = (authToken: string): UseAdminReview => {
  const [reviews, setReviews] = useState<Review[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [query] = useDebounce(search, 500);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const fetchReviews = useCallback(async () => {
    const toastFetch = toast.loading("Load Data...");
    setLoading(true);
    let url = `/api/reviews?page=${page}&limit=${limit}`;
    if (query.trim()) {
      url += `&search=${encodeURIComponent(query)}`;
    }
    try {
      const response = await useFetch(url, authToken);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      if (result.success) {
        setReviews(result?.data);
        setTotalRows(result.totalRows);
        toast.dismiss(toastFetch);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message, { id: toastFetch });
    } finally {
      setLoading(false);
    }
  }, [page, limit, query]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: number) => {
    customSwal
      .fire({
        title: "Are you sure to delete review?",
        text: "You won't be able to revert this!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          useFetch(
            `/api/reviews?id=${encodeURIComponent(id)}`,
            authToken,
            "DELETE"
          ).then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            toast.success("Review deleted successfully");
            fetchReviews();
          });
        }
      });
  };

  return {
    state: {
      search,
      reviews,
      error,
      loading,
      page,
      limit,
      totalRows,
    },
    actions: {
      handleDelete,
      setPage,
      handleSearch,
    },
  };
};

export default useAdminReview;
