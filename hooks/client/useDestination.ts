import { Category, Destination } from "@/constants/types";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useAdminCategory from "../admin/useAdminCategory";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "use-debounce";

type SortBy = "average_rating" | "d.duration" | "d.price";
type SortOrder = "asc" | "desc";

interface UseDestination {
  ref: {
    topRef: React.RefObject<HTMLDivElement>;
  };
  state: {
    firstSlide: boolean;
    lastSlide: boolean;
    page: number;
    limit: number;
    data: Destination[] | [];
    error: string | null;
    loading: boolean;
    service: string | string[] | undefined;
    totalRows: number;
    sortBy: SortBy;
    sortOrder: SortOrder;
    categories: Category[];
    categoryFilters: string[] | [];
    search: string;
  };
  actions: {
    setFirstSlide: (value: boolean) => void;
    setLastSlide: (value: boolean) => void;
    handleChangePagination: (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => void;
    handleChangeFilter: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleScrollToRef: () => void;
    handleChangeFilterCategory: (categoryName: string) => void;
    handleChangeSearch: (q: string) => void;
  };
}

const useDestination = (): UseDestination => {
  const [firstSlide, setFirstSlide] = useState<boolean>(true);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [data, setData] = useState<Destination[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("average_rating");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchDebounced] = useDebounce(search, 1000);

  const handleChangeSearch = (q: string) => {
    setSearch(q);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    let url = `/api/client/category`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      if (result.success) {
        setCategories(result?.data);
      }
    } catch (error: any) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const topRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const service = router.query.service ?? "";

  const handleChangePagination = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      handleScrollToRef();
    },
    []
  );

  const handleChangeFilter = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const [newSortBy, newSortOrder] = event.target.value.split("-");
      setSortBy(newSortBy as SortBy);
      setSortOrder(newSortOrder as SortOrder);
      handleScrollToRef();
    },
    []
  );

  const handleScrollToRef = useCallback(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/client/destination?page=${page}&limit=${limit}&sort=${encodeURIComponent(
        sortBy
      )}&order=${encodeURIComponent(
        sortOrder
      )}&category_names=${encodeURIComponent(
        categoryFilters.join(",")
      )}&search=${searchDebounced}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.success) {
        setData(result?.data);
        setTotalRows(result?.totalRows);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, categoryFilters, searchDebounced]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleChangeFilterCategory = (categoryName: string) => {
    let newCategoryFilters = [...categoryFilters];
    if (categoryFilters.includes(categoryName)) {
      newCategoryFilters = newCategoryFilters.filter(
        (item) => item !== categoryName
      );
    } else {
      newCategoryFilters.push(categoryName);
    }
    setCategoryFilters(newCategoryFilters);
    setPage(1);
  };

  return {
    ref: {
      topRef,
    },
    state: {
      categories,
      firstSlide,
      lastSlide,
      service,
      page,
      limit,
      data,
      totalRows,
      error,
      loading,
      sortBy,
      sortOrder,
      categoryFilters,
      search,
    },
    actions: {
      setFirstSlide,
      setLastSlide,
      handleChangePagination,
      handleChangeFilter,
      handleScrollToRef,
      handleChangeFilterCategory,
      handleChangeSearch,
    },
  };
};

export default useDestination;
