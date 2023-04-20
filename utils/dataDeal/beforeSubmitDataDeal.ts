import moment from "moment";
import { commonDealFunc, initConfigItem } from "./commonUtils";
import { dateArr, defaultDateFormat } from "./constants";
import { DealConfigType } from "./type";

export const beforeSubmitDataDeal = (
  data: Record<string, any>,
  dealConfig: DealConfigType[] = []
) => {
  if (!dealConfig.length) {
    return data;
  }
  const dealData = dealConfig.reduce((total, configItem) => {
    let { value, defaultConfigItem } = initConfigItem(total, configItem);
    const { type, key } = defaultConfigItem;
    if (dateArr.includes(type)) {
      value = value ? moment(value).format(defaultDateFormat[type]) : value;
    }
    value = commonDealFunc(value, defaultConfigItem);
    return {
      ...total,
      [key]: value,
    };
  }, data);

  return dealData;
};
