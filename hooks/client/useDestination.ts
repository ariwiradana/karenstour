import { Category, Destination } from "@/constants/types";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useDestinationStore } from "@/store/useDestinationStore";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useDestinationDetailStore } from "@/store/useDestinationDetailStore";

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
    error: string | null;
    isLoading: boolean;
    service: string | string[] | undefined;
    sortBy: SortBy;
    sortOrder: SortOrder;
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
    handleChangeFilterCategory: (id: number, slug: string) => void;
    handleChangeSearch: (q: string) => void;
  };
}

const useDestination = (): UseDestination => {
  const { setDestinations, setTotalRows } = useDestinationStore();
  const { categoryFilterId, setCategoryFilterId } = useDestinationDetailStore();

  const [firstSlide, setFirstSlide] = useState<boolean>(true);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [sortBy, setSortBy] = useState<SortBy>("average_rating");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [search, setSearch] = useState<string>("");
  const [searchDebounced] = useDebounce(search, 1000);

  const handleChangeSearch = (q: string) => {
    setSearch(q);
  };

  const {
    data: destinationResponse,
    error,
    isLoading,
  } = useSWR<{
    data: Destination[];
    totalRows: number;
  }>(
    `/api/client/destination?page=${page}&limit=${limit}&sort=${encodeURIComponent(
      sortBy
    )}&order=${encodeURIComponent(sortOrder)}&category_id=${
      categoryFilterId || ""
    }&search=${searchDebounced}`,
    fetcher,
    {
      onSuccess: (data) => {
        setDestinations(data?.data);
        setTotalRows(data?.totalRows);
      },
    }
  );

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

  const handleChangeFilterCategory = (id: number, slug: string) => {
    if (categoryFilterId === id) {
      setCategoryFilterId(null);
    } else {
      setCategoryFilterId(id);
    }
    setPage(1);
  };

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
      error,
      isLoading,
      sortBy,
      sortOrder,
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
