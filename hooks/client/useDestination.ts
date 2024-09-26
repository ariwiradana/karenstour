import { Destination } from "@/constants/types";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  };
}

const useDestination = (): UseDestination => {
  const [firstSlide, setFirstSlide] = useState<boolean>(true);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(8);
  const [data, setData] = useState<Destination[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortBy>("average_rating");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

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
      const url = `/api/destination?page=${page}&limit=${limit}&sort=${encodeURIComponent(
        sortBy
      )}&order=${encodeURIComponent(sortOrder)}`;
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
  }, [firstLoad, page, limit, sortBy, sortOrder]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  return {
    ref: {
      topRef,
    },
    state: {
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
    },
    actions: {
      setFirstSlide,
      setLastSlide,
      handleChangePagination,
      handleChangeFilter,
      handleScrollToRef,
    },
  };
};

export default useDestination;
