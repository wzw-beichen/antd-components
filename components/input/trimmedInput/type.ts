import { LegacyRef } from "react";
import { Input } from "antd";
import type { InputProps } from "antd";
import { Merge } from "../../constants/commonType";

export type ExtraTrimmedInputProps = {
  onChange?: (data?: string) => void;
  inputRef?: LegacyRef<Input>;
};
export type TrimmedInputProps = Merge<InputProps, ExtraTrimmedInputProps>;
