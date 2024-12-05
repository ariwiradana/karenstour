import toast from "react-hot-toast";

export const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const res = await fetch(url);
    return res.json() as Promise<T>;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Error fetching data. Please try again later.");
    throw error;
  }
};
