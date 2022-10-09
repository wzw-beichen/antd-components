import { CommonRecord } from "../requestComponent/type";

/**
 * @description 处理列表后端返回数据字段不同
 * @param data  Record<string, any> 后端返回数据
 * @param str string 前端处理层级字符串
 * @param separator string 字符串分割符
 * @returns 处理之后的数据 T
 * @example const data = { a: { b: { c: 1 }}} ===> handleDataField(data, 'a.b.c') => 1
 */
export const handleDataField = <T>(
  data: CommonRecord,
  str: string,
  separator = "."
): T => {
  return str.split(separator).reduce((total, item) => {
    return total[item] || {};
  }, data) as unknown as T;
};
