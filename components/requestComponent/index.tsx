import React, {
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { handleDataField } from "../utils";
import type { CommonRecord, RequestComponentRef, TRequestConfig } from "./type";

export type RequestComponentProps<T> = TRequestConfig<T> & {
  renderItem?: (list: T[]) => React.ReactNode;
  /** 首次是否请求，默认为true，下拉搜索框第一次不用请求 */
  firstRequest?: boolean;
  children?: (value: { list: CommonRecord[] }) => ReactNode;
};

/** @name 数据请求DataRequestComponent, 可能组件类型不同，例如下拉框、checkBox */
const DataRequestComponent = <T extends CommonRecord>(
  props: RequestComponentProps<T>,
  ref: Ref<RequestComponentRef<T>>
) => {
  const {
    requestConfig = {},
    renderItem,
    firstRequest = true,
    children,
  } = props;
  const {
    request,
    extraParams,
    resRename = {},
    beforeData = {},
    onBeforeRequest,
    onRequestFinally,
  } = requestConfig;
  const { listStr } = resRename;
  const { beforeListData } = beforeData;
  const [list, setList] = useState<T[]>([]);

  /** 每次request请求顺序，先请求，值越小，为了处理请求竞态问题哦 */
  const requestMaxOrder = useRef<number>(1);

  useImperativeHandle(ref, () => ({
    onRequest: handleRequest,
    setList,
  }));

  useEffect(() => {
    firstRequest && handleRequest();
  }, []);

  const handleRequest = async (params?: CommonRecord) => {
    /** currentOrder 当前本次请求顺序值 */
    const currentOrder = requestMaxOrder.current + 1;
    /** 更新请求顺序最大值 */
    requestMaxOrder.current = currentOrder;
    const newParams = {
      ...params,
      ...extraParams,
    };
    request && onBeforeRequest?.();
    request?.(newParams)
      .then((data) => {
        /** 不是最后一次请求，不用set覆盖掉前面的值 */
        if (requestMaxOrder.current !== currentOrder) return;
        const dataFieldList =
          listStr && data ? handleDataField<T[]>(data, listStr) : data || [];
        const list = beforeListData
          ? beforeListData(dataFieldList)
          : dataFieldList;
        const finalList = Array.isArray(list) ? list : [];
        setList(finalList);
      })
      .finally(() => {
        onRequestFinally?.();
      });
  };

  return renderItem?.(list);
};

// 主要解决forwardRef传递泛型问题
/** @name 数据请求DataRequestComponent, 可能组件类型不同，例如下拉框、checkBox */
export const RequestComponent = React.forwardRef(DataRequestComponent) as <T>(
  props: RequestComponentProps<T> & {
    ref?: React.ForwardedRef<RequestComponentRef<T>>;
  }
) => ReturnType<typeof DataRequestComponent>;
