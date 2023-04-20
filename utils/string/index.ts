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

/**
 * @description 生成随机唯一uuid
 * @param radix radix 指定要用于数字到字符串的转换的基数(从2到36)。如果未指定 radix 参数，则默认值为 10。
 * @return string
 */
export const uuid = (radix: number = 36): string => {
  return Math.random().toString(radix).substring(2);
};

type ImageItem = {
  uid: string;
  status: string;
  url: string;
};
/**
 * @description 字符串转换成图片数组
 * @param imgStr 字符串
 * @param separator 字符串分隔符
 * @return ImgItem[] 图片数组
 */
export const stringTransformImgArr = (
  imgStr: string,
  separator: string = ","
): ImageItem[] => {
  if (!imgStr) return [];
  const imgArr = imgStr.split(separator).map((item) => ({
    uid: uuid(),
    status: "done",
    url: item,
  }));
  return imgArr;
};
