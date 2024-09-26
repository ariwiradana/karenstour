import { Category, Review } from "@/constants/types";
import { customSwal } from "@/lib/sweetalert2";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

interface UseAdminCategory {
  state: {
    categories: Category[] | [];
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

const useAdminCategory = (): UseAdminCategory => {
  const [categories, setCategories] = useState<Category[] | []>([]);
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

  const fetchCategories = useCallback(async () => {
    const toastFetch = toast.loading("Load Data...");
    setLoading(true);
    let url = `/api/category?page=${page}&limit=${limit}`;
    if (query.trim()) {
      url += `&search=${encodeURIComponent(query)}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      if (result.success) {
        setCategories(result?.data);
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
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: number) => {
    customSwal
      .fire({
        title: "Are you sure to delete category?",
        text: "You won't be able to revert this!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const toastDelete = toast.loading("Delete category...");
          fetch(`/api/category?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            toast.success("Review deleted successfully", {
              id: toastDelete,
            });
            fetchCategories();
          });
        }
      });
  };

  return {
    state: {
      search,
      categories,
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

export default useAdminCategory;
