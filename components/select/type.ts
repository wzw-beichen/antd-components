import { SelectProps } from "antd";

export type SelectFieldNamesType = {
  fieldNames?: {
    label?: string;
    value?: string;
    disabled?: string;
  };
};

export type CommonSelectProps = SelectProps<any>;
