import React from "react";
import { FormItemProps } from "antd";

export interface RichFormItemProps extends FormItemProps {
  render?: (children: React.ReactNode) => React.ReactElement;
}

export interface MyFormItemChildrenProps {
  render?: RichFormItemProps["render"];
  children: React.ReactElement;
}
