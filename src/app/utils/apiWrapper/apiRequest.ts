import { AxiosResponse } from "axios";
import axiosPrivate from "./axiosPrivate";
import axiosPublic from "./axiosPublic";

export const apiRequest = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data: any = {},
  usePrivate: boolean = true,
  isFormData: boolean = false
): Promise<AxiosResponse> => {
  const client = usePrivate ? axiosPrivate : axiosPublic;

  // Only set Content-Type for non-FormData requests
  const headers = !isFormData ? { "Content-Type": "application/json" } : undefined;

  return client({
    method,
    url,
    ...(method === "get" || method === "delete" ? { params: data } : { data }),
    ...(headers ? { headers } : {}),
  });
};
