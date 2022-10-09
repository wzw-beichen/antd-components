import axios from "axios";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import { IApiConfig, InterfaceResponse } from "./type";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.withCredentials = true;

const instance = axios.create({ timeout: 1000 * 30 });

function noop() {}

// 添加请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error) => {
    // 对请求错误做些什么
  }
);
// 添加响应拦截器
instance.interceptors.response.use((response: AxiosResponse) => {
  if (response.status == 200) {
    const { success, data } = response.data as InterfaceResponse;
    return Promise.resolve(response.data);
  } else {
    errorHandler(response);
    return Promise.reject(response.data);
  }
});

// 错误处理
const errorHandler = (response: AxiosResponse) => {
  const { data } = response;
  const { errorCode, msg } = data || {};
  const apiConfig = (window as any).apiConfig || {};
  const {
    redirectURL,
    errorMsgCallback = noop,
    errorCallback = noop,
  } = apiConfig as IApiConfig;

  if (errorCode) {
    switch (errorCode) {
      case -2: // mp接口的-2也是未登录
      case 1: // 未登录
      case 5: // 登录失效，需登录
      case 11:
        {
          // 游客模式未登录
          if (typeof redirectURL === "string") {
            window.location.href = redirectURL;
          }
          if (typeof redirectURL === "function") {
            redirectURL();
          }
        }
        break;
      default:
        errorMsgCallback(msg);
        errorCallback(data);
        break;
    }
  } else {
    errorMsgCallback(msg);
    errorCallback(data);
  }
};

export default instance;
