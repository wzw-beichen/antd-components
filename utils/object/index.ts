/**
 * @description 处理列表后端返回数据字段不同
 * @param data  Record<string, any> 后端返回数据
 * @param str string 前端处理层级字符串
 * @param separator string 字符串分割符
 * @returns 处理之后的数据 T
 * @example const data = { a: { b: { c: 1 }}} ===> handleDataField(data, 'a.b.c') => 1
 */
export const handleDataField = <T>(
  data: Record<string, any>,
  str: string,
  separator = "."
): T => {
  return str.split(separator).reduce((total, item) => {
    return total[item] || {};
  }, data) as unknown as T;
};

/**
 * @description 对象转数组
 * @example const data = { 1: 'xxx' } ===> objectTransformArray(data) => [{ label: 'xxx', value: 1 }]
 */
export const objectTransformArray = <T>(
  obj: Record<string, any>,
  data?: {
    label?: string;
    value?: string;
  }
): T[] => {
  const { label = "label", value = "value" } = data || {};
  return Object.entries(obj).map(
    ([key, val]) =>
      ({
        [label]: val,
        [value]: key,
      } as T)
  );
};
