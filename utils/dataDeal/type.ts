export type DealType =
  | "time"
  | "minute"
  | "hour"
  | "day"
  | "month"
  | "year"
  | "stringToggleArray"
  | "arrayToggleString"
  | "numberToggleBoolean"
  | "booleanToggleNumber"
  | "imgArrToggleString"
  | "stringToggleImgArr"
  | "labelInValueToggleObject"
  | "objectTogglelabelInValue"
  | "jsonString"
  | "jsonParse";

export type DealConfigType = {
  key: string;

  replaceKey?: string;
  type: DealType;
  afterRequestType?: DealType;

  /** value转换 */
  transform?: (value: unknown) => unknown;
  /**
   *  是否省略key，replaceKey，直接返回对象labelKey，valueKey
   *  labelInValue会用到
   */
  omitOriginKey?: boolean;
  /**  labelInValue会用到，不传则不会传label对应的参数 */
  labelKey?: string;
  /** arrayToString会用到，不传则使用自身
   *  labelInValue会用到
   */
  valueKey?: string;
  /** arrayToString会用到，默认, */
  separator?: string;
  /** 默认值 */
  defaultValue?: unknown;
  /** 自定义函数处理 */
  customProcessingFunc?: (
    value: unknown,
    configItem: DealConfigType,
    data: Record<string, any>
  ) => unknown;
};
