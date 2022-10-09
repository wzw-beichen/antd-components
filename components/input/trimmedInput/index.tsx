import React, { ChangeEvent, FocusEvent } from "react";
import { Input } from "antd";
import { TrimmedInputProps } from "./type";

/** 失去焦点自动trim的输入框 */
const TrimmedInput = (props: TrimmedInputProps) => {
  const { onChange, onBlur, inputRef, ...restProps } = props;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange?.(value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newValue = value?.trim();
    onChange?.(newValue);
    onBlur?.(e);
  };

  return (
    <Input
      ref={inputRef}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="请输入"
      allowClear
      {...restProps}
    />
  );
};

export default TrimmedInput;
