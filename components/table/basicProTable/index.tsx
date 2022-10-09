import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { BasicProTableProps, BasicProTableRef, CommonRecord } from "./type";
import { renderValueType } from "./constants";
import {
  ProColumns,
  ProTable,
  ProTableProps,
} from "@ant-design/pro-components";
import { defaultPagination } from "../../constants";
import { handleDataField } from "../../utils";

/**
 * @description proTable增加统一配置和默认项
 */
const BasicProTableComponent = <T extends CommonRecord, U extends CommonRecord>(
  props: BasicProTableProps<T, U>,
  ref: ForwardedRef<BasicProTableRef<T>>
) => {
  const {
    columns,
    rowKey = "id",
    requestConfig,
    defaultHideInSearch = true,
    rowSelection = false,
    onSubmit,
    onReset,
    scroll,
    search,
    pagination,
    ...restProps
  } = props;
  const {
    request,
    extraParams,
    reqRename,
    resRename,
    beforeData,
    onBeforeRequest,
    onRequestFinally,
  } = requestConfig || {};
  const { currentPage = "currentPage", pageSize = "pageSize" } =
    reqRename || {};
  const { listStr = "pageData", totalStr = "totalRecords" } = resRename || {};
  const { beforeSearchData, beforeListData } = beforeData || {};

  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  useImperativeHandle(ref, () => ({
    getSelectedRows: handleGetSelectedRows,
    clearSelectedRows: handleClearSelectedRows,
  }));

  const handleGetSelectedRows = () => {
    return selectedRows;
  };

  const handleClearSelectedRows = () => {
    setSelectedRows([]);
  };

  const { columnEmptyText = "-" } = restProps;
  /** 给columns添加hideInSearch, 默认为true */
  const newColumns = columns?.map((item) => {
    const { dataIndex, render, valueType, renderFunc } = item;
    const newItem: ProColumns<T> = {
      ...item,
      ellipsis: item.ellipsis ?? true,
      hideInSearch: item.hideInSearch ?? defaultHideInSearch,
    };
    /** 上层传render方法就调用render方法 */
    if (render) {
      newItem.render = render;
    }
    const valueRenderFunc = renderValueType[valueType as string];
    /** valueType处理，目前支持 时间戳处理（dateTimeRange、dateTime），select（valueEnum Select处理）  */
    if (valueType && valueRenderFunc) {
      newItem.render = (dom, record: T) => {
        return valueRenderFunc(record, {
          dataIndex,
          columnEmptyText,
          ...item,
        });
      };
    }
    /** 简单的自定义方法调用，不用解构record，由下面来解构 */
    if (renderFunc) {
      newItem.render = (dom, record: T) => {
        let text = record[dataIndex as string];
        text = renderFunc(text, record);
        return typeof text === "number" ? text : text || columnEmptyText;
      };
    }
    return newItem;
  });

  const handleTableSelectChange = (
    selectedRowKeys: React.Key[],
    selectedRows: T[]
  ) => {
    /** //todo 可续可以在这里做支持跨页勾选 */
    setSelectedRows(selectedRows);
  };

  /** 默认分页showTotal */
  const { total, ...restPagination } = defaultPagination;

  /** 直接使用会存在依赖的版本不同，就会导致ts提示错误 */
  let newRowSelection: ProTableProps<T, U>["rowSelection"] = {};

  if (rowSelection) {
    /** 默认使用自身的selectedRowKeys, onChange方法，上层可传覆盖掉 */
    const selectedRowKeys = selectedRows.map((item) => item[rowKey as string]);
    newRowSelection = {
      fixed: true,
      selectedRowKeys,
      onChange: handleTableSelectChange,
      ...rowSelection,
    };
  }

  return (
    <ProTable<T, U>
      size="small"
      columns={newColumns}
      onSubmit={(params) => {
        /** 清空选中的数据 */
        handleClearSelectedRows();
        onSubmit?.(params);
      }}
      onReset={() => {
        /** 清空选中的数据 */
        handleClearSelectedRows();
        onReset?.();
      }}
      request={async (params, sort, filter) => {
        // 未传url，未传request，不加判断也会去请求
        if (!request) {
          return {
            data: [],
            success: false,
            total: 0,
          };
        }
        const { current, pageSize: PAGESIZE, ...restParams } = params;
        let newParams: CommonRecord = {
          ...restParams,
          ...extraParams,
          ...sort,
          ...filter,
          [currentPage]: current,
          [pageSize]: PAGESIZE,
        };
        newParams = beforeSearchData ? beforeSearchData(newParams) : newParams;
        onBeforeRequest?.();
        return request?.(newParams)
          .then((data) => {
            const newData = handleDataField<T[]>(data, listStr);
            const tableData = Array.isArray(newData)
              ? newData
              : beforeListData
              ? newData
              : [];
            const total = handleDataField<number>(data, totalStr);
            const tableTotal = typeof total === "number" ? total : 0;
            const dataSource = beforeListData
              ? beforeListData(tableData)
              : tableData;
            return {
              data: dataSource,
              success: true,
              total: tableTotal,
            };
          })
          .finally(() => {
            onRequestFinally?.();
          });
      }}
      rowKey={rowKey}
      options={false}
      pagination={
        typeof pagination === "boolean"
          ? pagination
          : {
              ...restPagination,
              ...pagination,
            }
      }
      rowSelection={rowSelection && newRowSelection}
      dateFormatter="string"
      scroll={scroll}
      search={
        typeof search === "boolean"
          ? search
          : {
              optionRender: (searchConfig, formProps, dom) => [
                ...dom.reverse(),
              ],
              labelWidth: 80,
              ...search,
            }
      }
      {...restProps}
    />
  );
};

/**
 * @description proTable增加统一配置和默认项
 */
// 主要解决forwardRef传递泛型问题
const BasicProTable = forwardRef(BasicProTableComponent) as <
  T,
  U extends CommonRecord = CommonRecord
>(
  props: BasicProTableProps<T, U> & {
    ref?: React.ForwardedRef<BasicProTableRef<T>>;
  }
) => ReturnType<typeof BasicProTableComponent>;
export default BasicProTable;
