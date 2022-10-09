import axios from "./serverConfig";
import { AxiosRequestConfig } from "axios";
import { InterfaceResponse } from "./type";

// 表单请求头
const formHeader: AxiosRequestConfig = {
  headers: { "Content-Type": "multipart/form-data" },
};

export const get = <T>(url: string, data: any, config?: AxiosRequestConfig) =>
  axios.get<T, InterfaceResponse<T>>(url, { params: data, ...config });

export const post = <T>(url: string, data: any, config?: AxiosRequestConfig) =>
  axios.post<T, InterfaceResponse<T>>(url, data, config);

export const formRequest = <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
) =>
  axios.post<never, InterfaceResponse<T>>(url, data, {
    ...formHeader,
    ...config,
  });
