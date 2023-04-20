export type DealConfigType = {
  key: string;
  type:
    | "time"
    | "minute"
    | "hour"
    | "day"
    | "month"
    | "year"
    | "arrayTransformString"
    | "jsonString"
    | "jsonParse"
    | "numberTransformBoolean"
    | "booleanTransformNumber"
    | "image";
  /** arrayToString会用到，不传则使用自身 */
  valueKey?: string;
  /** arrayToString会用到，默认, */
  separator?: string;
  /** 默认值 */
  defaultValue?: unknown;
  /** 自定义函数处理 */
  customProcessingFunc?: (
    value: unknown,
    configItem: DealConfigType
  ) => unknown;
};
