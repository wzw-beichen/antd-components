import React from "react";
import Icon from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

type Props = Partial<CustomIconComponentProps> & {
  component: () => JSX.Element;
  title?: string;
  onClick?: () => void;
};

const CustomIcon = (props: Props) => {
  return <Icon {...props} />;
};

export default CustomIcon;
