import {
  ProColumns,
  ActionType,
  ProTableProps,
} from "@ant-design/pro-components";
import { Merge } from "../../constants/commonType";

export type CommonRecord = Record<string, any>;

/** 解决因为proTable版本不同导致ts提示错误 */
export type ProTableActionType = ActionType;

export type MergeColumnsItem<T, ValueType = "text"> = {
  /** render渲染前会根据dataIndex的值调用renderFunc处理数据，不会给默认值，需要在方法里面去判断 */
  renderFunc?: (value: ValueType, record: T) => void;
};

/** 解决引入ProColumns版本不同导致ts提示错误 */
export type ProColumnsItem<T = CommonRecord, ValueType = "text"> = ProColumns<
  T,
  ValueType
> &
  MergeColumnsItem<T, ValueType>;

export type MergeProps<T, ValueType = "text"> = {
  columns?: ProColumnsItem<T, ValueType>[];
};
export type BasicProTableProps<
  T = CommonRecord,
  U extends CommonRecord = CommonRecord
> = Merge<ProTableProps<T, U>, MergeProps<T>> &
  TRequestConfig<T> & {
    /** 每列hideInSearch默认值，默认为true */
    defaultHideInSearch?: boolean;
    columns: ProColumnsItem<T>[];
  };

export type TRequestConfig<T> = {
  requestConfig?: {
    /** 获取数据的request */
    request?: (data: CommonRecord) => Promise<any>;
    /** 额外参数 */
    extraParams?: CommonRecord;
    /** 重命名获取数据分页参数, 默认使用currentPage, pageSize */
    reqRename?: {
      currentPage?: string;
      pageSize?: string;
    };
    /** 重命名响应参数, 默认使用pageData, totalRecords */
    resRename?: {
      listStr?: string;
      totalStr?: string;
    };
    /** 数据处理 */
    beforeData?: {
      /* 数据获取前，对查询参数进行处理 */
      beforeSearchData?: (data: CommonRecord) => CommonRecord;
      /* 请求后，对返回数据进行处理 */
      beforeListData?: (data: any) => T[];
    };
    /** 请求之前，可以设置loading之类的 */
    onBeforeRequest?: () => void;
    /** 请求finally后触发 */
    onRequestFinally?: () => void;
  };
};

export type BasicProTableRef<T> = {
  getSelectedRows: () => T[];
  clearSelectedRows: () => void;
};
