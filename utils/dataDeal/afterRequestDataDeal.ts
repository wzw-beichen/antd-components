import moment from "moment";
import {
  commonDealFunc,
  initConfigItem,
  resolveOmitOriginKey,
} from "./commonUtils";
import { dateArr } from "./constants";
import { DealConfigType } from "./type";

export const afterRequestDataDeal = (
  data: Record<string, any>,
  dealConfig: DealConfigType[] = []
) => {
  if (!dealConfig.length) {
    return data;
  }
  const dealData = dealConfig.reduce((total, configItem) => {
    let { value, defaultConfigItem } = initConfigItem(total, configItem);
    const { afterRequestType, type } = defaultConfigItem;
    const newType = afterRequestType ?? type;
    defaultConfigItem.type = newType;
    let otherValues = {};
    if (newType && dateArr.includes(newType)) {
      value = value ? moment(value) : value;
    }
    value = commonDealFunc(value, defaultConfigItem, total);
    otherValues = resolveOmitOriginKey(
      { otherValues, value },
      defaultConfigItem
    );
    return {
      ...total,
      ...otherValues,
    };
  }, data);

  return dealData;
};
