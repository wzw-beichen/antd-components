// 所有接口返回的格式
export interface InterfaceResponse<T = any> {
  success: boolean;
  data: T;
  msg?: string;
}

export interface IRedirectURL {
  (params?: any): void;
}

export interface IApiConfig {
  redirectURL?: string | IRedirectURL;
  errorMsgCallback?: (params?: string) => void;
  errorCallback?: (params?: {
    errorCode: number;
    msg?: string;
    success?: boolean;
  }) => void;
}
