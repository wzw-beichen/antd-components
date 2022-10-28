/**
 * @description 处理url上search数据
 * 注意: useLocation().query会处理特殊字符
 */
export const handleSplitURL = <T>(url: string): T => {
  const [paramStr] = url.split("?").reverse();
  const objArr = paramStr.split("&");
  const obj = {} as Record<string, any>;
  objArr.forEach((itm) => {
    const [key, value] = itm.split("=");
    // 避免无search时
    if (value) {
      obj[key] = value;
    }
  });
  return obj as T;
};
