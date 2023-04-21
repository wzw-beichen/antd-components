import { imgArrayTransformString } from "../array";
import { stringTransformImgArr } from "../string";
import { basicDataTypeArr, dataTypeArr, objectDataTypeArr } from "./constants";
import { DealConfigType } from "./type";

export const dealFuncConfig: Record<
  string,
  (
    value: unknown,
    configItem: DealConfigType,
    data: Record<string, any>
  ) => unknown
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

  labelInValueToggleObject: (_value, configItem) => {
    const { label, value } =
      (_value as { label: string; value: string | number }) || {};
    const { labelKey, valueKey } = configItem;
    const newValue = {};
    if (labelKey) {
      newValue[labelKey] = label;
    }
    if (valueKey) {
      newValue[valueKey] = value;
    }
    return newValue;
  },
  objectTogglelabelInValue: (_value, configItem, total) => {
    const { labelKey, valueKey, transform, key } = configItem;
    const valueObj = {
      label: undefined,
      value: undefined,
    };
    if (labelKey) {
      valueObj.label = total[labelKey];
    }
    if (valueKey) {
      const newValue = total[valueKey];
      valueObj.value = transform ? transform(newValue) : newValue;
    }
    return {
      [key]: valueObj,
    };
  },

  jsonString: (value) => JSON.stringify(value),
  jsonParse: (value) => JSON.parse(value as string),
};

/** @description 公共处理函数 */
export const commonDealFunc = (
  value: unknown,
  configItem: DealConfigType,
  data: Record<string, any>
) => {
  const { type, customProcessingFunc } = configItem;
  let dataValue = value;
  if (dataTypeArr.includes(type)) {
    if (objectDataTypeArr.includes(type)) {
      dataValue = dataValue
        ? dealFuncConfig[type](type, configItem, data)
        : dataValue;
    }
    if (basicDataTypeArr.includes(type)) {
      dataValue = dealFuncConfig[type](type, configItem, data);
    }
  }
  if (customProcessingFunc) {
    dataValue = customProcessingFunc(value, configItem, data);
  }
  return dataValue;
};

/** @description 初始化configItem */
export const initConfigItem = (
  total: Record<string, any>,
  configItem: DealConfigType
) => {
  const { key, replaceKey, separator = ",", defaultValue } = configItem;
  let value = total[key] ?? defaultValue;
  const newKey = replaceKey ?? key;
  const defaultConfigItem = { ...configItem, separator, key: newKey };
  return {
    value,
    defaultConfigItem,
  };
};

/** @description 解析omitOriginKey参数设置值 */
export const resolveOmitOriginKey = (
  data: { otherValues: Record<string, any>; value: unknown },
  defaultConfigItem: DealConfigType
) => {
  let { otherValues, value } = data;
  const { key, omitOriginKey } = defaultConfigItem;
  if (omitOriginKey) {
    otherValues = {
      ...otherValues,
      ...(value as Record<string, any>),
    };
  } else {
    otherValues[key] = value;
  }
  return otherValues;
};
