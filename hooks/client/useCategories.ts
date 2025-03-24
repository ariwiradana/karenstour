import { Category } from "@/constants/types";
import { fetcher } from "@/lib/fetcher";
import { useCategoryStore } from "@/store/useCategoryStore";
import useSWR from "swr";

const useCategories = () => {
  const { setCategories } = useCategoryStore();
  const { data } = useSWR<{ data: Category[] }>(
    `/api/client/category`,
    fetcher,
    {
      onSuccess: (data) => {
        setCategories(data.data);
      },
    }
  );
  return {
    categories: data?.data || [],
  };
};

export default useCategories;
