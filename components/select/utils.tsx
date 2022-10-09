import React from "react";
import { Tooltip } from "antd";

/** Select 筛选 */
export const handleSelectFilterOption = (
  inputValue: string,
  option?: any,
  optionKey = "children"
) => {
  return (option && (option[optionKey] as unknown as string))
    ?.toLocaleLowerCase()
    .includes(inputValue.toLocaleLowerCase());
};

/** select OptGroup分组筛选 */
export const handleSelectGroupFilterOption = (
  inputValue: string,
  option?: any
) => {
  // 第一个相当于对组的校验，得返回false才会进入组里面一个一个比对，返回true则是返回整个组
  return Array.isArray(option.options)
    ? false
    : (option?.children?.toLocaleLowerCase() as unknown as string)?.includes(
        inputValue.toLocaleLowerCase()
      );
};

export const showMaxTagPlaceholder = (
  values: { label?: React.ReactNode }[]
) => {
  return (
    <Tooltip title={values.map((itm) => itm.label).join("，")}>
      +{values.length}...
    </Tooltip>
  );
};
