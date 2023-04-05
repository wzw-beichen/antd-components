import { pickArrayItem } from "../array";

/**
 * @description 获取url searchParams数据
 * @param url 浏览器url
 */
export const getSearchParams = <T>(url: string): T => {
  const query = pickArrayItem(url.split("?"));
  const strArr = query.split("&");
  const searchParams = {} as T;
  strArr.forEach((itm) => {
    const [key, value] = itm.split("=");
    // 避免无search时
    if (value) {
      searchParams[key] = value;
    }
  });
  return searchParams as T;
};
