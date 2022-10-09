import React, { useEffect, useRef, useState } from "react";
import { Empty, Select, SelectProps, Spin } from "antd";
import { defaultMultipleConfig } from "../constants";
import { RequestSelectType } from "../RequestSelect/type";
import { debounce } from "lodash";
import {
  RequestComponentRef,
  TRequestConfig,
} from "../../requestComponent/type";
import { RequestComponent } from "../../requestComponent";

export type SearchSelectProps<T> = SelectProps<T> &
  TRequestConfig<T> & {
    /** 默认id，name，disabled  */
    fieldNames?: {
      label?: string;
      value?: string;
      disabled?: string;
    };
    searchKey?: string;
    /** 搜索选择，当值变为undefined是否需要清空选择框 */
    clearEmpty?: boolean;
    /** 当请求接口依赖的值发生改变时，将数据清空 */
    dependencies?: string;
    /** 自定义渲染Select.Option */
    renderListItem?: (data: T[]) => React.ReactNode;
  } & RequestSelectType;

/**
 * @name 搜索下拉选择
 * @param props 组件参数
 * @returns 搜索下拉组件
 */
const SearchSelect = <T extends Record<string, any>>(
  props: SearchSelectProps<T>
) => {
  const {
    requestConfig = {},
    fieldNames = {},
    searchKey,
    onChange,
    relationConfig,
    clearEmpty,
    dependencies,
    renderListItem,
    ...restProps
  } = props;
  const {
    label = "label",
    value = "value",
    disabled = "disabled",
  } = fieldNames;
  const { onBeforeRequest, onRequestFinally } = requestConfig;
  const { form, resetKey } = relationConfig || {};

  const [loading, setLoading] = useState(false);

  const requestRef = useRef<RequestComponentRef<T> | null>(null);

  useEffect(() => {
    requestRef.current?.setList([]);
  }, [dependencies]);

  const handleChange = (value: T, option: any) => {
    resetKey?.split(",").forEach((item) => {
      form?.setFieldsValue({
        [item]: undefined,
      });
    });
    if (((Array.isArray(value) && !value.length) || !value) && clearEmpty) {
      requestRef.current?.setList([]);
    }
    onChange?.(value, option);
  };

  const handleBeforeRequest = () => {
    setLoading(true);
    onBeforeRequest?.();
  };

  const handleRequestFinally = () => {
    setLoading(false);
    onRequestFinally?.();
  };

  const handleRequest = (value?: string) => {
    value &&
      requestRef.current?.onRequest({
        [searchKey!]: value,
      });
  };
  const debounceSearch = debounce(handleRequest, 800);

  return (
    <RequestComponent
      ref={requestRef}
      requestConfig={{
        ...requestConfig,
        onBeforeRequest: handleBeforeRequest,
        onRequestFinally: handleRequestFinally,
      }}
      firstRequest={false}
      renderItem={(list) => {
        const newList = list.map((item) => ({
          key: item.key ?? item[value],
          label: item[label],
          value: item[value],
          disabled: item[disabled],
        }));
        const defaultSelectConfig: SelectProps<T> = {
          showSearch: true,
          allowClear: true,
          labelInValue: true,
          onSearch: debounceSearch,
          onChange: handleChange,
          filterOption: false,
          showArrow: false,
          notFoundContent: loading ? (
            <Spin spinning />
          ) : (
            <Empty
              style={{
                margin: "8px 0",
              }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
          ...defaultMultipleConfig,
          ...restProps,
        };
        /** options 层级较高，会覆盖Select.Options */
        if (!renderListItem) {
          defaultSelectConfig.options = defaultSelectConfig.options || newList;
        }
        return (
          <Select {...defaultSelectConfig}>
            {renderListItem ? renderListItem(list) : null}
          </Select>
        );
      }}
    />
  );
};

export default SearchSelect;
