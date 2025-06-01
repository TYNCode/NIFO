
import { AxiosResponse } from "axios";
import axiosPrivate from "./axiosPrivate";
import axiosPublic from "./axiosPublic";

export const apiRequest = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data: any = {},
  usePrivate: boolean = true
): Promise<AxiosResponse> => {
  const client = usePrivate ? axiosPrivate : axiosPublic;

  return client({
    method,
    url,
    ...(method === "get" || method === "delete" ? { params: data } : { data }),
  });
};
