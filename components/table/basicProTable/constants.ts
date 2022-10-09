import moment from "moment";
import { defaultDateFormat } from "../../constants";

type CommonRecord = Record<string, any>;

/** 默认时间格式化处理 */
const handleTimeFormat = (
  record: CommonRecord,
  {
    dataIndex,
    columnEmptyText,
  }: {
    dataIndex: string;
    columnEmptyText?: string;
  }
) => {
  const text = record[dataIndex];
  return text ? moment(text).format(defaultDateFormat.time) : columnEmptyText;
};

export const renderValueType: CommonRecord = {
  /** 时间戳处理 */
  dateTimeRange: handleTimeFormat,
  dateTime: handleTimeFormat,

  /** valueEnum Select处理 */
  select: (
    record: CommonRecord,
    {
      dataIndex,
      columnEmptyText,
      valueEnum,
    }: {
      dataIndex: string;
      columnEmptyText?: string;
      valueEnum: CommonRecord;
    }
  ) => {
    const text = record[dataIndex];
    /** 当valueEnum为对象，进行处理 */
    if (valueEnum && valueEnum.constructor === Object) {
      const value = valueEnum[text];
      return value?.text || text || columnEmptyText;
    }
    return text || columnEmptyText;
  },
};
