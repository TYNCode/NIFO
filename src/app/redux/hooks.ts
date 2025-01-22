import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import axios, { AxiosResponse } from "axios";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const getRequest = async (url: string): Promise<AxiosResponse> => {
  return axios.get(url);
};

export const postRequest = async (
  url: string,
  data: any
): Promise<AxiosResponse> => {
  return axios.post(url, data);
};

export const putRequest = async (
  url: string,
  data: any
): Promise<AxiosResponse> => {
  return axios.put(url, data);
};

export const deleteRequest = async (url: string): Promise<AxiosResponse> => {
  return axios.delete(url);
};

export const patchRequest = async (
  url: string,
  data: any
): Promise<AxiosResponse> => {
  return axios.patch(url, data);
};

export const getToken = (): string | null => {
  const token = localStorage.getItem("jwtAccessToken");
  return token;
};

// Requests with Access Token
export const getRequestWithAccessToken = async (
  url: string
): Promise<AxiosResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error("Access token not provided");
  }
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postRequestWithAccessToken = async (
  url: string,
  data: any
): Promise<AxiosResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error("Access token not provided");
  }
  return axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const putRequestWithAccessToken = async (
  url: string,
  data: any
): Promise<AxiosResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error("Access token not provided");
  }
  return axios.put(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteRequestWithAccessToken = async (
  url: string
): Promise<AxiosResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error("Access token not provided");
  }
  return axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const patchRequestWithAccessToken = async (
  url: string,
  data: any
): Promise<AxiosResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error("Access token not provided");
  }
  return axios.patch(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
