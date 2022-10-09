import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Select, Divider } from "antd";
import { handleSelectFilterOption } from "../utils";
import { defaultMultipleConfig } from "../constant";
import { CommonSelectProps, SelectFieldNamesType } from "../type";
import { RequestSelectType } from "./type";
import {
  RequestComponent,
  RequestComponentProps,
} from "../../requestComponent";
import { RequestComponentRef } from "../../requestComponent/type";

export type RequestSelectProps<
  T,
  U = string | undefined
> = RequestComponentProps<T> &
  CommonSelectProps & {
    onChange?: (value: U) => void;
    value?: U;
    /**
     * 下拉菜单进行自由扩展内容
     */
    bottom?: ReactNode;
    /**
     * 点击自定义内容后是否自动关闭浮层
     * @default true
     */
    clickBottomToClose?: boolean;
    selectRender?: (
      selectConfig: CommonSelectProps & {
        list: T[];
      },
      selectDom: JSX.Element
    ) => React.ReactNode | null;
  } & SelectFieldNamesType &
  RequestSelectType;

const RequestSelect = <T extends Record<string, any>, U = string>(
  props: RequestSelectProps<T, U>
) => {
  const {
    requestConfig = {},
    fieldNames = {},
    mode,
    relationConfig,
    onChange,
    firstRequest,
    bottom,
    clickBottomToClose = true,
    selectRender,
    ...restProps
  } = props;
  const { label = "label", value = "value", disabled } = fieldNames;
  const { onBeforeRequest, onRequestFinally } = requestConfig;
  const {
    form,
    relationKey = "",
    resetKey,
    onlyKey,
    relationValue,
  } = relationConfig || {};

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const requestRef = useRef<RequestComponentRef<T> | null>(null);

  const relationVal =
    relationValue && !relationKey
      ? relationValue
      : form?.getFieldValue(relationKey);

  useEffect(() => {
    /** 需要考虑数据val为数字0的情况，后续考虑抽离写个方法判断 */
    if (!relationVal && relationConfig && typeof relationVal !== "number") {
      requestRef.current?.setList([]);
      return;
    }
    /** val为undefined，有无关联配置的情况，都不应该再调接口 */
    if (!relationVal) return;
    requestRef.current?.onRequest({
      [onlyKey ?? relationKey]: relationVal,
    });
  }, [relationVal]);

  const handleBeforeRequest = () => {
    setLoading(true);
    onBeforeRequest?.();
  };

  const handleRequestFinally = () => {
    setLoading(false);
    onRequestFinally?.();
  };

  const handleChange = (value: any) => {
    resetKey?.split(",").forEach((item) => {
      form?.setFieldsValue({
        [item]: undefined,
      });
    });
    onChange?.(value);
  };

  let multipleConfig: CommonSelectProps = {};

  if (mode) {
    multipleConfig = {
      ...defaultMultipleConfig,
    };
  }

  return (
    <RequestComponent
      ref={requestRef}
      firstRequest={firstRequest}
      requestConfig={{
        ...requestConfig,
        onBeforeRequest: handleBeforeRequest,
        onRequestFinally: handleRequestFinally,
      }}
      renderItem={(list: T[]) => {
        const newList = list.map((item) => ({
          key: item.key ?? item[value],
          label: item[label],
          value: item[value],
          disabled: disabled && item[disabled],
        }));

        const defaultSelectConfig: CommonSelectProps = {
          allowClear: true,
          showSearch: true,
          open,
          onDropdownVisibleChange: (visible) => setOpen(visible),
          filterOption: (inputValue, option) =>
            handleSelectFilterOption(inputValue, option, "label"),
          dropdownRender: (menu) => (
            <>
              {menu}
              {bottom && (
                <>
                  <Divider style={{ margin: "6px 0" }} />
                  <div
                    style={{ textAlign: "center" }}
                    onClick={() => setOpen(!clickBottomToClose)}
                  >
                    {bottom}
                  </div>
                </>
              )}
            </>
          ),
          loading,
          mode,
          onChange: handleChange,
          placeholder: "请选择",
          getPopupContainer: (triggerNode) =>
            triggerNode.parentNode as HTMLElement,
          options: newList,
          ...multipleConfig,
          ...restProps,
        };
        const SelectComponent = <Select {...defaultSelectConfig} />;
        if (selectRender) {
          return selectRender(
            {
              ...defaultSelectConfig,
              list,
            },
            SelectComponent
          );
        }

        return SelectComponent;
      }}
    />
  );
};

export default RequestSelect;
