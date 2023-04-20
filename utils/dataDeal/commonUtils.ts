import { imgArrayTransformString } from "../array";
import { stringTransformImgArr } from "../string";
import { basicDataTypeArr, dataTypeArr, objectDataTypeArr } from "./constants";
import { DealConfigType } from "./type";

export const dealFuncConfig: Record<
  string,
  (value: unknown, configItem: DealConfigType) => unknown
> = {
  imgArrToggleString: (value) =>
    imgArrayTransformString(value as { url: string }[]),
  stringToggleImgArr: (value) => stringTransformImgArr(value as string),

  booleanToggleNumber: (value) => Number(!!value),
  numberToggleBoolean: (value) => !!value,

  arrayToggleString: (value, configItem) => {
    const { valueKey, separator } = configItem;
    return ((value || []) as Record<string, any>[])
      .map((item) => (valueKey ? item[valueKey] : item))
      .join(separator);
  },
  stringToggleArray: (value, configItem) => {
    const { separator } = configItem;
    return (value as string).split(separator as string) || [];
  },

  jsonString: (value) => JSON.stringify(value),
  jsonParse: (value) => JSON.parse(value as string),
};

/** @description 公共处理函数 */
export const commonDealFunc = (value: unknown, configItem: DealConfigType) => {
  const { type, customProcessingFunc } = configItem;
  let dataValue = value;
  if (dataTypeArr.includes(type)) {
    if (objectDataTypeArr.includes(type)) {
      dataValue = dataValue
        ? dealFuncConfig[type](type, configItem)
        : dataValue;
    }
    if (basicDataTypeArr.includes(type)) {
      dataValue = dealFuncConfig[type](type, configItem);
    }
  }
  if (customProcessingFunc) {
    dataValue = customProcessingFunc(value, configItem);
  }
  return dataValue;
};

/** @description 初始化configItem */
export const initConfigItem = (
  total: Record<string, any>,
  configItem: DealConfigType
) => {
  const { key, separator = ",", defaultValue } = configItem;
  let value = total[key] ?? defaultValue;
  const defaultConfigItem = { ...configItem, separator };
  return {
    value,
    defaultConfigItem,
  };
};
