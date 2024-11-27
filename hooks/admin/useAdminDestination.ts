import { Destination } from "@/constants/types";
import { customSwal } from "@/lib/sweetalert2";
import { useFetch } from "@/lib/useFetch";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useDebounce } from "use-debounce";

interface UseAdminDestinationState {
  data: Destination[] | [];
  error: string | null;
  loading: boolean;
  expanded: boolean[];
  page: number;
  limit: number;
  totalRows: number;
  search: string;
}

interface UseAdminDestination {
  state: UseAdminDestinationState;
  actions: {
    handleDelete: (id: number) => void;
    handleUpdate: (id: number) => void;
    handleToggleDescription: (index: number) => void;
    handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
    setPage: (page: number) => void;
  };
}

const useAdminDestination = (authToken: string): UseAdminDestination => {
  const [data, setData] = useState<Destination[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<boolean[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [query] = useDebounce(search, 500);

  const fetchDestinations = useCallback(async () => {
    const toastFetch = toast.loading("Load Data...");
    try {
      let url = `/api/destination?page=${page}&limit=${limit}`;
      if (query.trim()) {
        url += `&search=${encodeURIComponent(query)}`;
      }
      const response = await useFetch(url, authToken);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.success) {
        setData(result?.data);
        setTotalRows(result?.totalRows);
        toast.dismiss(toastFetch);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message, {
        id: toastFetch,
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, query]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  useEffect(() => {
    setExpanded(Array(data.length).fill(false));
  }, [data]);

  const handleToggleDescription = (index: number) => {
    setExpanded((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id: number) => {
    customSwal
      .fire({
        title: "Are you sure to delete destination?",
        text: "You won't be able to revert this!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const deleteToast = toast.loading("Delete destination...");
          useFetch(
            `/api/destination?id=${encodeURIComponent(id)}`,
            authToken,
            "DELETE"
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              toast.success("Destination deleted successfully", {
                id: deleteToast,
              });
            })
            .finally(() => fetchDestinations())
            .catch((error) => toast.error(error.message));
        }
      });
  };

  const handleUpdate = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  return {
    state: {
      search,
      totalRows,
      page,
      limit,
      expanded,
      data,
      error,
      loading,
    },
    actions: {
      handleDelete,
      handleUpdate,
      handleToggleDescription,
      handleSearch,
      setPage,
    },
  };
};

export default useAdminDestination;
